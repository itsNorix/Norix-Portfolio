/* ─── SKILL BAR ANIMATION ────────────────────────────────────────
   Animates skill bar fills from 0% to their target level.
   Called by the Talents page on init.
────────────────────────────────────────────────────────────────── */

window.NORIX_SKILLBAR = (function () {
  'use strict';

  /**
   * Animates all skill bars inside the given container.
   * Bars must have data-level attribute set to the target percent.
   */
  function animate(container) {
    if (!container) return;

    const bars = container.querySelectorAll('.skill-item__fill');
    const percents = container.querySelectorAll('.skill-item__percent');
    const items = container.querySelectorAll('.skill-item');

    // Reset
    bars.forEach((bar) => { bar.style.width = '0%'; });
    items.forEach((item) => item.classList.remove('animated'));

    // Small delay so the transition is visible
    setTimeout(() => {
      bars.forEach((bar, i) => {
        const level = parseInt(bar.dataset.level, 10) || 0;

        // Animate the width
        bar.style.width = level + '%';

        // Animate the counter number
        if (percents[i]) {
          _countUp(percents[i], 0, level, 1200);
        }

        // Stagger
        setTimeout(() => {
          if (items[i]) items[i].classList.add('animated');
        }, 800 + i * 100);
      });
    }, 120);
  }

  /** Animates a number counter from start to end over durationMs */
  function _countUp(el, start, end, durationMs) {
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased) + '%';
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  return { animate };
}());
