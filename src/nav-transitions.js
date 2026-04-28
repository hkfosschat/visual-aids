// src/nav-transitions.js
// Runs on every page. Hooks into the Navigation API to:
//   1. Persist data-nav="forward"|"backward" to sessionStorage on the old page,
//      then restore it on the new page via the `pagereveal` event so CSS
//      directional slide rules (html[data-nav="forward"]) match in the new document.
//   2. For multi-level skips (|depth delta| > 1), intercept the navigation
//      and briefly show a skeleton frame representing the skipped level.
//
// Why sessionStorage + pagereveal?
// MPA View Transition pseudo-elements are evaluated in the NEW document's context.
// Setting data-nav on the OLD page's <html> (inside the navigate listener) is
// invisible to them — only the new page's <html> matters for CSS matching.

// ── New page: apply persisted direction before transition animations begin ──
window.addEventListener('pagereveal', () => {
  const dir = sessionStorage.getItem('vt-nav-dir');
  if (dir) {
    document.documentElement.dataset.nav = dir;
    sessionStorage.removeItem('vt-nav-dir');
  }
});

// ── Old page: detect direction and persist it ────────────────────────────────
if (typeof navigation !== 'undefined') {
  navigation.addEventListener('navigate', (e) => {
    // Only intercept same-origin navigations to real URLs.
    if (!e.canIntercept || e.hashChange || e.downloadRequest) return;

    const fromDepth = urlDepth(location.href);
    const toDepth   = urlDepth(e.destination.url);
    const delta     = toDepth - fromDepth;

    if (delta === 0) return;

    const dir = delta > 0 ? 'forward' : 'backward';
    // Persist for the new page's pagereveal listener to pick up.
    sessionStorage.setItem('vt-nav-dir', dir);

    if (Math.abs(delta) > 1) {
      // Multi-level skip: show a ghost skeleton before completing navigation.
      e.intercept({
        async handler() {
          await showSkeletonFrame(e.destination.url, dir);
          // After skeleton, the real page loads via standard navigation —
          // but intercept() has already resolved so the browser proceeds.
        },
      });
    }
  });
}

/**
 * Count the meaningful path segments in a URL to determine navigation depth.
 * /visual-aids/           → 1
 * /visual-aids/<slug>/    → 2
 * /visual-aids/<slug>/<sub>/ → 3
 */
function urlDepth(href) {
  const pathname = new URL(href).pathname;
  // Strip trailing slash, split, remove empty segments and the base segment.
  const segments = pathname.replace(/\/$/, '').split('/').filter(Boolean);
  // segments[0] is the repo name ('visual-aids') — counts as depth 0.
  return Math.max(0, segments.length - 1) + 1;
}

/**
 * Briefly render a skeleton UI representing an intermediate navigation level,
 * then remove it.
 *
 * @param {string} destUrl  - The final destination URL (used to derive crumb labels)
 * @param {string} dir      - 'forward' | 'backward'
 */
async function showSkeletonFrame(destUrl, dir) {
  const destPath = new URL(destUrl).pathname;
  const segments = destPath.replace(/\/$/, '').split('/').filter(Boolean);
  // segments[0] = 'visual-aids', segments[1] = slug, segments[2] = sub-slug (if any)

  // Build intermediate crumbs (one level in from current depth toward destination)
  const intermediateSegment = dir === 'forward' ? segments[1] : segments[segments.length - 2];
  const label = intermediateSegment
    ? intermediateSegment.replace(/^\d{8}-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : '講題輔助';

  // Build skeleton DOM
  const skeleton = document.createElement('div');
  skeleton.className = 'vt-skeleton-overlay';
  skeleton.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:9999',
    'background:#f8fafc', 'display:flex', 'flex-direction:column',
    'opacity:0', 'transition:opacity 0.12s ease-in-out',
  ].join(';');

  skeleton.innerHTML = `
    <div style="background:#fff;border-bottom:1px solid #e2e8f0;padding:0.75rem 1.5rem;">
      <span style="font-size:0.875rem;color:#94a3b8;">主頁 / 講題輔助 / </span>
      <span style="font-size:0.875rem;color:#1e293b;font-weight:500;">${label}</span>
    </div>
    <div style="flex:1;background:#f8fafc;padding:2rem;">
      <div style="max-width:56rem;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;">
        ${Array.from({ length: 4 }, () => '<div class="vt-skeleton-card"></div>').join('')}
      </div>
    </div>
  `;

  document.body.appendChild(skeleton);

  // Trigger fade-in on next frame
  await nextFrame();
  skeleton.style.opacity = '1';

  // Hold for one animation beat
  await sleep(180);

  // Fade out
  skeleton.style.opacity = '0';
  await sleep(130);

  skeleton.remove();
}

function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
