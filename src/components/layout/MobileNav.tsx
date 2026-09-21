import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, Code2, Shapes, Repeat } from 'lucide-react'
import { classNames } from '../../lib/utils'

const ITEMS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/practice', label: 'Practice', icon: Code2, end: true },
  { to: '/patterns', label: 'Patterns', icon: Shapes },
  { to: '/review', label: 'Review', icon: Repeat },
]

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-edge-dark bg-panel-dark/95 backdrop-blur lg:hidden">
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            classNames(
              'flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium',
              isActive ? 'text-accent' : 'text-mute-dark',
            )
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
