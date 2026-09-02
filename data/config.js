/*
  ╔══════════════════════════════════════════════════════════════════════╗
  ║                                                                      ║
  ║   MASTER CONFIG — data/config.js                                     ║
  ║                                                                      ║
  ║  This is the main config file for your portfolio.                   ║
  ║  Change your name, colors, SEO, theme, and features here.           ║
  ║                                                                      ║
  ║  Changes take effect on the next page refresh.                      ║
  ╚══════════════════════════════════════════════════════════════════════╝
*/

window.NORIX_CONFIG = {

  /* ────────────────────────────────────────────────────────────────────
     IDENTITY
  ──────────────────────────────────────────────────────────────────── */
  name:  'Norix',                               /* ← YOUR NAME            */
  title: 'Junior 3D Artist & Graphic Designer', /* ← YOUR TITLE           */

  /* ────────────────────────────────────────────────────────────────────
     SITE URL & SEO
  ──────────────────────────────────────────────────────────────────── */
  siteUrl:         'https://norix.dev',
  siteDescription: 'Junior 3D Artist & Graphic Designer. Explore my portfolio of 3D art, animation, photography, visual design, and video production.',
  ogImage:         'assets/images/Lights-Craft-Traller-Thumbnail.jpg',
  twitterHandle:   '@itsNorix_0',

  /* ────────────────────────────────────────────────────────────────────
     THEME
     'dark'  = dark mode by default
     'light' = light mode by default
  ──────────────────────────────────────────────────────────────────── */
  defaultTheme: 'dark',                         /* ← 'dark' or 'light'    */

  /* ────────────────────────────────────────────────────────────────────
     ACCENT COLOR OVERRIDE (Optional)
     null          = use theme.css defaults (recommended)
     '#59E3FF'     = neon cyan (dark mode default)
     '#0088cc'     = electric blue
     '#a855f7'     = purple
     '#22c55e'     = green
  ──────────────────────────────────────────────────────────────────── */
  accentColor: null,                            /* ← null or '#HEXCODE'   */

  /* ────────────────────────────────────────────────────────────────────
     SITE PROTECTION
     true  = enable (blocks F12, DevTools, right-click, Ctrl+U, copy watermark)
     false = disable (useful during local development)
  ──────────────────────────────────────────────────────────────────── */
  protection: true,                             /* ← true or false        */

  /* ────────────────────────────────────────────────────────────────────
     FEATURE FLAGS
  ──────────────────────────────────────────────────────────────────── */
  features: {
    showWork:        true,
    showTutorials:   true,
    showTalents:     true,
    showSocial:      true,

    /* ─ UI Controls ─────────────────────────────────────────────
       showThemeToggle: show the dark/light mode toggle button
    ──────────────────────────────────────────────────────────── */
    showThemeToggle: true,            /* ← true or false         */
  },

  /* ────────────────────────────────────────────────────────────────────
     VIDEO PLAYER SETTINGS
  ──────────────────────────────────────────────────────────────────── */
  player: {
    idleHideMs:     1000,  /* ms of mouse inactivity before bar hides     */
    autoplayOnOpen: false, /* auto-play when a project card opens         */
  },

};
