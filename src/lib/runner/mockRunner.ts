import type { CodeRunner } from './types'
import type { RunResult } from '../../types'
import { looksLikeValidJava } from '../utils'

/**
 * MockCodeRunner — no real Java execution. Results are derived deterministically
 * from the shape of the submitted code so the practice loop feels real:
 *  - empty or unbalanced code            -> all tests fail
 *  - code with no loops                  -> passes only the first test
 *  - contains a loop + a structure       -> passes all tests
 */
export class MockCodeRunner implements CodeRunner {
  async run(code: string, testCases: { input: string; output: string }[]): Promise<RunResult> {
    await new Promise((r) => setTimeout(r, 400))

    if (!looksLikeValidJava(code)) {
      return {
        ok: false,
        cases: [],
        stderr: 'Compile error: unbalanced braces or empty submission. Check your class and method braces.',
      }
    }

    const hasLoop = /\b(for|while)\b/.test(code)
    const hasStructure = /\b(class|void|int|return)\b/.test(code)
    const passCount = hasLoop && hasStructure ? testCases.length : Math.min(1, testCases.length)

    const cases = testCases.map((tc, i) => ({
      name: `Test ${i + 1}`,
      passed: i < passCount,
      detail: i < passCount ? `Input: ${tc.input} -> ${tc.output} (matched)` : `Input: ${tc.input} -> expected ${tc.output}, got a different result`,
    }))

    return { ok: cases.every((c) => c.passed) && cases.length > 0, cases, stderr: undefined }
  }
}
