import type { AIProvider, AnalysisResponse, AttemptInput, CoachInput, CoachResponse, HintInput, Problem } from '../../types'
import { COACH_STAGE_BY_ID } from '../../data/coachStages'
import { PATTERN_BY_NAME } from '../../data/patterns'

const STAGE_RESPONSES: Record<number, (p: CoachInput['problem']) => string> = {
  1: (p) =>
    `Step 1 — Understand. Before any code: what are the inputs, and what exactly must you return? Which edge case in "${p.title}" is most likely to break a first attempt? Tell me your reading of the problem first.`,
  2: (p) =>
    `Step 2 — Intuition. As you scan the input for "${p.title}", what changes from one position to the next? What single piece of information, if you remembered it, would make each decision easy?`,
  3: () =>
    `Step 3 — Brute force. Describe the simplest always-correct approach: which loops, what do you check at each step? We only need correctness here — cost comes next.`,
  4: () =>
    `Step 4 — Bottleneck. In your brute force, which operation repeats work you have already done? Name it, and tell me what you wish you could look up instantly.`,
  5: (p) =>
    `Step 5 — Pattern. Given the repeated work you just named, which pattern fits? Say the name out loud, then tell me the signal that pointed to it. Here the answer will be ${p.pattern}.`,
  6: (p) =>
    `Step 6 — Optimize + implement. Translate the idea into Java for "${p.title}": which data structure holds your state, and which loop maintains it? Write it, then submit.`,
}

/** Stage-appropriate "stuck" nudges that stay one step ahead of the user. */
export const STUCK_RESPONSES: Record<number, (p: CoachInput['problem']) => string> = {
  1: () =>
    `Let's slow down. Restate the problem in one sentence: what goes in, what comes out? Then name one tiny example you could trace by hand.`,
  2: () =>
    `Try this: walk a tiny example by hand and say what you needed to remember at each step. That memory is usually the whole idea.`,
  3: () =>
    `Forget efficiency. How would you solve it with as many loops as you like? Describe that plainly — we will cut it down afterward.`,
  4: () =>
    `Look at your nested loops: which values do they recompute? Those repeated values are exactly what a data structure could remember.`,
  5: (p) => {
    const pat = PATTERN_BY_NAME[p.pattern]
    return `The repeated work points to ${p.pattern}. ${pat ? `Ask yourself: "${pat.mentalTrigger}"` : 'Think about which structure makes that repeated work constant-time.'}`
  },
  6: () =>
    `Start from the pattern, not the code: state your main data structure and the loop that feeds it. One loop, one clearly defined piece of state.`,
}

/** Follow-up intents recognized from user messages. */
function respondToUser(userText: string, problem: CoachInput['problem'], stageId: number): string | null {
  const t = userText.toLowerCase()
  if (t.includes('explain deeper') || t.includes('deeper')) {
    const pat = PATTERN_BY_NAME[problem.pattern]
    return pat
      ? `${problem.pattern} in one paragraph: ${pat.whatItSolves} The tell-tale signals here were ${pat.recognitionSignals
          .slice(0, 2)
          .join(' and ')}. For this problem: ${problem.patternHint} ${problem.bottleneck}`
      : problem.patternHint
  }
  if (t.includes('bottleneck')) return problem.bottleneck
  if (t.includes('pattern') && stageId >= 5) return problem.patternHint
  if (t.includes('understand')) {
    return `Restate it once more: input is ${problem.examples[0]?.input ?? 'the given data'}; expected output is ${
      problem.examples[0]?.output ?? 'described above'
    }. Where could that break?`
  }
  if (t.includes('stuck') || t.includes('hint')) {
    return levelHint(problem, 1)
  }
  if (t.includes('implement') || t.includes('syntax') || t.includes('java')) {
    return `For Java you need: ${problem.javaConcepts.join(', ')}. ${problem.optimizationHint}`
  }
  return null
}

export function levelHint(problem: Problem, level: number): string {
  const pat = PATTERN_BY_NAME[problem.pattern]
  switch (Math.min(level, 4)) {
    case 1:
      return `Hint 1 — Think about what information you could remember while scanning, instead of recomputing it.`
    case 2:
      return `Hint 2 — ${problem.patternHint}`
    case 3:
      return `Pattern — this is ${problem.pattern}. ${pat ? `Mental trigger: "${pat.mentalTrigger}"` : ''}`.trim()
    default:
      return `Implementation — ${problem.optimizationHint}`
  }
}

export class MockAIProvider implements AIProvider {
  readonly name = 'Local Demo'

  async getCoachResponse(input: CoachInput): Promise<CoachResponse> {
    // Simulate a moment of "thinking" without blocking the UI noticeably.
    await new Promise((r) => setTimeout(r, 150))
    const stage = COACH_STAGE_BY_ID[input.stage] ?? COACH_STAGE_BY_ID[1]
    let text = ''
    const lastUser = [...input.history].reverse().find((m) => m.role === 'user')
    if (lastUser) {
      const intent = respondToUser(lastUser.text, input.problem, input.stage)
      if (intent) text = intent
    }
    if (!text) {
      text = (STAGE_RESPONSES[input.stage] ?? STAGE_RESPONSES[1])(input.problem)
    }
    void stage
    return { text, suggestExplainDeeper: true }
  }

  async analyzeAttempt(input: AttemptInput): Promise<AnalysisResponse> {
    await new Promise((r) => setTimeout(r, 120))
    const hasStructure = /class\s+\w+/.test(input.code)
    const hasLoop = /\b(for|while)\b/.test(input.code)
    if (!hasStructure) {
      return { text: 'I do not see a class skeleton yet. Start from the template and fill in the method body.' }
    }
    if (!hasLoop) {
      return { text: 'The skeleton is there. Which loop drives your main idea? Most patterns for this problem are loop-shaped.' }
    }
    return { text: 'Your structure looks plausible. Walk one example by hand through your code before submitting — check the loop bounds and the return value.' }
  }

  async generateHint(input: HintInput): Promise<string> {
    await new Promise((r) => setTimeout(r, 100))
    return levelHint(input.problem, input.level)
  }
}
