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
