import { useState } from 'react'
import { X } from 'lucide-react'
import type { Problem, ReviewGrade } from '../../types'
import { PATTERNS } from '../../data/patterns'
import { relatedProblems, nextProblems } from '../../data'
import CodeBlock from '../common/CodeBlock'

export interface SubmissionAnswers {
  pattern: string
  time: string
  space: string
}

const COMPLEXITY_CHOICES = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)', 'O(n³)', "O(n·m)"]

/** Pre-submit reflection: pattern + complexity self-identification. */
export function PreSubmitModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (answers: SubmissionAnswers) => void
  onCancel: () => void
}) {
  const [pattern, setPattern] = useState('')
  const [time, setTime] = useState('')
  const [space, setSpace] = useState('')

  return (
    <ModalShell title="Before we evaluate" onClose={onCancel}>
      <p className="mb-4 text-sm text-mute-dark">
        Rate your own solution first — this is the recognition training, not the grade.
      </p>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-mute-dark">
            What pattern did you use?
          </label>
          <select className="input" value={pattern} onChange={(e) => setPattern(e.target.value)}>
            <option value="">Select a pattern…</option>
            {PATTERNS.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
            <option value="Other">Something else</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-mute-dark">Time</label>
            <select className="input" value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="">Select…</option>
              {COMPLEXITY_CHOICES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-mute-dark">Space</label>
            <select className="input" value={space} onChange={(e) => setSpace(e.target.value)}>
              <option value="">Select…</option>
              {COMPLEXITY_CHOICES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button className="btn-ghost" onClick={onCancel}>Go back</button>
          <button
            className="btn-primary"
            disabled={!pattern || !time || !space}
            onClick={() => onConfirm({ pattern, time, space })}
          >
            Evaluate my solution
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

export interface PostSolveData {
  passed: boolean
  patternCorrect: boolean
  timeCorrect: boolean
  spaceCorrect: boolean
  expectedTime: string
  expectedSpace: string
  expectedPattern: string
  hintsUsed: number
  minutes: number
  score: number
}

/** Post-solve analysis: SOLVED card, pattern transfer, related problems, confidence. */
export function PostSolveModal({
  problem,
  data,
  onGrade,
  onClose,
}: {
  problem: Problem
  data: PostSolveData
  /** `confidence` rides along so the rating is persisted with the grade. */
  onGrade: (g: ReviewGrade, confidence?: number) => void
  onClose: () => void
}) {
  const [confidence, setConfidence] = useState(3)
  const patternInfo = PATTERNS.find((p) => p.name === problem.pattern)
  const related = relatedProblems(problem)
  const patternMatch = data.patternCorrect

  return (
    <ModalShell title={data.passed ? 'Solved' : 'Not quite yet'} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-3">
        <ResultChip label="Pattern" ok={patternMatch} expected={data.expectedPattern} />
        <ResultChip label="Time" ok={data.timeCorrect} expected={data.expectedTime} />
        <ResultChip label="Space" ok={data.spaceCorrect} expected={data.expectedSpace} />
      </div>

      {data.passed && (
        <div className="mt-4 rounded-lg border border-good/30 bg-good-soft p-4 text-sm">
          <div className="font-semibold text-good">Nice work — logged as solved.</div>
          <div className="mt-1 text-mute-dark">
            {data.minutes} min · {data.hintsUsed} hint{data.hintsUsed === 1 ? '' : 's'} used · score {data.score}/100.
          </div>
        </div>
      )}
      {!data.passed && (
        <div className="mt-4 rounded-lg border border-bad/30 bg-bad-soft p-4 text-sm">
          <div className="font-semibold text-bad">Logged as a failed attempt — it is already in your Review queue.</div>
          <div className="mt-1 text-mute-dark">Study the pattern below, then try again tomorrow or right now.</div>
        </div>
      )}

      {/* Pattern Transfer */}
      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">
          Pattern Transfer — you just used {problem.pattern}
        </h3>
        <p className="mt-2 text-sm">{patternInfo?.whatItSolves ?? problem.patternHint}</p>
        <ul className="mt-2 space-y-1 text-sm text-mute-dark">
          {(patternInfo?.recognitionSignals ?? problem.recognitionSignals).slice(0, 4).map((s) => (
            <li key={s} className="flex gap-2">
              <span className="text-accent">•</span> {s}
            </li>
          ))}
        </ul>
        {patternInfo && (
          <div className="mt-2 text-sm italic text-mute-dark">Mental trigger: “{patternInfo.mentalTrigger}”</div>
        )}
      </div>

      {/* Common trap */}
      <div className="mt-4 rounded-md border border-warn/30 bg-warn-soft p-3 text-sm">
        <span className="font-medium text-warn">Common trap:</span> {problem.commonMistakes[0] ?? 'Watch the edge cases.'}
      </div>

      {/* Try next */}
      <div className="mt-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-mute-dark">
          Same pattern, different surface problem — try next
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            ...new Map(
              [...related, ...nextProblems(problem)].map((r) => [r.id, r] as const),
            ).values(),
          ].map((r) => (
            <a key={r.id} href={`#/practice/${r.id}`} className="btn-ghost text-xs">
              {r.title}
            </a>
          ))}
        </div>
      </div>

      {/* Confidence + spaced repetition */}
      <div className="mt-5 border-t border-edge-dark pt-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-mute-dark">
          Confidence: {confidence} / 5
        </label>
        <input
          type="range"
          min={1}
          max={5}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full accent-accent"
          aria-label="Confidence"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {(['again', 'hard', 'good', 'easy', 'mastered'] as ReviewGrade[]).map((g) => (
            <button key={g} className="btn-ghost text-xs capitalize" onClick={() => onGrade(g, confidence)}>
              {g}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-mute-dark">
          Grade schedules the next review: again 1d · hard 2d · good 4d · easy 7d · mastered 14d.
        </p>
      </div>

      {problem.javaSolution && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-accent">Show reference solution</summary>
          <div className="mt-2">
            <CodeBlock code={problem.javaSolution ?? ''} label="Reference Java" />
          </div>
        </details>
      )}
    </ModalShell>
  )
}

function ResultChip({ label, ok, expected }: { label: string; ok: boolean; expected: string }) {
  return (
    <div className={`rounded-lg border p-3 ${ok ? 'border-good/30 bg-good-soft' : 'border-bad/30 bg-bad-soft'}`}>
      <div className="text-[11px] uppercase tracking-wide text-mute-dark">{label}</div>
      <div className={`mt-1 font-semibold ${ok ? 'text-good' : 'text-bad'}`}>{ok ? 'Matched' : 'Check this'}</div>
      <div className="code mt-0.5 text-xs text-mute-dark">expected: {expected}</div>
    </div>
  )
}

export function ModalShell({
  title,
  children,
  onClose,
  wide,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  wide?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className={`card max-h-[88vh] w-full overflow-y-auto p-5 shadow-2xl ${wide ? 'max-w-2xl' : 'max-w-lg'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={title}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="rounded p-1 text-mute-dark hover:bg-edge-dark/40" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
