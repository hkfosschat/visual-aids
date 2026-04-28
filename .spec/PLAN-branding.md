# Sub-site Branding and Renaming Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update the header to establish "講題輔助" as a sub-site of "我哋講開", adding a branding row above the breadcrumbs and injecting the main site as the root of all breadcrumb trails.

**Architecture:** Update `SiteHeader` to a two-row flex-col layout. Update all hardcoded references of "Visual Aids" to "講題輔助" across the index component, HTML shell generator, transition skeleton, and smoke tests.

**Tech Stack:** React, Tailwind CSS, Vite, Playwright.

---

### Task 1: Update `SiteHeader.jsx` Layout

**Files:**
- Modify: `src/components/SiteHeader.jsx`

**Step 1: Write minimal implementation**

Update `src/components/SiteHeader.jsx` to include the branding row.

```jsx
import React from 'react';

/**
 * crumbs: Array<{ label: string, href?: string }>
 * First crumb is always the site root. Last crumb is current page (no href).
 * Supports 3+ levels.
 */
export default function SiteHeader({ crumbs = [] }) {
  const MAIN_SITE_NAME = "我哋講開";
  const MAIN_SITE_URL = "https://hkfosschat.github.io/";

  return (
    <header className="site-header w-full bg-white border-b border-slate-200 px-6 py-3 flex flex-col gap-3">
      {/* Branding Row */}
      <a href={MAIN_SITE_URL} className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
          我
        </div>
        <span className="text-lg font-bold text-slate-900 tracking-tight">
          {MAIN_SITE_NAME}
        </span>
      </a>

      {/* Breadcrumb Row */}
      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-slate-500 flex-wrap">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.href ?? crumb.label} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden="true" className="text-slate-300">/</span>}
                {isLast || !crumb.href ? (
                  <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-slate-900 font-medium' : 'text-slate-500'}>
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

**Step 2: Run build to verify no syntax errors**

Run: `npm run build`
Expected: Passes.

---

### Task 2: Rename in Index Page and Root HTML

**Files:**
- Modify: `src/index.jsx`
- Modify: `index.html`

**Step 1: Write minimal implementation**

In `src/index.jsx`:
Change `<SiteHeader crumbs={[{ label: 'Visual Aids' }]} />` to:
`<SiteHeader crumbs={[{ label: '我哋講開', href: 'https://hkfosschat.github.io/' }, { label: '講題輔助' }]} />`

Change `<h1 className="sr-only">Visual Aids</h1>` to:
`<h1 className="sr-only">講題輔助</h1>`

In `index.html`:
Change `<title>Visual Aids</title>` to:
`<title>講題輔助</title>`

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Passes.

---

### Task 3: Rename in Vite HTML Shell Generator

**Files:**
- Modify: `vite.config.js`

**Step 1: Write minimal implementation**

In `vite.config.js`, inside the `generateHtmlShell` function, update the `crumbs` array in the inline script:

```javascript
      const base = '/${REPO_NAME}/';
      const crumbs = [
        { label: '我哋講開', href: 'https://hkfosschat.github.io/' },
        { label: '講題輔助', href: base },
        { label: appMeta ? appMeta.title : '${title}' },
      ];
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Passes.

---

### Task 4: Rename in Navigation Transitions Skeleton

**Files:**
- Modify: `src/nav-transitions.js`

**Step 1: Write minimal implementation**

In `src/nav-transitions.js`, locate `showSkeletonFrame` and update the fallback label and skeleton HTML:

Change:
```javascript
  const label = intermediateSegment
    ? intermediateSegment.replace(/^\d{8}-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Visual Aids';
```
To:
```javascript
  const label = intermediateSegment
    ? intermediateSegment.replace(/^\d{8}-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : '講題輔助';
```

Change:
```html
    <div style="background:#fff;border-bottom:1px solid #e2e8f0;padding:0.75rem 1.5rem;">
      <span style="font-size:0.875rem;color:#94a3b8;">Visual Aids / </span>
      <span style="font-size:0.875rem;color:#1e293b;font-weight:500;">${label}</span>
    </div>
```
To:
```html
    <div style="background:#fff;border-bottom:1px solid #e2e8f0;padding:0.75rem 1.5rem;">
      <span style="font-size:0.875rem;color:#94a3b8;">我哋講開 / 講題輔助 / </span>
      <span style="font-size:0.875rem;color:#1e293b;font-weight:500;">${label}</span>
    </div>
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Passes.

---

### Task 5: Update Smoke Tests and Commit

**Files:**
- Modify: `tests/smoke.spec.js`

**Step 1: Write minimal implementation**

In `tests/smoke.spec.js`:

Change: `await expect(page).toHaveTitle('Visual Aids');`
To: `await expect(page).toHaveTitle('講題輔助');`

Change: `await expect(page.locator('header')).toContainText('Visual Aids');` (in both tests)
To: `await expect(page.locator('header')).toContainText('講題輔助');`

**Step 2: Run test to verify it passes**

Run: `npm run build && npx playwright test`
Expected: All 4 tests PASS.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add main site branding header and rename to 講題輔助"
```