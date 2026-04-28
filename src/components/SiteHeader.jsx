// src/components/SiteHeader.jsx
import React from 'react';
import logo from '../../static/images/logo.webp';

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
        <img 
          src={logo} 
          alt={`${MAIN_SITE_NAME} Logo`} 
          className="h-8 w-auto object-contain rounded" 
        />
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
