import type { Problem } from '../types'
import { build, type CompactProblem } from './problemHelpers'
import { PROBLEMS_PART1 } from './problemsPart1'
import { PROBLEMS_TREES } from './problemsPart2'
import { PROBLEMS_HEAP_BACKTRACKING } from './problemsPart3'
import { PROBLEMS_ADV } from './problemsPart4'
import { PROBLEMS_FINAL } from './problemsPart5'
import { FIRST30 } from './first30Detail'

export interface PhaseMeta {
  phase: number
  name: string
}

export const PHASES: PhaseMeta[] = [
  { phase: 1, name: 'Arrays & Hashing' },
  { phase: 2, name: 'Two Pointers' },
  { phase: 3, name: 'Sliding Window' },
  { phase: 4, name: 'Stack' },
  { phase: 5, name: 'Binary Search' },
  { phase: 6, name: 'Linked List' },
  { phase: 7, name: 'Trees' },
  { phase: 8, name: 'Heap / Priority Queue' },
  { phase: 9, name: 'Backtracking' },
  { phase: 10, name: 'Tries' },
  { phase: 11, name: 'Graphs' },
  { phase: 12, name: 'Advanced Graphs' },
  { phase: 13, name: '1-D Dynamic Programming' },
  { phase: 14, name: '2-D Dynamic Programming' },
  { phase: 15, name: 'Greedy' },
  { phase: 16, name: 'Intervals' },
  { phase: 17, name: 'Math & Geometry' },
  { phase: 18, name: 'Bit Manipulation' },
]

const ALL_COMPACT: (CompactProblem & { _phase?: number })[] = [
  ...PROBLEMS_PART1.map((p) => ({ ...p })),
  ...PROBLEMS_TREES.map((p) => ({ ...p })),
  ...PROBLEMS_HEAP_BACKTRACKING.map((p) => ({ ...p })),
  ...PROBLEMS_ADV.map((p) => ({ ...p })),
  ...PROBLEMS_FINAL.map((p) => ({ ...p })),
]

function phaseFor(cat: string): number {
  const meta = PHASES.find((p) => p.name === cat)
  return meta ? meta.phase : 1
}

export const PROBLEMS: Problem[] = ALL_COMPACT.map((p) => {
  const problem = build(p, phaseFor(p.cat))
  const extra = FIRST30[problem.title]
  if (!extra) return problem
  return {
    ...problem,
    javaTemplate: extra.tmpl,
    javaSolution: extra.code,
    testCases: extra.tests,
    constraints: extra.con ?? problem.constraints,
  }
})

export const PROBLEM_BY_ID: Record<string, Problem> = Object.fromEntries(
  PROBLEMS.map((p) => [p.id, p]),
)

export function getProblem(id: string): Problem | undefined {
  return PROBLEM_BY_ID[id]
}

export function problemsByPhase(phase: number): Problem[] {
  return PROBLEMS.filter((p) => p.phase === phase)
}

export function problemsByPattern(pattern: string): Problem[] {
  return PROBLEMS.filter((p) => p.pattern === pattern)
}

/** 2–4 related problems sharing the same pattern (excluding the given one). */
export function relatedProblems(problem: Problem): Problem[] {
  const samePattern = PROBLEMS.filter((p) => p.pattern === problem.pattern && p.id !== problem.id)
  return samePattern.slice(0, 4)
}

/** Problems in the same phase that naturally come next. */
export function nextProblems(problem: Problem): Problem[] {
  const samePhase = PROBLEMS.filter((p) => p.phase === problem.phase && p.id !== problem.id)
  return samePhase.slice(0, 3)
}

/** Difficulty order for sorting. */
export function difficultyRank(d: string): number {
  if (d === 'Easy') return 0
  if (d === 'Medium') return 1
  return 2
}

/** Pick the next unsolved problem in roadmap order. */
export function nextRoadmapProblem(solvedIds: Set<string>): Problem {
  const unsolved = PROBLEMS.find((p) => !solvedIds.has(p.id))
  return unsolved ?? PROBLEMS[0]
}

/** Deterministic pseudo-random pick from a list based on the day. */
export function pickForDay<T>(items: T[], dayKey: string): T | undefined {
  if (items.length === 0) return undefined
  let h = 0
  for (let i = 0; i < dayKey.length; i++) {
    h = (h * 31 + dayKey.charCodeAt(i)) | 0
  }
  return items[Math.abs(h) % items.length]
}

/** Pattern Drill pool: problems with at least 4 pattern-siblings make good quizzes. */
export function drillCandidates(): Problem[] {
  const counts: Record<string, number> = {}
  for (const p of PROBLEMS) counts[p.pattern] = (counts[p.pattern] ?? 0) + 1
  return PROBLEMS.filter((p) => counts[p.pattern] >= 2)
}

/** Four choices for a pattern drill: correct pattern + 3 distractors. */
export function drillChoices(problem: Problem): string[] {
  const wrong = new Set<string>()
  const pool = PROBLEMS.filter((p) => p.pattern !== problem.pattern)
  // Prefer plausible distractors: patterns from nearby phases
  const near = pool.filter((p) => Math.abs(p.phase - problem.phase) <= 2)
  for (const p of near) {
    if (wrong.size < 3) wrong.add(p.pattern)
  }
  for (const p of pool) {
    if (wrong.size >= 3) break
    wrong.add(p.pattern)
  }
  const choices = [problem.pattern, ...Array.from(wrong).slice(0, 3)]
  // deterministic shuffle by problem id
  let seed = problem.id.length
  for (let i = 0; i < problem.id.length; i++) seed = (seed * 31 + problem.id.charCodeAt(i)) | 0
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.abs(seed) % (i + 1)
    ;[choices[i], choices[j]] = [choices[j], choices[i]]
    seed = (seed * 1103515245 + 12345) | 0
  }
  return choices
}

export const TOTAL_PROBLEMS = PROBLEMS.length
