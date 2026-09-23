import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import { getProblem } from '../data'
import { useProgress } from '../state/progress'
import { fmtRelative } from '../lib/utils'
import type { Mistake, MistakeType } from '../types'

const TYPES: MistakeType[] = [
  'Logic',
  'Complexity',
  'Java syntax',
  'Collections',
  'Edge case',
  'Off-by-one',
  'Pattern recognition',
  'Implementation',
]

export default function Mistakes() {
  const { progress, addMistake } = useProgress()
  const [type, setType] = useState<MistakeType>('Edge case')
  const [note, setNote] = useState('')

  const byType = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const m of progress.mistakes) counts[m.type] = (counts[m.type] ?? 0) + 1
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [progress.mistakes])

  const maxCount = byType.length > 0 ? Math.max(...byType.map(([, c]) => c)) : 0

  const add = () => {
    if (!note.trim()) return
    addMistake({ type, note: note.trim() })
    setNote('')
  }

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <PageHeader
        title="Mistake Log"
        subtitle="Name the mistake and it stops repeating. Failed attempts and drill slips appear here automatically; add your own anytime."
      />

      {progress.mistakes.length === 0 ? (
        <EmptyState
          title="No mistakes logged."
          message="Your first failed attempt will create your review history — or log a slip manually below."
        />
      ) : (
        <div className="card mb-6 p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute-dark">Your recurring mistakes</h2>
          <div className="space-y-2">
            {byType.map(([t, count]) => (
              <div key={t} className="flex items-center gap-3">
                <span className="w-44 shrink-0 text-sm">{t}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-edge-dark/50">
                  <div className="h-full rounded-full bg-warn" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
                <span className="code w-6 text-right text-sm font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mb-6 p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute-dark">Log a mistake</h2>
        <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
          <select className="input" value={type} onChange={(e) => setType(e.target.value as MistakeType)} aria-label="Mistake type">
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="What happened? e.g. forgot to shrink the window on duplicates"
            aria-label="Mistake note"
          />
        </div>
        <button className="btn-primary mt-3 text-sm" onClick={add} disabled={!note.trim()}>
          Add mistake
        </button>
      </div>

      <ul className="space-y-2">
        {progress.mistakes.map((m: Mistake) => {
          const p = m.problemId ? getProblem(m.problemId) : undefined
          return (
            <li key={m.id} className="card flex items-start gap-3 p-4 text-sm">
              <span className="code rounded bg-warn-soft px-2 py-0.5 text-[11px] text-warn">{m.type}</span>
              <span className="min-w-0 flex-1">{m.note}</span>
              {p && (
                <Link to={`/practice/${p.id}`} className="code hidden text-xs text-mute-dark hover:text-accent sm:inline">
                  {p.title}
                </Link>
              )}
              <span className="code shrink-0 text-xs text-mute-dark">{fmtRelative(m.createdAt)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
