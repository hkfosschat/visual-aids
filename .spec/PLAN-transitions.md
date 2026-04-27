# View Transitions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add CSS View Transition API animations to the MPA — directional slides between depth levels, header cross-fade, and a ghost/skeleton frame when navigating across multiple levels (e.g. index → sub-aid).

**Architecture:** CSS-only `@view-transition { navigation: auto }` provides automatic cross-fades in Chrome 126+ (other browsers get instant navigation — progressive enhancement). A small inline JS snippet using the Navigation API detects depth change before each navigation and writes the direction to `sessionStorage`; a `pagereveal` listener on the new page reads it and sets `data-nav` on the new `<html>` so CSS directional slide rules match. For multi-level skips (|depth delta| > 1), the same snippet intercepts the navigation and briefly injects a skeleton DOM representing the skipped level before completing.

> **Bug fix (post-implementation):** The original plan set `data-nav` on the old page's `<html>` inside the `navigate` listener. MPA View Transition pseudo-elements are evaluated in the **new** document's context, so the attribute was invisible to them and only the default cross-fade fired. Fix: persist to `sessionStorage` on the old page; restore via `pagereveal` on the new page.

**Tech Stack:** CSS View Transitions API, Navigation API, Tailwind (CDN — inline CSS for critical animation rules), Playwright for smoke tests.

---

## Key constraints

- **Never modify** any `src/<slug>/index.jsx` files (aid source code).
- **Aid `index.jsx` files must never be modified.** Repeat: do not touch them.
- GitHub Pages base: `/visual-aids/`
- URL depth:
  - `/visual-aids/` → depth 1 (index)
  - `/visual-aids/<slug>/` → depth 2 (aid)
  - `/visual-aids/<slug>/<sub>/` → depth 3 (sub-aid, not yet built but architecture must support it)
- All changes are progressive enhancement — broken/missing JS must not break navigation.

---

### Task 1: Create `src/transitions.css`

This file is the single source of truth for all transition CSS. It is linked from both `index.html` and every generated HTML shell.

**Files:**
- Create: `src/transitions.css`

**Step 1: Write the file**

```css
/* src/transitions.css */

/* Enable MPA View Transitions in supporting browsers (Chrome 126+). */
/* Other browsers get instant navigation — no JS or fallback needed. */
@view-transition {
  navigation: auto;
}

/* ─── Named transition layers ──────────────────────────────────────────── */

.site-header {
  view-transition-name: site-header;
}

.page-content {
  view-transition-name: page-content;
}

/* ─── Keyframes ─────────────────────────────────────────────────────────── */

@keyframes vt-slide-in-from-right {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

@keyframes vt-slide-out-to-left {
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(-100%); opacity: 0; }
}

@keyframes vt-slide-in-from-left {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

@keyframes vt-slide-out-to-right {
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
}

@keyframes vt-skeleton-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

/* ─── Forward navigation (going deeper: index → aid, aid → sub-aid) ─────── */

html[data-nav="forward"]::view-transition-old(page-content) {
  animation: vt-slide-out-to-left 0.28s ease-in-out;
}

html[data-nav="forward"]::view-transition-new(page-content) {
  animation: vt-slide-in-from-right 0.28s ease-in-out;
}

/* ─── Backward navigation (going shallower: aid → index, sub-aid → aid) ── */

html[data-nav="backward"]::view-transition-old(page-content) {
  animation: vt-slide-out-to-right 0.28s ease-in-out;
}

html[data-nav="backward"]::view-transition-new(page-content) {
  animation: vt-slide-in-from-left 0.28s ease-in-out;
}

/* ─── Header: always cross-fade (no slide) ──────────────────────────────── */

::view-transition-old(site-header),
::view-transition-new(site-header) {
  animation-duration: 0.18s;
  animation-timing-function: ease-in-out;
}

/* ─── Skeleton shimmer ──────────────────────────────────────────────────── */

.vt-skeleton-card {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: vt-skeleton-shimmer 1.2s ease-in-out infinite;
  border-radius: 1rem;
  height: 8rem;
}
```

**Step 2: Verify file exists**

```bash
cat src/transitions.css | head -5
```

Expected: `/* src/transitions.css */`

---

### Task 2: Link `transitions.css` from `index.html`

**Files:**
- Modify: `index.html`

**Step 1: Add `<link>` in `<head>`, after the Tailwind script tag**

Open `index.html`. In `<head>`, after the `<script src="https://cdn.tailwindcss.com"></script>` line, add:

```html
    <link rel="stylesheet" href="/visual-aids/src/transitions.css" />
```

Wait — Vite serves files under the base path. The correct path for dev server is `/src/transitions.css`. For production the built asset hash path is injected automatically. Use a Vite-aware `<link>` that works in both:

Actually: because `transitions.css` is a plain CSS file inside `src/`, Vite will process and bundle it when it is imported from JS. Do NOT use a raw `<link>` tag in the HTML shell — instead import it from JS. See Task 3.

**Step 1 (revised): Do nothing to `index.html` yet.** The CSS import will be done in Task 3 via JS import.

---

### Task 3: Import `transitions.css` from entry points

CSS imported from any JS/JSX file Vite processes will be bundled correctly and injected into all pages that share that bundle. However, each aid page has its own HTML shell and its own entry script. The cleanest approach: create a shared `src/site.js` that imports the CSS, then import `site.js` from `src/index.jsx` and from the generated HTML shell template.

**Files:**
- Create: `src/site.js`
- Modify: `src/index.jsx`
- Modify: `vite.config.js` (the generated shell template inside `generateHtmlShell()`)

**Step 1: Create `src/site.js`**

```js
// src/site.js
// Shared site-wide CSS. Imported from every page entry point.
import './transitions.css';
```

**Step 2: Import `site.js` at the top of `src/index.jsx`**

Add as the first import line (before `import React`):

```js
import './site.js';
```

**Step 3: Inject import into the generated HTML shell template**

In `vite.config.js`, inside `generateHtmlShell()`, find the inline `<script type="module">` block. Add this as the first import inside that script:

```js
      import '/src/site.js';
```

The generated shell will look like:

```html
    <script type="module">
      import '/src/site.js';
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      ...
```

**Step 4: Verify build still works**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes with no errors.

---

### Task 4: Add `view-transition-name` classes to SiteHeader and content wrappers

The View Transitions API requires named elements to animate between their old and new states across a navigation.

**Files:**
- Modify: `src/components/SiteHeader.jsx`
- Modify: `src/index.jsx`
- Modify: `vite.config.js` (generated shell template)

**Step 1: Add `site-header` class to `SiteHeader`'s `<header>` element**

In `src/components/SiteHeader.jsx`, the `<header>` element currently has class `"w-full bg-white border-b border-slate-200 px-6 py-3"`. Add `site-header` to it:

```jsx
<header className="site-header w-full bg-white border-b border-slate-200 px-6 py-3">
```

**Step 2: Add `page-content` class to the main content wrapper in `src/index.jsx`**

In `src/index.jsx`, the `<div className="flex-1 bg-slate-50 p-8 font-sans">` is the content area. Add `page-content` to it:

```jsx
<div className="page-content flex-1 bg-slate-50 p-8 font-sans">
```

**Step 3: Wrap the aid component in a `page-content` div in the generated shell template**

In `vite.config.js` inside `generateHtmlShell()`, the `React.createElement(App)` call renders the aid content directly. Wrap it in a div with `className="page-content"`:

Replace:

```js
        React.createElement(SiteHeader, { crumbs }),
        React.createElement(App)
```

With:

```js
        React.createElement(SiteHeader, { crumbs }),
        React.createElement('div', { className: 'page-content flex-1 bg-slate-50' },
          React.createElement(App)
        )
```

**Step 4: Rebuild and verify classes are present in output**

```bash
npm run build 2>&1 | tail -5
grep -r "page-content" dist/ | head -5
```

Expected: build passes, `page-content` found in HTML/JS output.

---

### Task 5: Write the direction + skeleton JS module

**Files:**
- Create: `src/nav-transitions.js`

**Step 1: Write the file**

```js
// src/nav-transitions.js
// Runs on every page. Hooks into the Navigation API to:
//   1. Set data-nav="forward"|"backward" on <html> before each navigation
//      so CSS can key directional slide animations on it.
//   2. For multi-level skips (|depth delta| > 1), intercept the navigation
//      and briefly show a skeleton frame representing the skipped level.

if (typeof navigation !== 'undefined') {
  navigation.addEventListener('navigate', (e) => {
    // Only intercept same-origin navigations to real URLs.
    if (!e.canIntercept || e.hashChange || e.downloadRequest) return;

    const fromDepth = urlDepth(location.href);
    const toDepth   = urlDepth(e.destination.url);
    const delta     = toDepth - fromDepth;

    if (delta === 0) return;

    const dir = delta > 0 ? 'forward' : 'backward';
    document.documentElement.dataset.nav = dir;

    if (Math.abs(delta) > 1) {
      // Multi-level skip: show a ghost skeleton before completing navigation.
      e.intercept({
        async handler() {
          await showSkeletonFrame(e.destination.url, dir);
          // After skeleton, the real page loads via standard navigation —
          // but intercept() has already resolved so the browser proceeds.
        },
      });
    }
  });
}

/**
 * Count the meaningful path segments in a URL to determine navigation depth.
 * /visual-aids/           → 1
 * /visual-aids/<slug>/    → 2
 * /visual-aids/<slug>/<sub>/ → 3
 */
function urlDepth(href) {
  const pathname = new URL(href).pathname;
  // Strip trailing slash, split, remove empty segments and the base segment.
  const segments = pathname.replace(/\/$/, '').split('/').filter(Boolean);
  // segments[0] is the repo name ('visual-aids') — counts as depth 0.
  return Math.max(0, segments.length - 1) + 1;
}

/**
 * Briefly render a skeleton UI representing an intermediate navigation level,
 * then remove it.
 *
 * @param {string} destUrl  - The final destination URL (used to derive crumb labels)
 * @param {string} dir      - 'forward' | 'backward'
 */
async function showSkeletonFrame(destUrl, dir) {
  const destPath = new URL(destUrl).pathname;
  const segments = destPath.replace(/\/$/, '').split('/').filter(Boolean);
  // segments[0] = 'visual-aids', segments[1] = slug, segments[2] = sub-slug (if any)

  // Build intermediate crumbs (one level in from current depth toward destination)
  const intermediateSegment = dir === 'forward' ? segments[1] : segments[segments.length - 2];
  const label = intermediateSegment
    ? intermediateSegment.replace(/^\d{8}-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Visual Aids';

  // Build skeleton DOM
  const skeleton = document.createElement('div');
  skeleton.className = 'vt-skeleton-overlay';
  skeleton.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:9999',
    'background:#f8fafc', 'display:flex', 'flex-direction:column',
    'opacity:0', 'transition:opacity 0.12s ease-in-out',
  ].join(';');

  skeleton.innerHTML = `
    <div style="background:#fff;border-bottom:1px solid #e2e8f0;padding:0.75rem 1.5rem;">
      <span style="font-size:0.875rem;color:#94a3b8;">Visual Aids / </span>
      <span style="font-size:0.875rem;color:#1e293b;font-weight:500;">${label}</span>
    </div>
    <div style="flex:1;background:#f8fafc;padding:2rem;">
      <div style="max-width:56rem;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;">
        ${Array.from({ length: 4 }, () => '<div class="vt-skeleton-card"></div>').join('')}
      </div>
    </div>
  `;

  document.body.appendChild(skeleton);

  // Trigger fade-in on next frame
  await nextFrame();
  skeleton.style.opacity = '1';

  // Hold for one animation beat
  await sleep(180);

  // Fade out
  skeleton.style.opacity = '0';
  await sleep(130);

  skeleton.remove();
}

function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Step 2: Verify file exists**

```bash
wc -l src/nav-transitions.js
```

Expected: ~90 lines.

---

### Task 6: Import `nav-transitions.js` from entry points

**Files:**
- Modify: `src/site.js`
- (No other file changes needed — `site.js` is already imported from all entry points)

**Step 1: Add import to `src/site.js`**

```js
// src/site.js
import './transitions.css';
import './nav-transitions.js';
```

**Step 2: Rebuild**

```bash
npm run build 2>&1 | tail -10
```

Expected: clean build.

---

### Task 7: Add smoke tests for transition classes and data-nav attribute

**Files:**
- Modify: `tests/smoke.spec.js`

**Step 1: Add tests**

Add these two tests at the end of `tests/smoke.spec.js`:

```js
test('page-content class present on index page', async ({ page }) => {
  await page.goto(`${BASE}/`);
  await page.waitForSelector('#root > *', { timeout: 5000 });
  await expect(page.locator('.page-content')).toBeVisible();
  await expect(page.locator('.site-header')).toBeVisible();
});

for (const slug of slugs) {
  test(`page-content class present on aid page: ${slug}`, async ({ page }) => {
    await page.goto(`${BASE}/${slug}/`);
    await page.waitForSelector('#root > *', { timeout: 5000 });
    await expect(page.locator('.page-content')).toBeVisible();
    await expect(page.locator('.site-header')).toBeVisible();
  });
}
```

**Step 2: Run validation + smoke tests**

```bash
node scripts/validate-aids.js && npx playwright test
```

Expected: all tests pass.

**Step 3: Commit**

```bash
git add src/transitions.css src/site.js src/nav-transitions.js src/components/SiteHeader.jsx src/index.jsx vite.config.js tests/smoke.spec.js
git commit -m "feat: add View Transition animations with directional slides and ghost skeleton"
```

---

## Testing notes

- **View Transition animations** only run in Chrome 126+. Playwright by default runs Chromium — so the `@view-transition` rule and `data-nav` attribute will be active during tests.
- **Navigation API** (`window.navigation`) is available in Chromium. The direction script will fire on link clicks during Playwright tests.
- **Skeleton frame** only triggers for multi-level skips — not testable until level-3 sub-aid pages exist. The test suite does not cover it. That is acceptable.
- **Firefox/Safari** get instant navigation (no transition) — tested manually, not in CI.

---

## Architecture diagram

```
index.html  ──import──▶  src/index.jsx
                               │
                         import './site.js'
                               │
                         ┌─────┴────────────────┐
                         │     src/site.js       │
                         │  import transitions.css│
                         │  import nav-transitions│
                         └───────────────────────┘

generated/<slug>/index.html  ──inline script──▶  import '/src/site.js'
                                                  import SiteHeader
                                                  import App from aid

CSS:  transitions.css
      - @view-transition { navigation: auto }
      - .site-header  { view-transition-name: site-header }
      - .page-content { view-transition-name: page-content }
      - html[data-nav="forward"]  → slide left
      - html[data-nav="backward"] → slide right

JS:   nav-transitions.js
      - Navigation API listener
      - Sets html[data-nav] before each navigation
      - Intercepts multi-level skips → injects skeleton → resolves
```
