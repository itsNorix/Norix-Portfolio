/* ─── APP BOOTSTRAP ──────────────────────────────────────────────
   Entry point. Wires together theme controller, sidebar, router, and first page.
────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  function boot() {
    // 1. Initialize Theme controller
    const themeCtrl = window.NORIX_THEME;
    if (themeCtrl) {
      themeCtrl.init();
    }

    const nav = window.NORIX_DATA.navigation || [];
    const startId = nav[0] ? nav[0].id : 'about';

    // 2. Init sidebar
    window.NORIX_SIDEBAR.init(nav, startId, function (id, index) {
      window.NORIX_ROUTER.navigate(id, index);
    });

    // 3. Init router — renders the first page immediately
    window.NORIX_ROUTER.init(nav, startId);

    // 4. Wire mobile topbar theme control (if present)
    const mobileTopbar = document.getElementById('mobile-topbar');
    if (mobileTopbar && themeCtrl) {
      const mobileThemeBtn = mobileTopbar.querySelector('.theme-toggle-btn');
      if (mobileThemeBtn) {
        mobileThemeBtn.addEventListener('click', () => themeCtrl.toggleTheme());
      }
    }

    // 5. Global listener for in-page navigation links (e.g. data-nav="work")
    document.addEventListener('click', function (e) {
      const link = e.target.closest('[data-nav]');
      if (!link) return;

      const targetId = link.getAttribute('data-nav');
      const currentNav = window.NORIX_DATA.navigation || [];
      const idx = currentNav.findIndex((n) => n.id === targetId);
      if (idx !== -1 && window.NORIX_ROUTER) {
        e.preventDefault();
        window.NORIX_ROUTER.navigate(targetId, idx);
      }
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
