import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { ProgressProvider } from './state/progress'
import './styles/index.css'

// Lightweight global error guard: an app crash must never blank the screen silently.
window.addEventListener('error', (e) => {
  console.error('[PatternPilot] Uncaught error:', e.error ?? e.message)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </HashRouter>
  </React.StrictMode>,
)
