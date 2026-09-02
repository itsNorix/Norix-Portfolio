/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  SKILLS / TALENTS — data/skills.js                             ║
  ║                                                                ║
  ║  To add a new skill:                                           ║
  ║  Just add a new object to the array, like this:               ║
  ║  { name: 'DaVinci Resolve', level: 25, icon: '🎬' }           ║
  ║                                                                ║
  ║  That's it! The page will automatically display it.           ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

window.NORIX_DATA = window.NORIX_DATA || {};

window.NORIX_DATA.skills = [
  {
    name: 'Blender',
    level: 70,            /* Percentage 0–100 */
    description: '3D modeling, animation, rendering & scene composition',
    icon: '🟠',
  },
  {
    name: 'After Effects',
    level: 50,
    description: 'Motion graphics, visual effects & compositing',
    icon: '🟣',
  },
  {
    name: 'Photoshop',
    level: 40,
    description: 'Photo editing, digital painting & compositing',
    icon: '🔵',
  },
  {
    name: 'Premiere Pro',
    level: 30,
    description: 'Video editing, color grading & post-production',
    icon: '🟤',
  },

  /* ── Add more skills below ────────────────────────────────────
  {
    name:        'DaVinci Resolve',
    level:       25,
    description: 'Professional video editing and color grading',
    icon:        '🟡',
  },
  ────────────────────────────────────────────────────────────── */
];
