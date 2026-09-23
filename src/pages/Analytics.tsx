import { useMemo } from 'react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import { useProgress } from '../state/progress'
import { PROBLEMS } from '../data'
import { fmtMinutes } from '../lib/utils'

export default function Analytics() {
  const { progress, snapshot } = useProgress()

  const solvedByDay = useMemo(() => {
    const map = new Map<string, number>()
    for (const a of progress.attempts) {
      if (!a.result.startsWith('solved')) continue
      const d = new Date(a.at)
      const key = `${d.getMonth() + 1}/${d.getDate()}`
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return Array.from(map.entries()).slice(-14)
  }, [progress.attempts])

  const patternDist = useMemo(() => {
    const solved: Record<string, number> = {}
    for (const id of progress.solvedProblems) {
      const p = PROBLEMS.find((x) => x.id === id)
      if (p) solved[p.pattern] = (solved[p.pattern] ?? 0) + 1
    }
    return Object.entries(solved).sort((a, b) => b[1] - a[1])
  }, [progress.solvedProblems])

  const hintsPerProblem = useMemo(() => {
    const solved = progress.attempts.filter((a) => a.result.startsWith('solved'))
    if (solved.length === 0) return 0
    return solved.reduce((s, a) => s + a.hintsUsed, 0) / solved.length
  }, [progress.attempts])

  const confidenceBuckets = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0]
    for (const a of progress.attempts) {
      const conf = a.confidence ?? progress.confidence[a.problemId]
      if (typeof conf === 'number' && conf >= 1 && conf <= 5) {
        buckets[conf - 1]++
      }
    }
    return buckets
  }, [progress.attempts, progress.confidence])

  const maxDay = Math.max(1, ...solvedByDay.map(([, c]) => c))
  const maxConf = Math.max(1, ...confidenceBuckets)

  if (progress.attempts.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <PageHeader title="Analytics" subtitle="Charts appear as soon as you log attempts." />
        <EmptyState title="No data yet." message="Solve a problem or two and your trends will show up here." />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <PageHeader title="Analytics" subtitle="Small signals, honest trends. This is a learning metric, not a judgment." />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">Problems solved over time</h2>
          <div className="mt-4 flex h-32 items-end gap-1.5">
            {solvedByDay.map(([day, count]) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-1" title={`${day}: ${count}`}>
                <div
                  className="w-full rounded-t bg-accent transition-all"
                  style={{ height: `${(count / maxDay) * 100}%`, minHeight: 4 }}
                />
                <span className="truncate text-[9px] text-mute-dark">{day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">Pattern distribution (solved)</h2>
          {patternDist.length === 0 ? (
            <p className="mt-4 text-sm text-mute-dark">No solved problems yet.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {patternDist.slice(0, 6).map(([pat, count]) => {
                return (
                  <div key={pat} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 truncate text-sm">{pat}</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-edge-dark/50">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, count * 20)}%` }} />
                    </div>
                    <span className="code w-6 text-right text-sm">{count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">Efficiency</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-mute-dark">Avg solve time</dt>
              <dd className="mt-0.5 text-xl font-bold">{fmtMinutes(snapshot.avgSolveMinutes)}</dd>
            </div>
            <div>
              <dt className="text-mute-dark">Hints per solved problem</dt>
              <dd className="mt-0.5 text-xl font-bold">{hintsPerProblem.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-mute-dark">Recognition score</dt>
              <dd className="mt-0.5 text-xl font-bold">{snapshot.recognitionScore}/100</dd>
            </div>
            <div>
              <dt className="text-mute-dark">Accuracy</dt>
              <dd className="mt-0.5 text-xl font-bold">{snapshot.accuracyPct}%</dd>
            </div>
          </dl>
        </section>

        <section className="card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">Confidence vs outcome</h2>
          <div className="mt-4 space-y-2">
            {confidenceBuckets.map((count, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-sm">{i + 1} / 5</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-edge-dark/50">
                  <div className="h-full rounded-full bg-good" style={{ width: `${(count / maxConf) * 100}%` }} />
                </div>
                <span className="code w-6 text-right text-sm">{count}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-mute-dark">
            Self-rated confidence per attempt. Low confidence with a solved result = review candidate.
          </p>
        </section>

        <section className="card p-5 lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">Weak patterns (by recognition score)</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(progress.patternStats)
              .map(([name, s]) => ({ name, avg: s.scoreCount ? s.scoreSum / s.scoreCount : 0 }))
              .sort((a, b) => a.avg - b.avg)
              .slice(0, 6)
              .map(({ name, avg }) => (
                <div key={name} className="flex items-center justify-between rounded-md border border-edge-dark px-3 py-2 text-sm">
                  <span className="truncate">{name}</span>
                  <span className={`code ${avg < 60 ? 'text-bad' : avg < 80 ? 'text-warn' : 'text-good'}`}>{Math.round(avg)}</span>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  )
}
