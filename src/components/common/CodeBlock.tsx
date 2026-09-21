import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="relative rounded-lg border border-edge-dark bg-black/30">
      {label && (
        <div className="border-b border-edge-dark px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-mute-dark">
          {label}
        </div>
      )}
      <button
        onClick={copy}
        className="absolute right-2 top-2 rounded p-1.5 text-mute-dark hover:bg-edge-dark/40 hover:text-ink-dark"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-good" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre className="code overflow-x-auto p-3 leading-relaxed">{code}</pre>
    </div>
  )
}
