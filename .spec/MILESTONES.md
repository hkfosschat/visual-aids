# Visual Aids Site — Milestones

Milestones map the 9 tasks in `PLAN.md` to shippable checkpoints. Each milestone ends with a working, verifiable state.

---

## M1 — Project Foundation

**Goal:** Repo is a valid Node/Vite project. `npm install` works. Vite can parse its config.

**Tasks:** 1, 2

**Deliverables:**
- `package.json` with all dependencies declared
- `.gitignore` excluding `node_modules/`, `dist/`, `generated/`
- `vite.config.js` with the multi-page plugin (scans `src/`, writes `generated/`, builds Rollup input map)

**Definition of done:**
- `npm install` exits 0
- `npx vite build` fails only because `index.html` is missing — not due to a config error
- `generated/<slug>/index.html` is written when the plugin runs

---

## M2 — Working Site (Local)

**Goal:** Full site runs locally in both dev and preview modes. The existing aid is migrated and visible on the index.

**Tasks:** 3, 4

**Deliverables:**
- `index.html` — root HTML shell
- `src/index.jsx` — index page using `import.meta.glob` to auto-discover aids
- `src/20260427-c-string/index.jsx` — renamed from `.js`, with `meta` export added

**Definition of done:**
- `npm run dev` serves the index page at `http://localhost:5173/visual-aids/`
- Index page shows one card: "C String Memory Visualizer"
- Clicking the card navigates to the aid at `/visual-aids/20260427-c-string/`
- `npm run build` exits 0
- `npx vite preview` serves the built site correctly

---

## M3 — Quality Gates

**Goal:** Three automated test layers are in place and all pass against the current codebase.

**Tasks:** 5, 6, 7

**Deliverables:**
- `scripts/validate-aids.js` — convention validator (static scan, no bundler)
- Build integrity assertions (shell `test -f` checks on `dist/`)
- `playwright.config.js` + `tests/smoke.spec.js` — headless smoke tests

**Definition of done:**
- `node scripts/validate-aids.js` exits 0 and reports 1 aid checked
- `npm run build` + `dist/` assertions pass
- `npx playwright test` exits 0: index page test + 1 per-aid smoke test
- Deliberately breaking the aid (e.g. remove `meta`, add a thrown error) causes the relevant layer to fail

---

## M4 — CI/CD & Live

**Goal:** Every push to `main` automatically validates, builds, tests, and deploys. Site is publicly accessible on GitHub Pages.

**Tasks:** 8, 9

**Deliverables:**
- `.github/workflows/deploy.yml` — validate → build → assert → smoke → deploy
- GitHub Pages configured to serve from `gh-pages` branch (one-time manual step)

**Definition of done:**
- Pushing to `main` triggers the workflow; all jobs green
- PRs run the test job but do not deploy
- Site is live at `https://hkfosschat.github.io/visual-aids/`
- Index page and aid page both render correctly in a real browser

---

## Milestone Map

```
M1 Foundation          M2 Working Site        M3 Quality Gates       M4 Live
──────────────────     ──────────────────     ──────────────────     ──────────────────
Task 1: package.json   Task 3: index page     Task 5: validator      Task 8: GH Actions
Task 2: vite config    Task 4: aid migration  Task 6: build check    Task 9: GH Pages
                                              Task 7: Playwright
```

Each milestone is independently committable and reviewable. M3 can be started as soon as M2's build passes — Playwright requires `dist/` to exist.
