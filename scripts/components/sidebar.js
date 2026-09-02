/* ─── SIDEBAR COMPONENT ──────────────────────────────────────────
   Renders the sidebar from localized navigation data, handles
   active-state highlighting, mobile drawer, and Theme/Language controls.
────────────────────────────────────────────────────────────────── */

window.NORIX_SIDEBAR = (function () {
  'use strict';

  let _onNavigate = null;
  let _activeId   = 'about';

  function init(navItems, activeId, onNavigate) {
    _onNavigate = onNavigate;
    _activeId   = activeId;
    render();
    _initMobileToggle();
  }

  function render() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const i18n = window.NORIX_I18N;
    const currentLang  = i18n ? i18n.getLang() : 'en';
    const currentTheme = i18n ? i18n.getTheme() : 'dark';
    const uiData       = i18n ? i18n.t('ui') : {};
    const navItems     = (i18n && i18n.t('navigation')) || window.NORIX_DATA.navigation || [];

    const langBtnText  = currentLang === 'en' ? 'AR' : 'EN';
    const langBtnTitle = currentLang === 'en' ? 'التبديل إلى العربية' : 'Switch to English';
    const themeIcon    = currentTheme === 'dark' ? (i18n ? i18n.sunIcon() : '☀️') : (i18n ? i18n.moonIcon() : '🌙');
    const themeBtnTitle= currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

    sidebar.innerHTML = `
      <div class="sidebar-logo" role="banner">
        <div class="sidebar-logo__name">NORIX</div>
        <div class="sidebar-logo__tagline">${uiData.tagline || '3D Artist · Designer'}</div>
      </div>

      <div class="sidebar-sep" aria-hidden="true"></div>

      <ul class="sidebar-nav" role="list">
        ${navItems.map((item, i) => _renderItem(item, i, _activeId)).join('')}
      </ul>

      <div class="sidebar-footer">
        <div class="sidebar-footer__controls">
          <button
            class="ui-control-btn lang-toggle-btn"
            aria-label="${langBtnTitle}"
            title="${langBtnTitle}"
          >
            <span style="font-size:13px; margin-inline-end: 2px;">🌐</span>
            <span class="lang-btn-text">${langBtnText}</span>
          </button>

          <button
            class="ui-control-btn theme-toggle-btn icon-only"
            aria-label="${themeBtnTitle}"
            title="${themeBtnTitle}"
          >
            <span class="theme-icon-wrap">${themeIcon}</span>
          </button>
        </div>

        <div class="sidebar-footer__text" aria-hidden="true">
          ${uiData.copyright || 'Portfolio · © Norix 2026'}
        </div>
      </div>
    `;

    // Attach navigation click handlers
    sidebar.querySelectorAll('.sidebar-nav__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id  = btn.dataset.id;
        const idx = parseInt(btn.dataset.idx, 10);
        if (_onNavigate) _onNavigate(id, idx);
        _closeMobile();
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    // Attach footer controls
    const langBtn = sidebar.querySelector('.lang-toggle-btn');
    if (langBtn && i18n) {
      langBtn.addEventListener('click', () => i18n.toggleLang());
    }

    const themeBtn = sidebar.querySelector('.theme-toggle-btn');
    if (themeBtn && i18n) {
      themeBtn.addEventListener('click', () => i18n.toggleTheme());
    }
  }

  function _renderItem(item, index, activeId) {
    const active = item.id === activeId;
    return `
      <li class="sidebar-nav__item${active ? ' sidebar-nav__item--active' : ''}" role="listitem">
        <button
          class="sidebar-nav__btn"
          data-id="${item.id}"
          data-idx="${index}"
          aria-current="${active ? 'page' : 'false'}"
          aria-label="${item.label}"
        >
          <span class="sidebar-nav__num">${item.number}</span>
          <span class="sidebar-nav__label">${item.label}</span>
        </button>
        <span class="sidebar-nav__dash" aria-hidden="true"></span>
      </li>
    `;
  }

  function setActive(id) {
    _activeId = id;
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    sidebar.querySelectorAll('.sidebar-nav__item').forEach((li) => {
      const btn = li.querySelector('.sidebar-nav__btn');
      const isActive = btn && btn.dataset.id === id;
      li.classList.toggle('sidebar-nav__item--active', isActive);
      if (btn) btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  function refresh() {
    render();
  }

  /* ─── Mobile drawer ─────────────────────────────────────────── */
  function _initMobileToggle() {
    const toggle  = document.getElementById('menu-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('sidebar');

    if (!toggle || !overlay || !sidebar) return;

    // Remove old listeners by replacing or assigning
    toggle.onclick = () => {
      const isOpen = sidebar.classList.toggle('sidebar--open');
      toggle.classList.toggle('open', isOpen);
      overlay.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    };

    overlay.onclick = _closeMobile;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') _closeMobile();
    });
  }

  function _closeMobile() {
    const toggle  = document.getElementById('menu-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.classList.remove('sidebar--open');
    if (toggle)  { toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    if (overlay) { overlay.classList.remove('active'); }
  }

  return { init, render, setActive, refresh };
}());
