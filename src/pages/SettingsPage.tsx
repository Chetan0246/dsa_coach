import { useRef, useState } from 'react'
import { Download, Upload, Trash2, Monitor, Moon, Sun } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import { useProgress } from '../state/progress'
import { exportProgress, importProgress } from '../lib/storage'
import { classNames } from '../lib/utils'

export default function SettingsPage() {
  const { settings, updateSettings, resetEverything, progress, storageOk } = useProgress()
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const doExport = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patternpilot-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const doImport = async (file: File) => {
    const text = await file.text()
    const result = importProgress(text)
    setImportMsg(
      result.ok
        ? { ok: true, text: 'Progress imported. Reload to see it everywhere.' }
        : { ok: false, text: result.error },
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-8">
      <PageHeader title="Settings" subtitle="Local-first: everything lives in your browser. Nothing leaves this device." />

      {!storageOk && (
        <div className="card mb-4 border-bad/40 p-4 text-sm text-bad">
          localStorage is unavailable (private browsing or blocked storage). The app works, but progress will not
          persist.
        </div>
      )}

      <section className="card mb-4 p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute-dark">Appearance</h2>
        <div className="flex gap-2">
          {(
            [
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'system', label: 'System', icon: Monitor },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={classNames('btn-ghost text-sm', settings.theme === id && '!border-accent !text-accent')}
              onClick={() => updateSettings({ theme: id })}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </section>

      <section className="card mb-4 p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute-dark">Daily target</h2>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={6}
            value={settings.dailyTarget}
            onChange={(e) => updateSettings({ dailyTarget: Number(e.target.value) })}
            className="w-56 accent-accent"
            aria-label="Daily problem target"
          />
          <span className="text-sm font-semibold">{settings.dailyTarget} problems / day</span>
        </div>
        <p className="mt-1.5 text-xs text-mute-dark">
          At this pace you will finish {Math.ceil(150 / settings.dailyTarget)} days' worth of the roadmap.
        </p>
      </section>

      <section className="card mb-4 p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute-dark">Your data</h2>
        <p className="mb-3 text-sm text-mute-dark">
          {progress.solvedProblems.length} solved · {progress.attempts.length} attempts logged.
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost text-sm" onClick={doExport}>
            <Download className="h-4 w-4" /> Export Progress (JSON)
          </button>
          <button className="btn-ghost text-sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Import Progress
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void doImport(f)
              e.target.value = ''
            }}
          />
          <button className="btn-danger text-sm" onClick={() => setConfirmReset(true)}>
            <Trash2 className="h-4 w-4" /> Reset All Progress
          </button>
        </div>
        {importMsg && (
          <p className={classNames('mt-3 text-sm', importMsg.ok ? 'text-good' : 'text-bad')}>{importMsg.text}</p>
        )}
      </section>

      <section className="card p-5">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-mute-dark">AI Provider</h2>
        <p className="text-sm">
          <span className="font-semibold">Local Demo</span>{' '}
          <span className="text-mute-dark">— a built-in Socratic coach. No network calls, no API keys.</span>
        </p>
        <p className="mt-1.5 text-xs text-mute-dark">
          A real provider (OpenAI, Gemini, Claude, Ollama…) can be added later via{' '}
          <code className="code">VITE_AI_PROVIDER</code>, <code className="code">VITE_AI_API_KEY</code>,{' '}
          <code className="code">VITE_AI_BASE_URL</code>, and <code className="code">VITE_AI_MODEL</code> in a{' '}
          <code className="code">.env.local</code> file. Keys never leave your machine in this build.
        </p>
      </section>

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirmReset(false)}>
          <div className="card max-w-md p-5" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Confirm reset">
            <h2 className="text-lg font-bold">Reset all progress?</h2>
            <p className="mt-2 text-sm text-mute-dark">
              This deletes every attempt, note, review item, and saved code draft on this device. Export first if you
              might want it back. This cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
              <button
                className="btn-danger"
                onClick={() => {
                  resetEverything()
                  setConfirmReset(false)
                  window.location.hash = '#/'
                }}
              >
                Delete everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
