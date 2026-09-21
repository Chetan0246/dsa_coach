import { useNavigate } from 'react-router-dom'
import { Compass, BookOpen } from 'lucide-react'
import { useProgress } from '../state/progress'
import { PROBLEMS, TOTAL_PROBLEMS } from '../data'

export default function Onboarding() {
  const { updateSettings } = useProgress()
  const navigate = useNavigate()

  const start = () => {
    updateSettings({ onboardingDone: true })
    navigate(`/practice/${PROBLEMS[0].id}`)
  }

  const startFoundations = () => {
    updateSettings({ onboardingDone: true })
    navigate('/java-foundations')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="card w-full max-w-lg p-8 text-center">
        <img src="/favicon.svg" alt="" className="mx-auto h-14 w-14 rounded-xl" />
        <h1 className="mt-4 text-2xl font-bold">Welcome to PatternPilot</h1>
        <p className="mt-2 text-sm text-mute-dark">
          Train your pattern recognition. Not your memory.
        </p>

        <div className="mt-6 grid gap-3 text-left text-sm">
          <div className="rounded-md border border-edge-dark p-3">
            <div className="font-semibold">Step 0 — Java basics</div>
            <div className="text-mute-dark">
              New to Collections, toCharArray, or cleaning input? Do Java Foundations first — 10 short lessons and a quiz.
            </div>
          </div>
          <div className="rounded-md border border-edge-dark p-3">
            <div className="font-semibold">Your goal</div>
            <div className="text-mute-dark">{TOTAL_PROBLEMS} problems over 40–60 days, grouped into 18 pattern families.</div>
          </div>
          <div className="rounded-md border border-edge-dark p-3">
            <div className="font-semibold">Your language</div>
            <div className="text-mute-dark">Java — templates, toolkit, and coach guidance included.</div>
          </div>
          <div className="rounded-md border border-edge-dark p-3">
            <div className="font-semibold">Your method</div>
            <div className="text-mute-dark">
              Think → hint → pattern → optimize → implement. A coach that asks questions before giving answers.
            </div>
          </div>
        </div>

        <button className="btn-primary mt-6 w-full" onClick={startFoundations}>
          <BookOpen className="h-4 w-4" /> Start with Java Foundations
        </button>
        <button className="btn-ghost mt-2 w-full" onClick={start}>
          <Compass className="h-4 w-4" /> I know Java basics — start Problem 1: {PROBLEMS[0].title}
        </button>
        <button
          className="mt-3 text-xs text-mute-dark hover:text-accent"
          onClick={() => updateSettings({ onboardingDone: true })}
        >
          Skip to dashboard
        </button>
      </div>
    </div>
  )
}
