import { Link, useNavigate } from 'react-router-dom'
import { Play, Flame, Target, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import ProgressBar from '../components/common/ProgressBar'
import EmptyState from '../components/common/EmptyState'
import { PHASES, PROBLEMS, TOTAL_PROBLEMS, getProblem } from '../data'
import { PATTERNS } from '../data/patterns'
import { useProgress } from '../state/progress'
import { fmtMinutes, fmtRelative, todayKey } from '../lib/utils'

export default function Dashboard() {
  const { progress, snapshot, settings } = useProgress()
  const navigate = useNavigate()

  const solvedSet = new Set(progress.solvedProblems)
  const nextProblem = PROBLEMS.find((p) => !solvedSet.has(p.id)) ?? PROBLEMS[0]
  const phaseMeta = PHASES.find((ph) => ph.phase === nextProblem.phase)!
  const phaseProblems = PROBLEMS.filter((p) => p.phase === phaseMeta.phase)
  const phaseDone = phaseProblems.filter((p) => solvedSet.has(p.id)).length

  const dueReviews = progress.reviewQueue.filter((r) => r.dueAt <= Date.now())
  const reviewProblem = dueReviews.length > 0 ? getProblem(dueReviews[0].problemId) : undefined

  const todaySolved = progress.attempts.filter(
    (a) => a.result.startsWith('solved') && todayKey(new Date(a.at)) === todayKey(),
  ).length

  const recent = [...progress.attempts].reverse().slice(0, 6)

  if (progress.attempts.length === 0) {
    return (
      <div className="mx-auto max-w-5xl p-6 lg:p-8">
        <PageHeader title="PatternPilot" subtitle="Train your pattern recognition. Not your memory." />
        <EmptyState
          title="Your roadmap is waiting."
          message={`Start with Problem #1: ${PROBLEMS[0].title}. ${TOTAL_PROBLEMS} problems, one pattern at a time.`}
          action={
            <Link to={`/practice/${PROBLEMS[0].id}`} className="btn-primary">
              <Play className="h-4 w-4" /> Start with Two Sum
            </Link>
          }
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard title="Your goal" body={`${TOTAL_PROBLEMS} problems over 40–60 days, pattern-first.`} />
          <InfoCard title="Your language" body="Java. Templates and toolkit included." />
          <InfoCard title="Daily target" body={`${settings.dailyTarget} problems per day — adjust in Settings.`} />
        </div>
      </div>
      )
  }

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-8">
      <PageHeader
        title="PatternPilot"
        subtitle="Train your pattern recognition. Not your memory."
        actions={
          <button
            className="btn-primary"
            onClick={() => navigate(reviewProblem ? `/practice/${reviewProblem.id}?mode=review` : `/practice/${nextProblem.id}`)}
          >
            <Play className="h-4 w-4" /> Start Practice
          </button>
        }
      />

      {/* Today's focus */}
      <section className="grid gap-4 lg:grid-cols-3" aria-label="Today's focus">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">Today's Focus</h2>
            <span className="text-xs text-mute-dark">
              {todaySolved}/{settings.dailyTarget} solved today
            </span>
          </div>
          <Link to={`/practice/${nextProblem.id}`} className="group block">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold group-hover:text-accent">{nextProblem.title}</div>
                <div className="code mt-1 text-xs text-mute-dark">
                  {nextProblem.pattern} · Phase {nextProblem.phase} — {phaseMeta.name}
                </div>
              </div>
              <span
                className={`code shrink-0 rounded-full border px-2 py-0.5 text-xs ${
                  nextProblem.difficulty === 'Easy'
                    ? 'border-good/40 text-good'
                    : nextProblem.difficulty === 'Medium'
                      ? 'border-warn/40 text-warn'
                      : 'border-bad/40 text-bad'
                }`}
              >
                {nextProblem.difficulty}
              </span>
            </div>
          </Link>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <Stat label="Estimated" value={`${nextProblem.estimatedMinutes} min`} />
            <Stat label="Pattern" value={nextProblem.pattern} />
            <Stat label="Due reviews" value={String(dueReviews.length)} />
          </div>
          {reviewProblem && (
            <div className="mt-4 rounded-md border border-warn/30 bg-warn-soft p-3 text-sm">
              <span className="font-medium text-warn">Review due:</span>{' '}
              <Link to={`/practice/${reviewProblem.id}?mode=review`} className="underline hover:text-accent">
                {reviewProblem.title}
              </Link>{' '}
              <span className="text-mute-dark">— cleared last time {fmtRelative(Date.now() - 86400000)}.</span>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute-dark">Current Phase</h2>
          <div className="text-sm font-semibold">
            Phase {phaseMeta.phase} — {phaseMeta.name}
          </div>
          <ProgressBar className="mt-3" value={(phaseDone / phaseProblems.length) * 100} />
          <div className="mt-2 text-xs text-mute-dark">
            {phaseDone} / {phaseProblems.length} completed
          </div>
        </div>
      </section>

      {/* Progress overview */}
      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Progress overview">
        <MetricCard label="Problems" value={`${snapshot.solvedCount}`} sub={`of ${TOTAL_PROBLEMS}`} icon={CheckCircle2} />
        <MetricCard label="Patterns" value={`${snapshot.patternsTouched}`} sub={`of ${PATTERNS.length}`} icon={Target} />
        <MetricCard label="Streak" value={`${snapshot.streak}`} sub={snapshot.streak === 1 ? 'day' : 'days'} icon={Flame} />
        <MetricCard label="Accuracy" value={`${snapshot.accuracyPct}%`} sub="solved / attempted" icon={TrendingUp} />
      </section>

      {/* Learning metrics */}
      <section className="mt-4 grid gap-4 lg:grid-cols-2" aria-label="Learning metrics">
        <div className="card p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute-dark">Learning Metrics</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <Metric label="Solved without hints" value={String(snapshot.solvedNoHints)} />
            <Metric label="Solved with hints" value={String(snapshot.solvedWithHints)} />
            <Metric label="Avg solve time" value={fmtMinutes(snapshot.avgSolveMinutes)} />
            <Metric label="Recognition score" value={`${snapshot.recognitionScore}/100`} />
            <Metric
              label="Strongest pattern"
              value={snapshot.strongestPattern ?? '—'}
              icon={TrendingUp}
              iconClass="text-good"
            />
            <Metric
              label="Weakest pattern"
              value={snapshot.weakestPattern ?? '—'}
              icon={TrendingDown}
              iconClass="text-bad"
            />
          </dl>
        </div>

        <div className="card p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute-dark">Recent Activity</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-mute-dark">No attempts recorded yet — your history will appear here.</p>
          ) : (
            <ul className="divide-y divide-edge-dark">
              {recent.map((a, i) => {
                const prob = getProblem(a.problemId)
                if (!prob) return null
                return (
                  <li key={`${a.problemId}-${a.at}-${i}`} className="flex items-center gap-3 py-2 text-sm">
                    <Link to={`/practice/${prob.id}`} className="min-w-0 flex-1 truncate font-medium hover:text-accent">
                      {prob.title}
                    </Link>
                    <span className="code hidden text-xs text-mute-dark sm:inline">{prob.pattern}</span>
                    <span
                      className={`code rounded px-1.5 py-0.5 text-[11px] ${
                        a.result.startsWith('solved') ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad'
                      }`}
                    >
                      {a.result.startsWith('solved') ? 'solved' : 'failed'}
                    </span>
                    <span className="code w-12 text-right text-xs text-mute-dark">{fmtMinutes(a.minutes)}</span>
                    <span className="code w-8 text-right text-xs text-mute-dark" title="hints used">
                      {a.hintsUsed}h
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-mute-dark">{label}</div>
      <div className="mt-0.5 truncate text-sm font-medium">{value}</div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string
  value: string
  sub: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-mute-dark">{label}</span>
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="text-xs text-mute-dark">{sub}</div>
    </div>
  )
}

function Metric({ label, value, icon: Icon, iconClass }: { label: string; value: string; icon?: React.ComponentType<{ className?: string }>; iconClass?: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] uppercase tracking-wide text-mute-dark">{label}</dt>
      <dd className="mt-0.5 flex items-center gap-1.5 truncate font-medium">
        {Icon && <Icon className={`h-3.5 w-3.5 ${iconClass ?? ''}`} />}
        {value}
      </dd>
    </div>
  )
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-mute-dark">{title}</div>
      <div className="mt-1 text-sm">{body}</div>
    </div>
  )
}
