/* ─── ROUTER ─────────────────────────────────────────────────────
   Manages page switching with direction-aware transitions.
   Reads the page registry from window.NORIX_PAGES and i18n data.
────────────────────────────────────────────────────────────────── */

window.NORIX_ROUTER = (function () {
  'use strict';

  let _navItems    = [];
  let _currentId   = null;
  let _currentIdx  = -1;
  let _isAnimating = false;

  function navigate(id, newIndex) {
    if (id === _currentId || _isAnimating) return;

    const pageModule = window.NORIX_PAGES && window.NORIX_PAGES[id];
    if (!pageModule) {
      console.warn('[Router] No page module found for:', id);
      return;
    }

    _isAnimating = true;

    const container   = document.getElementById('page-container');
    const oldPage     = container.querySelector('.page.page-active');
    const isRTL       = document.documentElement.dir === 'rtl';
    
    // In RTL, forward moves from left, backward from right
    let enterClass = newIndex > _currentIdx ? 'page-enter-right' : 'page-enter-left';
    let exitClass  = newIndex > _currentIdx ? 'page-exit-left' : 'page-exit-right';

    // ── Build new page element ────────────────────────────────── //
    const newPage = document.createElement('div');
    newPage.id           = 'page-' + id;
    newPage.className    = 'page ' + enterClass;
    newPage.setAttribute('role', 'main');
    newPage.setAttribute('aria-label', 'Page: ' + id);

    // Render localized HTML
    newPage.innerHTML = pageModule.render();
    container.appendChild(newPage);

    // ── Animate out old page ──────────────────────────────────── //
    if (oldPage) {
      oldPage.classList.remove('page-active');
      oldPage.classList.add(exitClass);
    }

    // ── Trigger enter animation ───────────────────────────────── //
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        newPage.classList.remove('page-enter-right', 'page-enter-left');
        newPage.classList.add('page-active');

        const duration = 360;

        setTimeout(() => {
          if (oldPage && oldPage.parentNode) {
            oldPage.parentNode.removeChild(oldPage);
          }
          _isAnimating = false;
          newPage.scrollTop = 0;

          if (typeof pageModule.init === 'function') {
            pageModule.init(newPage);
          }
        }, duration + 40);
      });
    });

    // ── Update state & sidebar ────────────────────────────────── //
    _currentId  = id;
    _currentIdx = newIndex;
    window.NORIX_SIDEBAR.setActive(id);

    _updateDocumentTitle(id);
  }

  function init(navItems, startId) {
    _navItems   = navItems;
    const startIdx = navItems.findIndex((n) => n.id === startId);
    _currentIdx = startIdx !== -1 ? startIdx : 0;
    _currentId  = startId;

    const pageModule = window.NORIX_PAGES && window.NORIX_PAGES[startId];
    if (!pageModule) {
      console.error('[Router] Starting page not found:', startId);
      return;
    }

    const container = document.getElementById('page-container');
    container.innerHTML = '';
    const page      = document.createElement('div');
    page.id         = 'page-' + startId;
    page.className  = 'page page-active';
    page.setAttribute('role', 'main');
    page.innerHTML  = pageModule.render();
    container.appendChild(page);

    window.NORIX_SIDEBAR.setActive(startId);
    _updateDocumentTitle(startId);

    if (typeof pageModule.init === 'function') {
      setTimeout(() => pageModule.init(page), 60);
    }
  }

  function refresh() {
    if (!_currentId) return;
    const pageModule = window.NORIX_PAGES && window.NORIX_PAGES[_currentId];
    if (!pageModule) return;

    const container = document.getElementById('page-container');
    const oldPage   = container.querySelector('.page.page-active');
    if (!oldPage) return;

    oldPage.innerHTML = pageModule.render();
    _updateDocumentTitle(_currentId);

    if (typeof pageModule.init === 'function') {
      pageModule.init(oldPage);
    }
  }

  function getCurrentId() {
    return _currentId;
  }

  function _updateDocumentTitle(id) {
    const nav = (window.NORIX_I18N && window.NORIX_I18N.t('navigation')) || _navItems;
    const item = nav.find(n => n.id === id);
    const label = item ? item.label : id;
    document.title = 'Norix — ' + label;
  }

  return { init, navigate, refresh, getCurrentId };
}());
