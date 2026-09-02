/* ─── PAGE 03: TUTORIALS (Playlists & Videos) ─────────────────────
   Reads from: i18n & data/tutorials.js
────────────────────────────────────────────────────────────────── */

window.NORIX_PAGES = window.NORIX_PAGES || {};

window.NORIX_PAGES.tutorials = {

  render() {
    const playlists = window.NORIX_DATA.playlists || window.NORIX_DATA.tutorials || [];
    const hasPlaylists = playlists.length > 0 && playlists.some(p => p.videos && p.videos.length > 0);

    if (!hasPlaylists) {
      return `
        <header class="tutorials-header page-header">
          <div class="page-chapter">03 — Chapter</div>
          <h1 class="page-title">Tutorials</h1>
          <p class="page-subtitle">Educational playlists, 3D breakdowns, and production guides.</p>
        </header>

        <div class="tutorials-empty-card" aria-label="No tutorials yet">
          <div class="tutorials-empty-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="3" ry="3"></rect>
            </svg>
          </div>
          <div class="tutorials-empty-badge">Coming Soon</div>
          <h2 class="tutorials-empty-title">There is no tutorials for now but i will make it soon as</h2>
          <p class="tutorials-empty-subtitle">Subscribe to my YouTube channel to be the first to know when new tutorials launch.</p>
          <a
            href="https://www.youtube.com/@itsNorix-0"
            target="_blank"
            rel="noopener noreferrer"
            class="tutorials-empty-btn"
            aria-label="Visit Norix YouTube channel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8z"/>
              <polygon points="9.8,15.5 15.8,12 9.8,8.5" fill="#fff"/>
            </svg>
            Visit @itsNorix-0 on YouTube
          </a>
        </div>
      `;
    }

    const playlistTabsHTML = playlists.map((pl, idx) => `
      <button
        class="playlist-tab-btn${idx === 0 ? ' active' : ''}"
        data-playlist-id="${pl.id}"
        role="tab"
        aria-selected="${idx === 0 ? 'true' : 'false'}"
        aria-controls="playlist-panel-${pl.id}"
      >
        <span class="playlist-tab-badge">${pl.badge || 'Playlist'}</span>
        <span class="playlist-tab-title">${pl.title}</span>
        <span class="playlist-tab-count">${(pl.videos || []).length} videos</span>
      </button>
    `).join('');

    const playlistPanelsHTML = playlists.map((pl, idx) => _renderPlaylistPanel(pl, idx === 0)).join('');

    return `
      <header class="tutorials-header page-header">
        <div class="page-chapter">03 — Chapter</div>
        <h1 class="page-title">Tutorials</h1>
        <p class="page-subtitle">Educational playlists, step-by-step 3D guides, and video breakdowns.</p>
        <a
          href="https://www.youtube.com/@itsNorix-0"
          target="_blank"
          rel="noopener noreferrer"
          class="tutorials-channel-link"
          aria-label="Visit Norix YouTube channel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8z"/>
            <polygon points="9.8,15.5 15.8,12 9.8,8.5" fill="#fff"/>
          </svg>
          Visit @itsNorix-0 on YouTube
        </a>
      </header>

      <!-- Playlist Selector Tabs -->
      <div class="playlist-tabs-nav" role="tablist" aria-label="Tutorial Playlists">
        ${playlistTabsHTML}
      </div>

      <!-- Playlist Panels -->
      <div class="playlist-panels-container">
        ${playlistPanelsHTML}
      </div>
    `;
  },

  init(pageEl) {
    const playlists = window.NORIX_DATA.playlists || window.NORIX_DATA.tutorials || [];

    // Tab switching handler
    const tabBtns = pageEl.querySelectorAll('.playlist-tab-btn');
    const panels = pageEl.querySelectorAll('.playlist-panel');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const playlistId = btn.dataset.playlistId;
        tabBtns.forEach(b => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        panels.forEach(panel => {
          const isActive = panel.dataset.playlistId === playlistId;
          panel.classList.toggle('active', isActive);
        });
      });
    });

    // Wire each playlist panel's video items & player
    panels.forEach(panel => {
      const playlistId = panel.dataset.playlistId;
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist || !playlist.videos || playlist.videos.length === 0) return;

      const playerStage = panel.querySelector('.playlist-player-stage');
      const videoItems = panel.querySelectorAll('.playlist-queue__item');
      const currentTitle = panel.querySelector('.playlist-player__active-title');
      const currentDesc = panel.querySelector('.playlist-player__active-desc');
      const prevBtn = panel.querySelector('.playlist-ctrl-prev');
      const nextBtn = panel.querySelector('.playlist-ctrl-next');
      const countIndicator = panel.querySelector('.playlist-queue__header-count');

      let currentVideoIdx = 0;

      function updateActiveVideo(index, autoPlay = false) {
        currentVideoIdx = index;
        const video = playlist.videos[index];
        if (!video) return;

        videoItems.forEach((item, i) => {
          item.classList.toggle('active', i === index);
        });

        if (currentTitle) currentTitle.textContent = video.title;
        if (currentDesc) currentDesc.textContent = video.description || '';
        if (countIndicator) countIndicator.textContent = `${index + 1} / ${playlist.videos.length}`;

        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === playlist.videos.length - 1;

        const thumbUrl = _getVideoThumb(video);
        const hasYouTube = video.videoId && !video.videoId.startsWith('YOUR_VIDEO_ID');
        const hasLocal = !!video.videoFile;

        if (autoPlay) {
          if (hasLocal) {
            playerStage.innerHTML = `
              <video
                class="playlist-video-element"
                src="${video.videoFile}"
                poster="${thumbUrl || ''}"
                controls
                autoplay
                playsinline
              ></video>
            `;
          } else if (hasYouTube) {
            playerStage.innerHTML = `
              <iframe
                src="https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0"
                title="${video.title}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            `;
          } else {
            _renderPlaceholder();
          }
        } else {
          _renderPlaceholder();
        }

        function _renderPlaceholder() {
          const bgStyle = thumbUrl ? `background-image: url('${thumbUrl}'); background-size: cover; background-position: center;` : '';
          playerStage.innerHTML = `
            <div class="playlist-player__placeholder" style="${bgStyle}">
              <button class="playlist-player__play-btn" aria-label="Play video: ${video.title}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,4 20,12 6,20"></polygon>
                </svg>
              </button>
              ${video.duration ? `<span class="playlist-player__duration-badge">${video.duration}</span>` : ''}
              ${!thumbUrl ? `<span class="playlist-player__empty-label">${video.title}</span>` : ''}
            </div>
          `;

          const playBtn = playerStage.querySelector('.playlist-player__play-btn');
          if (playBtn) {
            playBtn.addEventListener('click', () => {
              updateActiveVideo(currentVideoIdx, true);
            });
          }
        }
      }

      updateActiveVideo(0, false);

      videoItems.forEach((item, i) => {
        item.addEventListener('click', () => {
          updateActiveVideo(i, true);
        });
      });

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentVideoIdx > 0) updateActiveVideo(currentVideoIdx - 1, true);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentVideoIdx < playlist.videos.length - 1) updateActiveVideo(currentVideoIdx + 1, true);
        });
      }
    });
  },
};

/* ─── RENDER PLAYLIST PANEL ────────────────────────────────────── */
function _renderPlaylistPanel(playlist, isActive) {
  const videos = playlist.videos || [];
  const firstVideo = videos[0] || {};
  const prevLabel = 'Prev';
  const nextLabel = 'Next';
  const contentLabel = 'Playlist Content';

  const queueItemsHTML = videos.map((vid, idx) => {
    const thumbUrl = _getVideoThumb(vid);
    const thumbHTML = thumbUrl
      ? `<img src="${thumbUrl}" alt="${vid.title}" loading="lazy" />`
      : `<div class="playlist-queue__thumb-fallback"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg></div>`;

    return `
      <div
        class="playlist-queue__item${idx === 0 ? ' active' : ''}"
        data-index="${idx}"
        role="button"
        tabindex="0"
        aria-label="Play ${vid.title}"
      >
        <span class="playlist-queue__index">${String(idx + 1).padStart(2, '0')}</span>
        <div class="playlist-queue__thumb">
          ${thumbHTML}
          ${vid.duration ? `<span class="playlist-queue__duration">${vid.duration}</span>` : ''}
        </div>
        <div class="playlist-queue__info">
          <div class="playlist-queue__title">${vid.title}</div>
          ${vid.description ? `<div class="playlist-queue__desc">${vid.description}</div>` : ''}
        </div>
        <div class="playlist-queue__play-indicator" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,4 20,12 6,20"/>
          </svg>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div
      class="playlist-panel${isActive ? ' active' : ''}"
      id="playlist-panel-${playlist.id}"
      data-playlist-id="${playlist.id}"
      role="tabpanel"
      aria-label="${playlist.title}"
    >
      <div class="playlist-panel__header">
        <div class="playlist-panel__meta">
          <span class="playlist-badge">${playlist.badge || 'Playlist'}</span>
          <h2 class="playlist-panel__title">${playlist.title}</h2>
          <p class="playlist-panel__desc">${playlist.description || ''}</p>
        </div>
      </div>

      <div class="playlist-layout">
        <!-- Main Video Screen Area -->
        <div class="playlist-player-wrapper">
          <div class="playlist-player-stage" aria-label="Video Player"></div>

          <div class="playlist-player-details">
            <div class="playlist-player__meta-row">
              <h3 class="playlist-player__active-title">${firstVideo.title || playlist.title}</h3>
              <div class="playlist-player__nav-controls">
                <button class="playlist-ctrl-btn playlist-ctrl-prev" aria-label="${prevLabel}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <span>${prevLabel}</span>
                </button>
                <button class="playlist-ctrl-btn playlist-ctrl-next" aria-label="${nextLabel}">
                  <span>${nextLabel}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
            <p class="playlist-player__active-desc">${firstVideo.description || ''}</p>
          </div>
        </div>

        <!-- Playlist Video Queue -->
        <div class="playlist-queue-card">
          <div class="playlist-queue__header">
            <div class="playlist-queue__header-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>${contentLabel}</span>
            </div>
            <span class="playlist-queue__header-count">1 / ${videos.length}</span>
          </div>

          <div class="playlist-queue__list" role="list">
            ${queueItemsHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

function _getVideoThumb(video) {
  if (video.thumbnail) return video.thumbnail;
  if (video.videoId && !video.videoId.startsWith('YOUR_VIDEO_ID')) {
    return `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
  }
  return null;
}
