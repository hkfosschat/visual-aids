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