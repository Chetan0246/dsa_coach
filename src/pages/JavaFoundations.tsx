import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, FileText, GraduationCap } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import CodeBlock from '../components/common/CodeBlock'
import FoundationQuiz from '../components/foundations/FoundationQuiz'
import { FOUNDATIONS } from '../data/foundations'
import { classNames } from '../lib/utils'

export default function JavaFoundations() {
  const [tab, setTab] = useState<'lessons' | 'quiz'>('lessons')
  const [openId, setOpenId] = useState<string | null>(FOUNDATIONS[0]?.id ?? null)

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <PageHeader
        title="Java Foundations"
        subtitle="Start here if collections, String methods, or 'clean the input' tricks feel shaky. Ten short lessons, one quiz — then the roadmap."
        actions={
          <Link to="/notes#patterns-pdf" className="btn-ghost text-sm">
            <FileText className="h-4 w-4" /> Patterns PDF
          </Link>
        }
      />

      <div className="mb-6 flex gap-2">
        <button
          className={classNames('btn-ghost text-sm', tab === 'lessons' && '!border-accent !text-accent')}
          onClick={() => setTab('lessons')}
        >
          <BookOpen className="h-4 w-4" /> Lessons
        </button>
        <button
          className={classNames('btn-ghost text-sm', tab === 'quiz' && '!border-accent !text-accent')}
          onClick={() => setTab('quiz')}
        >
          <GraduationCap className="h-4 w-4" /> Methods Quiz
        </button>
      </div>

      {tab === 'lessons' && (
        <>
          <div className="card mb-6 flex flex-wrap items-center gap-3 p-4 text-sm">
            <span className="font-medium">Suggested path:</span>
            <span className="text-mute-dark">
              read Strings → Cleaning → HashMap → ArrayDeque (the big four), skim the rest, then take the quiz.
              The full reference also lives in the <Link to="/java-toolkit" className="underline hover:text-accent">Java Toolkit</Link> and
              the <Link to="/notes#patterns-pdf" className="underline hover:text-accent">Patterns PDF</Link>.
            </span>
          </div>

          <div className="space-y-3">
            {FOUNDATIONS.map((s, i) => {
              const open = openId === s.id
              return (
                <section key={s.id} id={s.id} className="card scroll-mt-6 overflow-hidden">
                  <button
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    onClick={() => setOpenId(open ? null : s.id)}
                    aria-expanded={open}
                  >
                    <span className="code rounded bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-semibold">{s.title}</span>
                    <span className="code ml-auto hidden text-xs text-mute-dark sm:inline">
                      {s.entries.length} entries
                    </span>
                  </button>
                  {open && (
                    <div className="border-t border-edge-dark px-4 py-4">
                      <p className="text-sm text-mute-dark">{s.intro}</p>
                      <ul className="mt-3 divide-y divide-edge-dark">
                        {s.entries.map((e) => (
                          <li key={e.sig} className="py-2">
                            <code className="code text-accent">{e.sig}</code>
                            <div className="mt-0.5 text-sm text-mute-dark">{e.desc}</div>
                          </li>
                        ))}
                      </ul>
                      {s.code && (
                        <div className="mt-3">
                          <CodeBlock code={s.code} />
                        </div>
                      )}
                      <div className="mt-3 rounded-md border border-accent/30 bg-accent-soft p-3 text-sm">
                        <span className="font-medium">Why it matters for DSA:</span> {s.dsaNote}
                      </div>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </>
      )}

      {tab === 'quiz' && <FoundationQuiz />}
    </div>
  )
}
