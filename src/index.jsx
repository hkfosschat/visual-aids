import './site.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import SiteHeader from './components/SiteHeader.jsx';

// Discover all aid modules at build time.
// Key shape: './20260427-c-string/index.jsx'
const aidModules = import.meta.glob('./**/index.jsx', { eager: true });

function slugToMeta(slug) {
  const date = `${slug.slice(0, 4)}-${slug.slice(4, 6)}-${slug.slice(6, 8)}`;
  const titleSlug = slug.slice(9);
  const fallbackTitle = titleSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return { date, fallbackTitle };
}

const aids = Object.entries(aidModules)
  .map(([key, mod]) => {
    // key: './20260427-c-string/index.jsx'
    const slug = key.replace(/^\.\//, '').replace(/\/index\.[jt]sx?$/, '');
    if (!/^\d{8}-/.test(slug)) return null; // skip src/index.jsx itself
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
    <div className="flex flex-col min-h-screen">
      <SiteHeader crumbs={[{ label: '我哋講開', href: 'https://hkfosschat.github.io/' }, { label: '講題輔助' }]} />
      <div className="page-content flex-1 bg-slate-50 p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <h1 className="sr-only">講題輔助</h1>
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
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
flushSync(() => {
  root.render(<App />);
});
