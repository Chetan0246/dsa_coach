import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Download } from 'lucide-react'
import { buildPatternPdfHtml } from '../data/patternPdf'
import { PATTERNS } from '../data/patterns'
import { useProgress } from '../state/progress'

export default function PatternReferencePdf() {
  const navigate = useNavigate()
  const { settings } = useProgress()
  // The reference follows your theme; print output stays light unless you print in dark.
  const dark = settings.theme === 'dark' || (settings.theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const html = useMemo(() => buildPatternPdfHtml(dark), [dark])

  const download = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'patternpilot-java-dsa-patterns.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
        <button className="btn-ghost text-sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-sm text-mute-dark">
          Java DSA Patterns reference — all {PATTERNS.length} patterns with signals, templates and traps.
        </span>
        <div className="ml-auto flex gap-2">
          <button className="btn-ghost text-sm" onClick={download}>
            <Download className="h-4 w-4" /> Download HTML
          </button>
          <button className="btn-primary text-sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Save as PDF
          </button>
        </div>
      </div>
      <div className="card overflow-hidden">
        <iframe
          title="Java DSA Patterns reference"
          srcDoc={html}
          className="h-[75vh] w-full border-0 bg-white"
        />
      </div>
      <p className="mt-3 text-center text-xs text-mute-dark print:hidden">
        Tip: “Save as PDF” opens your browser's print dialog — choose “Save as PDF” as the destination.
        The file is also downloadable as standalone HTML.
      </p>
    </div>
  )
}
