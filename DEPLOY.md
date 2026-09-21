# Deploy PatternPilot to Vercel via GitHub

The app is a static Vite build — it deploys to Vercel with zero configuration.

## 1. Push this project to your GitHub repo

Run these commands in the project folder (`dsa_coach` repo = this folder):

```bash
git init
git add .
git commit -m "PatternPilot: pattern-first DSA coach for Java"
git branch -M main
git remote add origin https://github.com/Chetan0246/dsa_coach.git
git push -u origin main
```

If the repo on GitHub already has content (e.g. a README created on github.com), force the first
push with:

```bash
git push -u origin main --force
```

(You may be asked to log in — a browser window or Personal Access Token. A PAT needs the `repo` scope.)

## 2. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Click **Import Git Repository** and pick `Chetan0246/dsa_coach`.
3. Vercel auto-detects **Vite**. Verify the settings (they should be prefilled):
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Leave **Environment Variables** empty — PatternPilot needs none (it is fully client-side; the
   AI coach and code runner are local mocks). The names are only placeholders for a future
   integration: `VITE_AI_PROVIDER`, `VITE_AI_API_KEY`, `VITE_AI_BASE_URL`, `VITE_AI_MODEL`.
5. Click **Deploy**. ~30 seconds later you get a URL like
   `https://dsa-coach.vercel.app`.

## 3. Every push deploys automatically

From now on, each `git push` to `main` triggers a fresh production deployment; pull requests get
their own preview URLs. Nothing else to configure.

## Notes

- **Routing:** the app uses hash routing (`#/roadmap`, `#/practice/two-sum`, …), so deep links
  work on Vercel with no rewrite rules needed.
- **SPA rewrites (optional):** not required today. If routing is ever switched from hash to
  history mode, add a `vercel.json` with:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- **Local data:** all progress lives in each visitor's browser localStorage; there is no server
  and no database, so nothing to provision.
