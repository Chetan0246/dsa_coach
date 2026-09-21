/* Run with: npx esbuild scripts/validate.ts --bundle --platform=node | node */
import { PROBLEMS, PHASES } from '../src/data'
import { PATTERNS } from '../src/data/patterns'

let errors = 0
const fail = (msg: string) => {
  errors++
  console.error('  ✗ ' + msg)
}

console.log(`Loaded ${PROBLEMS.length} problems across ${PHASES.length} phases, ${PATTERNS.length} patterns.`)
if (PROBLEMS.length !== 150) fail(`Expected 150 problems, got ${PROBLEMS.length}`)

const ids = new Set<string>()
for (const p of PROBLEMS) {
  if (ids.has(p.id)) fail(`Duplicate id: ${p.id}`)
  ids.add(p.id)
  if (!p.title) fail(`Problem ${p.id} missing title`)
  if (!p.shortDescription) fail(`${p.id}: missing description`)
  if (p.examples.length === 0) fail(`${p.id}: no examples`)
  if (p.recognitionSignals.length === 0) fail(`${p.id}: no recognition signals`)
  if (!p.bruteForceIdea) fail(`${p.id}: no brute force idea`)
  if (!p.bottleneck) fail(`${p.id}: no bottleneck`)
  if (!p.patternHint) fail(`${p.id}: no pattern hint`)
  if (!p.optimizationHint) fail(`${p.id}: no optimization hint`)
  if (p.javaConcepts.length === 0) fail(`${p.id}: no java concepts`)
  if (p.commonMistakes.length === 0) fail(`${p.id}: no common mistakes`)
  if (!p.complexity.time || !p.complexity.space) fail(`${p.id}: missing complexity`)
  if (!PHASES.some((ph) => ph.phase === p.phase)) fail(`${p.id}: unknown phase ${p.phase}`)
  if (!PATTERNS.some((pt) => pt.name === p.pattern)) fail(`${p.id}: unknown pattern "${p.pattern}"`)
}

const perPhase = PHASES.map((ph) => `${ph.phase}:${PROBLEMS.filter((p) => p.phase === ph.phase).length}`).join(' ')
console.log(`Per-phase counts: ${perPhase}`)

const fullyDetailed = PROBLEMS.filter(
  (p) => p.javaSolution && p.testCases && p.examples.length >= 1 && p.constraints && p.javaTemplate,
).length
console.log(`Fully detailed problems (solution + tests + template + constraints): ${fullyDetailed}`)

if (errors === 0) console.log('✓ Dataset validation passed.')
else {
  console.error(`✗ ${errors} problem(s) found.`)
  process.exit(1)
}
