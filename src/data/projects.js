// Work shown in the home-page showcase. Each project is a visual card:
//   type     — drives the filter chips and the cover treatment
//              (website = browser frame, video = play button,
//              photography = full-bleed photo).
//   cover    — image in /public/work (a 16:10 crop works best).
//   href     — external link for websites; video projects use `videoId`
//              (YouTube) and open in a lightbox instead.
//   inProgress — shows the IN PROGRESS badge.
// Add new types (branding, app-ui, visual) to projectTypes below and give
// their projects a `type` — the filter chips only show types that have work.
export const projectTypes = {
  website: { label: 'Websites', cta: 'Visit site ↗', frame: 'browser' },
  video: { label: 'Video editing', cta: 'Watch video ▶' },
  photography: { label: 'Photography', cta: 'View gallery ↗' },
  // branding: { label: 'Branding', cta: 'View project →' },
  // 'app-ui': { label: 'App UI', cta: 'View project →' },
  // visual: { label: 'Visual design', cta: 'View piece →' },
};

export const projects = [
  {
    id: '6th-mobile-studies-congress',
    type: 'website',
    title: '6th Mobile Studies Congress',
    href: 'https://www.6thmobilestudiescongress.org/',
    cover: '/work/congress.jpg',
    accent: 'blue',
  },
  {
    id: 'deepak-john-mathew',
    type: 'website',
    title: 'Prof. Deepak John Mathew Portfolio Site',
    href: 'https://djn.vercel.app/',
    cover: '/work/djn.jpg',
    accent: 'red',
  },
  {
    id: 'ganesh-kumar-malthurkar',
    type: 'website',
    title: 'Ganesh Kumar Malthurkar Portfolio Site',
    href: 'https://ganeshmalthurkar.com/',
    cover: '/work/ganesh.jpg',
    accent: 'blue',
    inProgress: true,
  },
  {
    id: 'dic-iith',
    type: 'website',
    title: 'DIC · IITH — Design Innovation Centre Website',
    href: 'https://dic-site.vercel.app/',
    cover: '/work/dic.jpg',
    accent: 'red',
    inProgress: true,
  },
  {
    id: 'pedagogy-playcards',
    type: 'website',
    title: 'Pedagogy Playcards',
    href: 'https://cards-omega-topaz.vercel.app/',
    cover: '/work/cards.jpg',
    accent: 'blue',
    inProgress: true,
  },
  {
    id: 'sricharan-reddy',
    type: 'website',
    title: 'Sricharan Reddy Portfolio Site',
    href: 'https://sricharan-port.vercel.app/',
    cover: '/work/sricharan.jpg',
    accent: 'red',
    inProgress: true,
  },
  {
    id: 'golden-age-industrial-design',
    type: 'video',
    title: 'Golden Age of Industrial Design with Kirti Trivedi — Documentary, Part 1',
    videoId: 'mQL6lPXuuZs',
    cover: '/work/video-golden-age.jpg',
    accent: 'blue',
  },
];

// Photography example — add real photos to /public/work and uncomment:
// {
//   id: 'photo-series-name',
//   type: 'photography',
//   title: 'Series title',
//   href: 'https://… (gallery / Instagram / Flickr)',
//   cover: '/work/photo-series-name.jpg',
//   accent: 'red',
// },
