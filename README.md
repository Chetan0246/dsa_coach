# PatternPilot

**Train your pattern recognition. Not your memory.**

A lightweight, local-first AI DSA coach for Java OA preparation. 150 problems across 18 pattern
families, a six-stage Socratic coach, progressive hints, pattern drills, spaced-repetition review,
and full progress tracking — all in your browser, no backend, no login.

## Run

```bash
npm install
npm run dev        # http://localhost:5175
npm run build      # production build in dist/
npm run typecheck
npx esbuild scripts/validate.ts --bundle --platform=node --format=cjs --outfile=/tmp/v.cjs && node /tmp/v.cjs   # dataset validation
```

## What's inside

- **Dashboard** — today's focus, progress cards, learning metrics, current phase, recent activity
- **Roadmap** — the 150-problem curriculum grouped into 18 phases (first 30 fully detailed with
  solutions, tests, and Java templates)
- **Practice workspace** — problem | Java editor | AI coach (3-column desktop, drawer on mobile)
- **Six-stage coach** — Understand → Intuition → Brute Force → Bottleneck → Pattern → Optimize
- **Progressive hints** — 4 levels, tracked; reveal-solution gated behind them
- **Submission flow** — self-identified pattern + complexity before grading; pattern-transfer
  debrief with related problems and confidence rating after
- **Pattern library** — 22 patterns with signals, mental triggers, Java templates, traps
- **Pattern Drill** — name-the-pattern quiz that logs recognition mistakes
- **Review** — spaced repetition (1/2/4/7/14-day intervals)
- **Mistake log, Notes, Analytics, OA Mode, Java Toolkit** — supporting cast
- **Ctrl/Cmd+K** command palette, dark/light/system theme, export/import/reset in Settings

## Architecture

```
src/
  data/          # problems (150), patterns (22), coach stages, toolkit
  lib/
    ai/          # AIProvider abstraction + MockAIProvider (local demo coach)
    runner/      # CodeRunner abstraction + MockCodeRunner
    storage.ts   # localStorage persistence, schema-validated import/export
    utils.ts
  state/         # ProgressProvider (reducer + persistence + scoring)
  components/    # layout, practice, common UI
  pages/         # Dashboard, Roadmap, PracticeWorkspace, Patterns, Drill, Review, ...
```

Everything is client-side. The AI coach and code runner are deterministic mocks behind clean
interfaces (`AIProvider`, `CodeRunner`) so a real API or sandbox can be plugged in later — see
`.env.example` for the reserved variables. No keys are ever hard-coded.
