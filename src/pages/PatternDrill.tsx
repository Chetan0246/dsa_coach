import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import { drillCandidates, drillChoices, PROBLEMS } from '../data'
import { useProgress } from '../state/progress'
import { classNames } from '../lib/utils'
import type { MistakeType } from '../types'

const LETTERS = ['A', 'B', 'C', 'D']

export default function PatternDrill() {
  const { addMistake } = useProgress()
  const [round, setRound] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [stats, setStats] = useState({ right: 0, total: 0, streak: 0, best: 0 })

  // A fresh question every round, drawn deterministically from the pool
  const question = useMemo(() => {
    const pool = drillCandidates()
    const p = pool[(round * 7 + 3) % pool.length]
    return { problem: p, choices: drillChoices(p) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const { problem, choices } = question
  const answered = picked !== null
  const correct = picked === problem.pattern

  const choose = (choice: string) => {
    if (answered) return
    setPicked(choice)
    const isRight = choice === problem.pattern
    setStats((s) => {
      const streak = isRight ? s.streak + 1 : 0
      return {
        right: s.right + (isRight ? 1 : 0),
        total: s.total + 1,
        streak,
        best: Math.max(s.best, streak),
      }
    })
    if (!isRight) {
      addMistake({
        type: 'Pattern recognition' as MistakeType,
        note: `Drill: mistook "${problem.title}" for ${choice} instead of ${problem.pattern}.`,
      })
    }
  }

  const next = () => {
    setRound((r) => r + 1)
    setPicked(null)
  }

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-8">
      <PageHeader
        title="Pattern Drill"
        subtitle="A problem walks in with no title and no tags. Name the pattern hiding inside it — this is the core skill."
      />

      <div className="mb-4 flex items-center gap-6 text-sm text-mute-dark">
        <span>Score <strong className="text-ink-dark">{stats.right}/{stats.total}</strong></span>
        <span>Streak <strong className="text-ink-dark">{stats.streak}</strong> (best {stats.best})</span>
        <button className="ml-auto btn-ghost text-xs" onClick={() => { setStats({ right: 0, total: 0, streak: 0, best: 0 }); setRound(0); setPicked(null) }}>
          <RefreshCw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <div className="card p-5">
        <div className="code text-xs text-mute-dark">What pattern do you recognize?</div>
        <p className="mt-2 text-[15px] leading-relaxed">{problem.shortDescription}</p>

        <div className="mt-4 space-y-2">
          {choices.map((c, i) => {
            const isCorrect = c === problem.pattern
            const isPicked = c === picked
            return (
              <button
                key={c}
                onClick={() => choose(c)}
                disabled={answered}
                className={classNames(
                  'flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors',
                  !answered && 'border-edge-dark hover:border-accent hover:bg-accent-soft',
                  answered && isCorrect && 'border-good/50 bg-good-soft',
                  answered && isPicked && !isCorrect && 'border-bad/50 bg-bad-soft',
                  answered && !isCorrect && !isPicked && 'border-edge-dark opacity-50',
                )}
              >
                <span className="code rounded bg-edge-dark/40 px-1.5 py-0.5 text-xs">{LETTERS[i]}</span>
                <span className="flex-1 font-medium">{c}</span>
                {answered && isCorrect && <CheckCircle2 className="h-4 w-4 text-good" />}
                {answered && isPicked && !isCorrect && <XCircle className="h-4 w-4 text-bad" />}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="mt-4 rounded-md border border-edge-dark bg-edge-dark/20 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-mute-dark">Why?</div>
            <p className="mt-1 text-sm">
              The problem asks for {problem.recognitionSignals[0]?.toLowerCase() ?? 'a repeating structure'}. {problem.patternHint}
            </p>
            <p className="mt-1 text-sm text-mute-dark">
              → {correct ? 'You called it: ' : 'Answer: '}<strong>{problem.pattern}</strong>
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button className="btn-primary text-xs" onClick={next}>
                Next drill <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <Link className="btn-ghost text-xs" to={`/practice/${problem.id}`}>
                Try the real problem
              </Link>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-mute-dark">
        Wrong answers are logged to your <Link to="/mistakes" className="underline hover:text-accent">mistake log</Link> as
        pattern-recognition slips. {PROBLEMS.length} problems are in the drill pool.
      </p>
    </div>
  )
}
