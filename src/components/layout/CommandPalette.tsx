import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft } from 'lucide-react'
import { PROBLEMS } from '../../data'
import { PATTERNS } from '../../data/patterns'
import { classNames } from '../../lib/utils'

interface Item {
  id: string
  label: string
  hint: string
  to: string
  kind: 'problem' | 'pattern' | 'page'
}

const PAGES: Item[] = [
  { id: 'p-dash', label: 'Dashboard', hint: 'Go to your workspace', to: '/', kind: 'page' },
  { id: 'p-road', label: 'Roadmap', hint: 'Open the 150-problem curriculum', to: '/roadmap', kind: 'page' },
  { id: 'p-practice', label: "Today's practice", hint: 'Start today session', to: '/practice', kind: 'page' },
  { id: 'p-patterns', label: 'Pattern library', hint: 'Browse patterns', to: '/patterns', kind: 'page' },
  { id: 'p-drill', label: 'Pattern Drill', hint: 'Train recognition', to: '/drill', kind: 'page' },
  { id: 'p-review', label: 'Review', hint: 'Spaced repetition queue', to: '/review', kind: 'page' },
  { id: 'p-mistakes', label: 'Mistake log', hint: 'Analytics of mistakes', to: '/mistakes', kind: 'page' },
  { id: 'p-notes', label: 'Notes', hint: 'All problem notes', to: '/notes', kind: 'page' },
  { id: 'p-toolkit', label: 'Java Toolkit', hint: 'Quick reference', to: '/java-toolkit', kind: 'page' },
  { id: 'p-analytics', label: 'Analytics', hint: 'Charts and trends', to: '/analytics', kind: 'page' },
  { id: 'p-oa', label: 'OA Mode', hint: 'Timed simulation', to: '/oa-mode', kind: 'page' },
  { id: 'p-settings', label: 'Settings', hint: 'Theme, data, import/export', to: '/settings', kind: 'page' },
]

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const items = useMemo<Item[]>(() => {
    const problems: Item[] = PROBLEMS.map((p) => ({
      id: `prob-${p.id}`,
      label: p.title,
      hint: `${p.difficulty} · ${p.pattern} · Phase ${p.phase}`,
      to: `/practice/${p.id}`,
      kind: 'problem',
    }))
    const patterns: Item[] = PATTERNS.map((pt) => ({
      id: `pat-${pt.id}`,
      label: pt.name,
      hint: 'Pattern',
      to: `/patterns#${pt.id}`,
      kind: 'pattern',
    }))
    const all = [...problems, ...patterns, ...PAGES]
    if (!q.trim()) return [...PAGES, ...problems.slice(0, 6)]
    const needle = q.toLowerCase()
    return all
      .filter((it) => it.label.toLowerCase().includes(needle) || it.hint.toLowerCase().includes(needle))
      .slice(0, 12)
  }, [q])

  useEffect(() => {
    if (open) {
      setQ('')
      setIdx(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  if (!open) return null

  const run = (item: Item) => {
    if (item.to === '/practice') {
      // route to the roadmap-recommended next problem
      navigate(`/roadmap?start=1`)
    } else {
      navigate(item.to)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Command palette"
      >
        <div className="flex items-center gap-2 border-b border-edge-dark px-4 py-3">
          <Search className="h-4 w-4 text-mute-dark" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setIdx(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, items.length - 1)) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)) }
              if (e.key === 'Enter' && items[idx]) run(items[idx])
              if (e.key === 'Escape') onClose()
            }}
            placeholder="Find a problem, pattern, or page..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-mute-dark"
          />
          <kbd className="code rounded border border-edge-dark px-1.5 py-0.5 text-[10px] text-mute-dark">Esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-1.5">
          {items.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-mute-dark">No matches. Try a different term.</li>
          )}
          {items.map((it, i) => (
            <li key={it.id}>
              <button
                className={classNames(
                  'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm',
                  i === idx ? 'bg-accent-soft text-accent' : 'hover:bg-edge-dark/40',
                )}
                onMouseEnter={() => setIdx(i)}
                onClick={() => run(it)}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{it.label}</span>
                  <span className="block truncate text-[11px] text-mute-dark">{it.hint}</span>
                </span>
                <span className="code shrink-0 text-[10px] uppercase text-mute-dark">{it.kind}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 border-t border-edge-dark px-4 py-2 text-[11px] text-mute-dark">
          <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> open</span>
          <span>↑↓ navigate</span>
          <span className="ml-auto">PatternPilot</span>
        </div>
      </div>
    </div>
  )
}
