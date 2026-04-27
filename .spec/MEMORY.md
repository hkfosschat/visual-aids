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
