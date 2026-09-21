import type { CoachStage } from '../types'

/** The exact six coach stages from the spec, in order. */
export const COACH_STAGES: CoachStage[] = [
  {
    id: 1,
    key: 'understand',
    label: 'Understand',
    prompt:
      'Before we think about code: What are the inputs? What must you return? Which constraint is most likely to break a naive idea?',
    followUps: ['Check my understanding', 'Give me a smaller hint', "I'm stuck"],
  },
  {
    id: 2,
    key: 'intuition',
    label: 'Intuition',
    prompt:
      'What changes as you scan the input? What information would help you make the next decision without rescanning?',
    followUps: ['Help me understand', 'Give me a smaller hint', "I'm stuck"],
  },
  {
    id: 3,
    key: 'brute-force',
    label: 'Brute Force',
    prompt:
      'Describe the simplest solution that is always correct — nested loops, recursion, or direct simulation. Then we will find its cost.',
    followUps: ['Show the bottleneck', 'Give me a smaller hint', "I'm stuck"],
  },
  {
    id: 4,
    key: 'bottleneck',
    label: 'Bottleneck',
    prompt:
      'What work does the brute force repeat? Which operation would you like to make O(1) or O(log n) instead?',
    followUps: ['Show the pattern', 'Give me a smaller hint', "I'm stuck"],
  },
  {
    id: 5,
    key: 'pattern',
    label: 'Pattern',
    prompt:
      'Which pattern fits the repeated work you just named? Name it, then explain the signal that told you.',
    followUps: ['Show implementation guidance', 'Give me a smaller hint', "I'm stuck"],
  },
  {
    id: 6,
    key: 'optimize',
    label: 'Optimize + Implement',
    prompt:
      'Convert the idea to Java: which data structure, which loop, which state? When you are confident, submit.',
    followUps: ['Reveal solution', 'Explain deeper', "I'm stuck"],
  },
]

export const COACH_STAGE_BY_ID: Record<number, CoachStage> = Object.fromEntries(
  COACH_STAGES.map((s) => [s.id, s]),
)
