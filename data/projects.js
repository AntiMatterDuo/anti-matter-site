/* ============================================================
   ANTI MATTER — data/projects.js
   ============================================================
   Edit this file to manage your portfolio projects.

   Fields:
     id          – unique slug (used for future case-study URLs)
     title       – card heading
     description – one-line summary shown on the card
     visual      – CSS class for the card background: v1 | v2 | v3 | v4
     link        – where clicking the card goes (use "#contact" until
                   you have a real case-study page, e.g. "/work/ledger")
     visible     – true = show the card | false = hide it

   When at least one project is visible the Work section appears
   automatically. When all are hidden the section and nav link
   disappear entirely so the site looks intentional, not empty.
   ============================================================ */

window.PROJECTS = [
  {
    id:          'ledger',
    title:       'Ledger',
    description: 'Digital banking platform serving 2.1M customers',
    visual:      'v1',
    link:        '#contact',
    visible:     false
  },
  {
    id:          'sable',
    title:       'Sable',
    description: 'AI workspace that turns meetings into shipped tasks',
    visual:      'v2',
    link:        '#contact',
    visible:     false
  },
  {
    id:          'halo',
    title:       'Halo',
    description: '3D commerce experience for a furniture brand',
    visual:      'v3',
    link:        '#contact',
    visible:     false
  },
  {
    id:          'meridian',
    title:       'Meridian',
    description: 'Operations system for a global logistics network',
    visual:      'v4',
    link:        '#contact',
    visible:     false
  }
];

