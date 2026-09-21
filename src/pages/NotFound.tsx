import { Link } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <EmptyState
        title="Page not found"
        message="That route does not exist. The roadmap and your dashboard are one click away."
        action={
          <div className="flex gap-2">
            <Link to="/" className="btn-primary">Dashboard</Link>
            <Link to="/roadmap" className="btn-ghost">Roadmap</Link>
          </div>
        }
      />
    </div>
  )
}
