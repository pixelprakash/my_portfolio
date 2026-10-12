// Work shown in the home-page showcase. Each project is a visual card:
//   type     — drives the filter chips and the cover treatment
//              (website = browser frame, video = play button,
//              photography = full-bleed photo).
//   cover    — image in /public/work (a 16:10 crop works best).
//   href     — external link for websites; video projects use `videoId`
//              (YouTube) and presentations use `embed` (Figma embed URL);
//              both open in a lightbox instead. A lightbox project may
//              also set `href` — shown as an "Open in Figma" link there.
//   gallery  — list of { name, alt } for image sets (files in
//              /public/work/visual: `name.jpg` full size, `name-sm.jpg`
//              640px). The card cover becomes a mosaic of the first six
//              and the card opens a gallery lightbox.
//   coverTitle — text for the placeholder cover when `cover` is omitted.
//   coverPosition — CSS object-position for the cover crop (default is
//              the top of the image, which suits full-page screenshots).
//   inProgress — shows the IN PROGRESS badge.
// Add new types (branding, app-ui, visual) to projectTypes below and give
// their projects a `type` — the filter chips only show types that have work.
export const projectTypes = {
  website: { label: 'Websites', cta: 'Visit site ↗', frame: 'browser' },
  video: { label: 'Video editing', cta: 'Watch video ▶' },
  photography: { label: 'Photography', cta: 'View gallery ↗' },
  branding: { label: 'Branding', cta: 'View presentation ▶' },
  visual: { label: 'Visual design', cta: 'Browse designs ▶' },
  // 'app-ui': { label: 'App UI', cta: 'View project →' },
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
  {
    id: 'grinitian-branding',
    type: 'branding',
    title: '5 Concepts — Grinitian Branding',
    coverTitle: 'Grinitian — 5 Concepts',
    embed:
      'https://embed.figma.com/slides/UJKFqmkVlLAi3mb6jeqUkl/5-Concepts---Grinitian-Branding?node-id=1-256&embed-host=share',
    href: 'https://www.figma.com/deck/UJKFqmkVlLAi3mb6jeqUkl',
    accent: 'red',
  },
  {
    id: 'akshara-sanjeevani-branding',
    type: 'branding',
    title: 'Akshara Sanjeevani — Branding',
    coverTitle: 'Akshara Sanjeevani',
    embed:
      'https://embed.figma.com/slides/29x48D4vNTvdqSDQTXRQNZ/Akshara-Sanjeevani---Branding?node-id=1-37&embed-host=share',
    href: 'https://www.figma.com/deck/29x48D4vNTvdqSDQTXRQNZ',
    accent: 'blue',
  },
  {
    id: 'praklens-photography',
    type: 'photography',
    title: 'Photography — @praklens',
    // logo for now — swap `cover` for a photo when you have one
    cover: '/work/praklens-logo.jpg',
    coverPosition: 'center',
    href: 'https://www.instagram.com/praklens/',
    accent: 'red',
  },
  {
    id: 'thumbnail-designs',
    type: 'visual',
    title: 'YouTube Thumbnail Designs',
    accent: 'blue',
    gallery: [
      { name: 'jaswanth-budda', alt: 'Thumbnail: How he got into IISc Bangalore for M.Des in Product Design & Manufacturing' },
      { name: 'bhaskar-komara', alt: 'Thumbnail: Architect to UX Designer, 4X hike' },
      { name: 'tina', alt: 'Thumbnail: Gujarati medium to a UX job in the USA' },
      { name: 'ai-final', alt: 'Thumbnail: AI for India, a designer and a data scientist' },
      { name: '6', alt: 'Thumbnail: Roadmap to be a successful designer' },
      { name: 'kirti-trivedi', alt: 'Thumbnail: The Journey, Kirti Trivedi' },
      { name: 'sai-anjan', alt: 'Thumbnail: Sai Anjan on designing SaaS products' },
      { name: 'live-thumbnail-2', alt: 'Thumbnail: New Age AI Tools, live with Tezan Sahu' },
      { name: 'live-thumbnail', alt: 'Thumbnail: AI tools for productivity and efficiency, live demos' },
      { name: 'shamit-shrivastav', alt: 'Thumbnail: How to get into a PhD in Design, Shamit Shrivastav' },
      { name: 'susruta', alt: 'Thumbnail: Lessons from 12 years of designing products, Susruta Chakraborty' },
      { name: 'natalie', alt: 'Thumbnail: M.Sc UX Design, the journey to Germany, Natalie Valsangkar' },
    ],
  },
];

// Resolve gallery file names to URLs once, so components just use src/thumb.
for (const project of projects) {
  if (project.gallery) {
    project.gallery = project.gallery.map((item) => ({
      ...item,
      src: `/work/visual/${item.name}.jpg`,
      thumb: `/work/visual/${item.name}-sm.jpg`,
    }));
  }
}
