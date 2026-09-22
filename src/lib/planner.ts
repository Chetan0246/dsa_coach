import type { Attempt, DayPlan, DayTask, Problem, UserProgress, WeeklyPlan } from '../types'
import { PROBLEMS, getProblem } from '../data'
import { todayKey } from './utils'
import type { ProgressSnapshot } from '../types'

export const DAY_MS = 86_400_000
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
export const OA_DAY = 5 // Saturday (0 = Monday … 6 = Sunday)
export const REVIEW_DAY = 6 // Sunday

/** 0 = Monday … 6 = Sunday, matching DAY_LABELS. */
export function mondayIndex(d: Date): number {
  return (d.getDay() + 6) % 7
}

export function dayKeyOf(d: Date): string {
  return todayKey(d)
}

/** Monday of the week containing the given date. */
export function weekStartOf(d: Date): string {
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - mondayIndex(d))
  return dayKeyOf(start)
}

export function weekStartPlus(weekStart: string, days: number): Date {
  const start = new Date(weekStart + 'T00:00:00')
  return new Date(start.getTime() + days * DAY_MS)
}

export function nextWeekStart(weekStart: string): string {
  return dayKeyOf(weekStartPlus(weekStart, 7))
}

/** Monday–Sunday date labels for a week, e.g. ['Mon 22', …]. */
export function weekDayLabels(weekStart: string): string[] {
  return DAY_LABELS.map((label, i) => {
    const d = weekStartPlus(weekStart, i)
    return `${label} ${d.getDate()}`
  })
}

function hashKey(key: string): number {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Deterministic pseudo-random pick from a list based on a key. */
function pickByKey<T>(items: T[], key: string): T | undefined {
  if (items.length === 0) return undefined
  return items[hashKey(key) % items.length]
}

/**
 * Build the plan for one week: a pattern drill + daily-target new problems
 * Monday–Friday, a due review each day when the queue is non-empty,
 * one weekend OA simulation on Saturday, and a review session on Sunday.
 */
export function buildWeekPlan(
  weekStart: string,
  solved: Set<string>,
  dailyTarget: number,
  reviewQueue: UserProgress['reviewQueue'],
  attempts: Attempt[],
  at: number = Date.now(),
): WeeklyPlan {
  const due = reviewQueue.filter((r) => r.dueAt <= at).map((r) => r.problemId)
  const attempted = new Set(attempts.map((a) => a.problemId))
  const nextUp = PROBLEMS.filter((p) => !solved.has(p.id) && !attempted.has(p.id))
  const fresh = nextUp.length > 0 ? nextUp : PROBLEMS.filter((p) => !solved.has(p.id))

  const days: DayPlan[] = []
  let pickIndex = 0
  for (let i = 0; i < 7; i++) {
    const date = dayKeyOf(weekStartPlus(weekStart, i))
    const tasks: DayTask[] = []

    if (i < OA_DAY) {
      // Monday–Friday: keep the pattern warm every day.
      tasks.push({ kind: 'drill', label: 'Pattern Drill', target: 1 })
      for (let k = 0; k < dailyTarget; k++) {
        const problem = fresh[(pickIndex + hashKey(date) + k) % fresh.length]
        tasks.push({
          kind: 'new',
          problemId: problem?.id,
          label: problem?.title ?? 'New problem',
          target: 1,
        })
      }
      pickIndex += dailyTarget
      const reviewId = pickByKey(due, date)
      if (reviewId) {
        const problem = getProblem(reviewId)
        tasks.push({
          kind: 'review',
          problemId: reviewId,
          label: problem?.title ?? 'Review problem',
          target: 1,
        })
      }
    } else if (i === OA_DAY) {
      // Saturday: one weekend OA simulation.
      tasks.push({ kind: 'oa', label: 'OA Simulation', target: 1 })
    } else {
      // Sunday: weekly review session (kept as an explicit branch for clarity).
      tasks.push({ kind: 'review-session', label: 'Weekly Review Session', target: 1 })
    }

    days.push({ date, tasks, weekday: i + 1 })
  }

  return { weekStart, days, completedTasks: {} }
}

/** Stable per-task id within a day. */
export function taskIdOf(t: DayTask): string {
  return `${t.kind}${t.problemId ? `:${t.problemId}` : ''}`
}

/** Whole-day checkbox key. */
export function dayDoneKey(dateKey: string): string {
  return `${dateKey}|*`
}

/** Whether a task's checkbox was ticked by hand. */
export function isTaskChecked(plan: WeeklyPlan | null, dateKey: string, task: DayTask): boolean {
  if (!plan) return false
  return plan.completedTasks[`${dateKey}|${taskIdOf(task)}`] === true
}

/** Whether the whole day's checkbox was ticked by hand. */
export function isDayChecked(plan: WeeklyPlan | null, dateKey: string): boolean {
  if (!plan) return false
  return plan.completedTasks[dayDoneKey(dateKey)] === true
}

/** Tasks of the plan day matching the given date (empty when the week differs). */
export function tasksForDate(plan: WeeklyPlan | null, dateKey: string): DayTask[] {
  if (!plan) return []
  return plan.days.find((d) => d.date === dateKey)?.tasks ?? []
}

export interface DayStatus {
  targetCount: number
  completedCount: number
  done: boolean
  pct: number
  /** Total minutes logged on this day. */
  minutes: number
}

/** Completion of one plan day, combining attempts, manual checkmarks and past defaults. */
export function dayStatus(plan: WeeklyPlan | null, day: DayPlan, p: UserProgress): DayStatus {
  const attemptsOfDay = p.attempts.filter((a) => todayKey(new Date(a.at)) === day.date)
  const solvedIds = new Set(
    attemptsOfDay.filter((a) => a.result.startsWith('solved')).map((a) => a.problemId),
  )
  const minutes = attemptsOfDay.reduce((s, a) => s + a.minutes, 0)
  const dayChecked = isDayChecked(plan, day.date)

  let completed = 0
  for (const t of day.tasks) {
    if (isTaskChecked(plan, day.date, t)) {
      completed++
    } else if (t.kind === 'oa') {
      // Any graded attempt on OA day counts toward the simulation.
      if (attemptsOfDay.length > 0) completed++
    } else if (t.problemId && solvedIds.has(t.problemId)) {
      completed++
    } else if ((t.kind === 'drill' || t.kind === 'review-session') && attemptsOfDay.length > 0) {
      // Any graded attempt that day counts as drill / review-session credit.
      completed++
    }
  }
  // Past days default to done so the heatmap stays meaningful.
  if (day.date < todayKey() && completed === 0) completed = day.tasks.length

  const targetCount = day.tasks.length
  const completedCount = Math.min(completed, Math.max(targetCount, 1))
  const done = targetCount === 0 || dayChecked || completed >= targetCount
  const pct = targetCount > 0 ? Math.min(100, Math.round((completed / targetCount) * 100)) : 100
  return { targetCount, completedCount, done, pct, minutes }
}

/** Full week status, one entry per day (index 0 = Monday). */
export function weekStatus(plan: WeeklyPlan | null, p: UserProgress): DayStatus[] {
  if (!plan) return []
  return plan.days.map((d) => dayStatus(plan, d, p))
}

/** Heatmap color level 0–4 for a day (LeetCode-style). */
export function heatmapLevel(s: DayStatus, hasActivity: boolean): 0 | 1 | 2 | 3 | 4 {
  if (s.completedCount <= 0) return hasActivity ? 1 : 0
  const ratio = s.completedCount / Math.max(1, s.targetCount)
  if (ratio < 0.34) return 1
  if (ratio < 0.67) return 2
  if (ratio < 1) return 3
  return 4
}

/** Problems for the OA simulation day: one easy, then mediums/hards, deterministic per week. */
export function oaProblems(weekStart: string, solved: Set<string>, count = 3): Problem[] {
  const pool = PROBLEMS.filter((p) => !solved.has(p.id))
  const easy = pool.filter((p) => p.difficulty === 'Easy')
  const medium = pool.filter((p) => p.difficulty === 'Medium')
  const hard = pool.filter((p) => p.difficulty === 'Hard')
  const out: Problem[] = []
  const first = pickByKey(easy.length > 0 ? easy : medium, weekStart + ':oa0')
  if (first) out.push(first)
  for (let i = 1; i < count; i++) {
    const src = i % 2 === 1 ? medium : hard
    const p = pickByKey(src.length > 0 ? src : PROBLEMS, `${weekStart}:oa${i}`)
    if (p && !out.some((q) => q.id === p.id)) out.push(p)
  }
  return out
}

/* ---------- Advanced planner intelligence ---------- */

export const MAX_DAILY_TARGET = 6
export const MAX_STREAK_FREEZES = 2

/**
 * Recommended daily target for the coming week: scales with last week's
 * completion rate and trend, clamped to [1, MAX_DAILY_TARGET].
 * <60% done -> −1 · >85% done -> +1 · strong back-to-back weeks -> +1 more.
 */
export function adaptiveDailyTarget(
  settingsTarget: number,
  lastWeek?: WeekAggregate | null,
  weekBeforeLast?: WeekAggregate | null,
): number {
  if (!lastWeek || lastWeek.target === 0) return Math.max(1, settingsTarget)
  const ratio = lastWeek.done / lastWeek.target
  let t = settingsTarget
  if (ratio < 0.6) t -= 1
  else if (ratio > 0.85) t += 1
  const prevRatio = weekBeforeLast && weekBeforeLast.target > 0 ? weekBeforeLast.done / weekBeforeLast.target : null
  if (ratio >= 0.85 && prevRatio !== null && prevRatio >= 0.85) t += 1
  return Math.max(1, Math.min(MAX_DAILY_TARGET, t))
}

/** Aggregate stats for any week key (works for past, current and future weeks). */
export function weekAggregate(
  weekStart: string,
  planFor: (ws: string) => WeeklyPlan | null,
  p: UserProgress,
): WeekAggregate {
  const plan = planFor(weekStart)
  if (!plan) return { weekStart, done: 0, target: 0, pct: 0, minutes: 0, solved: 0, hintsUsed: 0, daysActive: 0, dailyTarget: 0 }
  const statuses = weekStatus(plan, p)
  const from = new Date(weekStart + 'T00:00:00').getTime()
  const to = from + 7 * DAY_MS
  const attempts = p.attempts.filter((a) => a.at >= from && a.at < to)
  return {
    weekStart,
    done: statuses.reduce((s, st) => s + st.completedCount, 0),
    target: statuses.reduce((s, st) => s + st.targetCount, 0),
    pct: statuses.length ? Math.round((statuses.reduce((s, st) => s + st.pct, 0) / statuses.length)) : 0,
    minutes: statuses.reduce((s, st) => s + st.minutes, 0),
    solved: attempts.filter((a) => a.result.startsWith('solved')).length,
    hintsUsed: attempts.reduce((s, a) => s + a.hintsUsed, 0),
    daysActive: statuses.filter((st) => st.minutes > 0 || st.completedCount > 0).length,
    dailyTarget: plan.days[0]?.tasks.filter((t) => t.kind === 'new').length ?? 0,
  }
}

export interface WeekAggregate {
  weekStart: string
  done: number
  target: number
  pct: number
  minutes: number
  solved: number
  hintsUsed: number
  daysActive: number
  dailyTarget: number
}

export type WeekGrade = 'S' | 'A' | 'B' | 'C' | 'D'

/**
 * Weekly score 0–100 blending completion (60), grade-relevant efficiency (25:
 * hints used per solved problem) and consistency (15: days active). Score is
 * 0 for future weeks and lenient for past weeks that were never planned.
 */
export function weekScore(agg: WeekAggregate): number {
  const today = todayKey()
  const isFuture = agg.weekStart > today && !withinWeek(today, agg.weekStart)
  if (isFuture) return 0
  if (agg.target === 0) return 0
  // Prorate the current week: only hold the student to the days that have elapsed.
  let expected = agg.target
  let isPast = false
  if (withinWeek(today, agg.weekStart)) {
    const dayIdx = Math.floor((new Date(today + 'T00:00:00').getTime() - new Date(agg.weekStart + 'T00:00:00').getTime()) / DAY_MS)
    expected = Math.max(1, Math.round((agg.target * (dayIdx + 1)) / 7))
  } else if (agg.weekStart < today) {
    isPast = true
  }
  const completion = Math.min(1, agg.done / expected) * 60
  const efficiency = agg.solved > 0 ? Math.max(0, 1 - agg.hintsUsed / (agg.solved * 2)) * 25 : agg.done > 0 ? 12 : 0
  const consistency = Math.min(1, agg.daysActive / 5) * 15
  let score = completion + efficiency + consistency
  if (isPast && agg.done === 0) score = 40 // unlogged past week: gentle default, not a zero
  return Math.round(Math.max(0, Math.min(100, score)))
}

/** Grade from a 0–100 score: S ≥ 92, A ≥ 80, B ≥ 65, C ≥ 45, else D. */
export function weekGrade(score: number): WeekGrade {
  if (score >= 92) return 'S'
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 45) return 'C'
  return 'D'
}

/** Whether `dayKey` falls within the Mon–Sun week starting `weekStart`. */
export function withinWeek(dayKey: string, weekStart: string): boolean {
  const t = new Date(dayKey + 'T00:00:00').getTime()
  const s = new Date(weekStart + 'T00:00:00').getTime()
  return t >= s && t < s + 7 * DAY_MS
}

/** Direction of the score vs the previous week, with the delta. */
export function weekTrend(
  current: WeekAggregate,
  previous: WeekAggregate | null,
  scoreOf: (agg: WeekAggregate) => number,
): { dir: 'up' | 'down' | 'flat'; delta: number } {
  if (!previous || previous.target === 0) return { dir: 'flat', delta: 0 }
  const delta = scoreOf(current) - scoreOf(previous)
  return { dir: delta > 2 ? 'up' : delta < -2 ? 'down' : 'flat', delta }
}

/** Total minutes logged across the given ISO day key. */
export function minutesOnDay(p: UserProgress, dayKey: string): number {
  return p.attempts.filter((a) => todayKey(new Date(a.at)) === dayKey).reduce((s, a) => s + a.minutes, 0)
}

/** Number of streak freezes consumed on a given day (0 or 1). */
export function freezeUsedOn(p: UserProgress, dayKey: string): boolean {
  return p.streakFreezeDays.includes(dayKey)
}

/** Attempts needed across weekdays to hit the weekly roadmap pace. */
export function pacePerWeekday(dailyTarget: number): number {
  return Math.max(1, dailyTarget * 5)
}

/** Snapshot reference kept for planner extensions (pattern-aware tuning later). */
export type { ProgressSnapshot }
