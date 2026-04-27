# Universal Site Header Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Inject a `SiteHeader` React component with breadcrumb navigation into every page (index + all aid pages) without modifying any aid's `index.jsx`.

**Architecture:** A shared `SiteHeader` component lives in `src/components/SiteHeader.jsx`. The index page imports and renders it directly. Aid pages get it injected via `generateHtmlShell()` in `vite.config.js`, which wraps the aid's `App` component inside `SiteHeader` in the inline mounting script — no aid file is touched.

**Tech Stack:** React 18, Vite, Tailwind CSS (CDN), Playwright for smoke tests.

---

### Task 1: Create `src/components/SiteHeader.jsx`

**Files:**
- Create: `src/components/SiteHeader.jsx`

**Step 1: Write the component**

```jsx
// src/components/SiteHeader.jsx
import React from 'react';

/**
 * crumbs: Array<{ label: string, href?: string }>
 * First crumb is always the site root. Last crumb is current page (no href).
 * Supports 3+ levels.
 */
export default function SiteHeader({ crumbs = [] }) {
  return (
    <header className="w-full bg-white border-b border-slate-200 px-6 py-3">
      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-slate-500 flex-wrap">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden="true" className="text-slate-300">/</span>}
                {isLast || !crumb.href ? (
                  <span className={isLast ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                    {crumb.label}
                  </span>
                ) : (
                  <a href={crumb.href} className="hover:text-indigo-600 transition-colors">
                    {crumb.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}
```

**Step 2: Verify file was created**

```bash
ls src/components/
```
Expected: `SiteHeader.jsx`

---

### Task 2: Add `SiteHeader` to the index page (`src/index.jsx`)

**Files:**
- Modify: `src/index.jsx`

**Step 1: Import `SiteHeader` at the top of `src/index.jsx`**

Add after the existing React imports:
```jsx
import SiteHeader from './components/SiteHeader.jsx';
```

**Step 2: Add `BASE` crumb constant near the `BASE` variable line**

After `const BASE = import.meta.env.BASE_URL;` add:
```jsx
const ROOT_CRUMB = { label: 'Visual Aids', href: BASE };
```

**Step 3: Wrap the `App` return in a fragment with `SiteHeader`**

Replace the outer `<div className="min-h-screen ...">` wrapper so the layout becomes:

```jsx
function App() {
  return (
    <>
      <SiteHeader crumbs={[{ label: 'Visual Aids' }]} />
      <div className="min-h-screen bg-slate-50 p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          {/* remove the old <h1>Visual Aids</h1> and subtitle — the header now provides context */}
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
    </>
  );
}
```

Note: The `<h1>Visual Aids</h1>` heading and subtitle paragraph are removed since the breadcrumb header now provides that context. The `ROOT_CRUMB` constant (added in Step 2) isn't needed; remove it to keep things clean.

---

### Task 3: Inject `SiteHeader` into aid pages via `generateHtmlShell()`

**Files:**
- Modify: `vite.config.js` — `generateHtmlShell()` function

**Step 1: Update `generateHtmlShell()` to wrap `App` in `SiteHeader`**

The inline module script currently does:
```js
import App from '/src/${slug}/index.${entryExt}';
createRoot(document.getElementById('root')).render(React.createElement(App));
```

Replace it with:
```js
import App from '/src/${slug}/index.${entryExt}';
import SiteHeader from '/src/components/SiteHeader.jsx';
const base = '/${REPO_NAME}/';
const crumbs = [
  { label: 'Visual Aids', href: base },
  { label: (App.meta && App.meta.title) ? App.meta.title : ${JSON.stringify(title)} },
];
createRoot(document.getElementById('root')).render(
  React.createElement(React.Fragment, null,
    React.createElement(SiteHeader, { crumbs }),
    React.createElement(App)
  )
);
```

Full updated `generateHtmlShell` function:
```js
function generateHtmlShell(slug) {
  const entryExt = fs.existsSync(path.join(SRC_DIR, slug, 'index.jsx')) ? 'jsx' : 'js';
  const title = slugToTitle(slug);
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
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import App from '/src/${slug}/index.${entryExt}';
      import SiteHeader from '/src/components/SiteHeader.jsx';
      const base = '/${REPO_NAME}/';
      const crumbs = [
        { label: 'Visual Aids', href: base },
        { label: (App.meta && App.meta.title) ? App.meta.title : '${title}' },
      ];
      createRoot(document.getElementById('root')).render(
        React.createElement(React.Fragment, null,
          React.createElement(SiteHeader, { crumbs }),
          React.createElement(App)
        )
      );
    </script>
  </body>
</html>
`;
}
```

**Step 2: Run dev server to manually verify**

```bash
npm run dev
```
Open `http://localhost:5173/visual-aids/` — should show header with "Visual Aids" breadcrumb.
Open `http://localhost:5173/visual-aids/20260427-c-string/` — should show header with "Visual Aids / C String" breadcrumb.

---

### Task 4: Update smoke tests to assert header presence

**Files:**
- Modify: `tests/smoke.spec.js`

**Step 1: Add header assertion to the index page test**

After `await expect(page).toHaveTitle('Visual Aids');` add:
```js
// Header breadcrumb is present
await expect(page.locator('header[aria-label="breadcrumb"], header nav[aria-label="breadcrumb"]')).toBeVisible();
await expect(page.locator('header')).toContainText('Visual Aids');
```

**Step 2: Add header assertion to each aid page test**

After `await page.waitForSelector('#root > *', { timeout: 5000 });` add:
```js
// Site header is present with breadcrumb back to index
await expect(page.locator('header')).toBeVisible();
await expect(page.locator('header')).toContainText('Visual Aids');
```

---

### Task 5: Build, run all tests, commit

**Step 1: Run convention validation**

```bash
npm run validate
```
Expected: exits 0.

**Step 2: Build**

```bash
npm run build
```
Expected: exits 0, `dist/` populated.

**Step 3: Run build assertions**

```bash
node scripts/assert-build.js
```
Expected: exits 0 (if this script exists — skip if it doesn't).

**Step 4: Run Playwright smoke tests**

```bash
npm run test:e2e
```
Expected: all tests pass including new header assertions.

**Step 5: Commit**

```bash
git add src/components/SiteHeader.jsx src/index.jsx vite.config.js tests/smoke.spec.js
git commit -m "feat: add universal SiteHeader with breadcrumb navigation"
```
