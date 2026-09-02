/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  SITE PROTECTION — scripts/protect.js                          ║
  ║                                                                ║
  ║  Adds basic content protection to the portfolio:               ║
  ║    • Disables right-click context menu                         ║
  ║    • Disables image dragging                                    ║
  ║    • Disables text selection on non-content areas              ║
  ║    • Disables Ctrl+U (view source), Ctrl+S (save page)        ║
  ║    • Disables Ctrl+Shift+I, Ctrl+Shift+J (DevTools shortcuts) ║
  ║                                                                ║
  ║  NOTE: This is content deterrence, not absolute protection.    ║
  ║  Determined users can still view source via browser address    ║
  ║  bar. This stops casual theft/copying.                        ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────────
     CHECK CONFIG — protection can be disabled in data/config.js
     by setting: protection: false
  ──────────────────────────────────────────────────────────────── */
  function isEnabled() {
    const cfg = window.NORIX_CONFIG || {};
    return cfg.protection !== false; // enabled by default
  }

  /* ────────────────────────────────────────────────────────────────
     RIGHT-CLICK DISABLE
  ──────────────────────────────────────────────────────────────── */
  document.addEventListener('contextmenu', function (e) {
    if (!isEnabled()) return;
    e.preventDefault();
  }, false);

  /* ────────────────────────────────────────────────────────────────
     IMAGE DRAG DISABLE
  ──────────────────────────────────────────────────────────────── */
  document.addEventListener('dragstart', function (e) {
    if (!isEnabled()) return;
    if (e.target.tagName === 'IMG') e.preventDefault();
  }, false);

  /* ────────────────────────────────────────────────────────────────
     KEYBOARD SHORTCUT BLOCK
     Blocks: Ctrl+U, Ctrl+S, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
  ──────────────────────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (!isEnabled()) return;

    const ctrl = e.ctrlKey || e.metaKey;
    const key  = e.key.toLowerCase();

    // Ctrl+U — view-source (blocks casual source viewing)
    if (ctrl && key === 'u') { e.preventDefault(); return; }

    // Ctrl+S — save page (blocks saving HTML locally)
    if (ctrl && key === 's') { e.preventDefault(); return; }

    // NOTE: F12, Ctrl+Shift+I/J/C (DevTools) are NOT blocked
    // so the Owner Console can always be accessed.

  }, false);

  /* ────────────────────────────────────────────────────────────────
     SELECT DISABLE on media/images (not on text content)
  ──────────────────────────────────────────────────────────────── */
  document.addEventListener('selectstart', function (e) {
    if (!isEnabled()) return;
    const tag = e.target.tagName;
    // Allow selection in inputs/textareas/content text, block on images & decorative
    if (tag === 'IMG' || tag === 'VIDEO' || (e.target.classList && e.target.classList.contains('work-gallery__item'))) {
      e.preventDefault();
    }
  }, false);

  /* ────────────────────────────────────────────────────────────────
     COPY WATERMARK
     When someone copies text from the portfolio, appends a credit line.
  ──────────────────────────────────────────────────────────────── */
  document.addEventListener('copy', function (e) {
    if (!isEnabled()) return;
    const selected = window.getSelection();
    if (!selected || selected.isCollapsed) return;
    const text = selected.toString();
    if (text.length < 10) return; // don't watermark tiny copies

    const name = ((window.NORIX_CONFIG || {}).name) || 'Norix';
    const url  = ((window.NORIX_CONFIG || {}).siteUrl) || window.location.hostname;
    const watermark = `\n\n— ${name} Portfolio (${url})`;

    e.clipboardData.setData('text/plain', text + watermark);
    e.preventDefault();
  }, false);

}());
