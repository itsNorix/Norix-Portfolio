/* ─── PAGE 05: SOCIAL ────────────────────────────────────────────
   Reads from: i18n & data/social.js
────────────────────────────────────────────────────────────────── */

window.NORIX_PAGES = window.NORIX_PAGES || {};

window.NORIX_PAGES.social = {

  render() {
    const i18n = window.NORIX_I18N;
    const sData = (i18n && i18n.t('social')) || {};
    const links = sData.links || window.NORIX_DATA.social || [];

    const cardsHTML = links.map(link => _renderCard(link)).join('');

    return `
      <div id="page-social">
        <header class="social-header page-header">
          <div class="page-chapter">${sData.chapter || '05 — Chapter'}</div>
          <h1 class="page-title">${sData.title || 'Social'}</h1>
          <p class="page-subtitle">${sData.subtitle || "Find me online. Let's connect."}</p>
        </header>

        <section aria-label="Social media links">
          <div class="social-grid">
            ${cardsHTML}
          </div>
        </section>

        <footer class="social-footer" aria-label="Footer">
          <p class="social-footer__text">
            ${sData.footer || 'Built with passion by <span>Norix</span> · All rights reserved'}
          </p>
        </footer>
      </div>
    `;
  },

  init(pageEl) {
    const cards = pageEl.querySelectorAll('.social-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 400ms ease, transform 400ms ease';
      setTimeout(() => {
        card.style.opacity = '';
        card.style.transform = '';
      }, 60 + i * 70);
    });
  },
};

/* ─── CARD RENDERER ─────────────────────────────────────────── */

function _renderCard(link) {
  const icon = _getPlatformIcon(link.id);
  return `
    <a
      href="${link.url}"
      target="_blank"
      rel="noopener noreferrer"
      class="social-card"
      style="--platform-color: ${link.color}"
      aria-label="${link.platform}: ${link.handle}"
    >
      <div class="social-card__icon-wrap" aria-hidden="true">
        ${icon}
      </div>
      <div class="social-card__platform">${link.platform}</div>
      <div class="social-card__handle">${link.handle}</div>
      <div class="social-card__cta">
        ${link.label}
        <div class="social-card__cta-arrow" aria-hidden="true"></div>
      </div>
    </a>
  `;
}

/* ─── PLATFORM ICONS (inline SVG) ─────────────────────────── */
function _getPlatformIcon(id) {
  const icons = {
    discord: `<svg class="social-card__icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
    </svg>`,

    instagram: `<svg class="social-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>`,

    youtube: `<svg class="social-card__icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8z"/>
      <polygon points="9.8,15.5 15.8,12 9.8,8.5" fill="white"/>
    </svg>`,

    twitter: `<svg class="social-card__icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>`,

    tiktok: `<svg class="social-card__icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.7a4.85 4.85 0 01-1-.01z"/>
    </svg>`,

    behance: `<svg class="social-card__icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7V5h7v2zM1 11.5A5.5 5.5 0 016.5 6H11v5.5A5.5 5.5 0 015.5 17H1v-5.5zm5-3.5H4v7h2.5A3.5 3.5 0 006 8zM12 11.5V6h4.5a5.5 5.5 0 010 11H12V11.5zm3.5 3.5a3.5 3.5 0 000-7H14v7h1.5z"/>
    </svg>`,

    artstation: `<svg class="social-card__icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 002.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.727a2.424 2.424 0 00-2.164-1.333H8.064l12.18 21.095 3.234-5.604a2.41 2.41 0 00.522-1.037zm-11.585-5.585l-5.604-9.701-5.604 9.701h11.208z"/>
    </svg>`,
  };

  return icons[id] || `<svg class="social-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>
  </svg>`;
}
