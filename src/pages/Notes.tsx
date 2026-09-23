import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search,
  FileText,
  BookOpen,
  ExternalLink,
  Download,
  Layers,
  AlertTriangle,
  Compass,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import { getProblem, PROBLEMS } from '../data'
import { useProgress } from '../state/progress'
import { classNames } from '../lib/utils'
import {
  REFERENCE_BOOKS,
  PATTERN_DECISION_RULES,
  EXTERNAL_RESOURCES,
  type ReferenceBook,
  type PatternDecisionRule,
  type ExternalResource,
} from '../data/referenceBooks'

type Tab = 'notes' | 'references' | 'matrix'

export default function Notes() {
  const { progress } = useProgress()
  const location = useLocation()
  const [q, setQ] = useState('')
  const [matrixFilter, setMatrixFilter] = useState('')

  const initialTab = useMemo<Tab>(() => {
    const hash = location.hash.toLowerCase()
    if (hash === '#references' || hash === '#patterns-pdf' || hash === '#books') return 'references'
    if (hash === '#matrix' || hash === '#cheatsheet') return 'matrix'
    return 'notes'
  }, [location.hash])

  const [tab, setTab] = useState<Tab>(initialTab)

  useEffect(() => {
    const hash = location.hash.toLowerCase()
    if (hash === '#references' || hash === '#patterns-pdf' || hash === '#books') setTab('references')
    else if (hash === '#matrix' || hash === '#cheatsheet') setTab('matrix')
  }, [location.hash])

  const entries = Object.entries(progress.notes).filter(([, text]) => text.trim().length > 0)

  const filteredNotes = entries.filter(([id, text]) => {
    const p = getProblem(id)
    const hay = `${p?.title ?? id} ${text}`.toLowerCase()
    return hay.includes(q.toLowerCase())
  })

  const filteredRules = useMemo(() => {
    if (!matrixFilter.trim()) return PATTERN_DECISION_RULES
    const needle = matrixFilter.toLowerCase()
    return PATTERN_DECISION_RULES.filter(
      (r) =>
        r.signal.toLowerCase().includes(needle) ||
        r.pattern.toLowerCase().includes(needle) ||
        r.dataStructure.toLowerCase().includes(needle) ||
        r.exampleProblem.toLowerCase().includes(needle) ||
        (r.whenNotToUse && r.whenNotToUse.toLowerCase().includes(needle)),
    )
  }, [matrixFilter])

  // Lookup problems by title for direct practice links in the matrix
  const problemByTitle = useMemo(() => {
    const map = new Map<string, string>()
    for (const p of PROBLEMS) map.set(p.title.toLowerCase(), p.id)
    return map
  }, [])

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <PageHeader
        title="Notes & Reference Hub"
        subtitle="Your personal problem notes alongside curated books, open-access PDFs, and the Pattern Decision Matrix."
        actions={
          tab === 'notes' ? (
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-mute-dark" />
              <input
                className="input !py-1.5 !pl-8 w-56"
                placeholder="Search notes..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search notes"
              />
            </div>
          ) : undefined
        }
      />

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={classNames(
            'btn-ghost text-sm',
            tab === 'notes' && '!border-accent !text-accent bg-accent-soft',
          )}
          onClick={() => setTab('notes')}
        >
          <FileText className="h-4 w-4" /> My Problem Notes ({entries.length})
        </button>
        <button
          className={classNames(
            'btn-ghost text-sm',
            tab === 'references' && '!border-accent !text-accent bg-accent-soft',
          )}
          onClick={() => setTab('references')}
        >
          <BookOpen className="h-4 w-4" /> Books & Reference Guides ({REFERENCE_BOOKS.length})
        </button>
        <button
          className={classNames(
            'btn-ghost text-sm',
            tab === 'matrix' && '!border-accent !text-accent bg-accent-soft',
          )}
          onClick={() => setTab('matrix')}
        >
          <Layers className="h-4 w-4" /> Pattern Decision Matrix
        </button>
      </div>

      {/* TAB 1: My Problem Notes */}
      {tab === 'notes' && (
        <div>
          {/* Quick PDF Reference Banner */}
          <section id="patterns-pdf" className="card mb-6 flex flex-wrap items-center gap-4 p-5 scroll-mt-6">
            <div className="rounded-lg bg-accent-soft p-3">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">Java DSA Patterns — Printable PDF Reference</h2>
              <p className="text-sm text-mute-dark">
                Every pattern with recognition signals, mental trigger, Java template, common traps, and practice
                problems. Open online or print to PDF for your desk.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/patterns-pdf" className="btn-primary text-sm">
                Open reference
              </Link>
            </div>
          </section>

          {entries.length === 0 ? (
            <EmptyState
              title="No notes written yet."
              message="Every problem page has a 'My Notes' box. Write down what tripped you up, your edge-case rules, and mental models — future-you is the reader."
            />
          ) : (
            <div className="space-y-3">
              {filteredNotes.map(([id, text]) => {
                const p = getProblem(id)
                return (
                  <div key={id} className="card p-4">
                    <div className="mb-1.5 flex items-center gap-2">
                      {p ? (
                        <Link to={`/practice/${p.id}`} className="font-semibold hover:text-accent">
                          {p.title}
                        </Link>
                      ) : (
                        <span className="font-semibold">{id}</span>
                      )}
                      {p && <span className="code text-xs text-mute-dark">{p.pattern}</span>}
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-mute-dark leading-relaxed">{text}</p>
                  </div>
                )
              })}
              {filteredNotes.length === 0 && (
                <p className="py-6 text-center text-sm text-mute-dark">No notes match “{q}”.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Books & Reference PDFs */}
      {tab === 'references' && (
        <div className="space-y-6">
          {/* In-app primary reference */}
          <div className="card overflow-hidden border-accent/40 bg-accent-soft/20 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="code rounded bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                    Built-in
                  </span>
                  <span className="code text-xs text-mute-dark">Printable & Offline</span>
                </div>
                <h3 className="mt-2 text-lg font-bold">PatternPilot Java DSA Patterns Reference</h3>
                <p className="mt-1 text-sm text-mute-dark">
                  The complete 22-pattern syllabus synthesized for high-speed pattern recognition: core problem signals,
                  mental triggers, idiomatic Java skeletons, and common interview traps.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  <span className="rounded border border-edge-dark bg-panel-dark px-2 py-0.5">22 Patterns</span>
                  <span className="rounded border border-edge-dark bg-panel-dark px-2 py-0.5">Java Templates</span>
                  <span className="rounded border border-edge-dark bg-panel-dark px-2 py-0.5">Traps & Pitfalls</span>
                  <span className="rounded border border-edge-dark bg-panel-dark px-2 py-0.5">Printable HTML / PDF</span>
                </div>
              </div>
              <Link to="/patterns-pdf" className="btn-primary shrink-0 text-sm">
                Open in-app PDF
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-mute-dark">
              Authoritative Free Books, Handbooks & PDFs
            </h3>
            <p className="mb-4 text-xs text-mute-dark">
              Open-access textbooks, community handbooks, and reference sheets covering pattern-based problem solving, Java collections internals, and algorithmic complexity.
            </p>

            <div className="space-y-4">
              {REFERENCE_BOOKS.map((book: ReferenceBook) => (
                <div key={book.id} className="card p-5 transition-colors hover:border-accent/40">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="code rounded bg-edge-dark/50 px-2 py-0.5 text-[11px] font-semibold text-ink-dark">
                          {book.format}
                        </span>
                        <span className="code text-[11px] text-mute-dark">{book.license}</span>
                      </div>
                      <h4 className="mt-1.5 text-base font-bold text-ink-dark">{book.title}</h4>
                      <div className="text-xs text-mute-dark">
                        {book.author} · <span className="italic">{book.source}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {book.pdfUrl && (
                        <a
                          href={book.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost !px-3 !py-1 text-xs"
                          title="Open official PDF directly in browser"
                        >
                          <Download className="h-3.5 w-3.5" /> Direct PDF
                        </a>
                      )}
                      <a
                        href={book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary !px-3 !py-1 text-xs"
                      >
                        Visit resource <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-mute-dark">{book.description}</p>

                  <div className="mt-3 border-t border-edge-dark/60 pt-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-mute-dark">Key Topics Covered:</div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {book.keyTopics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-md border border-edge-dark bg-edge-dark/30 px-2 py-0.5 text-xs text-mute-dark"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {book.quickLinks && book.quickLinks.length > 0 && (
                    <div className="mt-3 border-t border-edge-dark/60 pt-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-mute-dark">
                        Quick Topic Deep Dives:
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {book.quickLinks.map((ql) => (
                          <a
                            key={ql.label}
                            href={ql.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md border border-edge-dark bg-edge-dark/20 px-2.5 py-1 text-xs text-ink-dark transition-colors hover:border-accent hover:text-accent"
                          >
                            {ql.label} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 rounded-md border border-accent/20 bg-accent-soft/30 p-2.5 text-xs text-mute-dark">
                    <strong className="text-accent">Recommended for:</strong> {book.recommendedFor}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Cheatsheets & External Pattern Guides */}
          <div className="pt-2">
            <div className="mb-1 flex items-center gap-2">
              <Compass className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-mute-dark">
                Curated Cheatsheets & External Pattern Guides
              </h3>
            </div>
            <p className="mb-4 text-xs text-mute-dark">
              Community portals, visual algorithmic animations, and curated problem trackers.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {EXTERNAL_RESOURCES.map((res: ExternalResource) => (
                <div key={res.id} className="card flex flex-col justify-between p-4 transition-colors hover:border-accent/40">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="code rounded bg-edge-dark/50 px-2 py-0.5 text-[10px] font-semibold text-ink-dark">
                        {res.category}
                      </span>
                      <span className="code text-[11px] text-mute-dark">{res.provider}</span>
                    </div>
                    <h4 className="mt-2 text-sm font-bold text-ink-dark">{res.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-mute-dark">{res.description}</p>
                  </div>
                  <div className="mt-3 flex justify-end border-t border-edge-dark/40 pt-2">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost !px-2.5 !py-1 text-xs hover:text-accent flex items-center gap-1"
                    >
                      Open resource <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Pattern Decision Matrix */}
      {tab === 'matrix' && (
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">Pattern Decision Matrix</h3>
                <p className="text-xs text-mute-dark">
                  “When I see X in the problem description, which pattern and Java structure should I immediately deploy — and what traps must I avoid?”
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-mute-dark" />
                <input
                  className="input !py-1 !pl-8 text-xs"
                  placeholder="Filter signals or patterns..."
                  value={matrixFilter}
                  onChange={(e) => setMatrixFilter(e.target.value)}
                  aria-label="Filter pattern matrix"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredRules.map((rule: PatternDecisionRule, idx: number) => {
              // Find if representative problems exist in curriculum
              const exampleTitles = rule.exampleProblem.split(',').map((s) => s.trim())
              return (
                <div key={idx} className="card p-4 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="code text-xs font-semibold text-accent">{rule.pattern}</span>
                        <span className="code text-[11px] text-mute-dark">
                          {rule.timeComplexity} · {rule.spaceComplexity}
                        </span>
                      </div>
                      <div className="mt-1 font-medium text-ink-dark">
                        <span className="text-mute-dark">Signal:</span> “{rule.signal}”
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 rounded-md border border-edge-dark bg-black/20 p-2.5 font-mono text-xs text-good">
                    {rule.dataStructure}
                  </div>

                  {rule.whenNotToUse && (
                    <div className="mt-2.5 flex items-start gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 p-2 text-xs text-amber-200/90">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                      <div>
                        <strong className="text-amber-300">When NOT to use:</strong> {rule.whenNotToUse}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-mute-dark">
                    <span>Try on:</span>
                    {exampleTitles.map((title) => {
                      const id = problemByTitle.get(title.toLowerCase())
                      return id ? (
                        <Link
                          key={title}
                          to={`/practice/${id}`}
                          className="btn-ghost !px-2 !py-0.5 text-[11px] hover:text-accent"
                        >
                          {title} →
                        </Link>
                      ) : (
                        <span key={title} className="code text-[11px] text-mute-dark">
                          {title}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            {filteredRules.length === 0 && (
              <p className="py-6 text-center text-sm text-mute-dark">No patterns match “{matrixFilter}”.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
