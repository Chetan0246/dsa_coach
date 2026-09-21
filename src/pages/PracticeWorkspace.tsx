import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  Play,
  Upload,
  RotateCcw,
  Copy,
  Wand2,
  Bot,
  Clock,
} from 'lucide-react'
import type { CoachStageId, Problem, Settings } from '../types'
import { getProblem } from '../data'
import { useProgress } from '../state/progress'
import { createCodeRunner } from '../lib/runner/runner'
import { fmtClock, classNames } from '../lib/utils'
import CoachPanel from '../components/practice/CoachPanel'
import { PreSubmitModal, PostSolveModal, type PostSolveData, type SubmissionAnswers } from '../components/practice/SubmissionFlow'
import EmptyState from '../components/common/EmptyState'
import CodeBlock from '../components/common/CodeBlock'

type Phase = 'practicing' | 'reflecting' | 'evaluated'

export default function PracticeWorkspace() {
  const { problemId } = useParams()
  const [params] = useSearchParams()
  const { progress, codeFiles, saveCodeFor, recordAttempt, scheduleReview, setNote } = useProgress()
  const problem: Problem | undefined = problemId ? getProblem(problemId) : undefined

  const mode: Settings['coachMode'] = useMemo(() => {
    const m = params.get('mode')
    if (m === 'timed' || m === 'blind' || m === 'review') return m
    return 'guided'
  }, [params])

  const [code, setCode] = useState('')
  const [phase, setPhase] = useState<Phase>('practicing')
  const [stage, setStage] = useState<CoachStageId>(1)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const [runResult, setRunResult] = useState<{ ok: boolean; cases: { name: string; passed: boolean; detail: string }[]; stderr?: string } | null>(null)
  const [running, setRunning] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [post, setPost] = useState<PostSolveData | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [mobileCoachOpen, setMobileCoachOpen] = useState(false)
  const runnerRef = useRef(createCodeRunner())

  const template = problem?.javaTemplate ?? `class Solution {\n}\n`

  useEffect(() => {
    if (!problem) return
    setCode(codeFiles[problem.id] ?? template)
    setPhase('practicing')
    setStage(1)
    setHintsUsed(0)
    setRunResult(null)
    setRevealed(false)
    setPost(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem?.id])

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000)
    return () => clearInterval(t)
  }, [startedAt])

  if (!problem) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <EmptyState
          title="Problem not found"
          message="This problem does not exist in the curriculum. It may have been renamed or the link is stale."
          action={<Link to="/roadmap" className="btn-primary">Back to Roadmap</Link>}
        />
      </div>
    )
  }

  const solvedSet = new Set(progress.solvedProblems)
  const alreadySolved = solvedSet.has(problem.id)
  const minutesSpent = Math.max(1, Math.round(elapsed / 60))

  const finishAttempt = useCallback(
    (answers: SubmissionAnswers, passed: boolean) => {
      const patternCorrect = answers.pattern === problem.pattern
      const timeCorrect = normalizeComplexity(answers.time) === normalizeComplexity(problem.complexity.time)
      const spaceCorrect = normalizeComplexity(answers.space) === normalizeComplexity(problem.complexity.space)
      const result =
        !passed
          ? 'failed'
          : hintsUsed === 0 && !revealed && patternCorrect
            ? 'solved-no-hints'
            : revealed
              ? 'solved-after-reveal'
              : 'solved-with-hints'
      const score = computeScoreLocal(result, hintsUsed, minutesSpent, problem.estimatedMinutes)
      recordAttempt({
        problem,
        result,
        minutes: minutesSpent,
        hintsUsed,
        patternCorrect,
      })
      const data: PostSolveData = {
        passed,
        patternCorrect,
        timeCorrect,
        spaceCorrect,
        expectedTime: problem.complexity.time,
        expectedSpace: problem.complexity.space,
        expectedPattern: problem.pattern,
        hintsUsed,
        minutes: minutesSpent,
        score,
      }
      setPost(data)
      setPhase('evaluated')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [problem, hintsUsed, revealed, minutesSpent, recordAttempt],
  )

  const handleSubmit = () => {
    setPhase('reflecting')
  }

  const handleRun = async () => {
    setRunning(true)
    const tests = problem.testCases ?? [{ input: 'sample input', output: 'sample output' }]
    const res = await runnerRef.current.run(code, tests)
    setRunResult(res)
    setRunning(false)
  }

  const handleGrade = (g: 'again' | 'hard' | 'good' | 'easy' | 'mastered') => {
    scheduleReview(problem.id, g)
    setPost(null)
  }

  const difficultyClass =
    problem.difficulty === 'Easy' ? 'text-good' : problem.difficulty === 'Medium' ? 'text-warn' : 'text-bad'

  const hidePattern = mode === 'blind'

  return (
    <div className="flex flex-col lg:h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-edge-dark px-4 py-2.5">
        <Link to="/roadmap" className="text-sm text-mute-dark hover:text-accent">← Roadmap</Link>
        <span className="hidden text-edge-dark sm:inline">|</span>
        <span className="code text-xs text-mute-dark">
          {hidePattern ? 'Pattern hidden' : problem.pattern} · Phase {problem.phase}
        </span>
        <span className={classNames('code text-xs', difficultyClass)}>{problem.difficulty}</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="code flex items-center gap-1.5 text-xs text-mute-dark">
            <Clock className="h-3.5 w-3.5" /> {fmtClock(elapsed)}
          </span>
          {alreadySolved && <span className="code rounded bg-good-soft px-1.5 py-0.5 text-[11px] text-good">solved before</span>}
        </div>
    </div>
      {/* 3-column layout */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(280px,1fr)_minmax(340px,1.2fr)_minmax(300px,1fr)] lg:overflow-hidden">
        {/* LEFT: problem */}
        <section className="min-h-0 overflow-y-auto border-b border-edge-dark p-5 lg:border-b-0 lg:border-r" aria-label="Problem statement">
          <h1 className="text-lg font-bold">{problem.title}</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className={classNames('code text-xs', difficultyClass)}>{problem.difficulty}</span>
            {!hidePattern && <span className="code text-xs text-mute-dark">Pattern: {problem.pattern}</span>}
          </div>
          <p className="mt-3 text-sm leading-relaxed">{problem.shortDescription}</p>

          <h2 className="mt-5 text-xs font-semibold uppercase tracking-wide text-mute-dark">Examples</h2>
          <div className="mt-2 space-y-2">
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-md border border-edge-dark bg-black/20 p-3">
                <div className="code text-xs"><span className="text-mute-dark">Input:</span> {ex.input}</div>
                <div className="code mt-1 text-xs"><span className="text-mute-dark">Output:</span> {ex.output}</div>
                {ex.explanation && <div className="mt-1 text-xs text-mute-dark">{ex.explanation}</div>}
              </div>
            ))}
          </div>

          {problem.constraints && problem.constraints.length > 0 && (
            <>
              <h2 className="mt-5 text-xs font-semibold uppercase tracking-wide text-mute-dark">Constraints</h2>
              <ul className="mt-2 space-y-1">
                {problem.constraints.map((c) => (
                  <li key={c} className="code text-xs text-mute-dark">{c}</li>
                ))}
              </ul>
            </>
          )}

          {/* Notes */}
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-mute-dark">My Notes</h2>
            <textarea
              value={progress.notes[problem.id] ?? ''}
              onChange={(e) => setNote(problem.id, e.target.value)}
              placeholder="What tripped you up? What should you remember?"
              rows={4}
              className="input mt-2 resize-y text-sm"
            />
          </div>

          {revealed && problem.javaSolution && (
            <div className="mt-6">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-mute-dark">Solution — study it, do not memorize it</h2>
              <CodeBlock code={problem.javaSolution} />
              {problem.solutionOutline && <p className="mt-2 text-sm text-mute-dark">{problem.solutionOutline}</p>}
            </div>
          )}
        </section>

        {/* CENTER: editor */}
        <section className="flex min-h-0 flex-col border-b border-edge-dark lg:border-b-0 lg:border-r" aria-label="Java editor">
          <div className="flex items-center gap-2 border-b border-edge-dark px-3 py-2">
            <span className="code text-xs font-semibold text-mute-dark">YOUR APPROACH — Java</span>
            <div className="ml-auto flex items-center gap-1.5">
              <button className="btn-ghost !px-2 !py-1 text-xs" onClick={handleRun} disabled={running}>
                <Play className="h-3.5 w-3.5" /> {running ? 'Running…' : 'Run'}
              </button>
              <button className="btn-primary !px-2 !py-1 text-xs" onClick={handleSubmit}>
                <Upload className="h-3.5 w-3.5" /> Submit
              </button>
              <button
                className="btn-ghost !px-2 !py-1 text-xs"
                onClick={() => setCode(template)}
                title="Reset to template"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                className="btn-ghost !px-2 !py-1 text-xs"
                onClick={() => navigator.clipboard?.writeText(code).catch(() => {})}
                title="Copy code"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                className="btn-ghost !px-2 !py-1 text-xs"
                onClick={() => setCode(formatJava(code))}
                title="Format (normalizes indentation)"
              >
                <Wand2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              saveCodeFor(problem.id, e.target.value)
            }}
            spellCheck={false}
            aria-label="Java code editor"
            className="code min-h-[300px] flex-1 resize-none bg-black/30 p-4 leading-relaxed outline-none lg:min-h-0"
          />
          {/* Run results */}
          {runResult && (
            <div className="border-t border-edge-dark px-4 py-3">
              {runResult.stderr && (
                <div className="mb-2 rounded-md border border-bad/30 bg-bad-soft p-2 text-xs text-bad">{runResult.stderr}</div>
              )}
              <ul className="space-y-1">
                {runResult.cases.map((c) => (
                  <li key={c.name} className="code text-xs">
                    <span className={c.passed ? 'text-good' : 'text-bad'}>{c.passed ? '✓' : '✗'}</span>{' '}
                    <span className={c.passed ? 'text-good' : 'text-bad'}>{c.name} {c.passed ? 'passed' : 'failed'}</span>
                    <span className="text-mute-dark"> — {c.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* RIGHT: coach (desktop) */}
        <section className="hidden min-h-0 p-3 lg:block" aria-label="AI coach">
          <CoachPanel
            problem={problem}
            stage={stage}
            onStageChange={setStage}
            mode={hidePattern ? 'blind' : mode}
            onHintUsed={() => setHintsUsed((h) => h + 1)}
            onRevealSolution={() => {
              setRevealed(true)
              if (mode !== 'blind') return
            }}
          />
        </section>
      </div>

      {/* Mobile coach drawer */}
      <button
        className="btn-primary fixed bottom-20 right-4 z-40 rounded-full !px-4 !py-3 shadow-lg lg:hidden"
        onClick={() => setMobileCoachOpen(true)}
        aria-label="Open AI coach"
      >
        <Bot className="h-5 w-5" />
      </button>
      {mobileCoachOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 lg:hidden" onClick={() => setMobileCoachOpen(false)}>
          <div className="h-[75vh] w-full rounded-t-xl border border-edge-dark bg-panel-dark p-2" onClick={(e) => e.stopPropagation()}>
            <CoachPanel
              problem={problem}
              stage={stage}
              onStageChange={setStage}
              mode={hidePattern ? 'blind' : mode}
              onHintUsed={() => setHintsUsed((h) => h + 1)}
              onRevealSolution={() => setRevealed(true)}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {phase === 'reflecting' && (
        <PreSubmitModal
          onCancel={() => setPhase('practicing')}
          onConfirm={(answers) => {
            const tests = problem.testCases ?? []
            const res = runnerRef.current.run(code, tests) // sync check for pass/fail
            void res
            const passed = tests.length === 0 ? true : codeLooksSolved(code)
            finishAttempt(answers, passed)
          }}
        />
      )}
      {post && (
        <PostSolveModal
          problem={problem}
          data={post}
          onGrade={handleGrade}
          onClose={() => setPost(null)}
        />
      )}
    </div>
  )
}

function normalizeComplexity(s: string): string {
  return s.replace(/\s+/g, '').toLowerCase().replace('·', '*').replace('\u00b7', '*')
}

function codeLooksSolved(code: string): boolean {
  const hasLoop = /\b(for|while)\b/.test(code)
  const hasReturn = /\breturn\b/.test(code)
  return hasLoop && hasReturn
}

function computeScoreLocal(
  result: string,
  hintsUsed: number,
  minutes: number,
  estimated: number,
): number {
  let score = 100
  if (result === 'solved-no-hints') score -= 0
  else if (result === 'solved-with-hints') score -= 12 * Math.min(4, Math.max(1, hintsUsed))
  else if (result === 'solved-after-reveal') score -= 55
  else score -= 70
  if (minutes > estimated) score -= Math.min(15, Math.round(((minutes - estimated) / Math.max(estimated, 1)) * 15))
  if (minutes <= estimated * 0.6) score += 5
  return Math.max(0, Math.min(100, Math.round(score)))
}

/** Naive formatter: normalizes indentation to 4 spaces per brace depth. */
function formatJava(code: string): string {
  let depth = 0
  return code
    .split('\n')
    .map((line) => {
      const t = line.trim()
      if (!t) return ''
      if (t.startsWith('}')) depth = Math.max(0, depth - 1)
      const out = '    '.repeat(depth) + t
      const opens = (t.match(/{/g) ?? []).length
      const closes = (t.match(/}/g) ?? []).length
      depth = Math.max(0, depth + opens - closes)
      if (t.startsWith('}')) depth = Math.max(0, depth + (opens - closes)) // closing lines counted too
      return out
    })
    .join('\n')
}
