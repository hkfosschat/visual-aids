import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_NAME = 'visual-aids';
const SRC_DIR = path.resolve(__dirname, 'src');
// Shells are written to <root>/<slug>/index.html so Vite outputs them to dist/<slug>/index.html.
// These folders are gitignored via the pattern in .gitignore.
const GEN_DIR = __dirname;

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

function slugToTitle(slug) {
  const titleSlug = slug.slice(9); // after YYYYMMDD-
  return titleSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

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
      import '/src/site.js';
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import { flushSync } from 'react-dom';
      import App, { meta as appMeta } from '/src/${slug}/index.${entryExt}';
      import SiteHeader from '/src/components/SiteHeader.jsx';
      const base = '/${REPO_NAME}/';
      const crumbs = [
        { label: '我哋講開', href: 'https://hkfosschat.github.io/' },
        { label: '講題輔助', href: base },
        { label: appMeta ? appMeta.title : '${title}' },
      ];
      const root = createRoot(document.getElementById('root'));
      flushSync(() => {
        root.render(
          React.createElement(React.Fragment, null,
            React.createElement(SiteHeader, { crumbs }),
            React.createElement('div', { className: 'page-content flex-1 bg-slate-50' },
              React.createElement(App)
            )
          )
        );
      });
    </script>
  </body>
</html>
`;
}

function multiPagePlugin() {
  return {
    name: 'visual-aids-multi-page',
    config() {
      const aids = discoverAids();

      // Write generated HTML shells into gitignored generated/
      if (!fs.existsSync(GEN_DIR)) fs.mkdirSync(GEN_DIR);
      for (const slug of aids) {
        const dir = path.join(GEN_DIR, slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), generateHtmlShell(slug));
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
