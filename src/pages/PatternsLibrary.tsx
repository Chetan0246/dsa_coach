import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Zap } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import CodeBlock from '../components/common/CodeBlock'
import { PATTERNS } from '../data/patterns'
import { problemsByPattern } from '../data'
import { classNames } from '../lib/utils'

export default function PatternsLibrary() {
  const location = useLocation()
  const hash = location.hash.replace('#', '')
  const [openId, setOpenId] = useState<string | null>(hash || (PATTERNS[0]?.id ?? null))

  useEffect(() => {
    if (hash) {
      setOpenId(hash)
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }, [hash])

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <PageHeader
        title="Pattern Library"
        subtitle="Every pattern, its signals, its Java template, and the problems that train it. Learn the pattern once — reuse it everywhere."
      />
      <div className="space-y-3">
        {PATTERNS.map((p) => {
          const open = openId === p.id
          const problems = problemsByPattern(p.name)
          return (
            <section key={p.id} id={p.id} className="card scroll-mt-6 overflow-hidden">
              <button
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
                onClick={() => setOpenId(open ? null : p.id)}
                aria-expanded={open}
              >
                <ChevronDown className={classNames('h-4 w-4 shrink-0 text-mute-dark transition-transform', !open && '-rotate-90')} />
                <span className="font-semibold">{p.name}</span>
                <span className="code ml-auto text-xs text-mute-dark">{problems.length} problems</span>
              </button>
              {open && (
                <div className="border-t border-edge-dark px-4 py-4">
                  <p className="text-sm">{p.whatItSolves}</p>

                  <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-mute-dark">Recognition signals</h3>
                  <ul className="mt-1.5 space-y-1 text-sm">
                    {p.recognitionSignals.map((s) => (
                      <li key={s} className="flex gap-2"><span className="text-accent">•</span> {s}</li>
                    ))}
                  </ul>

                  <div className="mt-3 flex items-start gap-2 rounded-md border border-accent/30 bg-accent-soft p-3">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <div className="text-sm">
                      <span className="font-medium">Mental trigger:</span> “{p.mentalTrigger}”
                    </div>
                  </div>

                  <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-mute-dark">Java template</h3>
                  <div className="mt-2">
                    <CodeBlock code={p.javaTemplate} />
                  </div>

                  <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-mute-dark">Common traps</h3>
                  <ul className="mt-1.5 space-y-1 text-sm text-mute-dark">
                    {p.commonTraps.map((t) => (
                      <li key={t} className="flex gap-2"><span className="text-warn">•</span> {t}</li>
                    ))}
                  </ul>

                  <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-mute-dark">Representative problems</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {problems.slice(0, 6).map((prob) => (
                      <Link key={prob.id} to={`/practice/${prob.id}`} className="btn-ghost text-xs">
                        {prob.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
