import type { AIProvider } from '../../types'
import { MockAIProvider } from './mockProvider'

/**
 * Returns the active AI provider.
 *
 * The MVP ships with MockAIProvider only. A real provider (OpenAI, Gemini,
 * Claude, OpenRouter, Ollama...) can be registered here later by reading
 * VITE_AI_PROVIDER / VITE_AI_API_KEY / VITE_AI_BASE_URL / VITE_AI_MODEL.
 * No keys are ever hard-coded.
 */
export function createAIProvider(): AIProvider {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {}
  const requested = (env.VITE_AI_PROVIDER ?? '').trim()
  if (requested && requested !== 'mock') {
    // No remote provider is wired in this build; fail soft to the local demo.
    console.info(`[PatternPilot] VITE_AI_PROVIDER="${requested}" has no implementation in this build; using the local demo coach.`)
  }
  return new MockAIProvider()
}
