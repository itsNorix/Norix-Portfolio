/* ─── APP BOOTSTRAP ──────────────────────────────────────────────
   Entry point. Wires together i18n, sidebar, router, and first page.
   If Firebase remoteSync is configured, loads cloud data first.
────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  function boot() {
    // 1. Initialize i18n & Theme state (loads saved language and theme)
    if (window.NORIX_I18N) {
      window.NORIX_I18N.init();
    }

    const nav = (window.NORIX_I18N && window.NORIX_I18N.t('navigation')) || window.NORIX_DATA.navigation;
    const startId = nav[0].id;

    // 2. Init sidebar
    window.NORIX_SIDEBAR.init(nav, startId, function (id, index) {
      window.NORIX_ROUTER.navigate(id, index);
    });

    // 3. Init router — renders the first page immediately
    window.NORIX_ROUTER.init(nav, startId);

    // 4. Wire mobile topbar controls (if present)
    const mobileTopbar = document.getElementById('mobile-topbar');
    if (mobileTopbar && window.NORIX_I18N) {
      const mobileLangBtn = mobileTopbar.querySelector('.lang-toggle-btn');
      if (mobileLangBtn) {
        mobileLangBtn.addEventListener('click', () => window.NORIX_I18N.toggleLang());
      }
      const mobileThemeBtn = mobileTopbar.querySelector('.theme-toggle-btn');
      if (mobileThemeBtn) {
        mobileThemeBtn.addEventListener('click', () => window.NORIX_I18N.toggleTheme());
      }
    }

    // 5. Global listener for in-page navigation links (e.g. data-nav="work")
    document.addEventListener('click', function (e) {
      const link = e.target.closest('[data-nav]');
      if (!link) return;

      const targetId = link.getAttribute('data-nav');
      const currentNav = (window.NORIX_I18N && window.NORIX_I18N.t('navigation')) || window.NORIX_DATA.navigation;
      const idx = currentNav.findIndex((n) => n.id === targetId);
      if (idx !== -1 && window.NORIX_ROUTER) {
        e.preventDefault();
        window.NORIX_ROUTER.navigate(targetId, idx);
      }
    });
  }

  function start() {
    // If Firebase cloud sync is configured, load remote data first,
    // then re-run i18n sync so the latest cloud content is used.
    if (window.NORIX_CLOUD && window.NORIX_CLOUD.isEnabled()) {
      window.NORIX_CLOUD.load(function (loaded) {
        if (loaded && window.NORIX_I18N) {
          // Re-sync i18n with the freshly loaded remote data
          // Use a small trick: temporarily clear lang storage so setLang triggers a full sync
          const lang = window.NORIX_I18N.getLang();
          window.NORIX_TRANSLATIONS = window.NORIX_TRANSLATIONS || {};
          window.NORIX_TRANSLATIONS[lang] = window.NORIX_TRANSLATIONS[lang] || {};
        }
        boot();
      });
    } else {
      boot();
    }
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}());

