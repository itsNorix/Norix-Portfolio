/* ─── PAGE 01: ABOUT ME ──────────────────────────────────────────
   Reads from: i18n translation dictionary or data/about.js
────────────────────────────────────────────────────────────────── */

window.NORIX_PAGES = window.NORIX_PAGES || {};

window.NORIX_PAGES.about = {

  render() {
    const i18n = window.NORIX_I18N;
    const d = (i18n && i18n.t('about')) || window.NORIX_DATA.about;

    const tagsHTML = (d.tags || []).map(t =>
      `<span class="about-tag">${t}</span>`
    ).join('');

    const bioParagraphs = d.bio || [];
    const nameToHighlight = i18n && i18n.getLang() === 'ar' ? 'نوريكس' : 'Norix';
    const regex = new RegExp(`\\b${nameToHighlight}\\b`, 'g');
    
    const leadText = bioParagraphs[0]
      ? bioParagraphs[0].replace(regex, `<span class="about-text-glow">${nameToHighlight}</span>`)
      : '';
    const middleParagraphs = bioParagraphs.slice(1, -1);
    const farewellText = bioParagraphs[bioParagraphs.length - 1] || '';

    const middleHTML = middleParagraphs.map(p =>
      `<p class="about-card__paragraph">${p}</p>`
    ).join('');

    const pillarsHTML = (d.highlights || []).map(item => `
      <div class="about-pillar-card">
        <span class="about-pillar-icon" aria-hidden="true">${item.icon}</span>
        <div class="about-pillar-title">${item.title}</div>
        <p class="about-pillar-desc">${item.desc}</p>
      </div>
    `).join('');

    const exploreBtnText = d.exploreBtn || 'Explore My Work';
    const contactBtnText = d.contactBtn || 'Get In Touch';

    return `
      <!-- ── LEFT PANEL: Hero (Name, Titles, Tags) ─────────────── -->
      <div class="about-hero">
        <span class="about-chapter" aria-hidden="true">${d.chapter || '01 / About'}</span>

        <div class="about-name" aria-label="${d.name}">
          <span class="about-name__accent">${d.name}</span>
          <span class="about-name__outline" aria-hidden="true">${d.name}</span>
        </div>

        <div class="about-title" aria-label="${d.title}">
          ${d.title}
        </div>

        <div class="about-tags" aria-label="Interests">
          ${tagsHTML}
        </div>
      </div>

      <!-- ── RIGHT PANEL: Full Rich Bio Card ───────────────────── -->
      <div class="about-bio">
        <article class="about-card" aria-label="About Norix">
          
          <!-- Top Header Meta -->
          <div class="about-card__meta-bar">
            <div class="about-card__badge">
              <span class="about-card__badge-dot" aria-hidden="true"></span>
              <span>${d.badge || 'PROFILE // ABOUT ME'}</span>
            </div>
            ${d.status ? `
              <div class="about-card__status" aria-label="Current status">
                <span class="about-status-pulse" aria-hidden="true"></span>
                <span>${d.status}</span>
              </div>
            ` : ''}
          </div>

          <div class="about-card__content">
            <!-- Lead Intro Statement -->
            <h2 class="about-card__lead">${leadText}</h2>

            <!-- Narrative Paragraphs -->
            <div class="about-card__body">
              ${middleHTML}
            </div>

            <!-- 3 Creative Pillars / Focus Cards -->
            ${pillarsHTML ? `
              <div class="about-card__pillars" role="region" aria-label="Creative Focus Areas">
                ${pillarsHTML}
              </div>
            ` : ''}

            <!-- Philosophy Quote Banner -->
            ${d.quote ? `
              <blockquote class="about-card__quote">
                <span class="about-quote-mark" aria-hidden="true">“</span>
                <p class="about-quote-text">${d.quote}</p>
              </blockquote>
            ` : ''}

            <!-- Farewell & Interactive Action Links -->
            <div class="about-card__footer">
              <p class="about-card__farewell">${farewellText}</p>
              <div class="about-card__actions">
                <a href="#work" class="about-action-btn primary" data-nav="work">
                  ${exploreBtnText}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
                <a href="#social" class="about-action-btn secondary" data-nav="social">
                  ${contactBtnText}
                </a>
              </div>
            </div>

          </div>
        </article>
      </div>
    `;
  },

  init(pageEl) {
    const card = pageEl.querySelector('.about-card');
    const heroElements = [
      pageEl.querySelector('.about-chapter'),
      pageEl.querySelector('.about-name'),
      pageEl.querySelector('.about-title'),
      pageEl.querySelector('.about-tags'),
    ].filter(Boolean);

    heroElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity 400ms ease, transform 400ms ease';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 50 + i * 60);
    });

    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(14px) scale(0.99)';
      card.style.transition = 'opacity 450ms ease, transform 450ms ease';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, 120);

      // Wire in-card action buttons to router
      card.querySelectorAll('.about-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = btn.getAttribute('data-nav');
          if (!target) return;
          e.preventDefault();
          const nav = (window.NORIX_I18N && window.NORIX_I18N.t('navigation')) || window.NORIX_DATA.navigation;
          const idx = nav.findIndex(n => n.id === target);
          if (idx !== -1 && window.NORIX_ROUTER) {
            window.NORIX_ROUTER.navigate(target, idx);
          }
        });
      });
    }
  },
};
