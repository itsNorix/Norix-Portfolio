/* ─── PAGE 04: TALENTS ───────────────────────────────────────────
   Reads from: i18n & data/skills.js
────────────────────────────────────────────────────────────────── */

window.NORIX_PAGES = window.NORIX_PAGES || {};

window.NORIX_PAGES.talents = {

  render() {
    const skills = window.NORIX_DATA.skills || [];

    const skillsHTML = skills.map(skill => _renderSkill(skill)).join('');

    const summaryHTML = skills.map(skill => `
      <div class="talents-summary__item">
        <span class="talents-summary__item-icon">${skill.icon}</span>
        <div class="talents-summary__item-name">${skill.name}</div>
        <div class="talents-summary__item-level">${skill.level}%</div>
      </div>
    `).join('');

    return `
      <div id="page-talents">
        <header class="page-header">
          <div class="page-chapter">04 — Chapter</div>
          <h1 class="page-title">Talents</h1>
          <p class="page-subtitle">Skills I'm actively developing as a creative artist.</p>
        </header>

        <div class="talents-layout">

          <!-- Left: intro copy -->
          <div class="talents-intro" aria-label="About my skills">
            <p class="talents-intro__quote">
              "I believe in learning by doing. Every project teaches me something new."
            </p>
            <p class="talents-intro__body">
              These percentages reflect my honest self-assessment of each tool. I'm still growing — and that's exactly the point. Every percentage here will be higher next year.
            </p>
            <div class="talents-intro__note">
              ✦ &nbsp;Skill levels are updated based on hands-on project mastery
            </div>
          </div>

          <!-- Right: skill bars -->
          <div class="talents-skills" role="list" aria-label="Skills">
            ${skillsHTML}
          </div>

        </div>

        <!-- Summary grid at bottom -->
        <section class="talents-summary" aria-label="Skills overview">
          <div class="talents-summary__label">Overview</div>
          <div class="talents-summary__grid">
            ${summaryHTML}
          </div>
        </section>

      </div>
    `;
  },

  init(pageEl) {
    const skillsContainer = pageEl.querySelector('.talents-skills');
    if (skillsContainer && window.NORIX_SKILLBAR) {
      window.NORIX_SKILLBAR.animate(skillsContainer);
    }
  },
};

/* ─── HELPERS ────────────────────────────────────────────────── */

function _renderSkill(skill) {
  const ticks = [0, 25, 50, 75, 100].map(() =>
    `<div class="skill-item__tick" aria-hidden="true"></div>`
  ).join('');

  return `
    <div class="skill-item" role="listitem" aria-label="${skill.name}: ${skill.level}%">
      <div class="skill-item__header">
        <div>
          <div class="skill-item__name">
            <span class="skill-item__icon" aria-hidden="true">${skill.icon}</span>
            ${skill.name}
          </div>
          ${skill.description
            ? `<span class="skill-item__meta">${skill.description}</span>`
            : ''}
        </div>
        <div class="skill-item__percent" aria-live="polite">0%</div>
      </div>

      <div class="skill-item__track" role="progressbar" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100" aria-label="${skill.name} proficiency">
        <div class="skill-item__fill" data-level="${skill.level}"></div>
        <div class="skill-item__ticks" aria-hidden="true">${ticks}</div>
      </div>
    </div>
  `;
}
