# Norix Portfolio — Beginner's Guide

A futuristic interactive digital-book portfolio website.  
Built with pure HTML, CSS, and JavaScript — **no build step required**. Just open `index.html` in a browser.

---

## Quick Start

1. Open the folder `norix-portfolio/` in VS Code (or any editor)
2. Open `index.html` with **Live Server** (VS Code extension) or just double-click it
3. Done! The site runs entirely in the browser

> **Tip:** Install the "Live Server" extension in VS Code for a better dev experience with auto-refresh.

---

## Project Structure

```
norix-portfolio/
│
├── index.html              ← Main entry point (open this in a browser)
│
├── data/                   ← ✏️  EDIT THESE to change your content
│   ├── navigation.js       ← Page order and names
│   ├── about.js            ← Your name, bio, tags
│   ├── projects.js         ← Your projects (videos + photos)
│   ├── tutorials.js        ← YouTube tutorial cards
│   ├── skills.js           ← Skill names and percentages
│   └── social.js           ← Social media links
│
├── assets/
│   ├── images/             ← Put your photos here
│   └── videos/             ← Put local video files here (optional)
│
├── styles/
│   ├── theme.css           ← 🎨 Change your accent color here
│   ├── layout.css
│   ├── transitions.css
│   ├── sidebar.css
│   ├── lightbox.css
│   └── pages/
│       ├── about.css
│       ├── work.css
│       ├── tutorials.css
│       ├── talents.css
│       └── social.css
│
└── scripts/
    ├── main.js             ← App entry point
    ├── router.js           ← Page transition logic
    ├── components/
    │   ├── sidebar.js
    │   ├── lightbox.js
    │   └── skillBar.js
    └── pages/
        ├── about.js
        ├── work.js
        ├── tutorials.js
        ├── talents.js
        └── social.js
```

---

## How to Edit Content

### Change Your Name or Title
Open `data/about.js` and edit:
```js
name: 'Norix',
title: 'Junior 3D Artist & Graphic Designer',
```

### Change Your About Me Bio
In `data/about.js`, the `bio` array holds your paragraphs:
```js
bio: [
  "First paragraph here.",
  "Second paragraph here.",
],
```
Each string in the array becomes one paragraph. Add or remove strings freely.

### Change Your Tags / Interests
In `data/about.js`:
```js
tags: ['3D Art', 'Animation', 'Photography', 'Visual Design', 'Video Production'],
```
Add, remove, or rename tags.

---

## How to Add a Project (Video or Gallery)

Open `data/projects.js` and add a new object to the array:

### Local Video Project (MP4):
```js
{
  id:          'my-local-video',
  type:        'video-local',
  featured:    true,
  title:       'My 3D Animation',
  category:    '3D Animation',
  year:        '2026',
  description: 'Project description here.',
  tags:        ['Blender', '3D Animation'],
  videoFile:   'assets/videos/my-video.mp4',       // Put MP4 in assets/videos/
  thumbnail:   'assets/images/my-thumbnail.jpg',   // Custom thumbnail in assets/images/
},
```

### YouTube Video Project:
```js
{
  id:          'my-youtube-project',
  type:        'video-youtube',
  featured:    true,
  title:       'My YouTube Showcase',
  category:    '3D Art',
  year:        '2026',
  description: 'Project description here.',
  tags:        ['Blender', '3D'],
  videoId:     'YOUTUBE_VIDEO_ID',   // from youtube.com/watch?v=XXXXXX
  thumbnail:   '',                   // Leave empty for auto-thumb or specify custom image
},
```

**How to find the YouTube video ID:**  
From `https://youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`.

The page will automatically display the new project with playable video controls.

---

## How to Remove a Project

In `data/projects.js`, delete the entire object `{ id: '...', ... }` for the project you want to remove.

---

## How to Add a Photography / Render Image

1. Copy your photo into `assets/images/` (e.g. `my-photo.jpg`)
2. Open `data/projects.js`, find the gallery project, and add to the `photos` array:

```js
{ src: 'assets/images/my-photo.jpg', alt: 'A description', caption: 'Caption text' },
```

The gallery will automatically include it. Click any image to open the lightbox viewer.

---

## How to Add a Tutorial Playlist & Videos

Open `data/tutorials.js` and add a playlist object to `window.NORIX_DATA.playlists`:

```js
{
  id:          'blender-basics',
  title:       'Blender 3D — Complete Beginner Series',
  badge:       'Blender Series',
  description: 'Learn the fundamentals of Blender from scratch.',
  videos: [
    {
      id:          'tut-1',
      title:       '01. Getting Started with Blender',
      description: 'Interface & navigation.',
      duration:    '12:34',
      videoId:     'YOUTUBE_VIDEO_ID',
      videoFile:   '', // or local path 'assets/videos/tut1.mp4'
      thumbnail:   '', // or custom image path
      url:         'https://www.youtube.com/@itsNorix-0',
    },
    // add more videos to the playlist here...
  ],
},
```

The playlist tabs, video player, and playlist queue update automatically!

---

## How to Change Skill Percentages

Open `data/skills.js`:

```js
{ name: 'Blender', level: 70, ... },
```

Change `level` to any number from 0 to 100.

## How to Add a New Skill

In `data/skills.js`, add a new object to the array:

```js
{
  name:        'DaVinci Resolve',
  level:       25,
  description: 'Professional video editing and color grading',
  icon:        '🟡',
},
```

The skill bar appears automatically with an animated fill.

---

## How to Change Social Links

Open `data/social.js` and update the `url` and `handle` fields:

```js
{
  id:       'instagram',
  platform: 'Instagram',
  handle:   '@yourhandle',
  url:      'https://www.instagram.com/yourhandle/',
  label:    'Follow on Instagram',
  color:    '#E1306C',
},
```

## How to Add a New Social Link

Add a new object to the `social` array. For the icon, use one of these `id` values:
`discord`, `instagram`, `youtube`, `twitter`, `tiktok`, `behance`, `artstation`

Or use any other `id` — a generic globe icon will appear as a fallback.

---

## How to Change the Accent Color

Open `styles/theme.css`. At the very top, change this one line:

```css
--accent: #59E3FF;   /* ← Change this hex value */
```

**The entire website will update automatically.** All UI elements, progress bars, glows, and highlights derive from this single variable.

---

## How to Add a New Page / Chapter

1. **Add to navigation** — open `data/navigation.js` and add:
   ```js
   {
     id:     'contact',
     number: '06',
     label:  'Contact',
   },
   ```

2. **Create the page renderer** — create `scripts/pages/contact.js`:
   ```js
   window.NORIX_PAGES = window.NORIX_PAGES || {};
   window.NORIX_PAGES.contact = {
     render() {
       return `
         <div id="page-contact">
           <header class="page-header">
             <div class="page-chapter">06 — Chapter</div>
             <h1 class="page-title">Contact</h1>
           </header>
           <p>Your content here.</p>
         </div>
       `;
     },
     init(pageEl) {
       // optional: run code after page is shown
     },
   };
   ```

3. **Create the page CSS** — create `styles/pages/contact.css` (can be empty to start)

4. **Link both files in `index.html`**:
   ```html
   <link rel="stylesheet" href="styles/pages/contact.css" />
   ...
   <script src="scripts/pages/contact.js"></script>
   ```

The new chapter appears in the sidebar automatically.

---

## Where to Put Files

| File type    | Location                  |
|-------------|---------------------------|
| Photos      | `assets/images/`          |
| Videos      | `assets/videos/`          |
| New styles  | `styles/pages/`           |
| New pages   | `scripts/pages/`          |
| New data    | `data/`                   |

---

## How to Deploy to Vercel

1. Create a free account at [vercel.com](https://vercel.com)
2. Install Vercel CLI (optional): `npm install -g vercel`
3. Push your project to GitHub (or drag-drop on Vercel dashboard)
4. On [vercel.com/new](https://vercel.com/new), import your GitHub repo
5. Vercel auto-detects it as a static site — click **Deploy**
6. Done! Your site is live at `yourproject.vercel.app`

> **Custom domain:** In your Vercel project settings → Domains → add your own domain.

### Deploy via GitHub Pages (alternative, free)
1. Push to GitHub
2. Go to repo Settings → Pages
3. Set source to `main` branch, root folder `/`
4. Your site will be live at `yourusername.github.io/norix-portfolio`

---

## FAQ

**Q: Can I open `index.html` directly without a server?**  
A: Yes! Double-click `index.html` in File Explorer. It works without any server.

**Q: I changed a data file but the site didn't update.**  
A: Hard-refresh the browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac).

**Q: YouTube thumbnails aren't loading.**  
A: This is normal when testing locally. They will load on a live server since YouTube thumbnails are cross-origin. They also load correctly when the site is deployed.

**Q: How do I make the skill bars animate again?**  
A: Navigate away from the Talents page and come back — the animation re-triggers each time.

---

*Built by Norix — Junior 3D Artist & Graphic Designer*
