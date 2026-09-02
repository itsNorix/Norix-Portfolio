/* ─── I18N & AUTO-TRANSLATION CONTROLLER ─────────────────────────
   Manages Arabic/English bilingual switching, Dark/Light themes,
   and Real-Time Auto-Translation for user edits in data/*.js.
────────────────────────────────────────────────────────────────── */

window.NORIX_I18N = (function () {
  'use strict';

  const STORAGE_KEY_LANG  = 'norix_lang';
  const STORAGE_KEY_THEME = 'norix_theme';
  const CACHE_KEY_TRANS   = 'norix_auto_trans_v1';

  let _currentLang  = 'en';
  let _currentTheme = 'dark';
  let _cache = {};

  // Common vocabulary for offline / instant auto-translation
  const DICT = {
    // Roles & Titles
    "Junior 3D Artist & Graphic Designer": "فنان ثلاثي الأبعاد ومصمم جرافيك مبتدئ",
    "3D Artist · Designer": "فنان ثلاثي الأبعاد · مصمم",
    "Open for Freelance & Collaboration": "متاح للعمل الحر والتعاون الإبداعي",
    "Available for freelance": "متاح للعمل الحر",
    
    // Categories & Tags
    "3D Art": "فن ثلاثي الأبعاد",
    "Animation": "أنيميشن",
    "Photography": "تصوير فوتوغرافي",
    "Visual Design": "تصميم بصري",
    "Video Production": "إنتاج فيديو",
    "Motion Graphics": "موشن جرافيك",
    "Cinematic": "سينمائي",
    "VFX": "مؤثرات بصرية",
    "3D Animation": "أنيميشن 3D",
    "3D Animation & VFX": "أنيميشن ثلاثي الأبعاد ومؤثرات بصرية",
    "3D / Motion Graphics": "ثلاثي الأبعاد / موشن جرافيك",
    "3D Renders & Photography": "رندرات ثلاثية الأبعاد وتصوير",
    "Lighting": "إضاءة",
    "Fan Art": "عمل فني",
    "Blender": "بلندر",
    "After Effects": "أفتر إفكتس",
    "Photoshop": "فوتوشوب",
    "Premiere Pro": "بريمير برو",
    "DaVinci Resolve": "دافينشي ريزولف",
    "Cinema 4D": "سينما فور دي",
    "Unreal Engine": "أنريل إنجين",

    // Common UI Phrases
    "There is no tutorials for now but i will make it soon as": "لا توجد دروس حالياً ولكن سأقوم بنشرها قريباً",
    "Subscribe to my YouTube channel to be the first to know when new tutorials launch.": "اشترك في قناتي على يوتيوب لتكون أول من يعلم عند إطلاق الدروس الجديدة.",
    "Coming Soon": "قريباً",
    "Explore My Work": "استكشف أعمالي",
    "Get In Touch": "تواصل معي",
    "Join my Discord": "انضم إلى سيرفر الديسكورد",
    "Follow on Instagram": "تابعني على إنستغرام",
    "Watch on YouTube": "شاهد قناتي على يوتيوب",
    "Follow on X": "تابعني على إكس (تويتر)",
    "Follow on TikTok": "تابعني على تيك توك",
    "Local Video": "فيديو محلي",
    "Play video": "تشغيل الفيديو",
    "Playlist": "قائمة تشغيل",
    "Playlist Content": "محتوى قائمة التشغيل",
    "shots": "لقطات",
    "videos": "فيديوهات",
    "Overview": "نظرة عامة",
  };

  function init() {
    // 1. Load persisted settings
    const savedLang  = localStorage.getItem(STORAGE_KEY_LANG);
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    try {
      _cache = JSON.parse(localStorage.getItem(CACHE_KEY_TRANS) || '{}');
    } catch (e) {
      _cache = {};
    }

    _currentLang  = (savedLang === 'ar' || savedLang === 'en') ? savedLang : 'en';
    _currentTheme = (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';

    // 2. Synchronize user's live data/*.js edits with bilingual dictionary
    _syncDataWithTranslations();

    // 3. Apply initial theme and language
    _applyTheme(_currentTheme);
    _applyLang(_currentLang, false);
  }

  /**
   * Automatically synchronizes user data from window.NORIX_DATA
   * into both English and Arabic translations in real time.
   */
  function _syncDataWithTranslations() {
    window.NORIX_TRANSLATIONS = window.NORIX_TRANSLATIONS || {};
    const en = window.NORIX_TRANSLATIONS.en = window.NORIX_TRANSLATIONS.en || {};
    const ar = window.NORIX_TRANSLATIONS.ar = window.NORIX_TRANSLATIONS.ar || {};
    const raw = window.NORIX_DATA || {};

    // ── ABOUT ME SYNC ──
    if (raw.about) {
      en.about = en.about || {};
      ar.about = ar.about || {};
      
      // Update English from raw
      en.about.name   = raw.about.name || en.about.name || 'Norix';
      en.about.title  = raw.about.title || en.about.title;
      en.about.status = raw.about.status || en.about.status;
      en.about.tags   = raw.about.tags || en.about.tags;
      if (raw.about.bio) en.about.bio = raw.about.bio;
      if (raw.about.highlights) en.about.highlights = raw.about.highlights;
      if (raw.about.quote) en.about.quote = raw.about.quote;

      // Auto-translate to Arabic if not explicitly set
      ar.about.name   = raw.about.name === 'Norix' ? 'نوريكس' : (ar.about.name || raw.about.name);
      ar.about.title  = _autoTranslate(en.about.title, ar.about.title);
      ar.about.status = _autoTranslate(en.about.status, ar.about.status);
      ar.about.tags   = (en.about.tags || []).map((t, i) => _autoTranslate(t, ar.about.tags && ar.about.tags[i]));
      
      if (raw.about.bio && raw.about.bio.length > 0) {
        ar.about.bio = raw.about.bio.map((p, i) => _autoTranslate(p, ar.about.bio && ar.about.bio[i]));
      }

      if (raw.about.highlights) {
        ar.about.highlights = raw.about.highlights.map((h, i) => {
          const existing = ar.about.highlights && ar.about.highlights[i];
          return {
            icon: h.icon,
            title: _autoTranslate(h.title, existing && existing.title),
            desc: _autoTranslate(h.desc, existing && existing.desc),
          };
        });
      }

      if (raw.about.quote) {
        ar.about.quote = _autoTranslate(raw.about.quote, ar.about.quote);
      }
    }

    // ── PROJECTS / MY WORK SYNC ──
    if (raw.projects) {
      en.work = en.work || {};
      ar.work = ar.work || {};
      en.work.projects = en.work.projects || {};
      ar.work.projects = ar.work.projects || {};

      raw.projects.forEach(p => {
        if (!p.id) return;
        en.work.projects[p.id] = {
          title: p.title,
          category: p.category,
          description: p.description,
          tags: p.tags,
        };

        const existingAr = ar.work.projects[p.id] || {};
        ar.work.projects[p.id] = {
          title: _autoTranslate(p.title, existingAr.title),
          category: _autoTranslate(p.category, existingAr.category),
          description: _autoTranslate(p.description, existingAr.description),
          tags: (p.tags || []).map((t, idx) => _autoTranslate(t, existingAr.tags && existingAr.tags[idx])),
        };
      });
    }

    // ── SKILLS / TALENTS SYNC ──
    if (raw.skills) {
      en.talents = en.talents || {};
      ar.talents = ar.talents || {};
      
      en.talents.skills = raw.skills;
      ar.talents.skills = raw.skills.map((s, i) => {
        const existing = ar.talents.skills && ar.talents.skills[i];
        return {
          name: s.name,
          level: s.level,
          icon: s.icon,
          description: _autoTranslate(s.description, existing && existing.description),
        };
      });
    }

    // ── SOCIAL SYNC ──
    if (raw.social) {
      en.social = en.social || {};
      ar.social = ar.social || {};
      en.social.links = raw.social;
      ar.social.links = raw.social.map((s, i) => {
        const existing = ar.social.links && ar.social.links[i];
        return {
          ...s,
          label: _autoTranslate(s.label, existing && existing.label),
        };
      });
    }
  }

  /**
   * Smart translation lookup:
   * 1. Preserves existing manual translation if already Arabic
   * 2. Checks predefined dictionary
   * 3. Checks localStorage cache
   * 4. Asynchronously fetches online translation and caches result
   */
  function _autoTranslate(englishText, preferredArabic) {
    if (!englishText || typeof englishText !== 'string') return englishText;
    
    // If preferred translation is already valid Arabic text, use it
    if (preferredArabic && preferredArabic.trim() !== '' && preferredArabic !== englishText && _isArabic(preferredArabic)) {
      return preferredArabic;
    }

    // 1. Direct dictionary match
    if (DICT[englishText]) {
      return DICT[englishText];
    }

    // 2. Cache match
    if (_cache[englishText]) {
      return _cache[englishText];
    }

    // 3. Fallback: Request async machine translation for custom user texts
    _fetchAsyncTranslation(englishText);

    return preferredArabic || englishText;
  }

  function _isArabic(text) {
    return /[\u0600-\u06FF]/.test(text);
  }

  /**
   * Asynchronous machine translation using public translate endpoint.
   * Caches results so each phrase is only translated once.
   */
  async function _fetchAsyncTranslation(text) {
    if (!text || text.length > 500 || _cache[text]) return;
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data[0]) {
        const translated = data[0].map(item => item[0]).join('');
        if (translated && _isArabic(translated)) {
          _cache[text] = translated;
          try {
            localStorage.setItem(CACHE_KEY_TRANS, JSON.stringify(_cache));
          } catch (e) {}

          // If current active language is Arabic, refresh the view to show newly translated text
          if (_currentLang === 'ar') {
            _syncDataWithTranslations();
            if (window.NORIX_ROUTER && typeof window.NORIX_ROUTER.refresh === 'function') {
              window.NORIX_ROUTER.refresh();
            }
          }
        }
      }
    } catch (e) {
      // Offline fallback: silent
    }
  }

  function getLang() {
    return _currentLang;
  }

  function getTheme() {
    return _currentTheme;
  }

  function getData() {
    const dict = window.NORIX_TRANSLATIONS || {};
    return dict[_currentLang] || dict['en'] || {};
  }

  function t(path) {
    const data = getData();
    if (!path) return data;
    const parts = path.split('.');
    let cur = data;
    for (const part of parts) {
      if (cur === undefined || cur === null) return undefined;
      cur = cur[part];
    }
    return cur;
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'ar') return;
    if (lang === _currentLang) return;
    _currentLang = lang;
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    _applyLang(lang, true);
  }

  function toggleLang() {
    const nextLang = _currentLang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
  }

  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    _currentTheme = theme;
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    _applyTheme(theme);
  }

  function toggleTheme() {
    const nextTheme = _currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }

  function _applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      const iconWrap = btn.querySelector('.theme-icon-wrap');
      if (iconWrap) {
        iconWrap.innerHTML = theme === 'dark' ? _sunIcon() : _moonIcon();
      }
    });
  }

  function _applyLang(lang, refreshUI = true) {
    _syncDataWithTranslations();

    const meta = (window.NORIX_TRANSLATIONS && window.NORIX_TRANSLATIONS[lang]?.meta) || {
      dir: lang === 'ar' ? 'rtl' : 'ltr',
    };

    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;

    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      const label = lang === 'en' ? 'العربية' : 'English';
      btn.setAttribute('aria-label', `Switch language to ${label}`);
      const textSpan = btn.querySelector('.lang-btn-text');
      if (textSpan) {
        textSpan.textContent = lang === 'en' ? 'AR' : 'EN';
      } else {
        btn.textContent = lang === 'en' ? 'العربية' : 'English';
      }
    });

    if (refreshUI) {
      if (window.NORIX_SIDEBAR && typeof window.NORIX_SIDEBAR.refresh === 'function') {
        window.NORIX_SIDEBAR.refresh();
      }
      if (window.NORIX_ROUTER && typeof window.NORIX_ROUTER.refresh === 'function') {
        window.NORIX_ROUTER.refresh();
      }
    }
  }

  function _sunIcon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`;
  }

  function _moonIcon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`;
  }

  return {
    init,
    getLang,
    getTheme,
    getData,
    t,
    setLang,
    toggleLang,
    setTheme,
    toggleTheme,
    sunIcon: _sunIcon,
    moonIcon: _moonIcon,
  };
}());
