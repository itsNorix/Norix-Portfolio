/* ─── PAGE 02: MY WORK ───────────────────────────────────────────
   Reads from: i18n translations & data/projects.js
   Supports: Coming Soon, Release Dates, and YouTube-Style Custom Player.
────────────────────────────────────────────────────────────────── */

window.NORIX_PAGES = window.NORIX_PAGES || {};

window.NORIX_PAGES.work = {

  render() {
    const projects = window.NORIX_DATA.projects || [];

    // Separate featured videos from gallery
    const featuredProjects = projects.filter(p => p.type === 'video-youtube' || p.type === 'video-local' || p.videoFile || p.videoId || p.releaseIn || p.releaseDate);
    const galleryProject = projects.find(p => p.type === 'gallery');

    const featuredHTML = featuredProjects.map((proj, i) => {
      const isReverse = i % 2 !== 0;
      return _renderFeatured(proj, isReverse);
    }).join('');

    const galleryHTML = galleryProject ? _renderGallery(galleryProject) : '';

    return `
      <div id="page-work">
        <header class="work-header page-header">
          <div class="page-chapter">02 — Chapter</div>
          <h1 class="page-title">My Work</h1>
          <p class="page-subtitle">Featured 3D animations, cinematic trailers, visual effects, and renders.</p>
        </header>

        <section aria-label="Featured video projects">
          ${featuredHTML}
        </section>

        ${galleryHTML}
      </div>
    `;
  },

  init(pageEl) {
    // 1. Attach lightbox to gallery items
    const projects = window.NORIX_DATA.projects || [];
    const galleryProject = projects.find(p => p.type === 'gallery');

    if (galleryProject && galleryProject.photos) {
      const photos = galleryProject.photos;

      const items = pageEl.querySelectorAll('.work-gallery__item');
      items.forEach((item, i) => {
        const handler = () => window.NORIX_LIGHTBOX.open(photos, i);
        item.addEventListener('click', handler);
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handler();
          }
        });
      });
    }

    // 2. Video play handler (YouTube-Style custom player)
    const videoWrappers = pageEl.querySelectorAll('.work-featured__video.is-playable');
    videoWrappers.forEach((wrap) => {
      const videoFile = wrap.dataset.videofile;
      const rawVideoId = wrap.dataset.videoid;
      const videoId = _extractYouTubeId(rawVideoId);
      const thumbUrl = wrap.dataset.thumb;
      const hasLocal = videoFile && videoFile.trim() !== '';
      const hasYouTube = videoId && !videoId.startsWith('YOUR_YOUTUBE_VIDEO_ID') && videoId.trim() !== '';

      const startPlayback = () => {
        if (wrap.querySelector('.yt-player-container') || wrap.querySelector('iframe')) return;

        const projTitle = wrap.dataset.title || '';
        const projCat = wrap.dataset.category || '';

        if (hasLocal) {
          _mountYouTubeStylePlayer(wrap, videoFile, thumbUrl, projTitle, projCat);
        } else if (hasYouTube) {
          _mountYouTubeIframePlayer(wrap, videoId, thumbUrl, projTitle);
        }
      };

      wrap.addEventListener('click', () => {
        if (!wrap.querySelector('.yt-player-container')) {
          startPlayback();
        }
      });

      wrap.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !wrap.querySelector('.yt-player-container')) {
          e.preventDefault();
          startPlayback();
        }
      });
    });
  },
};

/* ─── SLEEK CUSTOM VIDEO PLAYER MOUNT ─────────────────────────── */

function _mountYouTubeStylePlayer(wrap, videoFile, thumbUrl, projTitle, projCat) {
  wrap.innerHTML = `
    <div class="yt-player-container" tabindex="0">
      <video
        class="yt-video-element"
        src="${videoFile}"
        poster="${thumbUrl || ''}"
        playsinline
        preload="metadata"
      ></video>

      <!-- Center Click Standalone Curved Flash Indicator -->
      <div class="yt-center-flash" aria-hidden="true">
        <div class="yt-flash-icon yt-flash-play">
          <svg viewBox="0 0 24 24" width="76" height="76" fill="var(--accent)">
            <path d="M7 5.25C7 4.01 8.35 3.24 9.42 3.86L19.92 9.86C20.97 10.47 20.97 11.98 19.92 12.59L9.42 18.59C8.35 19.21 7 18.44 7 17.2V5.25Z"></path>
          </svg>
        </div>
        <div class="yt-flash-icon yt-flash-pause" style="display:none;">
          <svg viewBox="0 0 24 24" width="68" height="68" fill="var(--accent)">
            <rect x="5.5" y="4" width="4.5" height="16" rx="2"></rect>
            <rect x="14" y="4" width="4.5" height="16" rx="2"></rect>
          </svg>
        </div>
      </div>

      <!-- Slim Cyan Bottom Controls Bar -->
      <div class="yt-controls-bar">
        
        <!-- Edge-to-Edge Cyan Scrubber Line -->
        <div class="yt-progress-container" role="slider" aria-label="Progress bar" tabindex="0">
          <div class="yt-progress-bg"></div>
          <div class="yt-progress-buffered"></div>
          <div class="yt-progress-played">
            <div class="yt-scrubber-head"></div>
          </div>
        </div>

        <div class="yt-controls-row">
          <!-- Left Controls (Play/Pause, Volume, Time) -->
          <div class="yt-controls-left">
            <!-- Play / Pause Icon Button -->
            <button class="yt-ctrl-btn yt-play-btn" aria-label="Play / Pause (space)">
              <svg class="yt-icon-play" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M7 5.25C7 4.01 8.35 3.24 9.42 3.86L19.92 9.86C20.97 10.47 20.97 11.98 19.92 12.59L9.42 18.59C8.35 19.21 7 18.44 7 17.2V5.25Z"></path>
              </svg>
              <svg class="yt-icon-pause" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="display:none;">
                <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
              </svg>
            </button>

            <!-- Volume Control -->
            <div class="yt-volume-wrap">
              <button class="yt-ctrl-btn yt-vol-btn" aria-label="Mute (m)">
                <svg class="yt-icon-vol-high" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <svg class="yt-icon-vol-mute" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              </button>
              <input type="range" class="yt-vol-slider" min="0" max="1" step="0.05" value="1" aria-label="Volume">
            </div>

            <!-- Time Indicator (00:00 / 01:41) -->
            <div class="yt-time-display">
              <span class="yt-time-cur">00:00</span>
              <span class="yt-time-sep">/</span>
              <span class="yt-time-dur">00:00</span>
            </div>
          </div>

          <!-- Right Controls (Speed, Fullscreen) -->
          <div class="yt-controls-right">
            <button class="yt-ctrl-btn yt-speed-btn" aria-label="Playback speed">1x</button>
            <button class="yt-ctrl-btn yt-fs-btn" aria-label="Fullscreen (f)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  const container = wrap.querySelector('.yt-player-container');
  const video = wrap.querySelector('.yt-video-element');
  const playBtn = wrap.querySelector('.yt-play-btn');
  const iconPlay = wrap.querySelector('.yt-icon-play');
  const iconPause = wrap.querySelector('.yt-icon-pause');
  const volBtn = wrap.querySelector('.yt-vol-btn');
  const volHigh = wrap.querySelector('.yt-icon-vol-high');
  const volMute = wrap.querySelector('.yt-icon-vol-mute');
  const volSlider = wrap.querySelector('.yt-vol-slider');
  const timeCur = wrap.querySelector('.yt-time-cur');
  const timeDur = wrap.querySelector('.yt-time-dur');
  const fsBtn = wrap.querySelector('.yt-fs-btn');
  const speedBtn = wrap.querySelector('.yt-speed-btn');
  const progressCont = wrap.querySelector('.yt-progress-container');
  const progressPlayed = wrap.querySelector('.yt-progress-played');
  const progressBuf = wrap.querySelector('.yt-progress-buffered');
  const flashBox = wrap.querySelector('.yt-center-flash');
  const flashPlay = wrap.querySelector('.yt-flash-play');
  const flashPause = wrap.querySelector('.yt-flash-pause');

  function triggerFlash(isPlay) {
    if (!flashBox) return;
    flashPlay.style.display = isPlay ? 'block' : 'none';
    flashPause.style.display = isPlay ? 'none' : 'block';
    flashBox.classList.remove('animate');
    void flashBox.offsetWidth;
    flashBox.classList.add('animate');
  }

  function togglePlay() {
    if (video.paused || video.ended) {
      video.play().catch(() => { });
      triggerFlash(true);
    } else {
      video.pause();
      triggerFlash(false);
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Single click to toggle play / Double click to toggle fullscreen
  let clickTimeout = null;

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen().catch(() => { });
    }
  }

  playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });

  video.addEventListener('click', (e) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      toggleFullscreen();
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
        togglePlay();
      }, 220);
    }
  });

  video.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
    }
    toggleFullscreen();
  });

  // Controls Auto-Hide (1s mouse inactivity timer)
  let idleTimer = null;

  function showControls() {
    container.classList.remove('is-controls-hidden');
  }

  function hideControls() {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
    if (!video.paused && !video.ended) {
      container.classList.add('is-controls-hidden');
    }
  }

  function resetIdleTimer() {
    showControls();
    if (idleTimer) clearTimeout(idleTimer);
    if (!video.paused && !video.ended) {
      idleTimer = setTimeout(() => {
        hideControls();
      }, 1000);
    }
  }

  container.addEventListener('mousemove', resetIdleTimer);
  container.addEventListener('pointermove', resetIdleTimer);

  container.addEventListener('mouseleave', hideControls);
  wrap.addEventListener('mouseleave', hideControls);

  video.addEventListener('play', () => {
    container.classList.add('is-playing');
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
    resetIdleTimer();
  });

  video.addEventListener('pause', () => {
    container.classList.remove('is-playing');
    showControls();
    if (idleTimer) clearTimeout(idleTimer);
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';
  });

  video.addEventListener('timeupdate', () => {
    timeCur.textContent = formatTime(video.currentTime);
    if (video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      progressPlayed.style.width = pct + '%';
    }
  });

  video.addEventListener('loadedmetadata', () => {
    timeDur.textContent = formatTime(video.duration);
  });

  video.addEventListener('progress', () => {
    if (video.buffered.length > 0 && video.duration) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      progressBuf.style.width = (bufferedEnd / video.duration) * 100 + '%';
    }
  });

  // Scrubber drag / click
  let isDragging = false;
  function seekTo(e) {
    const rect = progressCont.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (video.duration) {
      video.currentTime = pos * video.duration;
      progressPlayed.style.width = (pos * 100) + '%';
    }
  }

  progressCont.addEventListener('mousedown', (e) => {
    isDragging = true;
    seekTo(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) seekTo(e);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Volume
  volSlider.addEventListener('input', (e) => {
    video.volume = parseFloat(e.target.value);
    video.muted = video.volume === 0;
    updateVolUI();
  });

  volBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    updateVolUI();
  });

  function updateVolUI() {
    const isMuted = video.muted || video.volume === 0;
    volHigh.style.display = isMuted ? 'none' : 'block';
    volMute.style.display = isMuted ? 'block' : 'none';
    if (!video.muted && video.volume === 0) {
      volSlider.value = 0;
    } else if (video.muted) {
      volSlider.value = 0;
    } else {
      volSlider.value = video.volume;
    }
  }

  // Speed toggle (1x -> 1.5x -> 2x -> 0.5x -> 1x)
  const speeds = [1, 1.25, 1.5, 2, 0.5, 0.75];
  let currentSpeedIdx = 0;
  speedBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
    const s = speeds[currentSpeedIdx];
    video.playbackRate = s;
    speedBtn.textContent = `${s}x`;
  });

  // Fullscreen
  fsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen().catch(() => { });
    }
  });

  // ── KEYBOARD NAVIGATION (SPACE, ARROW KEYS, SHORTCUTS) ──
  container.focus();
  container.addEventListener('keydown', (e) => {
    // Space bar or 'k': Toggle play / pause
    if (e.key === ' ' || e.key === 'Spacebar' || e.key.toLowerCase() === 'k') {
      e.preventDefault();
      togglePlay();
    }
    // Arrow Left: Seek backward 5 seconds
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (video.duration) {
        video.currentTime = Math.max(0, video.currentTime - 5);
      }
    }
    // Arrow Right: Seek forward 5 seconds
    else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (video.duration) {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
      }
    }
    // Arrow Up: Volume Up 5%
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      video.volume = Math.min(1, video.volume + 0.05);
      video.muted = false;
      updateVolUI();
    }
    // Arrow Down: Volume Down 5%
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      video.volume = Math.max(0, video.volume - 0.05);
      updateVolUI();
    }
    // 'm': Toggle Mute
    else if (e.key.toLowerCase() === 'm') {
      e.preventDefault();
      video.muted = !video.muted;
      updateVolUI();
    }
    // 'f': Toggle Fullscreen
    else if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => { });
      } else {
        document.exitFullscreen().catch(() => { });
      }
    }
  });

  // Auto-play immediately on mount
  video.play().catch(() => { });
}

/* ─── YOUTUBE IFRAME STYLED PLAYER ───────────────────────────────
   Embeds a YouTube iframe inside the same visual shell as the local
   video player — same dark container, backdrop, and border styling.
   YouTube's native controls handle playback inside the frame.
────────────────────────────────────────────────────────────────── */

function _extractYouTubeId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return '';
  const trimmed = urlOrId.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

function _mountYouTubeIframePlayer(wrap, videoId, thumbUrl, projTitle) {
  const cleanId = _extractYouTubeId(videoId);
  wrap.innerHTML = `
    <div class="yt-player-container yt-player-iframe-mode" tabindex="0">
      <iframe
        class="yt-iframe-embed"
        src="https://www.youtube.com/embed/${cleanId}?autoplay=1&rel=0&enablejsapi=1"
        title="${projTitle || 'YouTube video player'}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  `;
}

/* ─── HELPERS ────────────────────────────────────────────────── */

function _renderFeatured(proj, reverse, uiData, isArabic) {
  const tagsHTML = (proj.tags || []).map(t =>
    `<span class="work-tag">${t}</span>`
  ).join('');

  const cleanYtId = _extractYouTubeId(proj.videoId);

  // Thumbnail
  let thumbUrl = '';
  if (proj.thumbnail && proj.thumbnail.trim()) {
    thumbUrl = proj.thumbnail.trim();
  } else if (cleanYtId && !cleanYtId.startsWith('YOUR_YOUTUBE_VIDEO_ID') && cleanYtId.trim()) {
    thumbUrl = `https://img.youtube.com/vi/${cleanYtId}/hqdefault.jpg`;
  }

  // Release status logic
  const isUpcoming = proj.releaseIn === true || (proj.releaseDate && proj.releaseDate.trim() !== '' && proj.releaseIn !== false);
  const releaseDate = proj.releaseDate || '';

  const hasLocal = proj.videoFile && proj.videoFile.trim() !== '';
  const hasYouTube = cleanYtId && !cleanYtId.startsWith('YOUR_YOUTUBE_VIDEO_ID') && cleanYtId.trim() !== '';
  const isPlayable = (hasLocal || hasYouTube) && !isUpcoming;

  // Thumbnail background style
  const bgStyle = thumbUrl
    ? `style="background-image: url('${thumbUrl}'); background-size: cover; background-position: center;"`
    : '';

  const playLabel = 'Play video';

  let videoInner = '';

  if (isUpcoming) {
    // ── CASE 1: Scheduled Release (e.g. Coming in 22/8/2026) ──
    const dateText = releaseDate ? `Coming in ${releaseDate}` : 'Coming Soon';
    videoInner = `
      <div class="work-video-placeholder work-video-upcoming" ${bgStyle}>
        <div class="work-upcoming-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${dateText}</span>
        </div>
      </div>
    `;
  } else if (!isPlayable) {
    // ── CASE 2: Coming Soon (No video yet / releaseIn: false without video) ──
    videoInner = `
      <div class="work-video-placeholder work-video-comingsoon" ${bgStyle}>
        <div class="work-upcoming-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="3" ry="3"></rect>
          </svg>
          <span>Coming Soon</span>
        </div>
      </div>
    `;
  } else {
    // ── CASE 3: Normal Playable Video with Standalone Glowing Curved Play Icon ──
    videoInner = `
      <div class="work-video-placeholder" ${bgStyle}>
        <div class="video-play-icon" aria-label="${playLabel}">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="var(--accent)">
            <path d="M7 5.25C7 4.01 8.35 3.24 9.42 3.86L19.92 9.86C20.97 10.47 20.97 11.98 19.92 12.59L9.42 18.59C8.35 19.21 7 18.44 7 17.2V5.25Z"></path>
          </svg>
        </div>
      </div>
    `;
  }

  return `
    <article class="work-featured" aria-label="${proj.title}">
      <div class="work-featured__inner${reverse ? ' reverse' : ''}">

        <!-- Video Frame -->
        <div
          class="work-featured__video${isPlayable ? ' is-playable' : ' is-disabled'}"
          data-id="${proj.id}"
          data-videofile="${proj.videoFile || ''}"
          data-videoid="${proj.videoId || ''}"
          data-thumb="${thumbUrl || ''}"
          data-title="${proj.title || ''}"
          data-category="${proj.category || ''}"
          role="${isPlayable ? 'button' : 'region'}"
          tabindex="${isPlayable ? '0' : '-1'}"
          aria-label="${isPlayable ? `${playLabel}: ${proj.title}` : proj.title}"
        >
          ${videoInner}
        </div>

        <!-- Info Column -->
        <div class="work-featured__info">
          <div class="work-featured__category">${proj.category}</div>
          <h2 class="work-featured__title">${proj.title}</h2>
          <p class="work-featured__desc">${proj.description}</p>
          <div class="work-featured__tags">${tagsHTML}</div>
          <div class="work-featured__year mono text-muted">${proj.year}</div>
        </div>

      </div>
    </article>
  `;
}

function _renderGallery(proj) {
  const photos = proj.photos || [];

  const photosHTML = photos.map((photo, i) => {
    const caption = photo.caption || '';
    return `
      <div
        class="work-gallery__item"
        role="button"
        tabindex="0"
        aria-label="View photo: ${photo.alt || caption || i + 1}"
      >
        <img
          src="${photo.src}"
          alt="${photo.alt || ''}"
          loading="lazy"
          onerror="this.parentNode.innerHTML='<div class=\\'work-gallery__placeholder\\'><span>📷 Add photo to assets/images/</span></div>'"
        />
        <div class="work-gallery__overlay" aria-hidden="true">
          <span class="work-gallery__caption">${caption}</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="work-gallery-section" aria-label="${proj.title}">
      <div class="work-gallery-header">
        <div class="work-gallery-header__info">
          <div class="page-chapter">Renders &amp; Thumbnails</div>
          <h2 class="page-title" style="font-size:clamp(1.4rem,2.5vw,2rem)">${proj.title}</h2>
          <p class="page-subtitle">${proj.description}</p>
        </div>
        <div class="work-gallery-header__count mono text-muted">${photos.length} shots</div>
      </div>

      <div class="work-gallery" role="list">
        ${photosHTML}
      </div>
    </section>
  `;
}
