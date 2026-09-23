import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Target,
  Repeat,
  Zap,
  ClipboardList,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Minus,
  Snowflake,
  Gauge,
  Award,
} from 'lucide-react'
import type { DayPlan, DayTask, UserProgress, WeeklyPlan } from '../../types'
import {
  buildWeekPlan,
  dayDiff,
  dayKeyOf,
  dayStatus,
  freezeUsedOn,
  isTaskChecked,
  isDayChecked,
  MAX_STREAK_FREEZES,
  taskIdOf,
  weekAggregate,
  weekDayLabels,
  weekGrade,
  weekScore,
  weekStartOf,
  weekStartPlus,
  weekTrend,
  withinWeek,
  type DayStatus,
  type WeekAggregate,
} from '../../lib/planner'
import { useProgress } from '../../state/progress'
import { classNames, fmtMinutes, todayKey } from '../../lib/utils'

const HEAT_CLASSES = [
  'bg-edge-dark/40',
  'bg-accent/25',
  'bg-accent/50',
  'bg-accent/75',
  'bg-accent',
]

const FREEZE_CLASS = 'bg-sky-400/70'

function taskIcon(kind: DayTask['kind']) {
  if (kind === 'new') return Target
  if (kind === 'review') return Repeat
  if (kind === 'drill') return Zap
  if (kind === 'oa') return ClipboardList
  return GraduationCap
}

/** Whether today is the plan's Saturday (OA simulation day). */
function isOaToday(plan: WeeklyPlan): boolean {
  const today = todayKey()
  return plan.days[5]?.date === today
}

/** Whether today is the plan's Sunday (review day). */
function isReviewToday(plan: WeeklyPlan): boolean {
  const today = todayKey()
  return plan.days[6]?.date === today
}

const GRADE_COLOR: Record<string, string> = {
  S: 'text-warn',
  A: 'text-good',
  B: 'text-accent',
  C: 'text-mute-dark',
  D: 'text-bad',
}

export default function WeeklyPlanView({ progress }: { progress: UserProgress }) {
  const { settings, togglePlanTask } = useProgress()
  const [weekOffset, setWeekOffset] = useState(0)
  const [openDay, setOpenDay] = useState<string | null>(null)
  const [heatMode, setHeatMode] = useState<'season' | 'month'>('season')

  const planFor = useMemo(() => {
    return (ws: string): WeeklyPlan => {
      if (ws === weekStartOf(new Date()) && progress.weeklyPlan?.weekStart === ws) {
        return progress.weeklyPlan
      }
      return buildWeekPlan(ws, new Set(progress.solvedProblems), settings.dailyTarget, progress.reviewQueue, progress.attempts)
    }
  }, [progress, settings.dailyTarget])

  const plan: WeeklyPlan = useMemo(
    () => planFor(weekStartOf(addDays(new Date(), weekOffset * 7))),
    [planFor, weekOffset],
  )

  const statuses: DayStatus[] = useMemo(
    () => plan.days.map((dayPlan) => dayStatus(plan, dayPlan, progress)),
    [plan, progress],
  )

  const thisAgg: WeekAggregate = useMemo(() => weekAggregate(plan.weekStart, planFor, progress), [plan, planFor, progress])
  const isCurrentWeek = plan.weekStart === weekStartOf(new Date())
  const prevAgg = useMemo(
    () => weekAggregate(dayKeyOf(weekStartPlus(plan.weekStart, -7)), planFor, progress),
    [plan, planFor, progress],
  )
  const score = useMemo(() => weekScore(thisAgg), [thisAgg])
  const grade = weekGrade(score)
  const trend = useMemo(() => weekTrend(thisAgg, prevAgg, weekScore), [thisAgg, prevAgg])

  const weekSolved = statuses.reduce((s, st) => s + st.completedCount, 0)
  const weekTarget = statuses.reduce((s, st) => s + st.targetCount, 0)
  const weekMinutes = statuses.reduce((s, st) => s + st.minutes, 0)
  const labels = weekDayLabels(plan.weekStart)
  const today = todayKey()

  const gotoWeek = (delta: number) => setWeekOffset((w) => w + delta)

  return (
    <section className="card p-5" aria-label="Weekly plan">
      {/* Header with week navigation + score ring */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">This Week's Plan</h2>
          <div className="mt-0.5 text-sm font-semibold">
            Week of {labels[0]}, {plan.weekStart}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ScoreRing score={score} grade={grade} />
          <div className="flex items-center gap-1">
            <button className="btn-ghost p-1.5" aria-label="Previous week" onClick={() => gotoWeek(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="btn-ghost px-3 text-xs" onClick={() => setWeekOffset(0)} disabled={weekOffset === 0}>
              Today
            </button>
            <button className="btn-ghost p-1.5" aria-label="Next week" onClick={() => gotoWeek(1)}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Intelligence strip: pace, minutes, adaptive target, trend, freezes */}
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-mute-dark">
        <span>
          <strong className="text-ink-dark">{weekSolved}</strong>/{weekTarget} planned tasks done
        </span>
        <span>
          <strong className="text-ink-dark">{fmtMinutes(weekMinutes)}</strong> logged
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-accent-soft px-1.5 py-0.5 text-accent" title="Suggested daily load for this week, based on last week's completion">
          <Gauge className="h-3 w-3" /> {plan.days[0]?.tasks.filter((t) => t.kind === 'new').length ?? settings.dailyTarget} new/day
          {plan.days[0] && (plan.days[0].tasks.filter((t) => t.kind === 'new').length ?? 0) !== settings.dailyTarget && ' (adaptive)'}
        </span>
        <span className="inline-flex items-center gap-1" title="Score vs previous week">
          {trend.dir === 'up' ? (
            <TrendingUp className="h-3.5 w-3.5 text-good" />
          ) : trend.dir === 'down' ? (
            <TrendingDown className="h-3.5 w-3.5 text-bad" />
          ) : (
            <Minus className="h-3.5 w-3.5 text-mute-dark" />
          )}
          {trend.delta !== 0 && <span className={trend.dir === 'up' ? 'text-good' : trend.dir === 'down' ? 'text-bad' : ''}>{trend.delta > 0 ? '+' : ''}{trend.delta}</span>}
        </span>
        <span
          className="inline-flex items-center gap-1"
          title={`Streak freezes bridge one missed day. Earn one every 4 problems (max ${MAX_STREAK_FREEZES}).`}
        >
          <Snowflake className={classNames('h-3.5 w-3.5', progress.streakFreezes > 0 ? 'text-sky-400' : 'text-mute-dark')} />
          {progress.streakFreezes}/{MAX_STREAK_FREEZES}
        </span>
        <span className="hidden sm:inline">Sat: OA simulation · Sun: review</span>
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {plan.days.map((day: DayPlan, i: number) => (
          <DayCard
            key={day.date}
            day={day}
            label={labels[i]}
            status={statuses[i]}
            isToday={day.date === today}
            plan={plan}
            progress={progress}
            open={openDay === day.date}
            onToggleOpen={() => setOpenDay((o) => (o === day.date ? null : day.date))}
            onToggleTask={(t) => togglePlanTask(day.date, taskIdOf(t))}
            onToggleDay={() => togglePlanTask(day.date, '*')}
          />
        ))}
      </div>

      {/* Weekend banners */}
      {isOaToday(plan) && (
        <div className="mt-4 rounded-md border border-warn/30 bg-warn-soft p-3 text-sm">
          <span className="font-medium text-warn">OA Simulation day.</span>{' '}
          Simulate a real assessment — timed, no coach, no pattern tags.{' '}
          <Link to="/oa-mode" className="underline hover:text-accent">
            Start OA Mode →
          </Link>
        </div>
      )}
      {isReviewToday(plan) && (
        <div className="mt-4 rounded-md border border-accent/30 bg-accent-soft p-3 text-sm">
          <span className="font-medium text-accent">Weekly review day.</span> Revisit failed and low-confidence
          problems from this week.{' '}
          <Link to="/review" className="underline hover:text-accent">
            Open Review →
          </Link>
        </div>
      )}

      {/* Weekly score breakdown */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-edge-dark pt-4 sm:grid-cols-4">
        <ScorePart
          label="Completion"
          value={Math.round(completionPart(thisAgg))}
          max={60}
          hint={isCurrentWeek ? 'prorated to elapsed days' : undefined}
        />
        <ScorePart label="Efficiency" value={thisAgg.solved > 0 ? Math.round(Math.max(0, 1 - thisAgg.hintsUsed / (thisAgg.solved * 2)) * 25) : thisAgg.done > 0 ? 12 : 0} max={25} />
        <ScorePart label="Consistency" value={Math.round(Math.min(1, thisAgg.daysActive / 5) * 15)} max={15} />
        <div className="rounded-md border border-edge-dark p-2.5">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-mute-dark">
            <Award className="h-3 w-3" /> Grade
          </div>
          <div className={classNames('mt-1 text-lg font-bold', GRADE_COLOR[grade])}>{grade}</div>
          <div className="text-[10px] text-mute-dark">
            {thisAgg.solved} solved · {thisAgg.daysActive}/5 active days
          </div>
        </div>
      </div>

      {/* Heatmap: season (17 weeks) or month view */}
      <div className="mt-5 border-t border-edge-dark pt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">Practice Consistency</h3>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-md border border-edge-dark text-[10px]">
              <button
                className={classNames('px-2 py-0.5', heatMode === 'season' ? 'bg-accent-soft text-accent' : 'text-mute-dark hover:text-accent')}
                onClick={() => setHeatMode('season')}
              >
                Season
              </button>
              <button
                className={classNames('px-2 py-0.5', heatMode === 'month' ? 'bg-accent-soft text-accent' : 'text-mute-dark hover:text-accent')}
                onClick={() => setHeatMode('month')}
              >
                Month
              </button>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-mute-dark">
              Less
              {HEAT_CLASSES.map((c, i) => (
                <span key={i} className={classNames('h-3 w-3 rounded-sm', c)} />
              ))}
              <span className={classNames('ml-1 h-3 w-3 rounded-sm', FREEZE_CLASS)} title="streak freeze" />
              More
            </div>
          </div>
        </div>
        {heatMode === 'season' ? (
          <ActivityHeatmap progress={progress} />
        ) : (
          <MonthHeatmap progress={progress} />
        )}
      </div>
    </section>
  )
}

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const R = 18
  const C = 2 * Math.PI * R
  const filled = (Math.max(0, Math.min(100, score)) / 100) * C
  const color = score >= 80 ? 'text-good' : score >= 45 ? 'text-accent' : 'text-warn'
  return (
    <div
      className="relative h-12 w-12"
      role="img"
      aria-label={`Weekly score ${score} out of 100, grade ${grade}`}
      title={`Weekly score ${score}/100 — grade ${grade}`}
    >
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
        <circle cx="22" cy="22" r={R} fill="none" strokeWidth="4" className="stroke-edge-dark" />
        <circle
          cx="22"
          cy="22"
          r={R}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className={classNames('transition-all duration-500', color)}
          stroke="currentColor"
          strokeDasharray={`${filled} ${C - filled}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">{grade}</div>
    </div>
  )
}

function ScorePart({ label, value, max, hint }: { label: string; value: number; max: number; hint?: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="rounded-md border border-edge-dark p-2.5" title={hint}>
      <div className="text-[10px] uppercase tracking-wide text-mute-dark">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">
        {value}
        <span className="text-xs text-mute-dark">/{max}</span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-edge-dark/60">
        <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
      {hint && <div className="mt-1 text-[9px] text-mute-dark">{hint}</div>}
    </div>
  )
}

/** Completion points for the breakdown card: prorated on the current week. */
function completionPart(agg: WeekAggregate): number {
  const today = todayKey()
  let expected = agg.target
  if (agg.target > 0 && withinWeek(today, agg.weekStart)) {
    const dayIdx = Math.min(6, dayDiff(today, agg.weekStart))
    expected = Math.max(1, Math.round((agg.target * (dayIdx + 1)) / 7))
  }
  return agg.target > 0 ? Math.min(1, agg.done / expected) * 60 : 0
}

function DayCard({
  day,
  label,
  status,
  isToday,
  plan,
  progress,
  open,
  onToggleOpen,
  onToggleTask,
  onToggleDay,
}: {
  day: DayPlan
  label: string
  status: DayStatus
  isToday: boolean
  plan: WeeklyPlan
  progress: UserProgress
  open: boolean
  onToggleOpen: () => void
  onToggleTask: (t: DayTask) => void
  onToggleDay: () => void
}) {
  const frozen = freezeUsedOn(progress, day.date)
  return (
    <div
      className={classNames(
        'rounded-md border p-2.5 transition-colors',
        isToday ? 'border-accent/60 bg-accent-soft' : 'border-edge-dark',
        status.done && !isToday && 'border-good/30',
        frozen && 'border-sky-400/40',
      )}
    >
      <button className="flex w-full items-center justify-between gap-1 text-left" onClick={onToggleOpen} aria-expanded={open}>
        <span className={classNames('inline-flex items-center gap-1 text-xs font-semibold', isToday && 'text-accent')}>
          {frozen && <Snowflake className="h-3 w-3 text-sky-400" aria-label="Streak freeze used" />}
          {label}
        </span>
        <span
          className={classNames(
            'code text-[10px]',
            status.done ? 'text-good' : status.completedCount > 0 ? 'text-warn' : 'text-mute-dark',
          )}
        >
          {status.completedCount}/{status.targetCount}
        </span>
      </button>

      {/* Progress bar */}
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-edge-dark/60">
        <div
          className={classNames('h-full rounded-full transition-all duration-300', status.done ? 'bg-good' : 'bg-accent')}
          style={{ width: `${status.pct}%` }}
        />
      </div>

      {/* Task summary icons + manual day check */}
      <div className="mt-2 flex items-center gap-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          {day.tasks.slice(0, 5).map((t, idx) => {
            const TI = taskIcon(t.kind)
            const done = isTaskChecked(plan, day.date, t)
            return (
              <TI
                key={idx}
                className={classNames(
                  'h-3 w-3 shrink-0',
                  t.kind === 'oa' ? 'text-warn' : t.kind === 'review-session' ? 'text-accent' : done ? 'text-good' : 'text-mute-dark',
                )}
              />
            )
          })}
        </div>
        <button
          onClick={onToggleDay}
          className="shrink-0"
          aria-label={isDayChecked(plan, day.date) ? `Mark ${label} as not done` : `Mark all of ${label} as done`}
          title="Mark day complete"
        >
          {isDayChecked(plan, day.date) ? (
            <CheckSquare className="h-3.5 w-3.5 text-good" />
          ) : (
            <Square className="h-3.5 w-3.5 text-mute-dark hover:text-accent" />
          )}
        </button>
      </div>

      {/* Expanded task list */}
      {open && (
        <ul className="mt-2 space-y-1 border-t border-edge-dark pt-2">
          {day.tasks.map((t, idx) => {
            const TI = taskIcon(t.kind)
            const checked = isTaskChecked(plan, day.date, t)
            const href = t.problemId
              ? `/practice/${t.problemId}${t.kind === 'review' ? '?mode=review' : ''}`
              : t.kind === 'drill'
                ? '/drill'
                : t.kind === 'oa'
                  ? '/oa-mode'
                  : '/review'
            return (
              <li key={idx} className="flex items-center gap-1.5">
                <button
                  onClick={() => onToggleTask(t)}
                  aria-label={checked ? `Mark ${t.label} as not done` : `Mark ${t.label} as done`}
                >
                  {checked ? (
                    <CheckSquare className="h-3.5 w-3.5 text-good" />
                  ) : (
                    <Square className="h-3.5 w-3.5 text-mute-dark hover:text-accent" />
                  )}
                </button>
                <TI className={classNames('h-3 w-3 shrink-0', t.kind === 'oa' ? 'text-warn' : t.kind === 'review-session' ? 'text-accent' : 'text-mute-dark')} />
                <Link to={href} className="min-w-0 flex-1 truncate text-xs hover:text-accent" title={t.label}>
                  {t.label}
                </Link>
              </li>
            )
          })}
          {day.tasks.length === 0 && <li className="text-xs text-mute-dark">Rest day</li>}
        </ul>
      )}
      {status.minutes > 0 && (
        <div className="mt-1.5 text-[10px] text-mute-dark">{fmtMinutes(status.minutes)} practiced</div>
      )}
    </div>
  )
}

/** Add whole days to a date without mutating the input. */
function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)
}

/** Shared cell model for both heatmaps. */
interface HeatCell {
  key: string
  date: Date
  level: 0 | 1 | 2 | 3 | 4
  minutes: number
  frozen: boolean
  future: boolean
}

function buildCells(progress: UserProgress, start: Date, days: number): HeatCell[] {
  const byDay = new Map<string, { count: number; minutes: number }>()
  for (const a of progress.attempts) {
    const key = todayKey(new Date(a.at))
    const prev = byDay.get(key) ?? { count: 0, minutes: 0 }
    prev.count += 1
    prev.minutes += a.minutes
    byDay.set(key, prev)
  }
  const today = todayKey()
  const out: HeatCell[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const key = todayKey(d)
    const activity = byDay.get(key)
    let level: 0 | 1 | 2 | 3 | 4 = 0
    if (activity && activity.count > 0) {
      if (activity.count === 1) level = 1
      else if (activity.count === 2) level = 2
      else if (activity.count <= 4) level = 3
      else level = 4
    }
    if (freezeUsedOn(progress, key)) level = 1
    out.push({ key, date: d, level, minutes: activity?.minutes ?? 0, frozen: freezeUsedOn(progress, key), future: key > today })
  }
  return out
}

/** LeetCode-style season heatmap: last ~17 weeks, Mon-start columns. */
function ActivityHeatmap({ progress }: { progress: UserProgress }) {
  const cells = useMemo(() => {
    const today = new Date()
    const weeks = 17
    const start = addDays(new Date(weekStartOf(today) + 'T00:00:00'), -(weeks - 1) * 7)
    return buildCells(progress, start, weeks * 7)
  }, [progress])

  const monthLabels = useMemo(() => {
    const cols: { idx: number; label: string }[] = []
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for (let w = 0; w < 17; w++) {
      const d = cells[w * 7]?.date
      if (!d) continue
      const label = MONTHS[d.getMonth()]
      if (cols.length === 0 || cols[cols.length - 1].label !== label) cols.push({ idx: w, label })
    }
    return cols
  }, [cells])

  return (
    <div className="overflow-x-auto pb-1" role="img" aria-label="Daily practice activity heatmap for the last 17 weeks">
      <div className="inline-flex flex-col gap-1">
        <div className="flex gap-[3px] pl-6">
          {Array.from({ length: 17 }).map((_, w) => {
            const m = monthLabels.find((c) => c.idx === w)
            return (
              <div key={w} className="w-3 text-[9px] text-mute-dark">
                {m ? m.label : ''}
              </div>
            )
          })}
        </div>
        <div className="flex gap-[3px] pl-6">
          <div className="mr-1 flex w-5 flex-col gap-[3px] text-[9px] text-mute-dark">
            <span className="h-3 leading-3">Mon</span>
            <span className="h-3" />
            <span className="h-3" />
            <span className="h-3" />
            <span className="h-3" />
            <span className="h-3 leading-3">Sat</span>
            <span className="h-3 leading-3">Sun</span>
          </div>
          {Array.from({ length: 17 }).map((_, w) => (
            <div key={w} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, dow) => {
                const cell = cells[w * 7 + dow]
                if (!cell) return <span key={dow} className="h-3 w-3" />
                return (
                  <span
                    key={dow}
                    className={classNames(
                      'h-3 w-3 rounded-sm',
                      cell.future ? 'bg-edge-dark/20' : cell.frozen ? FREEZE_CLASS : HEAT_CLASSES[cell.level],
                      cell.key === todayKey() && 'ring-1 ring-accent',
                    )}
                    title={`${cell.key}: ${cell.frozen ? 'streak freeze' : cell.level === 0 ? 'no activity' : `${cell.minutes}m practiced`}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Calendar-month heatmap: one row per week (Mon-start), single month at a time with ‹ › navigation. */
function MonthHeatmap({ progress }: { progress: UserProgress }) {
  const [monthOffset, setMonthOffset] = useState(0)
  const base = addDays(new Date(), 0)
  const view = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1)
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const cells = useMemo(() => {
    const firstMondayKey = weekStartOf(view)
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
    const firstDayDow = (view.getDay() + 6) % 7 // 0 = Monday
    const weeks = Math.ceil((firstDayDow + daysInMonth) / 7)
    return buildCells(progress, new Date(firstMondayKey + 'T00:00:00'), weeks * 7)
  }, [progress, view.getTime()])

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <div className="flex items-center gap-1">
          <button className="btn-ghost p-1" aria-label="Previous month" onClick={() => setMonthOffset((m) => m - 1)}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button className="btn-ghost px-2 text-[10px]" onClick={() => setMonthOffset(0)} disabled={monthOffset === 0}>
            This month
          </button>
          <button className="btn-ghost p-1" aria-label="Next month" onClick={() => setMonthOffset((m) => Math.min(0, m + 1))}>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="inline-flex flex-col gap-[3px]" role="img" aria-label={`Practice heatmap for ${MONTHS[view.getMonth()]} ${view.getFullYear()}`}>
        {[0, 1, 2, 3, 4, 5, 6].map((dow) => (
          <div key={dow} className="flex gap-[3px]">
            {cells.filter((c) => c.date.getDay() === (dow + 1) % 7).map((c) => (
              <span
                key={c.key}
                className={classNames(
                  'h-4 w-4 rounded-sm',
                  c.future ? 'bg-edge-dark/20' : c.frozen ? FREEZE_CLASS : HEAT_CLASSES[c.level],
                  c.key === todayKey() && 'ring-1 ring-accent',
                )}
                title={`${c.key}: ${c.frozen ? 'streak freeze' : c.level === 0 ? 'no activity' : `${c.minutes}m practiced`}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
