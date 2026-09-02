/* ─── LIGHTBOX COMPONENT ─────────────────────────────────────────
   Full-screen image viewer with prev/next navigation.
   Triggered by calling NORIX_LIGHTBOX.open(photos, startIndex).
────────────────────────────────────────────────────────────────── */

window.NORIX_LIGHTBOX = (function () {
  'use strict';

  let _photos  = [];
  let _current = 0;

  const el = {
    box:     null,
    img:     null,
    caption: null,
    close:   null,
    prev:    null,
    next:    null,
  };

  function _init() {
    el.box     = document.getElementById('lightbox');
    el.img     = document.getElementById('lightbox-img');
    el.caption = document.getElementById('lightbox-caption');
    el.close   = document.getElementById('lightbox-close');
    el.prev    = document.getElementById('lightbox-prev');
    el.next    = document.getElementById('lightbox-next');

    if (!el.box) return;

    el.close.addEventListener('click', close);
    el.prev.addEventListener('click', prev);
    el.next.addEventListener('click', next);

    // Click outside content = close
    el.box.addEventListener('click', (e) => {
      if (e.target === el.box) close();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!el.box.classList.contains('lightbox--open')) return;
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowLeft')   prev();
      if (e.key === 'ArrowRight')  next();
    });
  }

  function open(photos, startIndex = 0) {
    if (!el.box) _init();
    _photos  = photos;
    _current = startIndex;
    _show();
    el.box.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
    el.close.focus();
  }

  function close() {
    if (!el.box) return;
    el.box.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  }

  function prev() {
    _current = (_current - 1 + _photos.length) % _photos.length;
    _show();
  }

  function next() {
    _current = (_current + 1) % _photos.length;
    _show();
  }

  function _show() {
    const photo = _photos[_current];
    if (!photo || !el.img) return;
    el.img.src = photo.src;
    el.img.alt = photo.alt || '';
    el.caption.textContent = photo.caption || '';
    el.prev.style.display = _photos.length > 1 ? 'flex' : 'none';
    el.next.style.display = _photos.length > 1 ? 'flex' : 'none';
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  return { open, close, prev, next };
}());
