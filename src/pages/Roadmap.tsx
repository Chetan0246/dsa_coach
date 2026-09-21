import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, Play, Search } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import ProgressBar from '../components/common/ProgressBar'
import { PHASES, PROBLEMS, difficultyRank } from '../data'
import { useProgress } from '../state/progress'
import { classNames } from '../lib/utils'

export default function Roadmap() {
  const { progress } = useProgress()
  const navigate = useNavigate()
  const solvedSet = new Set(progress.solvedProblems)
  const nextProblem = PROBLEMS.find((p) => !solvedSet.has(p.id))

  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set())

  const filtered = useMemo(() => {
    if (!query.trim()) return PROBLEMS
    const needle = query.toLowerCase()
    return PROBLEMS.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.pattern.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.includes(needle)),
    )
  }, [query])

  const toggle = (phase: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(phase)) next.delete(phase)
      else next.add(phase)
      return next
    })

  const startNext = () => {
    if (nextProblem) navigate(`/practice/${nextProblem.id}`)
  }

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <PageHeader
        title="Roadmap"
        subtitle={`${PROBLEMS.length} problems across ${PHASES.length} pattern families. Work top to bottom — each phase builds on the last.`}
        actions={
          <>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-mute-dark" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter problems..."
                className="input !py-1.5 !pl-8 w-56"
                aria-label="Filter problems"
              />
            </div>
            <button className="btn-primary" onClick={startNext} disabled={!nextProblem}>
              <Play className="h-4 w-4" /> Continue
            </button>
          </>
        }
      />

      <div className="space-y-3">
        {PHASES.map((phase) => {
          const problems = filtered.filter((p) => p.phase === phase.phase)
          if (problems.length === 0) return null
          const all = PROBLEMS.filter((p) => p.phase === phase.phase)
          const done = all.filter((p) => solvedSet.has(p.id)).length
          const isCollapsed = collapsed.has(phase.phase) && !query.trim()
          return (
            <section key={phase.phase} className="card overflow-hidden">
              <button
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-edge-dark/20"
                onClick={() => toggle(phase.phase)}
                aria-expanded={!isCollapsed}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4 text-mute-dark" /> : <ChevronDown className="h-4 w-4 text-mute-dark" />}
                <span className="code rounded bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                  Phase {phase.phase}
                </span>
                <span className="font-semibold">{phase.name}</span>
                <span className="ml-auto text-xs text-mute-dark">
                  {done} / {all.length}
                </span>
                <div className="hidden w-32 sm:block">
                  <ProgressBar value={(done / all.length) * 100} />
                </div>
              </button>
              {!isCollapsed && (
                <ul className="divide-y divide-edge-dark border-t border-edge-dark">
                  {problems
                    .slice()
                    .sort((a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty))
                    .map((p) => {
                      const solved = solvedSet.has(p.id)
                      const attempted = progress.attemptedProblems.includes(p.id)
                      return (
                        <li key={p.id}>
                          <Link
                            to={`/practice/${p.id}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-edge-dark/20"
                          >
                            <span
                              className={classNames(
                                'h-2 w-2 shrink-0 rounded-full',
                                solved ? 'bg-good' : attempted ? 'bg-warn' : 'bg-edge-dark',
                              )}
                              title={solved ? 'Solved' : attempted ? 'Attempted' : 'Not started'}
                            />
                            <span className={classNames('min-w-0 flex-1 truncate', solved && 'text-mute-dark line-through decoration-good/50')}>
                              {p.title}
                            </span>
                            <span className="code hidden text-xs text-mute-dark md:inline">{p.pattern}</span>
                            <span
                              className={classNames(
                                'code w-16 text-right text-xs',
                                p.difficulty === 'Easy' ? 'text-good' : p.difficulty === 'Medium' ? 'text-warn' : 'text-bad',
                              )}
                            >
                              {p.difficulty}
                            </span>
                            <span className="code hidden w-12 text-right text-xs text-mute-dark sm:inline">
                              {p.estimatedMinutes}m
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
