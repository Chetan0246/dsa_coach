import { useEffect, useRef, useState } from 'react'
import { Bot, Send, Lightbulb, ChevronDown, Eye } from 'lucide-react'
import type { CoachMessage, CoachStageId, Problem, Settings } from '../../types'
import { COACH_STAGES, COACH_STAGE_BY_ID } from '../../data/coachStages'
import { createAIProvider } from '../../lib/ai/provider'
import { levelHint } from '../../lib/ai/mockProvider'
import { classNames } from '../../lib/utils'

interface Props {
  problem: Problem
  stage: CoachStageId
  onStageChange: (s: CoachStageId) => void
  mode: Settings['coachMode']
  onHintUsed: () => void
  onRevealSolution: () => void
}

export default function CoachPanel({ problem, stage, onStageChange, mode, onHintUsed, onRevealSolution }: Props) {
  const [messages, setMessages] = useState<CoachMessage[]>([])
  const [input, setInput] = useState('')
  const [hintLevel, setHintLevel] = useState(0)
  const [loading, setLoading] = useState(false)
  const providerRef = useRef(createAIProvider())
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reset and seed the coach prompt when the problem changes
  useEffect(() => {
    const stageDef = COACH_STAGE_BY_ID[stage]
    setMessages(stageDef ? [{ role: 'coach', text: stageDef.prompt, stage, at: Date.now() }] : [])
    setHintLevel(0)
    setInput('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.id])

  // Seed the stage prompt when it changes
  useEffect(() => {
    const stageDef = COACH_STAGE_BY_ID[stage]
    if (!stageDef) return
    setMessages((prev) => {
      if (prev.some((m) => m.stage === stage && m.role === 'coach')) return prev
      return [...prev, { role: 'coach', text: stageDef.prompt, stage, at: Date.now() }]
    })
  }, [stage])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, loading])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: trimmed, at: Date.now() }])
    setLoading(true)
    try {
      const resp = await providerRef.current.getCoachResponse({
        problem,
        stage,
        mode,
        history: [...messages, { role: 'user', text: trimmed, at: Date.now() }],
      })
      setMessages((prev) => [...prev, { role: 'coach', text: resp.text, stage, at: Date.now() }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'coach', text: 'Something went wrong reaching the coach. Try again.', at: Date.now() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const askHint = () => {
    const next = Math.min(hintLevel + 1, 4)
    if (next === hintLevel) return
    setHintLevel(next)
    onHintUsed()
    setMessages((prev) => [...prev, { role: 'coach', text: levelHint(problem, next), stage, at: Date.now() }])
  }

  const nextStage = () => onStageChange(Math.min(6, stage + 1) as CoachStageId)

  const stageDef = COACH_STAGE_BY_ID[stage]

  if (mode === 'blind') {
    return (
      <div className="card flex h-full flex-col p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mute-dark">
          <Bot className="h-4 w-4" /> AI Coach — paused
        </div>
        <p className="text-sm text-mute-dark">
          Blind mode hides coaching until you submit. The pattern will be revealed with your results.
        </p>
      </div>
    )
  }

  return (
    <div className="card flex h-full flex-col overflow-hidden">
      <div className="border-b border-edge-dark px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mute-dark">
            <Bot className="h-4 w-4 text-accent" /> AI Coach
          </div>
          <span className="code text-xs text-mute-dark">Step {stage} / 6</span>
        </div>
        <div className="mt-2 flex gap-1" role="list" aria-label="Coach stages">
          {COACH_STAGES.map((s) => (
            <button
              key={s.id}
              role="listitem"
              title={s.label}
              onClick={() => onStageChange(s.id)}
              className={classNames(
                'h-1.5 flex-1 rounded-full transition-colors',
                s.id < stage ? 'bg-accent/60' : s.id === stage ? 'bg-accent' : 'bg-edge-dark',
              )}
              aria-label={`Stage ${s.id}: ${s.label}`}
            />
          ))}
        </div>
        <div className="mt-2 text-sm font-semibold">{stageDef?.label}</div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={classNames('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={classNames(
                'max-w-[92%] rounded-lg px-3 py-2 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'bg-accent-soft text-accent'
                  : 'bg-edge-dark/40 text-ink-dark',
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-edge-dark/40 px-3 py-2 text-sm text-mute-dark">Coach is typing…</div>
          </div>
        )}
      </div>

      <div className="border-t border-edge-dark p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <button className="btn-ghost !px-2 !py-1 text-xs" onClick={askHint} disabled={hintLevel >= 4}>
            <Lightbulb className="h-3.5 w-3.5" /> I'm stuck ({Math.min(hintLevel + 1, 4)}/4)
          </button>
          {stageDef?.followUps.slice(0, 2).map((f) => (
            <button key={f} className="btn-ghost !px-2 !py-1 text-xs" onClick={() => send(f)}>
              {f}
            </button>
          ))}
          {stage === 6 && (
            <button className="btn-ghost !px-2 !py-1 text-xs text-warn" onClick={onRevealSolution}>
              <Eye className="h-3.5 w-3.5" /> Reveal solution
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask the coach..."
            aria-label="Message the coach"
            className="input !py-1.5 text-sm"
          />
          <button className="btn-primary !px-2.5" onClick={() => send(input)} aria-label="Send">
            <Send className="h-4 w-4" />
          </button>
        </div>
        {stage < 6 && (
          <button className="mt-2 w-full text-xs text-mute-dark hover:text-accent" onClick={nextStage}>
            Next step: {COACH_STAGE_BY_ID[stage + 1]?.label} <ChevronDown className="inline h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}
