import type { RunResult } from '../../types'

export interface CodeRunner {
  run(code: string, testCases: { input: string; output: string }[]): Promise<RunResult>
}
