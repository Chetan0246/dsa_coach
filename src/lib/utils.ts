export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function daysBetween(aKey: string, bKey: string): number {
  const a = new Date(aKey + 'T00:00:00')
  const b = new Date(bKey + 'T00:00:00')
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function fmtMinutes(min: number): string {
  if (!Number.isFinite(min) || min <= 0) return '0m'
  if (min < 60) return `${Math.round(min)}m`
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function fmtClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

export function fmtDate(ts: number | string): string {
  const d = typeof ts === 'number' ? new Date(ts) : new Date(ts + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function fmtRelative(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60_000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return fmtDate(ts)
}

export function diffColorClass(d: string): string {
  if (d === 'Easy') return 'text-good'
  if (d === 'Medium') return 'text-warn'
  return 'text-bad'
}

/** Very lightweight Java heuristic checks for the mock runner and coach. */
export function looksLikeValidJava(code: string): boolean {
  if (!code.trim()) return false
  const openBraces = (code.match(/{/g) ?? []).length
  const closeBraces = (code.match(/}/g) ?? []).length
  return openBraces > 0 && openBraces === closeBraces
}

export function containsLoop(code: string): boolean {
  return /\b(for|while)\b/.test(code)
}

export function containsHashMap(code: string): boolean {
  return /\b(HashMap|HashSet|Hashtable|TreeMap|TreeSet)\b/.test(code)
}

export function codeEqualsTemplate(code: string, template: string): boolean {
  return code.replace(/\s+/g, ' ').trim() === template.replace(/\s+/g, ' ').trim()
}

export function classNames(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
