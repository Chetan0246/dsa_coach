import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import MobileNav from './components/layout/MobileNav'
import CommandPalette from './components/layout/CommandPalette'
import ErrorBoundary from './components/common/ErrorBoundary'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import PracticeWorkspace from './pages/PracticeWorkspace'
import PatternsLibrary from './pages/PatternsLibrary'
import PatternDrill from './pages/PatternDrill'
import Review from './pages/Review'
import Mistakes from './pages/Mistakes'
import Notes from './pages/Notes'
import JavaToolkit from './pages/JavaToolkit'
import JavaFoundations from './pages/JavaFoundations'
import PatternReferencePdf from './pages/PatternReferencePdf'
import Analytics from './pages/Analytics'
import OAMode from './pages/OAMode'
import SettingsPage from './pages/SettingsPage'
import NotFound from './pages/NotFound'
import Onboarding from './pages/Onboarding'
import { useProgress } from './state/progress'
import { PROBLEMS } from './data'

function PracticeRedirect() {
  const { progress } = useProgress()
  const location = useLocation()
  const solved = new Set(progress.solvedProblems)
  const nextProb = PROBLEMS.find((p) => !solved.has(p.id)) ?? PROBLEMS[0]
  return <Navigate to={`/practice/${nextProb.id}${location.search}`} replace />
}

export default function App() {
  const { settings } = useProgress()
  const location = useLocation()
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const isWorkspace = location.pathname.startsWith('/practice/')

  if (!settings.onboardingDone) {
    return (
      <ErrorBoundary>
        <Onboarding />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen">
        <Sidebar />
        <MobileNav />
        <div className="flex min-h-screen w-full flex-col lg:pl-60">
          <main className="flex-1 pb-16 lg:pb-0">{/* pb for mobile bottom nav */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/practice" element={<PracticeRedirect />} />
              <Route path="/practice/:problemId" element={<PracticeWorkspace />} />
              <Route path="/patterns" element={<PatternsLibrary />} />
              <Route path="/drill" element={<PatternDrill />} />
              <Route path="/review" element={<Review />} />
              <Route path="/mistakes" element={<Mistakes />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/java-toolkit" element={<JavaToolkit />} />
              <Route path="/java-foundations" element={<JavaFoundations />} />
              <Route path="/patterns-pdf" element={<PatternReferencePdf />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/oa-mode" element={<OAMode />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        {isWorkspace && <MobileCoachToggle />}
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </div>
    </ErrorBoundary>
  )
}

function MobileCoachToggle() {
  // The workspace renders its own mobile drawer; this is a no-op spacer for the router.
  return null
}
