import React from 'react'

interface State {
  error: Error | null
}

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[PatternPilot] Render error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="card max-w-md p-6">
            <h1 className="mb-2 text-lg font-semibold">Something went wrong</h1>
            <p className="mb-4 text-sm text-mute-dark">
              An unexpected error occurred. Your saved progress is safe. Try reloading; if the problem
              persists, you can reset the app from Settings.
            </p>
            <pre className="code mb-4 max-h-40 overflow-auto rounded bg-black/30 p-3 text-xs text-bad">
              {this.state.error.message}
            </pre>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={() => window.location.reload()}>
                Reload
              </button>
              <button className="btn-ghost" onClick={() => (window.location.hash = '#/settings')}>
                Open Settings
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
