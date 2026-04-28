# Add Sticky Header and CC BY-SA Footer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep the header sticky at the top with a translucent blur, hide its breadcrumb row smoothly when scrolling down, and add a CC BY-SA copyright footer at the bottom of all pages.
**Architecture:** 
1. Convert `SiteHeader.jsx` to use React hooks (`useState`, `useEffect`) to track `window.scrollY`. Add `sticky top-0 z-50 bg-white/95 backdrop-blur-sm` to the header and animate the breadcrumb height based on scroll state.
2. Create a new `SiteFooter.jsx` component for the CC BY-SA declaration, utilizing the official license button and linked text.
3. Inject the new footer into both `src/index.jsx` (for the home page) and `vite.config.js` (for the statically generated MPA shells).

**Tech Stack:** React, Tailwind CSS, Vite

---

### Task 1: Create `SiteFooter` Component

**Files:**
- Create: `src/components/SiteFooter.jsx`

**Step 1: Write the implementation**

Create a clean footer component for the bottom of the layout, using the CC BY-SA 4.0 standard HTML snippet and license button.

```jsx
// src/components/SiteFooter.jsx
import React from 'react';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 py-8 px-6 text-center text-sm text-slate-500 flex flex-col items-center gap-4">
      <p>&copy; {currentYear} 我哋講開.</p>
      
      <div className="flex flex-col items-center gap-2">
        <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
          <img 
            alt="Creative Commons License" 
            style={{ borderWidth: 0 }} 
            src="https://licensebuttons.net/l/by-sa/4.0/88x31.png" 
          />
        </a>
        <p className="max-w-md">
          Except where otherwise noted, content on this site is licensed under a{' '}
          <a 
            rel="license" 
            href="http://creativecommons.org/licenses/by-sa/4.0/"
            className="text-indigo-600 hover:underline font-medium"
          >
            Creative Commons Attribution-ShareAlike 4.0 International License
          </a>.
        </p>
      </div>
    </footer>
  );
}
```

---

### Task 2: Implement the Sticky Header & Scroll Behavior

**Files:**
- Modify: `src/components/SiteHeader.jsx`

**Step 1: Write the implementation**

Update `SiteHeader.jsx` to become a stateful component.

```jsx
// src/components/SiteHeader.jsx
import React, { useState, useEffect } from 'react';
import logo from '../../static/images/logo.webp';

/**
 * crumbs: Array<{ label: string, href?: string }>
 * First crumb is always the site root. Last crumb is current page (no href).
 * Supports 3+ levels.
 */
export default function SiteHeader({ crumbs = [] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const MAIN_SITE_NAME = "我哋講開";
  const MAIN_SITE_URL = "https://hkfosschat.github.io/";

  useEffect(() => {
    const handleScroll = () => {
      // Hide breadcrumbs after scrolling down 20px
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-3 flex flex-col sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
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

      {/* Breadcrumb Row with smooth collapse animation */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden origin-top ${
          isScrolled ? 'max-h-0 opacity-0 mt-0' : 'max-h-16 opacity-100 mt-3'
        }`}
      >
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
      </div>
    </header>
  );
}
```

---

### Task 3: Inject the Footer into Pages

**Files:**
- Modify: `src/index.jsx`
- Modify: `vite.config.js`

**Step 1: Write the implementation**

In `src/index.jsx`:
Import `SiteFooter` and place it at the very bottom, right before the closing `</div>` of the `flex flex-col min-h-screen` container.

In `vite.config.js`:
Add the import and render the footer in the `generateHtmlShell` function, so every standalone aid page gets the footer too.

---

### Task 4: Verify and Commit

**Step 1: Verify Build and Tests**
Run `npm run build && npx playwright test`
Expected: Passes.

**Step 2: Commit**
```bash
git add .
git commit -m "feat: add sticky header with auto-hiding breadcrumbs and CC BY-SA footer"
```