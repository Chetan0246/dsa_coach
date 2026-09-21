import { useState } from 'react'
import { CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { FOUNDATION_QUESTIONS } from '../data/foundationQuiz'
import { classNames } from '../lib/utils'

const LETTERS = ['A', 'B', 'C', 'D']

export default function FoundationQuiz() {
  const [order] = useState(() => shuffle(Array.from(FOUNDATION_QUESTIONS.keys())))
  const [pos, setPos] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState({ right: 0, total: 0 })

  const qi = order[pos % order.length]
  const q = FOUNDATION_QUESTIONS[qi]
  const answered = picked !== null
  const correct = picked === q.correct

  const choose = (i: number) => {
    if (answered) return
    setPicked(i)
    setScore((s) => ({ right: s.right + (i === q.correct ? 1 : 0), total: s.total + 1 }))
  }

  const next = () => {
    setPicked(null)
    setPos((p) => p + 1)
  }

  const restart = () => {
    setPos(0)
    setPicked(null)
    setScore({ right: 0, total: 0 })
  }

  const pct = score.total > 0 ? Math.round((score.right / score.total) * 100) : 0
  const done = score.total >= order.length

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center gap-4 text-sm text-mute-dark">
        <span>
          Score <strong className="text-ink-dark">{score.right}/{score.total}</strong> ({pct}%)
        </span>
        <span className="hidden sm:inline">
          Question {Math.min(pos + 1, order.length)} of {order.length}
        </span>
        <button className="ml-auto btn-ghost text-xs" onClick={restart}>
          <RefreshCw className="h-3.5 w-3.5" /> Restart
        </button>
      </div>

      {done ? (
        <div className="rounded-md border border-good/30 bg-good-soft p-4 text-sm">
          <div className="font-semibold text-good">Round complete — {score.right}/{order.length} correct.</div>
          <p className="mt-1 text-mute-dark">
            Below 80%? Re-read the trap list, then run the round again. Above 80%? You are ready for the roadmap.
          </p>
          <button className="btn-primary mt-3 text-xs" onClick={restart}>
            <RefreshCw className="h-3.5 w-3.5" /> Go again
          </button>
        </div>
      ) : (
        <>
          <p className="text-[15px] font-medium leading-relaxed">{q.q}</p>
          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct
              const isPicked = i === picked
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={answered}
                  className={classNames(
                    'flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors',
                    !answered && 'border-edge-dark hover:border-accent hover:bg-accent-soft',
                    answered && isCorrect && 'border-good/50 bg-good-soft',
                    answered && isPicked && !isCorrect && 'border-bad/50 bg-bad-soft',
                    answered && !isCorrect && !isPicked && 'border-edge-dark opacity-50',
                  )}
                >
                  <span className="code shrink-0 rounded bg-edge-dark/40 px-1.5 py-0.5 text-xs">{LETTERS[i]}</span>
                  <span className="flex-1">{opt}</span>
                  {answered && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-good" />}
                  {answered && isPicked && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-bad" />}
                </button>
              )
            })}
          </div>

          {answered && (
            <div className="mt-4 rounded-md border border-edge-dark bg-edge-dark/20 p-4 text-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-mute-dark">
                {correct ? 'Correct —' : 'Why:'}
              </div>
              <p className="mt-1">{q.why}</p>
              <button className="btn-primary mt-3 text-xs" onClick={next}>
                Next question <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function shuffle(n: number[]): number[] {
  const a = Array.from(n)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
