/* ─── THEME CONTROLLER ───────────────────────────────────────────
   Manages Dark / Light mode switching and persists preference.
────────────────────────────────────────────────────────────────── */

window.NORIX_THEME = (function () {
  'use strict';

  const STORAGE_KEY_THEME = 'norix_theme';

  let _currentTheme = 'dark';

  /* ─── Init ──────────────────────────────────────────────────────── */

  function init() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    _currentTheme = (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme
                  : ((window.NORIX_CONFIG && window.NORIX_CONFIG.defaultTheme) || 'dark');
    _applyTheme(_currentTheme);
  }

  /* ─── Public Getters ─────────────────────────────────────────── */

  function getTheme() {
    return _currentTheme;
  }

  /* ─── Theme Control ──────────────────────────────────────────── */

  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    _currentTheme = theme;
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    _applyTheme(theme);
  }

  function toggleTheme() {
    setTheme(_currentTheme === 'dark' ? 'light' : 'dark');
  }

  /* ─── Internal ───────────────────────────────────────────────── */

  function _applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title',      theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      const iconWrap = btn.querySelector('.theme-icon-wrap');
      if (iconWrap) iconWrap.innerHTML = theme === 'dark' ? _sunIcon() : _moonIcon();
    });
  }

  function _sunIcon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`;
  }

  function _moonIcon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`;
  }

  /* ─── Public API ─────────────────────────────────────────────── */

  return {
    init,
    getTheme,
    setTheme,
    toggleTheme,
    sunIcon:  _sunIcon,
    moonIcon: _moonIcon,
  };
}());
