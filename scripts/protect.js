/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  SITE PROTECTION — scripts/protect.js                          ║
  ║                                                                ║
  ║  Adds content protection to the portfolio:                     ║
  ║    • Disables F12 & Developer Tools shortcuts                  ║
  ║    • Disables right-click context menu (Inspect)              ║
  ║    • Disables image dragging                                   ║
  ║    • Disables text selection on media/images                   ║
  ║    • Disables Ctrl+U (view source), Ctrl+S (save page)         ║
  ║    • Disables Ctrl+Shift+I/J/C/K (DevTools & Console)          ║
  ║                                                                ║
  ║  To disable during development, set in data/config.js:         ║
  ║    protection: false                                           ║
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
     Blocks: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+Shift+K,
             Ctrl+U (view-source), Ctrl+S (save page)
  ──────────────────────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (!isEnabled()) return;

    const ctrl  = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const key   = (e.key || '').toLowerCase();
    const code  = e.keyCode || e.which;

    // F12 — DevTools
    if (key === 'f12' || code === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Ctrl+Shift+K — DevTools & Inspector
    if (ctrl && shift && (key === 'i' || key === 'j' || key === 'c' || key === 'k' || key === 'e' || code === 73 || code === 74 || code === 67 || code === 75 || code === 69)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U — View Source
    if (ctrl && (key === 'u' || code === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S — Save Page
    if (ctrl && (key === 's' || code === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

  }, true);

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
