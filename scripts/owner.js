/*
  OWNER CONSOLE — scripts/owner.js
  Secret admin panel. Completely silent — no console messages.
  Unlock: NORIX_OWNER.unlock("IamOwner184#o3Norix_10")
  Open:   NORIX_OWNER.panel()
*/

(function () {
  'use strict';

  const OWNER_KEY = 'IamOwner184#o3Norix_10';
  const STORAGE_KEY = '_norix_owner_data';

  let _unlocked = false;
  let _panel = null;

  /* ── LOAD SAVED DATA (overrides data files at startup) ────────── */
  function loadOwnerData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      window.NORIX_DATA = window.NORIX_DATA || {};
      if (Array.isArray(saved.projects)) window.NORIX_DATA.projects = saved.projects;
      if (Array.isArray(saved.skills)) window.NORIX_DATA.skills = saved.skills;
      if (Array.isArray(saved.social)) window.NORIX_DATA.social = saved.social;
      if (Array.isArray(saved.playlists)) {
        window.NORIX_DATA.playlists = saved.playlists;
        window.NORIX_DATA.tutorials = saved.playlists;
      }
      if (saved.about && typeof saved.about === 'object') {
        window.NORIX_DATA.about = Object.assign({}, window.NORIX_DATA.about || {}, saved.about);
      }
    } catch (_) { }
  }

  function saveOwnerData() {
    const d = window.NORIX_DATA || {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      projects: d.projects || [],
      playlists: d.playlists || [],
      skills: d.skills || [],
      social: d.social || [],
      about: d.about || {},
    }));
  }

  /* ── SYNC OWNER DATA INTO i18n TRANSLATIONS (so pages see changes) ── */
  function syncTranslations() {
    const T = window.NORIX_TRANSLATIONS;
    if (!T) return;
    T.en = T.en || {};
    const d = window.NORIX_DATA || {};

    // About — pages read from NORIX_TRANSLATIONS[lang].about
    if (d.about) {
      T.en.about = Object.assign(T.en.about || {}, d.about);
    }

    // Skills/Talents — pages read from NORIX_TRANSLATIONS[lang].talents.skills
    if (d.skills) {
      T.en.talents = T.en.talents || {};
      T.en.talents.skills = d.skills;
    }

    // Social — pages read from NORIX_TRANSLATIONS[lang].social.links
    if (d.social) {
      T.en.social = T.en.social || {};
      T.en.social.links = d.social;
    }

    // Projects — pages read from NORIX_TRANSLATIONS[lang].work.projects[id]
    if (d.projects) {
      T.en.work = T.en.work || {};
      T.en.work.projects = T.en.work.projects || {};
      d.projects.forEach(p => {
        if (!p.id) return;
        T.en.work.projects[p.id] = {
          title: p.title,
          category: p.category,
          description: p.description,
          tags: p.tags,
        };
      });
    }
  }

  /* ── SAVE & REFRESH ── */
  function saveAndRefresh() {
    saveOwnerData();
    syncTranslations();

    // Push to Firebase so ALL visitors see the update
    if (window.NORIX_CLOUD && window.NORIX_CLOUD.isEnabled()) {
      const d = window.NORIX_DATA || {};
      const payload = {
        projects: d.projects || [],
        playlists: d.playlists || [],
        skills: d.skills || [],
        social: d.social || [],
        about: d.about || {},
      };
      window.NORIX_CLOUD.save(payload, function (ok, err) {
        showToast(ok ? '☁️ Saved & synced to cloud!' : '💾 Saved locally only (cloud error)');
      });
    } else {
      showToast('💾 Saved locally');
    }

    if (window.NORIX_ROUTER && typeof window.NORIX_ROUTER.refresh === 'function') {
      window.NORIX_ROUTER.refresh();
    }
  }

  /* ── PUBLIC API ── */
  Object.defineProperty(window, 'NORIX_OWNER', {
    get() {
      return {
        unlock(key) {
          if (key !== OWNER_KEY) return 'Error';
          _unlocked = true;
          return 'OK';
        },
        panel() {
          if (!_unlocked) return undefined;
          openPanel();
        },
        save() {
          if (!_unlocked) return undefined;
          saveAndRefresh();
        },
        reset() {
          if (!_unlocked) return undefined;
          if (confirm('Reset all owner data to defaults?')) {
            localStorage.removeItem(STORAGE_KEY);
            _unlocked = false;
            location.reload();
          }
        },
      };
    },
    configurable: false,
  });

  /* ── PANEL SHELL ── */
  function openPanel() {
    if (_panel && document.body.contains(_panel)) {
      _panel.style.display = _panel.style.display === 'none' ? 'flex' : 'none';
      return;
    }
    buildPanel();
  }

  function buildPanel() {
    if (_panel) _panel.remove();
    injectPanelStyles();

    _panel = document.createElement('div');
    _panel.id = 'owner-panel';
    _panel.innerHTML = `
      <div class="owner-panel__header">
        <div class="owner-panel__title">
          <span style="color:var(--accent);">⚙</span> Owner Console
        </div>
        <div class="owner-panel__header-btns">
          <button class="owner-btn owner-btn--save" id="owner-save-btn">💾 Save & Apply</button>
          <button class="owner-btn owner-btn--close" id="owner-close-btn">✕</button>
        </div>
      </div>
      <div class="owner-panel__tabs">
        <button class="owner-tab active" data-tab="projects">Projects</button>
        <button class="owner-tab" data-tab="playlists">Playlists</button>
        <button class="owner-tab" data-tab="about">About</button>
        <button class="owner-tab" data-tab="talents">Talents</button>
        <button class="owner-tab" data-tab="social">Social</button>
      </div>
      <div class="owner-panel__body">
        <div class="owner-tab-pane active" id="owner-tab-projects"></div>
        <div class="owner-tab-pane" id="owner-tab-playlists"></div>
        <div class="owner-tab-pane" id="owner-tab-about"></div>
        <div class="owner-tab-pane" id="owner-tab-talents"></div>
        <div class="owner-tab-pane" id="owner-tab-social"></div>
      </div>
    `;
    document.body.appendChild(_panel);
    bindPanelEvents();
    renderProjectsTab();
    renderPlaylistsTab();
    renderAboutTab();
    renderTalentsTab();
    renderSocialTab();
  }

  /* ══════════════════════════════════════════════════════════════
     PROJECTS TAB
  ══════════════════════════════════════════════════════════════ */
  function renderProjectsTab() {
    const pane = document.getElementById('owner-tab-projects');
    if (!pane) return;
    const projects = (window.NORIX_DATA || {}).projects || [];

    pane.innerHTML = `
      <div class="owner-section">
        <div class="owner-section__head">
          <span>Projects (${projects.length})</span>
          <button class="owner-btn owner-btn--add" id="owner-add-project">+ Add Project</button>
        </div>
        <div id="owner-projects-list">
          ${projects.length === 0 ? '<p class="owner-empty">No projects yet.</p>' : ''}
          ${projects.map((p, i) => `
            <div class="owner-item">
              <div class="owner-item__info">
                <span class="owner-item__badge">${p.type || 'video'}</span>
                <strong>${esc(p.title || '(untitled)')}</strong>
                <span class="owner-item__year">${p.year || ''}</span>
              </div>
              <div class="owner-item__btns">
                <button class="owner-btn owner-btn--sm" data-action="edit-project" data-index="${i}">Edit</button>
                <button class="owner-btn owner-btn--del" data-action="del-project" data-index="${i}">✕</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    pane.querySelector('#owner-add-project').addEventListener('click', () => openProjectForm(-1));
    pane.querySelectorAll('[data-action="edit-project"]').forEach(btn => {
      btn.addEventListener('click', () => openProjectForm(+btn.dataset.index));
    });
    pane.querySelectorAll('[data-action="del-project"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.dataset.index;
        if (confirm(`Delete "${projects[i].title}"?`)) {
          projects.splice(i, 1);
          window.NORIX_DATA.projects = projects;
          saveAndRefresh();
          renderProjectsTab();
        }
      });
    });
  }

  function openProjectForm(index) {
    const projects = (window.NORIX_DATA || {}).projects || [];
    const isNew = index === -1;
    const p = isNew ? {
      id: '', type: 'video-local', featured: true,
      title: '', category: '', year: new Date().getFullYear() + '',
      description: '', tags: [],
      videoFile: '', videoId: '', thumbnail: '',
      releaseIn: false, releaseDate: '', photos: [],
    } : JSON.parse(JSON.stringify(projects[index]));
    const tagsStr = Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '');

    createModal(`${isNew ? 'Add' : 'Edit'} Project`, `
      <div class="owner-form">
        <div class="owner-form__row2">
          <div class="owner-form__row">
            <label>Type <span class="req">*</span></label>
            <select id="pf-type">
              <option value="video-local"   ${p.type === 'video-local' ? 'selected' : ''}>Local MP4</option>
              <option value="video-youtube" ${p.type === 'video-youtube' ? 'selected' : ''}>YouTube</option>
              <option value="gallery"       ${p.type === 'gallery' ? 'selected' : ''}>Gallery</option>
            </select>
          </div>
          <div class="owner-form__row">
            <label>Year</label>
            <input id="pf-year" type="text" value="${esc(p.year)}" placeholder="2026" />
          </div>
        </div>
        <div class="owner-form__row">
          <label>Title <span class="req">*</span></label>
          <input id="pf-title" type="text" value="${esc(p.title)}" placeholder="My Project Title" />
        </div>
        <div class="owner-form__row">
          <label>Category</label>
          <input id="pf-cat" type="text" value="${esc(p.category)}" placeholder="3D Animation" />
        </div>
        <div class="owner-form__row">
          <label>Description</label>
          <textarea id="pf-desc" rows="3">${esc(p.description)}</textarea>
        </div>
        <div class="owner-form__row">
          <label>Tags (comma separated)</label>
          <input id="pf-tags" type="text" value="${esc(tagsStr)}" placeholder="Blender, VFX" />
        </div>
        <div class="owner-form__row" id="pf-row-videofile">
          <label>Video File Path</label>
          <input id="pf-videofile" type="text" value="${esc(p.videoFile || '')}" placeholder="assets/videos/my-video.mp4" />
        </div>
        <div class="owner-form__row" id="pf-row-videoid">
          <label>YouTube Video ID</label>
          <input id="pf-videoid" type="text" value="${esc(p.videoId || '')}" placeholder="dQw4w9WgXcQ" />
        </div>
        <div class="owner-form__row">
          <label>Thumbnail Path</label>
          <input id="pf-thumb" type="text" value="${esc(p.thumbnail || '')}" placeholder="assets/images/thumb.jpg" />
        </div>
        <div class="owner-form__row2">
          <div class="owner-form__row">
            <label>Status</label>
            <select id="pf-releasein">
              <option value="no"  ${!p.releaseIn ? 'selected' : ''}>Published</option>
              <option value="yes" ${p.releaseIn ? 'selected' : ''}>Coming in date</option>
            </select>
          </div>
          <div class="owner-form__row" id="pf-row-releasedate">
            <label>Release Date</label>
            <input id="pf-releasedate" type="text" value="${esc(p.releaseDate || '')}" placeholder="22/8/2026" />
          </div>
        </div>
        <div class="owner-form__row">
          <label><input type="checkbox" id="pf-featured" ${p.featured ? 'checked' : ''} style="margin-right:6px;"/> Featured (show in grid)</label>
        </div>
      </div>
    `, () => {
      const type = document.getElementById('pf-type').value;
      const saved = {
        id: p.id || ('proj-' + Date.now()),
        type,
        featured: document.getElementById('pf-featured').checked,
        title: document.getElementById('pf-title').value.trim(),
        category: document.getElementById('pf-cat').value.trim(),
        year: document.getElementById('pf-year').value.trim(),
        description: document.getElementById('pf-desc').value.trim(),
        tags: document.getElementById('pf-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        thumbnail: document.getElementById('pf-thumb').value.trim(),
        releaseIn: document.getElementById('pf-releasein').value === 'yes',
        releaseDate: document.getElementById('pf-releasedate').value.trim(),
        videoFile: type === 'video-local' ? document.getElementById('pf-videofile').value.trim() : '',
        videoId: type === 'video-youtube' ? document.getElementById('pf-videoid').value.trim() : '',
        photos: p.photos || [],
      };
      if (!saved.title) { alert('Title is required.'); return false; }
      if (isNew) projects.push(saved); else projects[index] = saved;
      window.NORIX_DATA.projects = projects;
      saveAndRefresh(); renderProjectsTab();
      return true;
    });
    function updateType() {
      const t = document.getElementById('pf-type').value;
      document.getElementById('pf-row-videofile').style.display = t === 'video-local' ? '' : 'none';
      document.getElementById('pf-row-videoid').style.display = t === 'video-youtube' ? '' : 'none';
    }
    function updateRelease() {
      document.getElementById('pf-row-releasedate').style.display =
        document.getElementById('pf-releasein').value === 'yes' ? '' : 'none';
    }
    document.getElementById('pf-type').addEventListener('change', updateType);
    document.getElementById('pf-releasein').addEventListener('change', updateRelease);
    updateType(); updateRelease();
  }

  /* ══════════════════════════════════════════════════════════════
     PLAYLISTS TAB
  ══════════════════════════════════════════════════════════════ */
  function renderPlaylistsTab() {
    const pane = document.getElementById('owner-tab-playlists');
    if (!pane) return;
    const playlists = (window.NORIX_DATA || {}).playlists || [];

    pane.innerHTML = `
      <div class="owner-section">
        <div class="owner-section__head">
          <span>Playlists (${playlists.length})</span>
          <button class="owner-btn owner-btn--add" id="owner-add-playlist">+ Add Playlist</button>
        </div>
        ${playlists.length === 0 ? '<p class="owner-empty">No playlists yet.</p>' : ''}
        ${playlists.map((pl, i) => `
          <div class="owner-item">
            <div class="owner-item__info">
              <span class="owner-item__badge">${(pl.videos || []).length} videos</span>
              <strong>${esc(pl.title || '(untitled)')}</strong>
            </div>
            <div class="owner-item__btns">
              <button class="owner-btn owner-btn--sm" data-action="edit-pl" data-index="${i}">Edit</button>
              <button class="owner-btn owner-btn--del" data-action="del-pl" data-index="${i}">✕</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    pane.querySelector('#owner-add-playlist').addEventListener('click', () => openPlaylistForm(-1));
    pane.querySelectorAll('[data-action="edit-pl"]').forEach(btn =>
      btn.addEventListener('click', () => openPlaylistForm(+btn.dataset.index)));
    pane.querySelectorAll('[data-action="del-pl"]').forEach(btn =>
      btn.addEventListener('click', () => {
        const i = +btn.dataset.index;
        if (confirm(`Delete "${playlists[i].title}"?`)) {
          playlists.splice(i, 1);
          window.NORIX_DATA.playlists = playlists;
          window.NORIX_DATA.tutorials = playlists;
          saveAndRefresh(); renderPlaylistsTab();
        }
      }));
  }

  function openPlaylistForm(index) {
    const playlists = (window.NORIX_DATA || {}).playlists || [];
    const isNew = index === -1;
    const pl = isNew ? { id: '', title: '', badge: '', description: '', thumbnail: '', videos: [] }
      : JSON.parse(JSON.stringify(playlists[index]));

    createModal(`${isNew ? 'Add' : 'Edit'} Playlist`, `
      <div class="owner-form">
        <div class="owner-form__row">
          <label>Title <span class="req">*</span></label>
          <input id="plf-title" type="text" value="${esc(pl.title)}" placeholder="Blender 3D Series" />
        </div>
        <div class="owner-form__row">
          <label>Badge Label</label>
          <input id="plf-badge" type="text" value="${esc(pl.badge || '')}" placeholder="Blender Series" />
        </div>
        <div class="owner-form__row">
          <label>Description</label>
          <textarea id="plf-desc" rows="2">${esc(pl.description || '')}</textarea>
        </div>
        <div class="owner-form__row">
          <label>Thumbnail Path</label>
          <input id="plf-thumb" type="text" value="${esc(pl.thumbnail || '')}" placeholder="assets/images/thumb.jpg" />
        </div>
        <hr class="owner-hr"/>
        <div class="owner-section__head">
          <span>Videos (${(pl.videos || []).length})</span>
          <button class="owner-btn owner-btn--add" id="plf-add-video">+ Add Video</button>
        </div>
        <div id="plf-videos-list">
          ${(pl.videos || []).map((v, vi) => `
            <div class="owner-item owner-item--small">
              <span>${vi + 1}. ${esc(v.title || '(untitled)')}</span>
              <button class="owner-btn owner-btn--del" data-vi="${vi}">✕</button>
            </div>
          `).join('')}
        </div>
      </div>
    `, () => {
      const saved = {
        id: pl.id || ('pl-' + Date.now()),
        title: document.getElementById('plf-title').value.trim(),
        badge: document.getElementById('plf-badge').value.trim(),
        description: document.getElementById('plf-desc').value.trim(),
        thumbnail: document.getElementById('plf-thumb').value.trim(),
        videos: pl.videos || [],
      };
      if (!saved.title) { alert('Title is required.'); return false; }
      if (isNew) playlists.push(saved); else playlists[index] = saved;
      window.NORIX_DATA.playlists = playlists;
      window.NORIX_DATA.tutorials = playlists;
      saveAndRefresh(); renderPlaylistsTab();
      return true;
    });

    document.getElementById('plf-add-video').addEventListener('click', () => {
      const title = prompt('Video title:'); if (!title) return;
      const videoId = prompt('YouTube Video ID (or leave blank):') || '';
      const duration = prompt('Duration (e.g. 12:34):') || '';
      pl.videos = pl.videos || [];
      pl.videos.push({ id: 'v' + Date.now(), title, videoId, duration, videoFile: '', thumbnail: '', url: '' });
      refreshVideoList();
    });

    document.getElementById('plf-videos-list').addEventListener('click', e => {
      const btn = e.target.closest('[data-vi]'); if (!btn) return;
      pl.videos.splice(+btn.dataset.vi, 1);
      refreshVideoList();
    });

    function refreshVideoList() {
      document.getElementById('plf-videos-list').innerHTML = (pl.videos || []).map((v, vi) => `
        <div class="owner-item owner-item--small">
          <span>${vi + 1}. ${esc(v.title)}</span>
          <button class="owner-btn owner-btn--del" data-vi="${vi}">✕</button>
        </div>
      `).join('');
    }
  }

  /* ══════════════════════════════════════════════════════════════
     ABOUT TAB
  ══════════════════════════════════════════════════════════════ */
  function renderAboutTab() {
    const pane = document.getElementById('owner-tab-about');
    if (!pane) return;
    // Read from i18n EN translation (source of truth the page uses)
    const i18nData = (window.NORIX_I18N && window.NORIX_I18N.t('about')) || {};
    const raw = (window.NORIX_DATA || {}).about || {};
    const d = Object.assign({}, raw, i18nData); // i18n wins for display, raw for fallback

    pane.innerHTML = `
      <div class="owner-form">
        <div class="owner-form__row2">
          <div class="owner-form__row">
            <label>Your Name</label>
            <input id="ab-name" type="text" value="${esc(d.name || '')}" />
          </div>
          <div class="owner-form__row">
            <label>Status Badge</label>
            <input id="ab-status" type="text" value="${esc(d.status || '')}" placeholder="Open for Freelance" />
          </div>
        </div>
        <div class="owner-form__row">
          <label>Title / Profession</label>
          <input id="ab-title" type="text" value="${esc(d.title || '')}" />
        </div>
        <div class="owner-form__row">
          <label>Tags (comma separated)</label>
          <input id="ab-tags" type="text" value="${esc((d.tags || []).join(', '))}" />
        </div>
        <div class="owner-form__row">
          <label>Bio (each paragraph on a new line)</label>
          <textarea id="ab-bio" rows="6">${esc((d.bio || []).join('\n'))}</textarea>
        </div>
        <div class="owner-form__row">
          <label>Quote</label>
          <textarea id="ab-quote" rows="2">${esc(d.quote || '')}</textarea>
        </div>
        <button class="owner-btn owner-btn--save" id="ab-save-btn" style="margin-top:8px;">💾 Save About</button>
      </div>
    `;

    pane.querySelector('#ab-save-btn').addEventListener('click', () => {
      const updated = {
        name: document.getElementById('ab-name').value.trim(),
        title: document.getElementById('ab-title').value.trim(),
        status: document.getElementById('ab-status').value.trim(),
        tags: document.getElementById('ab-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        bio: document.getElementById('ab-bio').value.split('\n').map(l => l.trim()).filter(Boolean),
        quote: document.getElementById('ab-quote').value.trim(),
        highlights: (window.NORIX_DATA.about || {}).highlights,
      };
      window.NORIX_DATA.about = updated;
      // Also write directly into the i18n EN translation so the about page sees it immediately
      if (window.NORIX_TRANSLATIONS && window.NORIX_TRANSLATIONS.en) {
        window.NORIX_TRANSLATIONS.en.about = Object.assign(
          window.NORIX_TRANSLATIONS.en.about || {}, updated
        );
      }
      saveAndRefresh();
    });
  }

  /* ══════════════════════════════════════════════════════════════
     TALENTS TAB
  ══════════════════════════════════════════════════════════════ */
  function renderTalentsTab() {
    const pane = document.getElementById('owner-tab-talents');
    if (!pane) return;
    const skills = (window.NORIX_DATA || {}).skills || [];

    pane.innerHTML = `
      <div class="owner-section">
        <div class="owner-section__head">
          <span>Skills / Talents (${skills.length})</span>
          <button class="owner-btn owner-btn--add" id="owner-add-skill">+ Add Skill</button>
        </div>
        ${skills.length === 0 ? '<p class="owner-empty">No skills yet.</p>' : ''}
        ${skills.map((s, i) => `
          <div class="owner-item">
            <div class="owner-item__info">
              <span style="font-size:18px;">${s.icon || '🔵'}</span>
              <strong>${esc(s.name || '(unnamed)')}</strong>
              <span class="owner-item__badge">${s.level || 0}%</span>
            </div>
            <div class="owner-item__btns">
              <button class="owner-btn owner-btn--sm" data-action="edit-skill" data-index="${i}">Edit</button>
              <button class="owner-btn owner-btn--del" data-action="del-skill" data-index="${i}">✕</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    pane.querySelector('#owner-add-skill').addEventListener('click', () => openSkillForm(-1));
    pane.querySelectorAll('[data-action="edit-skill"]').forEach(btn =>
      btn.addEventListener('click', () => openSkillForm(+btn.dataset.index)));
    pane.querySelectorAll('[data-action="del-skill"]').forEach(btn =>
      btn.addEventListener('click', () => {
        const i = +btn.dataset.index;
        if (confirm(`Delete skill "${skills[i].name}"?`)) {
          skills.splice(i, 1);
          window.NORIX_DATA.skills = skills;
          saveAndRefresh(); renderTalentsTab();
        }
      }));
  }

  function openSkillForm(index) {
    const skills = (window.NORIX_DATA || {}).skills || [];
    const isNew = index === -1;
    const s = isNew ? { name: '', level: 50, description: '', icon: '🔵', category: '' }
      : Object.assign({}, skills[index]);

    createModal(`${isNew ? 'Add' : 'Edit'} Skill`, `
      <div class="owner-form">
        <div class="owner-form__row2">
          <div class="owner-form__row">
            <label>Icon (emoji)</label>
            <input id="sf-icon" type="text" value="${esc(s.icon || '🔵')}" placeholder="🟠" style="font-size:20px;" />
          </div>
          <div class="owner-form__row">
            <label>Level (0–100) <span class="req">*</span></label>
            <input id="sf-level" type="number" min="0" max="100" value="${s.level || 50}" />
          </div>
        </div>
        <div class="owner-form__row">
          <label>Skill Name <span class="req">*</span></label>
          <input id="sf-name" type="text" value="${esc(s.name)}" placeholder="Blender" />
        </div>
        <div class="owner-form__row">
          <label>Description</label>
          <input id="sf-desc" type="text" value="${esc(s.description || '')}" placeholder="3D modeling, animation, rendering" />
        </div>
        <div class="owner-form__row">
          <label>Category (optional)</label>
          <input id="sf-cat" type="text" value="${esc(s.category || '')}" placeholder="3D / Video / Design / Code" />
        </div>
      </div>
    `, () => {
      const saved = {
        name: document.getElementById('sf-name').value.trim(),
        level: Math.min(100, Math.max(0, +document.getElementById('sf-level').value || 0)),
        description: document.getElementById('sf-desc').value.trim(),
        icon: document.getElementById('sf-icon').value.trim() || '🔵',
        category: document.getElementById('sf-cat').value.trim(),
      };
      if (!saved.name) { alert('Skill name is required.'); return false; }
      if (isNew) skills.push(saved); else skills[index] = saved;
      window.NORIX_DATA.skills = skills;
      saveAndRefresh(); renderTalentsTab();
      return true;
    });
  }

  /* ══════════════════════════════════════════════════════════════
     SOCIAL TAB
  ══════════════════════════════════════════════════════════════ */
  function renderSocialTab() {
    const pane = document.getElementById('owner-tab-social');
    if (!pane) return;
    const social = (window.NORIX_DATA || {}).social || [];

    pane.innerHTML = `
      <div class="owner-section">
        <div class="owner-section__head">
          <span>Social Links (${social.length})</span>
          <button class="owner-btn owner-btn--add" id="owner-add-social">+ Add Link</button>
        </div>
        ${social.length === 0 ? '<p class="owner-empty">No social links yet.</p>' : ''}
        ${social.map((s, i) => `
          <div class="owner-item">
            <div class="owner-item__info">
              <span class="owner-item__badge" style="background:${s.color || '#555'}20;color:${s.color || '#aaa'};border-color:${s.color || '#555'}40;">${s.platform || s.id || 'Link'}</span>
              <strong>${esc(s.handle || s.url || '')}</strong>
            </div>
            <div class="owner-item__btns">
              <button class="owner-btn owner-btn--sm" data-action="edit-social" data-index="${i}">Edit</button>
              <button class="owner-btn owner-btn--del" data-action="del-social" data-index="${i}">✕</button>
            </div>
          </div>
        `).join('')}
        <p class="owner-hint">Supported icon IDs: discord · instagram · youtube · twitter · tiktok · behance · artstation</p>
      </div>
    `;

    pane.querySelector('#owner-add-social').addEventListener('click', () => openSocialForm(-1));
    pane.querySelectorAll('[data-action="edit-social"]').forEach(btn =>
      btn.addEventListener('click', () => openSocialForm(+btn.dataset.index)));
    pane.querySelectorAll('[data-action="del-social"]').forEach(btn =>
      btn.addEventListener('click', () => {
        const i = +btn.dataset.index;
        if (confirm(`Delete "${social[i].platform}" link?`)) {
          social.splice(i, 1);
          window.NORIX_DATA.social = social;
          saveAndRefresh(); renderSocialTab();
        }
      }));
  }

  function openSocialForm(index) {
    const social = (window.NORIX_DATA || {}).social || [];
    const isNew = index === -1;
    const s = isNew ? { id: '', platform: '', handle: '', url: '', label: '', color: '#ffffff', visible: true }
      : Object.assign({}, social[index]);

    createModal(`${isNew ? 'Add' : 'Edit'} Social Link`, `
      <div class="owner-form">
        <div class="owner-form__row2">
          <div class="owner-form__row">
            <label>Icon ID <span class="req">*</span></label>
            <input id="sl-id" type="text" value="${esc(s.id)}" placeholder="instagram" />
          </div>
          <div class="owner-form__row">
            <label>Accent Color</label>
            <input id="sl-color" type="color" value="${s.color || '#ffffff'}" style="height:36px;padding:2px 4px;" />
          </div>
        </div>
        <div class="owner-form__row">
          <label>Platform Name <span class="req">*</span></label>
          <input id="sl-platform" type="text" value="${esc(s.platform)}" placeholder="Instagram" />
        </div>
        <div class="owner-form__row">
          <label>Handle / Username</label>
          <input id="sl-handle" type="text" value="${esc(s.handle || '')}" placeholder="@yourhandle" />
        </div>
        <div class="owner-form__row">
          <label>Full URL <span class="req">*</span></label>
          <input id="sl-url" type="url" value="${esc(s.url || '')}" placeholder="https://instagram.com/yourhandle" />
        </div>
        <div class="owner-form__row">
          <label>Button Label</label>
          <input id="sl-label" type="text" value="${esc(s.label || '')}" placeholder="Follow on Instagram" />
        </div>
        <div class="owner-form__row">
          <label><input type="checkbox" id="sl-visible" ${s.visible !== false ? 'checked' : ''} style="margin-right:6px;"/> Visible on site</label>
        </div>
      </div>
    `, () => {
      const saved = {
        id: document.getElementById('sl-id').value.trim().toLowerCase(),
        platform: document.getElementById('sl-platform').value.trim(),
        handle: document.getElementById('sl-handle').value.trim(),
        url: document.getElementById('sl-url').value.trim(),
        label: document.getElementById('sl-label').value.trim(),
        color: document.getElementById('sl-color').value,
        visible: document.getElementById('sl-visible').checked,
      };
      if (!saved.id) { alert('Icon ID is required.'); return false; }
      if (!saved.platform) { alert('Platform name is required.'); return false; }
      if (!saved.url) { alert('URL is required.'); return false; }
      if (isNew) social.push(saved); else social[index] = saved;
      window.NORIX_DATA.social = social;
      saveAndRefresh(); renderSocialTab();
      return true;
    });
  }

  /* ══════════════════════════════════════════════════════════════
     PANEL INFRASTRUCTURE
  ══════════════════════════════════════════════════════════════ */
  function bindPanelEvents() {
    document.getElementById('owner-close-btn').addEventListener('click', () => {
      _panel.style.display = 'none';
    });
    document.getElementById('owner-save-btn').addEventListener('click', saveAndRefresh);

    _panel.querySelectorAll('.owner-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        _panel.querySelectorAll('.owner-tab').forEach(t => t.classList.remove('active'));
        _panel.querySelectorAll('.owner-tab-pane').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('owner-tab-' + tab.dataset.tab).classList.add('active');
      });
    });

    // Draggable header
    const header = _panel.querySelector('.owner-panel__header');
    let dragging = false, ox = 0, oy = 0;
    header.style.cursor = 'grab';
    header.addEventListener('mousedown', e => {
      dragging = true;
      const r = _panel.getBoundingClientRect();
      ox = e.clientX - r.left; oy = e.clientY - r.top;
      header.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      _panel.style.left = (e.clientX - ox) + 'px';
      _panel.style.top = (e.clientY - oy) + 'px';
      _panel.style.right = 'auto';
      _panel.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => { dragging = false; header.style.cursor = 'grab'; });
  }

  function createModal(title, bodyHTML, onSave) {
    const existing = document.getElementById('owner-modal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'owner-modal';
    modal.innerHTML = `
      <div class="owner-modal__overlay"></div>
      <div class="owner-modal__box">
        <div class="owner-modal__header">
          <span>${title}</span>
          <button class="owner-btn owner-btn--close" id="owner-modal-close">✕</button>
        </div>
        <div class="owner-modal__body">${bodyHTML}</div>
        <div class="owner-modal__footer">
          <button class="owner-btn owner-btn--cancel" id="owner-modal-cancel">Cancel</button>
          <button class="owner-btn owner-btn--save" id="owner-modal-save">✅ Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('#owner-modal-close').addEventListener('click', close);
    modal.querySelector('#owner-modal-cancel').addEventListener('click', close);
    modal.querySelector('.owner-modal__overlay').addEventListener('click', close);
    modal.querySelector('#owner-modal-save').addEventListener('click', () => {
      if (onSave() !== false) close();
    });
    return modal;
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'owner-toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2200);
  }

  function esc(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function injectPanelStyles() {
    if (document.getElementById('owner-styles')) return;
    const style = document.createElement('style');
    style.id = 'owner-styles';
    style.textContent = `
      #owner-panel{position:fixed;right:20px;top:20px;width:500px;max-height:90vh;background:rgba(8,16,26,.97);border:1px solid var(--accent-border,rgba(89,227,255,.35));border-radius:14px;box-shadow:0 8px 48px rgba(0,0,0,.7),0 0 30px rgba(89,227,255,.08);z-index:99999;display:flex;flex-direction:column;font-family:'Outfit',sans-serif;color:#ecf1f8;overflow:hidden;backdrop-filter:blur(20px);}
      .owner-panel__header{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid rgba(89,227,255,.12);flex-shrink:0;}
      .owner-panel__title{font-size:14px;font-weight:700;}
      .owner-panel__header-btns{display:flex;gap:8px;}
      .owner-panel__tabs{display:flex;gap:2px;padding:10px 14px 0;flex-shrink:0;overflow-x:auto;}
      .owner-tab{background:transparent;border:1px solid rgba(89,227,255,.15);border-bottom:none;color:#6e88a0;padding:5px 12px;border-radius:7px 7px 0 0;cursor:pointer;font-size:12px;font-family:'Outfit',sans-serif;transition:color .15s,background .15s;white-space:nowrap;}
      .owner-tab.active,.owner-tab:hover{color:var(--accent,#59E3FF);background:rgba(89,227,255,.07);border-color:rgba(89,227,255,.3);}
      .owner-panel__body{flex:1;overflow-y:auto;padding:14px;}
      .owner-tab-pane{display:none;}.owner-tab-pane.active{display:block;}
      .owner-section__head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-size:12px;color:#6e88a0;}
      .owner-item{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;margin-bottom:5px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:8px;gap:8px;}
      .owner-item--small{padding:5px 10px;}
      .owner-item__info{display:flex;align-items:center;gap:8px;font-size:13px;flex:1;min-width:0;}
      .owner-item__info strong{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;}
      .owner-item__year{font-size:11px;color:#6e88a0;}
      .owner-item__btns{display:flex;gap:5px;flex-shrink:0;}
      .owner-item__badge{font-size:10px;padding:2px 7px;border-radius:4px;background:rgba(89,227,255,.1);color:var(--accent,#59E3FF);border:1px solid rgba(89,227,255,.2);white-space:nowrap;flex-shrink:0;}
      .owner-empty{color:#6e88a0;font-size:12px;text-align:center;padding:16px 0;}
      .owner-hint{color:#3a506a;font-size:11px;margin-top:10px;line-height:1.5;}
      .owner-hr{border:none;border-top:1px solid rgba(255,255,255,.08);margin:12px 0;}
      .owner-btn{background:rgba(89,227,255,.08);border:1px solid rgba(89,227,255,.2);color:var(--accent,#59E3FF);padding:5px 12px;border-radius:6px;cursor:pointer;font-size:12px;font-family:'Outfit',sans-serif;transition:background .15s;white-space:nowrap;}
      .owner-btn:hover{background:rgba(89,227,255,.18);}
      .owner-btn--sm{padding:4px 10px;font-size:11px;}
      .owner-btn--del{color:#ff6b6b;background:rgba(255,107,107,.08);border-color:rgba(255,107,107,.2);}
      .owner-btn--del:hover{background:rgba(255,107,107,.2);}
      .owner-btn--close{background:transparent;border:none;color:#6e88a0;font-size:16px;padding:2px 6px;}
      .owner-btn--cancel{color:#6e88a0;background:transparent;border-color:rgba(255,255,255,.1);}
      .owner-form{display:flex;flex-direction:column;gap:10px;}
      .owner-form__row{display:flex;flex-direction:column;gap:3px;}
      .owner-form__row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
      .owner-form__row label{font-size:11px;color:#6e88a0;}
      .owner-form__row input,.owner-form__row select,.owner-form__row textarea{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:7px;color:#ecf1f8;padding:7px 10px;font-size:13px;font-family:'Outfit',sans-serif;outline:none;resize:vertical;transition:border-color .15s;}
      .owner-form__row input:focus,.owner-form__row select:focus,.owner-form__row textarea:focus{border-color:rgba(89,227,255,.4);}
      .owner-form__row select option{background:#08101a;color:#ecf1f8;}
      .req{color:var(--accent,#59E3FF);}
      #owner-modal{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;}
      .owner-modal__overlay{position:absolute;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);}
      .owner-modal__box{position:relative;width:520px;max-width:96vw;max-height:88vh;background:rgba(8,16,26,.98);border:1px solid rgba(89,227,255,.3);border-radius:14px;box-shadow:0 20px 80px rgba(0,0,0,.8);display:flex;flex-direction:column;overflow:hidden;}
      .owner-modal__header{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid rgba(89,227,255,.1);font-size:14px;font-weight:700;flex-shrink:0;}
      .owner-modal__body{flex:1;overflow-y:auto;padding:16px;}
      .owner-modal__footer{padding:11px 16px;border-top:1px solid rgba(89,227,255,.1);display:flex;justify-content:flex-end;gap:10px;flex-shrink:0;}
      .owner-toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(10px);background:rgba(8,16,26,.95);border:1px solid rgba(89,227,255,.35);color:var(--accent,#59E3FF);padding:9px 22px;border-radius:30px;font-size:13px;font-family:'Outfit',sans-serif;z-index:9999999;opacity:0;transition:opacity .25s,transform .25s;box-shadow:0 4px 24px rgba(89,227,255,.15);pointer-events:none;}
      .owner-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
    `;
    document.head.appendChild(style);
  }

  /* ── INIT ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadOwnerData);
  } else {
    loadOwnerData();
  }

}());
