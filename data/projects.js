/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  PROJECTS — data/projects.js                                   ║
  ║                                                                ║
  ║  Add, remove, or reorder projects below.                       ║
  ║  Each project is one object { ... } in the array.             ║
  ║                                                                ║
  ║  PROJECT TYPES:                                                ║
  ║    type: 'video-local'    → plays an MP4 from assets/videos/  ║
  ║    type: 'video-youtube'  → embeds a YouTube video by ID      ║
  ║    type: 'gallery'        → displays a photo lightbox gallery ║
  ║                                                                ║
  ║  VIDEO STATUS MODES:                                           ║
  ║    Published: videoFile/videoId filled, releaseIn: false       ║
  ║    Coming on a date: releaseIn: true, releaseDate: '22/8/2026'║
  ║    Coming Soon: videoFile/videoId empty, releaseIn: false     ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

window.NORIX_DATA = window.NORIX_DATA || {};

window.NORIX_DATA.projects = [

  // ── PROJECT 1: LOCAL VIDEO (Lights Craft Trailer) ─────────────
  {
    id: 'lights-craft',      // REQUIRED — unique slug (no spaces)
    type: 'video-youtube',       // REQUIRED — 'video-local' | 'video-youtube' | 'gallery'
    featured: true,
    title: 'Lights Craft — Cinematic Trailer',
    category: '3D Animation & SFX',
    year: '2026',
    description: 'A cinematic showcase crafted with dramatic lighting, custom 3D environments, particle simulations, and atmospheric sound design.',
    tags: ['Blender', 'SFX', 'Cinematic'],

    videoId: 'https://www.youtube.com/watch?v=oslf-Icz8RM',
    thumbnail: 'assets/images/Lights-Craft-Traller-Thumbnail.jpg', // OPTIONAL

    releaseIn: false,   // true = show "Coming in [date]" instead of playing
    releaseDate: '',      // e.g. '22/8/2026' — only used when releaseIn: true
  },

  // ── PROJECT 2: YOUTUBE VIDEO (Murder Drones Fan-Made) ─────────
  {
    id: 'murder-drones',
    type: 'video-youtube',
    featured: false,
    title: 'Murder Drones Season 2 Trailer — Fan Made',
    category: '3D Animation',
    year: '2026',
    description: 'A fan-made animated sequence inspired by the Murder Drones series. Built in Blender with custom character rigging, expressive lighting, and dynamic camera work.',
    tags: ['Blender', '3D Animation', 'Fan Art', 'Cinematic'],

    videoId: 'YOUR_YOUTUBE_VIDEO_ID_HERE', // paste the YouTube video ID here
    thumbnail: '',      // OPTIONAL: custom thumbnail override

    releaseIn: false,
    releaseDate: '22/9/2026',
  },

  // ── PROJECT 3: PHOTO GALLERY ───────────────────────────────────
  {
    id: 'photos',
    type: 'gallery',
    featured: false,
    title: 'Renders',
    category: '3D Renders & Thumbnails',
    year: '2026',
    description: 'A collection of renders and Thumbnails capturing light, texture, and character composition.',
    tags: ['3D Art', 'Lighting', 'Visual Design'],

    photos: [
      { src: 'assets/images/Lights-Craft-Traller-Thumbnail.jpg', alt: 'Lights Craft Scene', caption: 'Lights Craft — Atmospheric Environment' },
      { src: 'assets/images/Huggy-Photo.png', alt: 'Huggy 3D Model', caption: 'Huggy — Character Scene' },
      { src: 'assets/images/Pomni-Stand.png', alt: 'Pomni Stand', caption: 'Pomni Stand — 3D Render' },
    ],
  },

  // ── ADD MORE PROJECTS BELOW ────────────────────────────────────
  //
  // LOCAL VIDEO TEMPLATE:
  // {
  //   id:          'my-project',
  //   type:        'video-local',
  //   featured:    true,
  //   title:       'My Project',
  //   category:    '3D Animation',
  //   year:        '2026',
  //   description: 'Description here.',
  //   tags:        ['Blender', 'VFX'],
  //   videoFile:   'assets/videos/my-video.mp4',
  //   thumbnail:   'assets/images/my-thumb.jpg',
  //   releaseIn:   false,
  //   releaseDate: '',
  // },
  //
  // YOUTUBE VIDEO TEMPLATE:
  // {
  //   id:          'my-yt-project',
  //   type:        'video-youtube',
  //   featured:    true,
  //   title:       'My YouTube Video',
  //   category:    '3D Animation',
  //   year:        '2026',
  //   description: 'Description here.',
  //   tags:        ['Blender'],
  //   videoId:     'YOUR_YT_ID_HERE',
  //   thumbnail:   '',
  //   releaseIn:   false,
  //   releaseDate: '',
  // },

];
