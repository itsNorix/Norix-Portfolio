/*
  ╔══════════════════════════════════════════════════════════════════════╗
  ║                                                                      ║
  ║   MASTER CONFIG — data/config.js                                     ║
  ║                                                                      ║
  ║  This is the ONLY file you need to edit to customize your           ║
  ║  portfolio. Change your name, colors, SEO, and features here.       ║
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
     LANGUAGE
     'en' = English (LTR)
     'ar' = Arabic (RTL)
  ──────────────────────────────────────────────────────────────────── */
  defaultLang: 'en',                            /* ← 'en' or 'ar'         */

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
     true  = enable (disables right-click, copy watermark, blocks Ctrl+U)
     false = disable (useful during local development)
  ──────────────────────────────────────────────────────────────────── */
  protection: true,                             /* ← true or false        */

  /* ────────────────────────────────────────────────────────────────────
     FEATURE FLAGS
  ──────────────────────────────────────────────────────────────────── */
  features: {
    showWork:      true,
    showTutorials: true,
    showTalents:   true,
    showSocial:    true,
  },

  /* ────────────────────────────────────────────────────────────────────
     VIDEO PLAYER SETTINGS
  ──────────────────────────────────────────────────────────────────── */
  player: {
    idleHideMs:     1000,  /* ms of mouse inactivity before bar hides     */
    autoplayOnOpen: false, /* auto-play when a project card opens         */
  },

  /* ────────────────────────────────────────────────────────────────────
     REMOTE SYNC — Updates all visitors when you save from the Owner Panel
     ──────────────────────────────────────────────────────────────────
     SETUP (takes 3 minutes, completely free):
       1. Go to https://firebase.google.com and sign in with Google
       2. Click "Go to Console" → "Add Project" → name it anything → Create
       3. In the left sidebar: Build → Realtime Database → Create Database
       4. Choose any location → Start in TEST MODE → Enable
       5. Copy the URL shown (looks like: https://my-project-default-rtdb.firebaseio.com)
       6. Paste it below as firebaseUrl
       7. Set enabled: true
     ──────────────────────────────────────────────────────────────────
     Once set up: every time you Save in the Owner Panel, ALL visitors
     worldwide will see your changes on their next page load.
  ──────────────────────────────────────────────────────────────────── */
  remoteSync: {
    enabled:     false,  /* ← Set to true after completing setup above    */
    firebaseUrl: '',     /* ← Paste your Firebase Realtime Database URL   */
                         /*   e.g. 'https://my-project-rtdb.firebaseio.com' */
  },

};
