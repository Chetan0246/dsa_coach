import type { Difficulty, Problem } from '../types'

export interface CompactProblem {
  /** title */
  t: string
  cat: string
  pat: string
  d: Difficulty
  desc: string
  sig: string[]
  brute: string
  bot: string
  pHint: string
  oHint: string
  java: string[]
  time: string
  space: string
  traps: string[]
  mins: 15 | 20 | 25 | 30 | 35 | 40
  ex?: { input: string; output: string; explanation?: string }[]
  con?: string[]
  tags?: string[]
  tmpl?: string
  outline?: string
  code?: string
  tests?: { input: string; output: string }[]
  lc?: string
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/\(|\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function build(p: CompactProblem, phase: number): Problem {
  const slug = slugify(p.t)
  return {
    id: slug,
    title: p.t,
    slug,
    category: p.cat,
    pattern: p.pat,
    difficulty: p.d,
    shortDescription: p.desc,
    constraints: p.con,
    examples: p.ex ?? [],
    recognitionSignals: p.sig,
    bruteForceIdea: p.brute,
    bottleneck: p.bot,
    patternHint: p.pHint,
    optimizationHint: p.oHint,
    javaConcepts: p.java,
    javaTemplate: p.tmpl,
    solutionOutline: p.outline,
    javaSolution: p.code,
    complexity: { time: p.time, space: p.space },
    commonMistakes: p.traps,
    estimatedMinutes: p.mins,
    leetcodeUrl: p.lc,
    tags: p.tags ?? [p.pat.split(' ')[0].toLowerCase()],
    phase,
    testCases: p.tests,
  }
}

/** Standard 1-D array constraints reused across many problems. */
export const ARRAY_CONSTRAINTS = [
  '1 <= nums.length <= 10^4',
  '-10^9 <= nums[i] <= 10^9',
]

export const STRING_CONSTRAINTS = [
  '1 <= s.length <= 10^4',
  's consists of printable characters',
]
