import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Code2,
  Shapes,
  Repeat,
  NotebookPen,
  Wrench,
  Settings as SettingsIcon,
  BarChart3,
  Timer,
  CircleAlert,
  GraduationCap,
} from 'lucide-react'
import { useProgress } from '../../state/progress'
import { classNames } from '../../lib/utils'

const MAIN = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/practice', label: 'Practice', icon: Code2, end: true },
  { to: '/patterns', label: 'Patterns', icon: Shapes },
  { to: '/review', label: 'Review', icon: Repeat },
  { to: '/notes', label: 'Notes', icon: NotebookPen },
]

const TOOLS = [
  { to: '/java-foundations', label: 'Java Foundations', icon: GraduationCap },
  { to: '/drill', label: 'Pattern Drill', icon: CircleAlert },
  { to: '/mistakes', label: 'Mistake Log', icon: CircleAlert },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/oa-mode', label: 'OA Mode', icon: Timer },
  { to: '/java-toolkit', label: 'Java Toolkit', icon: Wrench },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Sidebar() {
  const { progress } = useProgress()
  const dueCount = progress.reviewQueue.filter((r) => r.dueAt <= Date.now()).length

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-edge-dark bg-panel-dark px-3 py-4 lg:flex dark:border-edge-dark">
      <div className="mb-6 flex items-center gap-2 px-2">
        <img src="/favicon.svg" alt="" className="h-8 w-8 rounded-md" />
        <div>
          <div className="text-sm font-bold tracking-tight">PatternPilot</div>
          <div className="text-[11px] text-mute-dark">Train the pattern. Solve the problem.</div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5">
        {MAIN.map((item) => (
          <SidebarLink key={item.to} {...item} badge={item.to === '/review' ? dueCount : undefined} />
        ))}
        <div className="my-3 border-t border-edge-dark" />
        {TOOLS.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </nav>

      <div className="mt-4 rounded-lg border border-edge-dark bg-edge-dark/30 p-3">
        <div className="text-[11px] uppercase tracking-wide text-mute-dark">AI Provider</div>
        <div className="mt-0.5 text-sm font-medium">Local Demo</div>
        <div className="mt-1 text-[11px] text-mute-dark">All data stays in your browser.</div>
      </div>
    </aside>
  )
}

function SidebarLink({
  to,
  label,
  icon: Icon,
  end,
  badge,
}: {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  end?: boolean
  badge?: number
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        classNames(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-accent-soft text-accent'
            : 'text-mute-dark hover:bg-edge-dark/40 hover:text-ink-dark',
        )
      }
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="rounded-full bg-bad-soft px-2 py-0.5 text-[11px] font-semibold text-bad">{badge}</span>
      )}
    </NavLink>
  )
}
