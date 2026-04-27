# Project Memory — Findings & Decisions

## 2026-04-27 — Aid page blank white (root cause)

**Symptom:** Navigating to an individual aid page (e.g. `/visual-aids/20260427-c-string/`) renders a blank white page.

**Root cause:** The generated HTML shell (`generateHtmlShell()` in `vite.config.js`) pointed its `<script type="module" src="...">` directly at the component file:

```html
<script type="module" src="/src/20260427-c-string/index.jsx"></script>
```

Each aid's `index.jsx` only **exports** a React component — it never calls `createRoot`. Nothing mounts into `#root`, so the page stays blank.

**Fix:** Replace the `src=` script tag with an inline `<script type="module">` block that imports the component and mounts it:

```html
<script type="module">
  import React from 'react';
  import { createRoot } from 'react-dom/client';
  import App from '/src/<slug>/index.jsx';
  createRoot(document.getElementById('root')).render(React.createElement(App));
</script>
```

Vite processes inline module scripts in HTML files during both dev and production builds. The absolute `/src/<slug>/index.jsx` path resolves from the project root correctly in both modes.

**Convention confirmed:** Aid `index.jsx` files are pure component modules (export only). Mounting is the responsibility of the generated HTML shell, not the component.

## 2026-04-27 — View Transition slide not firing (root cause)

**Symptom:** Navigating index → aid only cross-fades instead of sliding left.

**Root cause:** `@view-transition { navigation: auto }` MPA transitions run their animation pseudo-elements (`::view-transition-old/new`) in the context of the **new document**. The CSS selector `html[data-nav="forward"]::view-transition-old(page-content)` is therefore evaluated against the **new page's** `<html>`. But `nav-transitions.js` was setting `document.documentElement.dataset.nav` inside the `navigate` event listener — which runs on the **old page**. The new page's `<html>` never got `data-nav`, so the directional CSS rules never matched and the browser fell back to the default cross-fade.

**Fix:** Persist direction to `sessionStorage` on the old page, then read it back and apply `data-nav` to the new page's `<html>` inside the `pagereveal` event listener (fires on the new document just before transition animations begin). `pagereveal` is Chrome 123+ — same cohort as `@view-transition { navigation: auto }`.

```js
// old page (navigate listener)
sessionStorage.setItem('vt-nav-dir', dir);

// new page (pagereveal listener, top-level in same module)
window.addEventListener('pagereveal', () => {
  const dir = sessionStorage.getItem('vt-nav-dir');
  if (dir) {
    document.documentElement.dataset.nav = dir;
    sessionStorage.removeItem('vt-nav-dir');
  }
});
```

## 2026-04-27 — View Transition slide still not firing (React CSR timing)

**Symptom:** After fixing the `data-nav` attribute, the directional slide still wasn't happening on the `page-content` (only the default cross-fade).

**Root cause:** The app is Client-Side Rendered (CSR). When navigating, the browser receives an empty `<div id="root"></div>` and fires the `pagereveal` event to capture the "new page" state for the View Transition. Because React's `createRoot().render(...)` is asynchronous, the DOM is empty during the snapshot. The browser doesn't find the `.page-content` element, discards the directional slide rules, and falls back to a default document cross-fade.

**Fix:** Force React to render synchronously on initial load using `flushSync` from `react-dom`. This ensures the `.page-content` element exists in the DOM *before* the browser takes the transition snapshot. Additionally, set `mix-blend-mode: normal` on the `page-content` transition pseudo-elements to override the default `plus-lighter` blend mode, which causes bright ghosting during slides.
