import { Link } from 'react-router-dom'
import { CalendarClock, Check } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import { getProblem } from '../data'
import { useProgress } from '../state/progress'
import { fmtDate, fmtRelative } from '../lib/utils'
import type { ReviewGrade } from '../types'

const GRADES: { grade: ReviewGrade; label: string; days: string }[] = [
  { grade: 'again', label: 'Again', days: '1d' },
  { grade: 'hard', label: 'Hard', days: '2d' },
  { grade: 'good', label: 'Good', days: '4d' },
  { grade: 'easy', label: 'Easy', days: '7d' },
  { grade: 'mastered', label: 'Mastered', days: '14d' },
]

export default function Review() {
  const { progress, scheduleReview } = useProgress()

  const now = Date.now()
  const due = progress.reviewQueue
    .filter((r) => r.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt)
  const upcoming = progress.reviewQueue
    .filter((r) => r.dueAt > now)
    .sort((a, b) => a.dueAt - b.dueAt)
    .slice(0, 8)

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <PageHeader
        title="Review"
        subtitle="Spaced repetition over the problems you struggled with. Grade honestly — the schedule adapts."
      />

      {progress.reviewQueue.length === 0 ? (
        <EmptyState
          title="Nothing to review yet."
          message="Problems you struggle with will appear here. Failed attempts land in this queue automatically."
        />
      ) : (
        <>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute-dark">
            Due now ({due.length})
          </h2>
          {due.length === 0 ? (
            <div className="card mb-6 flex items-center gap-3 p-4 text-sm text-mute-dark">
              <Check className="h-4 w-4 text-good" /> All caught up. Nothing is due right now.
            </div>
          ) : (
            <ul className="mb-8 space-y-3">
              {due.map((item) => {
                const p = getProblem(item.problemId)
                if (!p) return null
                return (
                  <li key={item.problemId} className="card p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/practice/${p.id}?mode=review`} className="font-semibold hover:text-accent">
                        {p.title}
                      </Link>
                      <span className="code text-xs text-mute-dark">{p.pattern}</span>
                      <span className="code ml-auto text-xs text-mute-dark">
                        last {item.lastReviewedAt ? fmtRelative(item.lastReviewedAt) : 'never'}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {GRADES.map((g) => (
                        <button
                          key={g.grade}
                          className="btn-ghost text-xs"
                          onClick={() => scheduleReview(item.problemId, g.grade)}
                          title={`Next review in ${g.days}`}
                        >
                          {g.label} <span className="text-mute-dark">{g.days}</span>
                        </button>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {upcoming.length > 0 && (
            <>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mute-dark">Coming up</h2>
              <ul className="card divide-y divide-edge-dark">
                {upcoming.map((item) => {
                  const p = getProblem(item.problemId)
                  if (!p) return null
                  return (
                    <li key={item.problemId} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                      <CalendarClock className="h-4 w-4 shrink-0 text-mute-dark" />
                      <Link to={`/practice/${p.id}`} className="min-w-0 flex-1 truncate hover:text-accent">
                        {p.title}
                      </Link>
                      <span className="code text-xs text-mute-dark">{p.pattern}</span>
                      <span className="code w-20 text-right text-xs text-mute-dark">due {fmtDate(item.dueAt)}</span>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}
