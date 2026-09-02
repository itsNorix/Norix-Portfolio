/*
  CLOUD SYNC — scripts/cloud-sync.js
  Loads and saves portfolio data from Firebase Realtime Database.

  This makes Owner Panel changes visible to ALL visitors worldwide.

  Controlled by data/config.js → remoteSync block.
  Works silently — no errors shown to visitors if offline.
*/

(function () {
  'use strict';

  const DB_PATH = '/norix-portfolio.json';

  function getConfig() {
    const cfg = (window.NORIX_CONFIG || {}).remoteSync || {};
    return {
      enabled:     cfg.enabled === true,
      firebaseUrl: (cfg.firebaseUrl || '').replace(/\/$/, ''), // remove trailing slash
    };
  }

  /* ── PUBLIC API ── */
  window.NORIX_CLOUD = {

    /* Called on every page load — fetches latest data from Firebase */
    load: function (onLoaded) {
      const cfg = getConfig();
      if (!cfg.enabled || !cfg.firebaseUrl) {
        if (onLoaded) onLoaded(false);
        return;
      }

      fetch(cfg.firebaseUrl + DB_PATH)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          if (!data || typeof data !== 'object') {
            if (onLoaded) onLoaded(false);
            return;
          }

          // Apply remote data into NORIX_DATA (overrides local data files)
          window.NORIX_DATA = window.NORIX_DATA || {};
          if (Array.isArray(data.projects)) window.NORIX_DATA.projects = data.projects;
          if (Array.isArray(data.skills))   window.NORIX_DATA.skills   = data.skills;
          if (Array.isArray(data.social))   window.NORIX_DATA.social   = data.social;
          if (Array.isArray(data.playlists)) {
            window.NORIX_DATA.playlists = data.playlists;
            window.NORIX_DATA.tutorials = data.playlists;
          }
          if (data.about && typeof data.about === 'object') {
            window.NORIX_DATA.about = Object.assign({}, window.NORIX_DATA.about || {}, data.about);
          }

          // Also save to localStorage as offline cache
          try { localStorage.setItem('_norix_owner_data', JSON.stringify(data)); } catch (_) {}

          if (onLoaded) onLoaded(true);
        })
        .catch(function () {
          // Firebase unreachable — fall back to localStorage cache silently
          if (onLoaded) onLoaded(false);
        });
    },

    /* Called by Owner Panel after saving — pushes data to Firebase */
    save: function (data, onDone) {
      const cfg = getConfig();
      if (!cfg.enabled || !cfg.firebaseUrl) {
        if (onDone) onDone(false, 'Remote sync not configured');
        return;
      }

      fetch(cfg.firebaseUrl + DB_PATH, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function () {
          if (onDone) onDone(true);
        })
        .catch(function (err) {
          if (onDone) onDone(false, err.message);
        });
    },

    /* Returns true if remote sync is set up and enabled */
    isEnabled: function () {
      const cfg = getConfig();
      return cfg.enabled && !!cfg.firebaseUrl;
    },
  };

})();
