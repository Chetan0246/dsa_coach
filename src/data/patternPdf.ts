/** Assembles the printable Java DSA Patterns reference from the pattern library. */
import { PATTERNS } from './patterns'
import { PROBLEMS } from './index'

export function buildPatternPdfHtml(dark: boolean): string {
  const page = dark ? { bg: '#0b0f14', ink: '#e6edf3', mute: '#8b98a9', edge: '#1e2630', accent: '#0ea5b7', code: '#11161d' } : { bg: '#ffffff', ink: '#0f172a', mute: '#5b6779', edge: '#e2e8f0', accent: '#0b7f8e', code: '#f1f5f9' }

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const sections = PATTERNS.map((p, idx) => {
    const related = PROBLEMS.filter((pr) => pr.pattern === p.name).slice(0, 5)
    const signals = p.recognitionSignals.map((s) => `<li>${esc(s)}</li>`).join('')
    const traps = p.commonTraps.map((t) => `<li>${esc(t)}</li>`).join('')
    const probs = related.map((r) => esc(r.title)).join(' · ')
    return `
  <section class="pat">
    <h2><span class="num">${String(idx + 1).padStart(2, '0')}</span>${esc(p.name)}</h2>
    <p class="solves">${esc(p.whatItSolves)}</p>
    <div class="cols">
      <div>
        <h3>Recognition signals</h3>
        <ul>${signals}</ul>
        <h3>Common traps</h3>
        <ul class="traps">${traps}</ul>
        <p class="trigger">Mental trigger: “${esc(p.mentalTrigger)}”</p>
      </div>
      <div>
        <h3>Java template</h3>
        <pre>${esc(p.javaTemplate)}</pre>
      </div>
    </div>
    <p class="probs"><strong>Practice:</strong> ${probs}</p>
  </section>`
  }).join('\n')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>PatternPilot — Java DSA Patterns Reference</title>
<style>
  @page { margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font: 12px/1.45 'Segoe UI', system-ui, sans-serif; color: ${page.ink}; background: ${page.bg}; margin: 0; padding: 24px; max-width: 900px; margin-inline: auto; }
  header { text-align: center; border-bottom: 3px solid ${page.accent}; padding-bottom: 14px; margin-bottom: 18px; }
  header h1 { margin: 0; font-size: 26px; letter-spacing: 0.5px; }
  header .tag { color: ${page.mute}; margin-top: 4px; font-size: 13px; }
  header .meta { color: ${page.mute}; margin-top: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
  .pat { break-inside: avoid; page-break-inside: avoid; border: 1px solid ${page.edge}; border-radius: 8px; padding: 14px 16px; margin-bottom: 14px; background: ${page.bg}; }
  h2 { font-size: 16px; margin: 0 0 6px; display: flex; align-items: center; gap: 8px; }
  .num { color: ${page.accent}; font-family: ui-monospace, monospace; font-size: 12px; }
  .solves { margin: 0 0 10px; }
  .cols { display: grid; grid-template-columns: 1fr 1.1fr; gap: 14px; }
  @media print { .cols { grid-template-columns: 1fr 1.1fr; } }
  @media (max-width: 640px) { .cols { grid-template-columns: 1fr; } }
  h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: ${page.accent}; margin: 10px 0 4px; }
  ul { margin: 0; padding-left: 16px; }
  li { margin: 2px 0; }
  ul.traps li::marker { color: #d97706; }
  .trigger { margin: 10px 0 0; font-style: italic; color: ${page.mute}; }
  pre { background: ${page.code}; border: 1px solid ${page.edge}; border-radius: 6px; padding: 10px; font: 10.5px/1.5 ui-monospace, 'Cascadia Code', Consolas, monospace; overflow-x: auto; margin: 0; white-space: pre-wrap; }
  .probs { margin: 10px 0 0; font-size: 11px; color: ${page.mute}; }
  .probs a { color: ${page.accent}; text-decoration: none; }
  .probs a:hover { text-decoration: underline; }
  footer { text-align: center; color: ${page.mute}; font-size: 10px; margin-top: 18px; padding-top: 10px; border-top: 1px solid ${page.edge}; }
  @media print { footer { position: fixed; bottom: 0; } }
</style>
</head>
<body>
  <header>
    <h1>PatternPilot — Java DSA Patterns</h1>
    <div class="tag">Train your pattern recognition. Not your memory.</div>
    <div class="meta">${PATTERNS.length} patterns · recognition signals · Java templates · traps · practice set</div>
  </header>
  ${sections}
  <footer>PatternPilot · generated ${new Date().toLocaleDateString()} · print via Ctrl/Cmd+P → “Save as PDF”</footer>
</body>
</html>`
}
