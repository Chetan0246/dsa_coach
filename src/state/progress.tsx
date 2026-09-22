import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type {
  Attempt,
  Mistake,
  MistakeType,
  Problem,
  ProgressSnapshot,
  ReviewGrade,
  ResultStatus,
  Settings,
  UserProgress,
  WeeklyPlan,
} from '../types'
import {
  emptyProgress,
  loadCode,
  loadProgress,
  loadSettings,
  resetAll,
  saveCode,
  saveProgress,
  saveSettings,
  storageAvailable,
} from '../lib/storage'
import { todayKey, daysBetween, uid, clamp } from '../lib/utils'
import {
  adaptiveDailyTarget,
  buildWeekPlan,
  dayKeyOf,
  MAX_STREAK_FREEZES,
  weekAggregate,
  weekStartOf,
  weekStartPlus,
} from '../lib/planner'

interface Ctx {
  progress: UserProgress
  settings: Settings
  codeFiles: Record<string, string>
  storageOk: boolean
  recordAttempt: (a: {
    problem: Problem
    result: ResultStatus
    minutes: number
    hintsUsed: number
    patternCorrect: boolean
    confidence?: number
  }) => void
  scheduleReview: (problemId: string, grade: ReviewGrade) => void
  addMistake: (m: { problemId?: string; type: MistakeType; note: string }) => void
  setNote: (problemId: string, text: string) => void
  saveCodeFor: (problemId: string, code: string) => void
  updateSettings: (s: Partial<Settings>) => void
  resetEverything: () => void
  setWeeklyPlan: (plan: WeeklyPlan) => void
  togglePlanTask: (dateKey: string, taskKey: string) => void
  snapshot: ProgressSnapshot
}

const ProgressContext = createContext<Ctx | null>(null)

type Action =
  | { type: 'load'; progress: UserProgress }
  | { type: 'attempt'; attempt: Attempt; problem: Problem }
  | { type: 'review'; problemId: string; grade: ReviewGrade }
  | { type: 'mistake'; mistake: Mistake }
  | { type: 'note'; problemId: string; text: string }
  | { type: 'settings'; settings: Settings }
  | { type: 'plan-set'; plan: WeeklyPlan }
  | { type: 'plan-toggle'; dateKey: string; taskKey: string }
  | { type: 'reset' }

function touchStreak(p: UserProgress): void {
  const today = todayKey()
  if (p.lastPracticeDate === today) return
  const gap = p.lastPracticeDate ? daysBetween(p.lastPracticeDate, today) : 999
  if (gap === 1) {
    p.streak += 1
  } else if (gap === 2 && p.streakFreezes > 0 && p.lastPracticeDate) {
    // Consume one freeze to bridge the missed day and keep the streak alive.
    p.streakFreezes -= 1
    p.streakFreezeDays.push(todayKey(new Date(new Date(today + 'T00:00:00').getTime() - 86_400_000)))
    p.streak += 1
  } else {
    p.streak = 1
  }
  p.lastPracticeDate = today
}

/** Award a freeze after every 4th solve, capped at MAX_STREAK_FREEZES. */
function awardStreakFreezes(p: UserProgress): void {
  const next = Math.floor(p.solvedProblems.length / 4)
  if (next > p.streakFreezes) p.streakFreezes = Math.min(MAX_STREAK_FREEZES, next)
  else p.streakFreezes = Math.min(p.streakFreezes, MAX_STREAK_FREEZES)
}

function applyGrade(item: { problemId: string; dueAt: number; intervalDays: number; lastGrade?: ReviewGrade; lastReviewedAt?: number }, grade: ReviewGrade) {
  const intervals: Record<ReviewGrade, number> = {
    again: 1,
    hard: 2,
    good: 4,
    easy: 7,
    mastered: 14,
  }
  item.lastGrade = grade
  item.lastReviewedAt = Date.now()
  item.intervalDays = intervals[grade]
  item.dueAt = Date.now() + item.intervalDays * 86_400_000
}

function reducer(state: UserProgress, action: Action): UserProgress {
  switch (action.type) {
    case 'load':
      return action.progress

    case 'attempt': {
      const p: UserProgress = {
        ...state,
        solvedProblems: [...state.solvedProblems],
        attemptedProblems: [...state.attemptedProblems],
        failedProblems: [...state.failedProblems],
        problemStats: { ...state.problemStats },
        patternStats: { ...state.patternStats },
        reviewQueue: [...state.reviewQueue],
        attempts: [...state.attempts],
      }
      const { attempt, problem } = action
      const solved = attempt.result.startsWith('solved')
      const stat = p.problemStats[problem.id] ?? {
        attempts: 0,
        solved: 0,
        failed: 0,
        totalMinutes: 0,
        hintsUsedTotal: 0,
        bestScore: 0,
        lastScore: 0,
      }
      stat.attempts += 1
      stat.totalMinutes += attempt.minutes
      stat.hintsUsedTotal += attempt.hintsUsed
      stat.lastAttemptAt = attempt.at
      stat.lastResult = attempt.result
      stat.lastScore = attempt.score
      stat.lastPatternCorrect = attempt.patternCorrect
      stat.lastConfidence = attempt.confidence
      if (attempt.score > stat.bestScore) stat.bestScore = attempt.score

      if (solved && !p.solvedProblems.includes(problem.id)) p.solvedProblems.push(problem.id)
      if (!solved && !p.failedProblems.includes(problem.id)) p.failedProblems.push(problem.id)
      if (!p.attemptedProblems.includes(problem.id)) p.attemptedProblems.push(problem.id)

      if (solved) {
        const idx = p.failedProblems.indexOf(problem.id)
        if (idx >= 0) p.failedProblems.splice(idx, 1)
      }
      if (!solved || attempt.result === 'solved-after-reveal' || attempt.confidence !== undefined && attempt.confidence <= 2) {
        scheduleOrBumpReview(p, problem.id, 'again')
      }

      const ps = p.patternStats[problem.pattern] ?? { solved: 0, attempts: 0, scoreSum: 0, scoreCount: 0 }
      ps.attempts += 1
      if (solved) ps.solved += 1
      ps.scoreSum += attempt.score
      ps.scoreCount += 1
      p.patternStats[problem.pattern] = ps

      p.attempts.push(attempt)
      if (p.attempts.length > 400) p.attempts = p.attempts.slice(-400)

      touchStreak(p)
      awardStreakFreezes(p)
      p.problemStats[problem.id] = stat
      return p
    }

    case 'review': {
      const p = { ...state, reviewQueue: [...state.reviewQueue] }
      const item = p.reviewQueue.find((r) => r.problemId === action.problemId)
      if (item) {
        applyGrade(item, action.grade)
      } else {
        const fresh = { problemId: action.problemId, dueAt: 0, intervalDays: 0 }
        p.reviewQueue.push(fresh)
        applyGrade(fresh, action.grade)
      }
      return p
    }
    case 'mistake': {
      const p = { ...state, mistakes: [action.mistake, ...state.mistakes] }
      return p
    }
    case 'note': {
      return { ...state, notes: { ...state.notes, [action.problemId]: action.text } }
    }
    case 'settings':
      return state // handled outside reducer
    case 'plan-set':
      return { ...state, weeklyPlan: action.plan }
    case 'plan-toggle': {
      const plan = state.weeklyPlan
      if (!plan) return state
      const key = `${action.dateKey}|${action.taskKey}`
      const completedTasks = { ...plan.completedTasks }
      if (completedTasks[key] === true) delete completedTasks[key]
      else completedTasks[key] = true
      return { ...state, weeklyPlan: { ...plan, completedTasks } }
    }
    case 'reset':
      return emptyProgress()
    default:
      return state
  }
}

function scheduleOrBumpReview(p: UserProgress, problemId: string, grade: ReviewGrade): void {
  const item = p.reviewQueue.find((r) => r.problemId === problemId)
  if (item) applyGrade(item, grade)
  else {
    const newItem = { problemId, dueAt: 0, intervalDays: 0 }
    p.reviewQueue.push(newItem)
    applyGrade(newItem, grade)
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, dispatch] = useReducer(reducer, undefined, loadProgress)
  const [settings, setSettings] = React.useState<Settings>(() => loadSettings())
  const [codeFiles, setCodeFiles] = React.useState<Record<string, string>>(() => loadCode())
  const storageOk = useMemo(() => storageAvailable(), [])

  // Persist on every change
  useEffect(() => {
    if (!storageOk) return
    saveProgress(progress)
  }, [progress, storageOk])

  useEffect(() => {
    if (!storageOk) return
    saveSettings(settings)
  }, [settings, storageOk])

  useEffect(() => {
    if (!storageOk) return
    saveCode(codeFiles)
  }, [codeFiles, storageOk])

  // Keep the weekly plan aligned with the current week, the daily target and the
  // plan shape (e.g. plans built before the OA day moved to Saturday).
  useEffect(() => {
    const ws = weekStartOf(new Date())
    const plan = progress.weeklyPlan
    const mondayNewCount = plan?.days[0]?.tasks.filter((t) => t.kind === 'new').length ?? -1
    const shapeOk =
      !!plan &&
      plan.days[5]?.tasks.length === 1 &&
      plan.days[5]?.tasks[0]?.kind === 'oa' &&
      plan.days[6]?.tasks.length === 1 &&
      plan.days[6]?.tasks[0]?.kind === 'review-session'
    if (!plan || plan.weekStart !== ws || mondayNewCount !== settings.dailyTarget || !shapeOk) {
      const prevAgg = weekAggregate(
        dayKeyOf(weekStartPlus(ws, -7)),
        (k) => buildWeekPlan(k, new Set(progress.solvedProblems), settings.dailyTarget, progress.reviewQueue, progress.attempts),
        progress,
      )
      const prev2Agg = weekAggregate(
        dayKeyOf(weekStartPlus(ws, -14)),
        (k) => buildWeekPlan(k, new Set(progress.solvedProblems), settings.dailyTarget, progress.reviewQueue, progress.attempts),
        progress,
      )
      const target = adaptiveDailyTarget(settings.dailyTarget, prevAgg, prev2Agg)
      const rebuilt = buildWeekPlan(
        ws,
        new Set(progress.solvedProblems),
        target,
        progress.reviewQueue,
        progress.attempts,
      )
      rebuilt.completedTasks = plan?.completedTasks ?? {}
      dispatch({ type: 'plan-set', plan: rebuilt })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.dailyTarget])

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement
    const apply = (dark: boolean) => root.classList.toggle('dark', dark)
    if (settings.theme === 'dark') apply(true)
    else if (settings.theme === 'light') apply(false)
    else apply(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }, [settings.theme])

  const recordAttempt = React.useCallback(
    (a: { problem: Problem; result: ResultStatus; minutes: number; hintsUsed: number; patternCorrect: boolean; confidence?: number }) => {
      const score = computeScore(a.result, a.hintsUsed, a.minutes, a.problem.estimatedMinutes)
      const attempt: Attempt = {
        problemId: a.problem.id,
        result: a.result,
        minutes: a.minutes,
        hintsUsed: a.hintsUsed,
        score,
        patternCorrect: a.patternCorrect,
        confidence: a.confidence,
        at: Date.now(),
      }
      dispatch({ type: 'attempt', attempt, problem: a.problem })
    },
    [],
  )

  const snapshot = useMemo(() => computeSnapshot(progress), [progress])

  const value = useMemo<Ctx>(
    () => ({
      progress,
      settings,
      codeFiles,
      storageOk,
      recordAttempt,
      snapshot,
      scheduleReview: (problemId, grade) => dispatch({ type: 'review', problemId, grade }),
      addMistake: (m) =>
        dispatch({ type: 'mistake', mistake: { id: uid('mist'), createdAt: Date.now(), problemId: m.problemId, type: m.type, note: m.note } }),
      setNote: (problemId, text) => dispatch({ type: 'note', problemId, text }),
      saveCodeFor: (problemId, code) =>
        setCodeFiles((prev) => {
          if (prev[problemId] === code) return prev
          return { ...prev, [problemId]: code }
        }),
      updateSettings: (s) => setSettings((prev) => ({ ...prev, ...s })),
      setWeeklyPlan: (plan) => dispatch({ type: 'plan-set', plan }),
      togglePlanTask: (dateKey, taskKey) => dispatch({ type: 'plan-toggle', dateKey, taskKey }),
      resetEverything: () => {
        resetAll()
        dispatch({ type: 'reset' })
        setSettings({ ...loadSettings(), onboardingDone: true })
      },
    }),
    [progress, settings, codeFiles, storageOk, recordAttempt, snapshot],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): Ctx {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}

/** Pattern Recognition Score: 0–100, higher = cleaner solve. */
export function computeScore(
  result: ResultStatus,
  hintsUsed: number,
  minutes: number,
  estimated: number,
): number {
  let score = 100
  if (result === 'solved-no-hints') score -= 0
  else if (result === 'solved-with-hints') score -= 12 * clamp(hintsUsed, 1, 4)
  else if (result === 'solved-after-reveal') score -= 55
  else score -= 70
  if (minutes > estimated) score -= Math.min(15, Math.round(((minutes - estimated) / Math.max(estimated, 1)) * 15))
  if (minutes <= estimated * 0.6) score += 5
  return clamp(Math.round(score), 0, 100)
}

export function computeSnapshot(p: UserProgress): ProgressSnapshot {
  const attempts = p.attempts
  const solvedCount = p.solvedProblems.length
  const attemptedCount = p.attemptedProblems.length
  const failedCount = p.failedProblems.length
  const graded = attempts.filter((a) => a.result.startsWith('solved'))
  const accuracy = attemptedCount > 0 ? Math.round((solvedCount / attemptedCount) * 100) : 0

  const solvedNoHints = attempts.filter((a) => a.result === 'solved-no-hints').length
  const solvedWithHints = attempts.filter((a) => a.result === 'solved-with-hints').length
  const avgSolveMinutes =
    graded.length > 0 ? graded.reduce((s, a) => s + a.minutes, 0) / graded.length : 0

  const patternEntries = Object.entries(p.patternStats)
  const patternAvg = patternEntries
    .filter(([, v]) => v.scoreCount > 0)
    .map(([name, v]) => ({ name, avg: v.scoreSum / v.scoreCount, solved: v.solved }))
  const strongest = patternAvg.length
    ? patternAvg.reduce((best, cur) => (cur.avg > best.avg ? cur : best)).name
    : null
  const weakest = patternAvg.length
    ? patternAvg.reduce((worst, cur) => (cur.avg < worst.avg ? cur : worst)).name
    : null

  const recognitionScore =
    attempts.length > 0
      ? Math.round(attempts.slice(-20).reduce((s, a) => s + a.score, 0) / Math.min(attempts.length, 20))
      : 0

  const confidenceVals = Object.values(p.confidence)
  const avgConfidence =
    confidenceVals.length > 0 ? confidenceVals.reduce((s, v) => s + v, 0) / confidenceVals.length : 0

  return {
    solvedCount,
    attemptedCount,
    failedCount,
    streak: p.streak,
    accuracyPct: accuracy,
    patternsTouched: patternEntries.length,
    solvedNoHints,
    solvedWithHints,
    avgSolveMinutes,
    recognitionScore,
    strongestPattern: strongest,
    weakestPattern: weakest,
    avgConfidence: Math.round(avgConfidence * 10) / 10,
  }
}
