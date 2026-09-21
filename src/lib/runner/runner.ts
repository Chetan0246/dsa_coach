import type { CodeRunner } from './types'
import { MockCodeRunner } from './mockRunner'

/**
 * Execution layer selection for the MVP.
 * Later this can point at Judge0, a local Java process, or a remote sandbox.
 */
export function createCodeRunner(): CodeRunner {
  return new MockCodeRunner()
}

export type { CodeRunner } from './types'
