/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  NAVIGATION — data/navigation.js                               ║
  ║                                                                ║
  ║  To add a new page/chapter:                                    ║
  ║  1. Add a new object to the array below                        ║
  ║  2. Create scripts/pages/yourpage.js                           ║
  ║  3. Create styles/pages/yourpage.css                           ║
  ║  4. Link both files in index.html                              ║
  ║  See README.md for full instructions.                          ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

window.NORIX_DATA = window.NORIX_DATA || {};

window.NORIX_DATA.navigation = [
  {
    id:     'about',      /* matches window.NORIX_PAGES.about   */
    number: '01',
    label:  'About Me',
  },
  {
    id:     'work',       /* matches window.NORIX_PAGES.work    */
    number: '02',
    label:  'My Work',
  },
  {
    id:     'tutorials',  /* matches window.NORIX_PAGES.tutorials */
    number: '03',
    label:  'Tutorials',
  },
  {
    id:     'talents',    /* matches window.NORIX_PAGES.talents  */
    number: '04',
    label:  'Talents',
  },
  {
    id:     'social',     /* matches window.NORIX_PAGES.social   */
    number: '05',
    label:  'Social',
  },
];
