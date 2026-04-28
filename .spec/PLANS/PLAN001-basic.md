# Visual Aids Site — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Vite-based multi-page React site hosted on GitHub Pages, with auto-discovery of visual aids, rich metadata via named exports, and a three-layer CI pipeline (convention validation → build integrity → Playwright smoke tests).

**Architecture:** A Vite plugin inside `vite.config.js` scans `src/[0-9]{8}-*/` at config time, writes per-aid HTML shells into a gitignored `generated/` folder, and registers them as Rollup entry points. The index page (`src/index.jsx`) uses `import.meta.glob` to discover all aids and their `meta` exports at bundle time — no generated JSON file. Playwright smoke-tests the built `dist/` against a local static server.

**Tech Stack:** Vite 5, React 18, Tailwind CSS (via CDN or PostCSS — match the existing component style), Vitest (convention validation), Playwright (smoke tests), `peaceiris/actions-gh-pages` (deploy), Node 20.

**Repo:** `git@github.com:hkfosschat/visual-aids.git` — GitHub Pages base path is `/visual-aids/`.

---

### Task 1: Project scaffolding — `package.json` and core dependencies

**Files:**
- Create: `package.json`
- Create: `.gitignore`

**Step 1: Create `package.json`**

```json
{
  "name": "hkfosschat-visual-aids",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "validate": "node scripts/validate-aids.js",
    "test": "npm run validate && vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "lucide-react": "^0.378.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.2.0",
    "vitest": "^1.6.0"
  }
}
```

**Step 2: Create `.gitignore`**

```
node_modules/
dist/
generated/
```

**Step 3: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, no errors.

**Step 4: Commit**

```bash
git add package.json .gitignore
git commit -m "chore: add package.json and gitignore"
```

---

### Task 2: Vite config with multi-page plugin

**Files:**
- Create: `vite.config.js`

**Step 1: Write `vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const REPO_NAME = 'visual-aids';
const SRC_DIR = path.resolve(__dirname, 'src');
const GEN_DIR = path.resolve(__dirname, 'generated');

function discoverAids() {
  if (!fs.existsSync(SRC_DIR)) return [];
  return fs.readdirSync(SRC_DIR)
    .filter(name => /^\d{8}-/.test(name))
    .filter(name => {
      const hasJsx = fs.existsSync(path.join(SRC_DIR, name, 'index.jsx'));
      const hasJs  = fs.existsSync(path.join(SRC_DIR, name, 'index.js'));
      return hasJsx || hasJs;
    })
    .sort()
    .reverse(); // newest first
}

function slugToMeta(slug) {
  const date = `${slug.slice(0,4)}-${slug.slice(4,6)}-${slug.slice(6,8)}`;
  const titleSlug = slug.slice(9); // after YYYYMMDD-
  const title = titleSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return { date, title };
}

function generateHtmlShell(slug) {
  const entryExt = fs.existsSync(path.join(SRC_DIR, slug, 'index.jsx')) ? 'jsx' : 'js';
  const { title } = slugToMeta(slug);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import React from '../../src/${slug}/index.${entryExt}';
      // handled by Vite transform — entry is the module below
    </script>
  </body>
</html>
`;
}

// NOTE: the HTML shell only needs to reference the entry script.
// Vite resolves the import via its plugin pipeline.
function generateHtmlShellCorrect(slug) {
  const entryExt = fs.existsSync(path.join(SRC_DIR, slug, 'index.jsx')) ? 'jsx' : 'js';
  const { title } = slugToMeta(slug);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/${slug}/index.${entryExt}"></script>
  </body>
</html>
`;
}

function multiPagePlugin() {
  return {
    name: 'visual-aids-multi-page',
    config() {
      const aids = discoverAids();

      // Write generated HTML shells
      if (!fs.existsSync(GEN_DIR)) fs.mkdirSync(GEN_DIR);
      for (const slug of aids) {
        const dir = path.join(GEN_DIR, slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        fs.writeFileSync(path.join(dir, 'index.html'), generateHtmlShellCorrect(slug));
      }

      // Build Rollup input map
      const input = { main: path.resolve(__dirname, 'index.html') };
      for (const slug of aids) {
        input[slug] = path.resolve(GEN_DIR, slug, 'index.html');
      }

      return {
        base: `/${REPO_NAME}/`,
        build: {
          rollupOptions: { input },
        },
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), multiPagePlugin()],
});
```

**Step 2: Verify Vite resolves config without errors**

Run: `npx vite build --mode development 2>&1 | head -20`

> Note: this will fail (no `index.html` yet) but should NOT throw a JS config parse error. Expected: error about missing entry, not a syntax error.

**Step 3: Commit**

```bash
git add vite.config.js
git commit -m "feat: add Vite multi-page plugin for auto-discovery of aids"
```

---

### Task 3: Root `index.html` and `src/index.jsx`

**Files:**
- Create: `index.html`
- Create: `src/index.jsx`

**Step 1: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Visual Aids</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

**Step 2: Create `src/index.jsx`**

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';

// Discover all aid modules at build time.
// Key shape: './20260427-c-string/index.jsx'
const aidModules = import.meta.glob('./**/index.jsx', { eager: true });

function slugToMeta(slug) {
  const date = `${slug.slice(0,4)}-${slug.slice(4,6)}-${slug.slice(6,8)}`;
  const titleSlug = slug.slice(9);
  const fallbackTitle = titleSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return { date, fallbackTitle };
}

const aids = Object.entries(aidModules)
  .map(([key, mod]) => {
    // key: './20260427-c-string/index.jsx'
    const slug = key.replace(/^\.\//, '').replace(/\/index\.[jt]sx?$/, '');
    if (!/^\d{8}-/.test(slug)) return null; // skip index.jsx itself if matched
    const { date, fallbackTitle } = slugToMeta(slug);
    return {
      slug,
      date,
      title: mod.meta?.title ?? fallbackTitle,
      description: mod.meta?.description ?? '',
      tags: mod.meta?.tags ?? [],
    };
  })
  .filter(Boolean)
  .sort((a, b) => b.date.localeCompare(a.date));

const BASE = import.meta.env.BASE_URL; // e.g. /visual-aids/

function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Visual Aids</h1>
        <p className="text-slate-500 mb-8">Interactive learning aids for FOSS Chat.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {aids.map(aid => (
            <a
              key={aid.slug}
              href={`${BASE}${aid.slug}/`}
              className="block bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-xs text-slate-400 font-mono mb-1">{aid.date}</p>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">{aid.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">{aid.description}</p>
              {aid.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {aid.tags.map(tag => (
                    <span key={tag} className="text-[11px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
```

**Step 3: Run dev server to verify index page loads**

Run: `npx vite --port 5173 &` then open `http://localhost:5173/visual-aids/` in a browser (or `curl -s http://localhost:5173/visual-aids/ | head -5`). Expected: HTML with `<title>Visual Aids</title>`.

Stop dev server: `kill %1`

**Step 4: Commit**

```bash
git add index.html src/index.jsx
git commit -m "feat: add root index page with auto-discovered aid cards"
```

---

### Task 4: Migrate existing aid to `index.jsx` with `meta` export

**Files:**
- Rename: `src/20260427-c-string/index.js` → `src/20260427-c-string/index.jsx`
- Modify: `src/20260427-c-string/index.jsx` (add `meta` export)

**Step 1: Rename the file**

```bash
git mv src/20260427-c-string/index.js src/20260427-c-string/index.jsx
```

**Step 2: Add `meta` export at the top of `src/20260427-c-string/index.jsx`**

Insert before the `import React` line:

```js
export const meta = {
  title: 'C String Memory Visualizer',
  description: 'Visualize how strcpy, strncpy, and memcpy handle null-terminated strings in C — and why buffer overflows happen.',
  tags: ['c', 'memory', 'security', 'strings'],
};
```

**Step 3: Verify dev server shows the aid card on index**

Run: `npx vite --port 5173 &` and check `http://localhost:5173/visual-aids/`. Expected: one card with title "C String Memory Visualizer".

Stop dev server: `kill %1`

**Step 4: Commit**

```bash
git add src/20260427-c-string/
git commit -m "feat: migrate c-string aid to index.jsx with meta export"
```

---

### Task 5: Convention validation script

**Files:**
- Create: `scripts/validate-aids.js`

**Step 1: Create `scripts/validate-aids.js`**

```js
#!/usr/bin/env node
/**
 * Validates that every src/<YYYYMMDD>-<slug>/index.jsx:
 *   1. Matches the folder name pattern
 *   2. Contains a `export const meta` with title and description
 *   3. Contains a `export default` (component)
 *
 * Uses static text scanning (no bundling) — fast and dependency-free.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../src');

const errors = [];
const slugPattern = /^\d{8}-/;

const entries = fs.readdirSync(SRC).filter(name => slugPattern.test(name));

if (entries.length === 0) {
  console.error('ERROR: No aid folders found in src/');
  process.exit(1);
}

for (const slug of entries) {
  const dir = path.join(SRC, slug);
  const stat = fs.statSync(dir);
  if (!stat.isDirectory()) continue;

  const jsxPath = path.join(dir, 'index.jsx');
  const jsPath  = path.join(dir, 'index.js');
  const filePath = fs.existsSync(jsxPath) ? jsxPath : fs.existsSync(jsPath) ? jsPath : null;

  if (!filePath) {
    errors.push(`${slug}: missing index.jsx (or index.js)`);
    continue;
  }

  const src = fs.readFileSync(filePath, 'utf8');

  if (!/export\s+const\s+meta\s*=/.test(src)) {
    errors.push(`${slug}: missing \`export const meta\``);
  } else {
    if (!/title\s*:/.test(src)) errors.push(`${slug}: meta missing 'title'`);
    if (!/description\s*:/.test(src)) errors.push(`${slug}: meta missing 'description'`);
  }

  if (!/export\s+default/.test(src)) {
    errors.push(`${slug}: missing default export (React component)`);
  }
}

if (errors.length > 0) {
  console.error('Convention validation FAILED:\n' + errors.map(e => `  ✗ ${e}`).join('\n'));
  process.exit(1);
}

console.log(`Convention validation passed (${entries.length} aid(s) checked).`);
```

**Step 2: Run validator — expect pass**

Run: `node scripts/validate-aids.js`
Expected output: `Convention validation passed (1 aid(s) checked).`

**Step 3: Verify it fails correctly — temporarily remove meta**

Temporarily comment out `export const meta` in `src/20260427-c-string/index.jsx`, run `node scripts/validate-aids.js`, expect:

```
Convention validation FAILED:
  ✗ 20260427-c-string: missing `export const meta`
```

Restore the line.

**Step 4: Commit**

```bash
git add scripts/validate-aids.js
git commit -m "feat: add convention validation script for aid meta exports"
```

---

### Task 6: Full build verification

**Step 1: Run build**

Run: `npm run build`
Expected: exits 0, `dist/` directory created.

**Step 2: Assert expected output files exist**

Run:
```bash
ls dist/index.html && \
ls dist/20260427-c-string/index.html && \
echo "Build output OK"
```
Expected: `Build output OK`

**Step 3: Preview built site**

Run: `npx vite preview --port 4173 &`

Check `curl -s http://localhost:4173/visual-aids/ | grep -c 'C String'` — expected: `1` or more.
Check `curl -s http://localhost:4173/visual-aids/20260427-c-string/ | grep -c 'root'` — expected: `1`.

Stop: `kill %1`

**Step 4: Commit (if any fixup needed)**

```bash
git add -A && git commit -m "fix: build output verified"
```

---

### Task 7: Playwright smoke tests

**Files:**
- Create: `playwright.config.js`
- Create: `tests/smoke.spec.js`

**Step 1: Install Playwright Chromium**

Run: `npx playwright install chromium --with-deps`
Expected: Chromium downloaded.

**Step 2: Create `playwright.config.js`**

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'npx vite preview --port 4173',
    url: 'http://localhost:4173/visual-aids/',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
```

**Step 3: Create `tests/smoke.spec.js`**

```js
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = '/visual-aids';

// Discover slugs from dist/ at test time
const distDir = path.resolve(process.cwd(), 'dist');
const slugs = fs.readdirSync(distDir).filter(name => /^\d{8}-/.test(name));

test('index page loads and shows at least one aid card', async ({ page }) => {
  await page.goto(`${BASE}/`);
  await expect(page).not.toHaveTitle('');
  const cards = page.locator('a[href*="' + BASE + '"]');
  await expect(cards).toHaveCount(slugs.length);
});

for (const slug of slugs) {
  test(`aid page loads without JS errors: ${slug}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(`${BASE}/${slug}/`);
    // Wait for React to mount
    await page.waitForSelector('#root > *', { timeout: 5000 });
    expect(errors).toHaveLength(0);
  });
}
```

**Step 4: Run smoke tests — expect pass**

Run: `npm run build && npx playwright test`
Expected: all tests pass (1 index test + 1 per aid).

**Step 5: Verify a broken aid fails the test**

Temporarily break `src/20260427-c-string/index.jsx` (e.g. add `throw new Error('test')` inside the component). Run `npm run build && npx playwright test`. Expected: the smoke test for that aid fails with a pageerror. Restore the file.

**Step 6: Commit**

```bash
git add playwright.config.js tests/smoke.spec.js
git commit -m "feat: add Playwright smoke tests for index and all aid pages"
```

---

### Task 8: GitHub Actions CI/CD workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Build, Test & Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Validate aid conventions
        run: node scripts/validate-aids.js

      - name: Build
        run: npm run build

      - name: Assert build output
        run: |
          test -f dist/index.html || (echo "MISSING dist/index.html" && exit 1)
          for dir in dist/[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]-*/; do
            test -f "${dir}index.html" || (echo "MISSING ${dir}index.html" && exit 1)
          done
          echo "Build output OK"

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps

      - name: Run smoke tests
        run: npx playwright test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add CI/CD workflow — validate, build, smoke test, deploy"
```

**Step 3: Push to main and verify Actions run**

Run: `git push origin main`

Go to `https://github.com/hkfosschat/visual-aids/actions` — expected: workflow runs, all steps green, `gh-pages` branch updated.

---

### Task 9: Enable GitHub Pages

> This is a one-time manual step in the GitHub UI.

1. Go to `https://github.com/hkfosschat/visual-aids/settings/pages`
2. Under **Source**, select **Deploy from a branch**
3. Branch: `gh-pages`, folder: `/ (root)`
4. Save

Expected: site live at `https://hkfosschat.github.io/visual-aids/` within ~1 minute.

---

## Test Plan Summary

| Layer | Tool | When | What it checks |
|-------|------|------|----------------|
| Convention | `scripts/validate-aids.js` (Node) | Every CI run (PR + push) | Each aid has `export const meta` with `title` + `description`, and a default export |
| Build integrity | Bash assertions in CI | Every CI run | `dist/index.html` and `dist/<slug>/index.html` exist for every discovered aid |
| Smoke | Playwright (headless Chromium) | Every CI run | Index page renders N cards; each aid page mounts without JS errors |
| Unit (optional) | Vitest | When added per-aid | Component-level behaviour for complex aids |

Deploy only runs after all test layers pass, and only on push to `main` (not on PRs).
