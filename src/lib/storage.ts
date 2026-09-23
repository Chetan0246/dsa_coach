import type { UserProgress, Settings, CodeFile } from '../types'
import { buildWeekPlan, weekStartOf } from './planner'

const PROGRESS_KEY = 'patternpilot.progress.v1'
const SETTINGS_KEY = 'patternpilot.settings.v1'
const CODE_KEY = 'patternpilot.code.v1'

export const emptyProgress = (): UserProgress => ({
  version: 1,
  solvedProblems: [],
  attemptedProblems: [],
  failedProblems: [],
  problemStats: {},
  patternStats: {},
  reviewQueue: [],
  mistakes: [],
  notes: {},
  attempts: [],
  sessionHistory: [],
  streak: 0,
  lastPracticeDate: null,
  streakFreezes: 0,
  streakFreezesGranted: 0,
  streakFreezeDays: [],
  confidence: {},
  weeklyPlan: buildWeekPlan(weekStartOf(new Date()), new Set(), 2, [], []),
})

export const defaultSettings = (): Settings => ({
  theme: 'dark',
  dailyTarget: 2,
  timedModeMinutes: 20,
  onboardingDone: false,
  coachMode: 'guided',
})

function readKey<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeKey(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const strArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string')

/** Minimal structural check for a stored WeeklyPlan; null when malformed. */
function validWeeklyPlan(v: unknown): UserProgress['weeklyPlan'] {
  if (!isRecord(v)) return null
  if (typeof v.weekStart !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v.weekStart)) return null
  if (!Array.isArray(v.days) || v.days.length !== 7) return null
  for (const day of v.days) {
    if (!isRecord(day)) return null
    if (typeof day.date !== 'string' || typeof day.weekday !== 'number') return null
    if (!Array.isArray(day.tasks)) return null
    for (const t of day.tasks) {
      if (!isRecord(t) || typeof t.kind !== 'string' || typeof t.label !== 'string' || typeof t.target !== 'number') {
        return null
      }
    }
  }
  if (!isRecord(v.completedTasks)) return null
  return v as unknown as UserProgress['weeklyPlan']
}

/** Validate an imported progress object; returns null when invalid. */
export function validateProgress(data: unknown): UserProgress | null {
  if (!isRecord(data)) return null
  const d = data as Record<string, unknown>
  if (!strArray(d.solvedProblems)) return null
  if (!strArray(d.attemptedProblems ?? []) || !strArray(d.failedProblems ?? [])) return null
  if (!isRecord(d.problemStats) || !isRecord(d.patternStats)) return null
  if (!isRecord(d.notes)) return null
  if (!Array.isArray(d.reviewQueue)) return null
  if (!Array.isArray(d.mistakes)) return null
  if (!Array.isArray(d.attempts)) return null
  if (!Array.isArray(d.sessionHistory)) return null
  if (typeof d.streak !== 'number' || Number.isNaN(d.streak)) return null
  if (d.lastPracticeDate !== null && typeof d.lastPracticeDate !== 'string') return null
  if (!isRecord(d.confidence)) return null
  // Auto-repair older records: streak-freeze fields default instead of failing import.
  const usedDays = strArray(d.streakFreezeDays) ? d.streakFreezeDays : []
  const legacyBalance =
    typeof d.streakFreezes === 'number' && Number.isFinite(d.streakFreezes)
      ? Math.max(0, Math.min(2, Math.floor(d.streakFreezes)))
      : 0
  // Migrate: records without the granted counter get granted = balance + consumed.
  const streakFreezesGranted =
    typeof d.streakFreezesGranted === 'number' && Number.isFinite(d.streakFreezesGranted)
      ? Math.max(legacyBalance + usedDays.length, Math.min(2, Math.floor(d.streakFreezesGranted)))
      : legacyBalance + usedDays.length
  const streakFreezeDays = usedDays

  // Auto-repair: default weeklyPlan for older exports/records missing or malformed.
  const weeklyPlan = validWeeklyPlan(d.weeklyPlan) ?? buildWeekPlan(weekStartOf(new Date()), new Set(), 2, [], [])
  return {
    version: 1,
    solvedProblems: d.solvedProblems as string[],
    attemptedProblems: (d.attemptedProblems ?? []) as string[],
    failedProblems: (d.failedProblems ?? []) as string[],
    problemStats: d.problemStats as UserProgress['problemStats'],
    patternStats: d.patternStats as UserProgress['patternStats'],
    reviewQueue: (d.reviewQueue ?? []) as UserProgress['reviewQueue'],
    mistakes: (d.mistakes ?? []) as UserProgress['mistakes'],
    notes: d.notes as Record<string, string>,
    attempts: (d.attempts ?? []) as UserProgress['attempts'],
    sessionHistory: (d.sessionHistory ?? []) as UserProgress['sessionHistory'],
    streak: d.streak as number,
    lastPracticeDate: (d.lastPracticeDate ?? null) as string | null,
    streakFreezes: Math.min(streakFreezesGranted, Math.max(0, streakFreezesGranted - streakFreezeDays.length)),
    streakFreezesGranted,
    streakFreezeDays,
    confidence: d.confidence as Record<string, number>,
    weeklyPlan,
  }
}

export function loadProgress(): UserProgress {
  const raw = readKey<UserProgress>(PROGRESS_KEY)
  if (!raw) return emptyProgress()
  const valid = validateProgress(raw)
  const p = valid ?? emptyProgress()
  // Defensive defaults: never let a partially-shaped legacy record crash the app.
  if (!Array.isArray(p.streakFreezeDays)) p.streakFreezeDays = []
  if (typeof p.streakFreezes !== 'number' || !Number.isFinite(p.streakFreezes)) p.streakFreezes = 0
  if (typeof p.streakFreezesGranted !== 'number' || !Number.isFinite(p.streakFreezesGranted)) {
    p.streakFreezesGranted = p.streakFreezes + p.streakFreezeDays.length
  }
  return p
}

export function saveProgress(p: UserProgress): boolean {
  return writeKey(PROGRESS_KEY, p)
}

export function loadSettings(): Settings {
  const raw = readKey<Partial<Settings>>(SETTINGS_KEY)
  return { ...defaultSettings(), ...(raw ?? {}) }
}

export function saveSettings(s: Settings): boolean {
  return writeKey(SETTINGS_KEY, s)
}

export function loadCode(): Record<string, string> {
  return readKey<Record<string, string>>(CODE_KEY) ?? {}
}

export function saveCode(files: Record<string, string>): boolean {
  return writeKey(CODE_KEY, files)
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY)
  } catch {
    /* storage unavailable */
  }
}

export function resetAll(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY)
    localStorage.removeItem(SETTINGS_KEY)
    localStorage.removeItem(CODE_KEY)
  } catch {
    /* storage unavailable */
  }
}

export function exportProgress(): string {
  return JSON.stringify(loadProgress(), null, 2)
}

export function importProgress(json: string): { ok: true } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(json)
    const valid = validateProgress(parsed)
    if (!valid) return { ok: false, error: 'The file is valid JSON but does not match the PatternPilot progress schema.' }
    return writeKey(PROGRESS_KEY, valid) ? { ok: true } : { ok: false, error: 'Could not write to localStorage (quota or privacy mode).' }
  } catch (e) {
    return { ok: false, error: 'The file could not be parsed as JSON. ' + (e instanceof Error ? e.message : '') }
  }
}

/** True when localStorage is usable at all. */
export function storageAvailable(): boolean {
  try {
    const probe = '__pp_probe__'
    localStorage.setItem(probe, '1')
    localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

export type { CodeFile }
