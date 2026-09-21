import { Inbox } from 'lucide-react'

export default function EmptyState({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: React.ReactNode
}) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 rounded-full bg-edge-dark/40 p-3">
        <Inbox className="h-6 w-6 text-mute-dark" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-mute-dark">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
