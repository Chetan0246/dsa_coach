import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Play, ArrowLeft } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import { PROBLEMS } from '../data'
import { useProgress } from '../state/progress'
import { classNames } from '../lib/utils'

const DURATIONS = [30, 45, 60, 90]
const COUNTS = [1, 2, 3, 4]

interface OAConfig {
  minutes: number
  problems: number
}

export default function OAMode() {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const [config, setConfig] = useState<OAConfig>({ minutes: 45, problems: 2 })
  const [started, setStarted] = useState(false)

  const solvedSet = new Set(progress.solvedProblems)

  const picked = useMemo(() => {
    // Prefer unsolved problems across mixed difficulties
    const unsolved = PROBLEMS.filter((p) => !solvedSet.has(p.id))
    const pool = unsolved.length >= config.problems ? unsolved : PROBLEMS
    const easy = pool.filter((p) => p.difficulty === 'Easy')
    const medium = pool.filter((p) => p.difficulty === 'Medium')
    const hard = pool.filter((p) => p.difficulty === 'Hard')
    const out = []
    for (let i = 0; i < config.problems; i++) {
      const round = i % 3
      const src = round === 0 ? easy : round === 1 ? medium : hard
      out.push((src[i % src.length] ?? pool[i]) ?? PROBLEMS[i])
    }
    return out.filter(Boolean).slice(0, config.problems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, progress.solvedProblems.length])

  if (started) {
    return (
      <div className="mx-auto max-w-3xl p-6 lg:p-8">
        <PageHeader
          title="OA Session"
          subtitle={`${config.minutes} minutes · ${config.problems} problem${config.problems > 1 ? 's' : ''} · hints off · timer running from your first click.`}
          actions={
            <button className="btn-ghost" onClick={() => setStarted(false)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          }
        />
        <ul className="space-y-3">
          {picked.map((p, i) => (
            <li key={p.id} className="card flex items-center gap-4 p-4">
              <span className="code text-sm font-bold text-mute-dark">Q{i + 1}</span>
              <div className="min-w-0 flex-1">
                <button className="font-semibold hover:text-accent" onClick={() => navigate(`/practice/${p.id}?mode=timed`)}>
                  {p.title}
                </button>
                <div className="code text-xs text-mute-dark">hidden pattern · {p.estimatedMinutes} min suggested</div>
              </div>
              <span
                className={classNames(
                  'code text-xs',
                  p.difficulty === 'Easy' ? 'text-good' : p.difficulty === 'Medium' ? 'text-warn' : 'text-bad',
                )}
              >
                {p.difficulty}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-md border border-edge-dark bg-edge-dark/20 p-4 text-sm text-mute-dark">
          Open each problem and work it like a real assessment: no coach, no pattern labels, timer visible. Your
          attempts are graded the same way — pattern and complexity self-identification included.
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-8">
      <PageHeader
        title="OA Mode"
        subtitle="A clean testing environment: no coach, no pattern tags, one clock. Configure and go."
      />
      <div className="card p-5">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">Duration</h2>
            <div className="mt-2 flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  className={classNames('btn-ghost text-sm', config.minutes === d && '!border-accent !text-accent')}
                  onClick={() => setConfig((c) => ({ ...c, minutes: d }))}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">Problems</h2>
            <div className="mt-2 flex gap-2">
              {COUNTS.map((count) => (
                <button
                  key={count}
                  className={classNames('btn-ghost text-sm', config.problems === count && '!border-accent !text-accent')}
                  onClick={() => setConfig((c) => ({ ...c, problems: count }))}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-md border border-edge-dark bg-edge-dark/20 p-3 text-sm text-mute-dark">
          Difficulty: mixed. Hints: off. This is practice, not a prediction — the summary is factual only.
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button className="btn-primary" onClick={() => setStarted(true)}>
            <Play className="h-4 w-4" /> Start session
          </button>
          <Link to="/practice?mode=timed" className="text-sm text-mute-dark hover:text-accent">
            or practice timed without OA setup
          </Link>
        </div>
      </div>
    </div>
  )
}
