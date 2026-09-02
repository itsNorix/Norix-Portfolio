/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  TUTORIALS & PLAYLISTS — data/tutorials.js                     ║
  ║                                                                ║
  ║  To add a playlist: uncomment or copy an object from the       ║
  ║  template below and add your videos.                           ║
  ║                                                                ║
  ║  When playlists array is empty `[]`, the page displays:        ║
  ║  "There is no tutorials for now but i will make it soon as"    ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

window.NORIX_DATA = window.NORIX_DATA || {};

/* Set to empty array for now — update when you release tutorials */
window.NORIX_DATA.playlists = [
  /*
  {
    id: 'blender-basics',
    title: 'Blender 3D — Complete Beginner Series',
    badge: 'Blender Series',
    description: 'Learn the fundamentals of Blender from scratch. Master viewport navigation, 3D modeling, and rendering step-by-step.',
    thumbnail: '',
    videos: [
      {
        id: 'blender-01',
        title: '01. Getting Started with Blender — Interface & Navigation',
        description: 'Explore the Blender UI, 3D viewport navigation, object modes, and essential hotkeys for beginners.',
        duration: '12:34',
        videoId: 'YOUR_VIDEO_ID_1',
        videoFile: '',
        thumbnail: '',
        url: 'https://www.youtube.com/@itsNorix-0',
      },
      {
        id: 'blender-02',
        title: '02. Modeling Your First 3D Scene from a Single Cube',
        description: 'Transform a default cube into a detailed 3D environment.',
        duration: '15:20',
        videoId: 'YOUR_VIDEO_ID_2',
        videoFile: '',
        thumbnail: '',
        url: 'https://www.youtube.com/@itsNorix-0',
      },
    ],
  },
  */
];

/* Backward compatibility alias */
window.NORIX_DATA.tutorials = window.NORIX_DATA.playlists;


