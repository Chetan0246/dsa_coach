export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface ProblemExample {
  input: string
  output: string
  explanation?: string
}

export interface Problem {
  id: string
  title: string
  slug: string
  category: string
  pattern: string
  difficulty: Difficulty
  shortDescription: string
  constraints?: string[]
  examples: ProblemExample[]
  recognitionSignals: string[]
  bruteForceIdea: string
  bottleneck: string
  patternHint: string
  optimizationHint: string
  javaConcepts: string[]
  javaTemplate?: string
  solutionOutline?: string
  javaSolution?: string
  complexity: { time: string; space: string }
  commonMistakes: string[]
  estimatedMinutes: 15 | 20 | 25 | 30 | 35 | 40
  leetcodeUrl?: string
  tags: string[]
  phase: number
  testCases?: TestCase[]
}

export interface TestCase {
  input: string
  output: string
}

export interface DsaPattern {
  id: string
  name: string
  whatItSolves: string
  recognitionSignals: string[]
  mentalTrigger: string
  javaTemplate: string
  commonTraps: string[]
  representativeProblemTitles: string[]
}

export type CoachStageId = 1 | 2 | 3 | 4 | 5 | 6

export interface CoachStage {
  id: CoachStageId
  key: string
  label: string
  prompt: string
  followUps: string[]
}

export type ResultStatus =
  | 'solved-no-hints'
  | 'solved-with-hints'
  | 'solved-after-reveal'
  | 'failed'
  | 'gave-up'

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy' | 'mastered'

export interface ProblemStats {
  attempts: number
  solved: number
  failed: number
  totalMinutes: number
  hintsUsedTotal: number
  lastResult?: ResultStatus
  lastAttemptAt?: number
  bestScore: number
  lastScore: number
  lastPatternCorrect?: boolean
  lastConfidence?: number
}

export interface PatternStats {
  solved: number
  attempts: number
  scoreSum: number
  scoreCount: number
}

export interface ReviewItem {
  problemId: string
  dueAt: number
  intervalDays: number
  lastGrade?: ReviewGrade
  lastReviewedAt?: number
}

export type MistakeType =
  | 'Logic'
  | 'Complexity'
  | 'Java syntax'
  | 'Collections'
  | 'Edge case'
  | 'Off-by-one'
  | 'Pattern recognition'
  | 'Implementation'

export interface Mistake {
  id: string
  problemId?: string
  type: MistakeType
  note: string
  createdAt: number
}

export interface Attempt {
  problemId: string
  result: ResultStatus
  minutes: number
  hintsUsed: number
  score: number
  patternCorrect: boolean
  confidence?: number
  at: number
}

export interface SessionHistoryItem {
  at: number
  solved: number
  attempted: number
  hintsUsed: number
  avgMinutes: number
  patternsRecognized: number
}

export interface UserProgress {
  version: 1
  solvedProblems: string[]
  attemptedProblems: string[]
  failedProblems: string[]
  problemStats: Record<string, ProblemStats>
  patternStats: Record<string, PatternStats>
  reviewQueue: ReviewItem[]
  mistakes: Mistake[]
  notes: Record<string, string>
  attempts: Attempt[]
  sessionHistory: SessionHistoryItem[]
  streak: number
  lastPracticeDate: string | null
  /** Current streak-freeze balance (auto-consumed to bridge a missed day). */
  streakFreezes: number
  /** Total freezes ever granted (awarded every 4th solve, capped); balance = granted − used. */
  streakFreezesGranted: number
  /** ISO day keys where a freeze was consumed to bridge a 1-day gap. */
  streakFreezeDays: string[]
  confidence: Record<string, number>
  weeklyPlan: WeeklyPlan | null
}

export interface ProgressSnapshot {
  solvedCount: number
  attemptedCount: number
  failedCount: number
  streak: number
  accuracyPct: number
  patternsTouched: number
  solvedNoHints: number
  solvedWithHints: number
  avgSolveMinutes: number
  recognitionScore: number
  strongestPattern: string | null
  weakestPattern: string | null
  avgConfidence: number
}

export type DayTaskKind = 'new' | 'review' | 'drill' | 'oa' | 'review-session'

export interface DayTask {
  kind: DayTaskKind
  /** Problem id when kind = 'new' | 'review' | 'oa'; omitted for 'drill' | 'review-session'. */
  problemId?: string
  label: string
  /** Target count for the task (problems to solve, drills to run, sessions to complete). */
  target: number
}

export interface DayPlan {
  /** ISO day key, e.g. 2026-09-22. */
  date: string
  tasks: DayTask[]
  /** 1 = Monday … 7 = Sunday. */
  weekday: number
}

export interface WeeklyPlan {
  /** ISO day key of the plan's Monday. */
  weekStart: string
  days: DayPlan[]
  /** Completed items: key = `${date}|${taskId}` (`${date}|*` = whole day checked off). */
  completedTasks: Record<string, true>
}

export interface CodeFile {
  problemId: string
  code: string
}

export interface Settings {
  theme: 'dark' | 'light' | 'system'
  dailyTarget: number
  timedModeMinutes: number
  onboardingDone: boolean
  coachMode: 'guided' | 'timed' | 'blind' | 'review'
}

export interface TestCaseResult {
  name: string
  passed: boolean
  detail: string
}

export interface RunResult {
  ok: boolean
  cases: TestCaseResult[]
  stderr?: string
}

/* ---------- AI provider abstraction ---------- */

export interface CoachInput {
  problem: Problem
  stage: CoachStageId
  mode: Settings['coachMode']
  history: CoachMessage[]
}

export interface CoachMessage {
  role: 'coach' | 'user'
  text: string
  stage?: CoachStageId
  at: number
}

export interface CoachResponse {
  text: string
  suggestExplainDeeper: boolean
}

export interface HintInput {
  problem: Problem
  level: number
}

export interface AttemptInput {
  problem: Problem
  code: string
  stage: CoachStageId
}

export interface AnalysisResponse {
  text: string
}

export interface AIProvider {
  readonly name: string
  getCoachResponse(input: CoachInput): Promise<CoachResponse>
  analyzeAttempt(input: AttemptInput): Promise<AnalysisResponse>
  generateHint(input: HintInput): Promise<string>
}
