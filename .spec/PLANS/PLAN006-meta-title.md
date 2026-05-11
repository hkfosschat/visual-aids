# Visual Aid Page Title Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure the HTML `<title>` tag for individual visual aid pages dynamically matches the `title` defined in the component's exported `meta` object, rather than the capitalized slug fallback.

**Architecture:** 
1. Since the HTML `<title>` is written to static shells in `vite.config.js` before the JS bundle executes, we will use a simple regular expression to extract the `meta.title` string directly from the component file's source code during the Vite build step.
2. The extracted title will be used to correctly populate `<title>${extractedTitle} | 講題輔助 | 我哋講開</title>`.
3. We will also add a one-liner to dynamically update `document.title` on the client-side once React mounts, acting as a foolproof safety net for any complex exported metadata strings that the simple regex might miss.

**Tech Stack:** Node.js (fs, regex), Vite, Playwright

---

### Task 1: Extract and Inject Correct Title in Vite Config

**Files:**
- Modify: `vite.config.js`

**Step 1: Write minimal implementation**

Update `vite.config.js` to add the parsing logic. We will create a `getMetaTitle` helper function right below `slugToTitle` and update `generateHtmlShell` to use it.

```javascript
function getMetaTitle(slug, entryExt) {
  const filePath = path.join(SRC_DIR, slug, \`index.\${entryExt}\`);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/title:\s*['"]([^'"]+)['"]/);
    if (match) return match[1];
  } catch (err) {}
  return slugToTitle(slug);
}
```

And update `generateHtmlShell`:

```javascript
function generateHtmlShell(slug) {
  const entryExt = fs.existsSync(path.join(SRC_DIR, slug, 'index.jsx')) ? 'jsx' : 'js';
  const displayTitle = getMetaTitle(slug, entryExt);
  
  return \`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>\${displayTitle} | 講題輔助 | 我哋講開</title>
    <link rel="icon" type="image/webp" href="/\${REPO_NAME}/favicon.webp" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import '/src/site.js';
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import { flushSync } from 'react-dom';
      import App, { meta as appMeta } from '/src/\${slug}/index.\${entryExt}';
      import SiteHeader from '/src/components/SiteHeader.jsx';
      import SiteFooter from '/src/components/SiteFooter.jsx';
      const base = '/\${REPO_NAME}/';
      
      const finalTitle = appMeta && appMeta.title ? appMeta.title : '\${displayTitle}';
      document.title = finalTitle + ' | 講題輔助 | 我哋講開';
      
      const crumbs = [
        { label: '主頁', href: 'https://hkfosschat.github.io/' },
        { label: '講題輔助', href: base },
        { label: finalTitle },
      ];
      const root = createRoot(document.getElementById('root'));
      flushSync(() => {
        root.render(
          React.createElement(React.Fragment, null,
            React.createElement(SiteHeader, { crumbs }),
            React.createElement('div', { className: 'page-content flex-1 bg-slate-50' },
              React.createElement(App)
            ),
            React.createElement(SiteFooter)
          )
        );
      });
    </script>
  </body>
</html>
\`;
}
```

---

### Task 2: Verify and Commit

**Step 1: Test the implementation**
Run: `npm run build && npx playwright test`
Expected: Passes. 

**Step 2: Commit**
```bash
git add vite.config.js
git commit -m "fix: use component meta.title for HTML page title generation"
```