import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import { getProblem } from '../data'
import { useProgress } from '../state/progress'

export default function Notes() {
  const { progress } = useProgress()
  const [q, setQ] = useState('')
  const entries = Object.entries(progress.notes).filter(([, text]) => text.trim().length > 0)

  const filtered = entries.filter(([id, text]) => {
    const p = getProblem(id)
    const hay = `${p?.title ?? id} ${text}`.toLowerCase()
    return hay.includes(q.toLowerCase())
  })

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <PageHeader
        title="Notes"
        subtitle="Everything you wrote while practicing — the traps you hit and the rules you derived."
        actions={
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
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          title="No notes yet."
          message="Every problem page has a notes box. Write down what tripped you up — future-you is the reader."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(([id, text]) => {
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
                <p className="whitespace-pre-wrap text-sm text-mute-dark">{text}</p>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-mute-dark">No notes match “{q}”.</p>
          )}
        </div>
      )}
    </div>
  )
}
