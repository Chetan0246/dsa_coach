import { PROBLEMS, PHASES, getProblem } from '../src/data'
import { PATTERNS } from '../src/data/patterns'
import { COMPLEXITY_CHOICES, matchComplexity } from '../src/components/practice/SubmissionFlow'
import { MockCodeRunner } from '../src/lib/runner/mockRunner'
import {
  buildWeekPlan,
  weekStartOf,
  dayDiff,
  dayStatus,
  adaptiveDailyTarget,
  weekScore,
  weekGrade,
  oaProblems,
  weekAggregate,
} from '../src/lib/planner'
import { computeScore, computeSnapshot } from '../src/state/progress'
import { validateProgress, emptyProgress, exportProgress, importProgress } from '../src/lib/storage'
import type { UserProgress, Attempt, DayPlan } from '../src/types'

let passed = 0
let failed = 0

function assert(condition: boolean, msg: string) {
  if (condition) {
    passed++
  } else {
    failed++
    console.error(`  ✗ FAIL: ${msg}`)
  }
}

console.log('--- 1. Testing Dataset Integrity ---')
assert(PROBLEMS.length === 150, `Expected 150 problems, got ${PROBLEMS.length}`)
assert(PHASES.length === 18, `Expected 18 phases, got ${PHASES.length}`)
assert(PATTERNS.length === 22, `Expected 22 patterns, got ${PATTERNS.length}`)

for (const p of PROBLEMS) {
  assert(Boolean(p.id && p.title && p.pattern && p.difficulty), `Problem ${p.id} missing core fields`)
  assert(Boolean(p.complexity.time && p.complexity.space), `Problem ${p.id} missing complexity`)
}

console.log('--- 2. Testing Complexity Matching Across All 150 Problems ---')
for (const p of PROBLEMS) {
  const matchT = COMPLEXITY_CHOICES.some((c) => matchComplexity(c, p.complexity.time))
  const matchS = COMPLEXITY_CHOICES.some((c) => matchComplexity(c, p.complexity.space))
  assert(matchT, `Time complexity "${p.complexity.time}" for ${p.id} has no matching choice in COMPLEXITY_CHOICES`)
  assert(matchS, `Space complexity "${p.complexity.space}" for ${p.id} has no matching choice in COMPLEXITY_CHOICES`)
}

console.log('--- 3. Testing MockCodeRunner ---')
async function testRunner() {
  const runner = new MockCodeRunner()
  const testCases = [
    { input: 'case 1', output: 'ans 1' },
    { input: 'case 2', output: 'ans 2' },
    { input: 'case 3', output: 'ans 3' },
  ]

  // Invalid Java (unbalanced braces)
  const res1 = await runner.run('class Solution {', testCases)
  assert(!res1.ok, 'Unbalanced braces should fail compilation')
  assert(Boolean(res1.stderr), 'Unbalanced braces should return stderr')

  // Empty code
  const res2 = await runner.run('', testCases)
  assert(!res2.ok, 'Empty code should fail')

  // Unedited stub (no logic)
  const res3 = await runner.run('class Solution { public int fn() { return 0; } }', testCases)
  assert(!res3.ok, 'Stub with no logic should fail')
  assert(res3.cases.length === 3 && res3.cases[0].passed && !res3.cases[1].passed, 'Stub should pass at most 1 test')

  // Loop implementation
  const resLoop = await runner.run(
    'class Solution { public int fn(int[] nums) { int sum = 0; for (int n : nums) sum += n; return sum; } }',
    testCases,
  )
  assert(resLoop.ok, 'Loop implementation should pass all tests')

  // Recursive tree implementation (no for or while)
  const resRecur = await runner.run(
    `class Solution {
      public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
      }
    }`,
    testCases,
  )
  assert(resRecur.ok, 'Recursive implementation without loop should pass all tests')

  // Bit manipulation implementation
  const resBit = await runner.run(
    `class Solution {
      public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
          n &= (n - 1);
          count++;
        }
        return count;
      }
    }`,
    testCases,
  )
  assert(resBit.ok, 'Bit manipulation should pass all tests')
}

console.log('--- 4. Testing Planner Logic ---')
const ws = weekStartOf(new Date(2026, 8, 24)) // Sep 24, 2026 (Thursday)
assert(ws === '2026-09-21', `Expected Monday to be 2026-09-21, got ${ws}`)

const plan = buildWeekPlan(ws, new Set(['two-sum']), 2, [], [])
assert(plan.days.length === 7, `Expected 7 days, got ${plan.days.length}`)
assert(plan.days[0].tasks.some((t) => t.kind === 'drill'), 'Monday must have pattern drill')
assert(plan.days[5].tasks.some((t) => t.kind === 'oa'), 'Saturday must have OA simulation')
assert(plan.days[6].tasks.some((t) => t.kind === 'review-session'), 'Sunday must have review session')

const baseProgress: UserProgress = {
  ...emptyProgress(),
  solvedProblems: ['two-sum'],
  attempts: [
    {
      problemId: 'two-sum',
      result: 'solved-no-hints',
      minutes: 10,
      hintsUsed: 0,
      score: 100,
      patternCorrect: true,
      confidence: 5,
      at: new Date('2026-09-21T10:00:00').getTime(),
    },
  ],
}

const statusMon = dayStatus(plan, plan.days[0], baseProgress)
assert(statusMon.completedCount >= 1, 'Monday should reflect completed task')

const oaProbs = oaProblems(ws, new Set())
assert(oaProbs.length === 3, 'OA should produce 3 problems')

console.log('--- 5. Testing Scoring & Grades ---')
const scorePerfect = computeScore('solved-no-hints', 0, 10, 20)
assert(scorePerfect === 100, `Expected 100, got ${scorePerfect}`)

const scoreSlowHints = computeScore('solved-with-hints', 3, 35, 20)
assert(scoreSlowHints < 65, `Expected score < 65 with 3 hints & overtime, got ${scoreSlowHints}`)

assert(weekGrade(95) === 'S', 'Grade 95 should be S')
assert(weekGrade(82) === 'A', 'Grade 82 should be A')
assert(weekGrade(68) === 'B', 'Grade 68 should be B')
assert(weekGrade(50) === 'C', 'Grade 50 should be C')
assert(weekGrade(30) === 'D', 'Grade 30 should be D')

console.log('--- 6. Testing Storage Validation & Migration ---')
const empty = emptyProgress()
const validated = validateProgress(empty)
assert(validated !== null, 'Empty progress should validate successfully')

const legacyRecord = {
  solvedProblems: ['two-sum'],
  problemStats: {},
  patternStats: {},
  notes: {},
  reviewQueue: [],
  mistakes: [],
  attempts: [],
  sessionHistory: [],
  streak: 3,
  lastPracticeDate: '2026-09-20',
  confidence: {},
  // Missing streakFreezesGranted, streakFreezeDays, weeklyPlan
}
const migrated = validateProgress(legacyRecord)
assert(migrated !== null, 'Legacy record should migrate cleanly')
assert(Array.isArray(migrated?.streakFreezeDays), 'Migrated record should have streakFreezeDays array')
assert(typeof migrated?.streakFreezesGranted === 'number', 'Migrated record should have streakFreezesGranted')
assert(Boolean(migrated?.weeklyPlan), 'Migrated record should have auto-repaired weeklyPlan')

const snap = computeSnapshot(baseProgress)
assert(snap.solvedCount === 1, `Expected 1 solved problem, got ${snap.solvedCount}`)
assert(snap.solvedNoHints === 1, `Expected 1 solved without hints, got ${snap.solvedNoHints}`)

testRunner().then(() => {
  console.log(`\nResults: ${passed} passed, ${failed} failed.`)
  if (failed > 0) process.exit(1)
  console.log('✓ All verification tests passed!')
})
