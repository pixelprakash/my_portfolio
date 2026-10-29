// Work shown in the home-page showcase. Each project is a visual card:
//   type     — drives the filter chips and the cover treatment
//              (website = browser frame, video = play button,
//              photography = full-bleed photo).
//   cover    — image in /public/work (a 16:10 crop works best).
//   href     — external link for websites; video projects use `videoId`
//              (YouTube) and presentations use `embed` (Figma embed URL);
//              both open in a lightbox instead. A lightbox project may
//              also set `href` + `hrefLabel` — shown as a link in the
//              lightbox header (e.g. "Open in Figma ↗").
//   cta      — overrides the type's default card call-to-action text.
//   gallery  — list of { name, alt } for image sets (files in
//              /public/work/visual: `name.jpg` full size, `name-sm.jpg`
//              640px). The card cover becomes a mosaic of the first six
//              and the card opens a gallery lightbox.
//   embedAspect — CSS aspect-ratio for the lightbox player (default 16 / 9);
//              e.g. '4 / 3' for taller Behance embeds.
//   coverTitle — text for the placeholder cover when `cover` is omitted.
//   coverPosition — CSS object-position for the cover crop (default is
//              the top of the image, which suits full-page screenshots).
//   inProgress — shows the IN PROGRESS badge.
//   role     — what you did on it ("Solo Designer & Developer"), shown on
//              every card so work from different sources reads the same.
//   year     — optional; shown after the role.
//   summary  — one factual line about the project.
//   tools    — optional list; the card shows the first three.
// A project's colour and group come from its type: each type belongs to a
// discipline (see `disciplines`), and the discipline sets the accent.
// Add new types to projectTypes below and give
// their projects a `type` — the filter chips only show types that have work.
// The work is grouped by the two sides of the practice (the same blue /
// red split as the hero), plus the craft that sits between them.
export const disciplines = {
  design: {
    label: 'Design',
    accent: 'blue',
    blurb: 'Brand identities, app UX and visual design: the thinking and the look.',
  },
  development: {
    label: 'Development',
    accent: 'red',
    blurb: 'Websites designed and built end to end, from first sketch to deploy.',
  },
  craft: {
    label: 'Craft',
    accent: 'mix',
    blurb: 'Film and photography: storytelling beyond the screen.',
  },
};

// The order here is the order cards appear within a group: App & UX first,
// then branding, then visual design.
export const projectTypes = {
  website: { label: 'Websites', cta: 'Visit site ↗', frame: 'browser', discipline: 'development' },
  ux: { label: 'App & UX', cta: 'View case study ▶', discipline: 'design' },
  branding: { label: 'Branding', cta: 'View presentation ▶', discipline: 'design' },
  visual: { label: 'Visual design', cta: 'Browse designs ▶', discipline: 'design' },
  video: { label: 'Video editing', cta: 'Watch video ▶', discipline: 'craft' },
  photography: { label: 'Photography', cta: 'View gallery ↗', discipline: 'craft' },
};

export const projects = [
  {
    id: '6th-mobile-studies-congress',
    type: 'website',
    title: '6th Mobile Studies Congress',
    href: 'https://www.6thmobilestudiescongress.org/',
    cover: '/work/congress.jpg',
    role: 'Solo Designer & Developer',
    year: '2026',
    summary: 'The official site for a live international academic congress at IIT Hyderabad: registration, schedule and speakers.',
    tools: ['React', 'Vite', 'Spline'],
  },
  {
    id: 'deepak-john-mathew',
    type: 'website',
    title: 'Prof. Deepak John Mathew Portfolio Site',
    href: 'https://djn.vercel.app/',
    cover: '/work/djn.jpg',
    role: 'Solo Designer & Developer',
    year: '2026',
    summary: 'A personal site for a Professor of Design at IIT Hyderabad, with a CMS his team updates without code.',
    tools: ['React', 'GSAP', 'Sanity'],
  },
  {
    id: 'ganesh-kumar-malthurkar',
    type: 'website',
    title: 'Ganesh Kumar Malthurkar Portfolio Site',
    href: 'https://ganeshmalthurkar.com/',
    cover: '/work/ganesh.jpg',
    inProgress: true,
    role: 'Designer & Developer',
    summary: 'A personal portfolio website.',
  },
  {
    id: 'dic-iith',
    type: 'website',
    title: 'DIC · IITH — Design Innovation Centre Website',
    href: 'https://dic-site.vercel.app/',
    cover: '/work/dic.jpg',
    inProgress: true,
    role: 'Designer & Developer',
    summary: 'The website for the Design Innovation Centre at IIT Hyderabad.',
  },
  {
    id: 'pedagogy-playcards',
    type: 'website',
    title: 'Pedagogy Playcards',
    href: 'https://cards-omega-topaz.vercel.app/',
    cover: '/work/cards.jpg',
    inProgress: true,
    role: 'Designer & Developer',
    summary: 'An interactive web app for the Pedagogy Playcards.',
  },
  {
    id: 'sricharan-reddy',
    type: 'website',
    title: 'Sricharan Reddy Portfolio Site',
    href: 'https://sricharan-port.vercel.app/',
    cover: '/work/sricharan.jpg',
    inProgress: true,
    role: 'Designer & Developer',
    summary: 'A personal portfolio website.',
  },
  {
    id: 'golden-age-industrial-design',
    type: 'video',
    title: 'Golden Age of Industrial Design with Kirti Trivedi — Documentary, Part 1',
    videoId: 'mQL6lPXuuZs',
    cover: '/work/video-golden-age.jpg',
    role: 'Video editor',
    summary: 'Part 1 of a documentary conversation with Kirti Trivedi on the golden age of industrial design.',
  },
  {
    id: 'grinitian-branding',
    type: 'branding',
    title: '5 Concepts — Grinitian Branding',
    coverTitle: 'Grinitian — 5 Concepts',
    embed:
      'https://embed.figma.com/slides/UJKFqmkVlLAi3mb6jeqUkl/5-Concepts---Grinitian-Branding?node-id=1-256&embed-host=share',
    href: 'https://www.figma.com/deck/UJKFqmkVlLAi3mb6jeqUkl',
    hrefLabel: 'Open in Figma ↗',
    role: 'Brand designer',
    summary: 'Five brand identity concepts for Grinitian, presented as a deck.',
    tools: ['Figma'],
  },
  {
    id: 'akshara-sanjeevani-branding',
    type: 'branding',
    title: 'Akshara Sanjeevani — Branding',
    coverTitle: 'Akshara Sanjeevani',
    embed:
      'https://embed.figma.com/slides/29x48D4vNTvdqSDQTXRQNZ/Akshara-Sanjeevani---Branding?node-id=1-37&embed-host=share',
    href: 'https://www.figma.com/deck/29x48D4vNTvdqSDQTXRQNZ',
    hrefLabel: 'Open in Figma ↗',
    role: 'Brand designer',
    summary: 'A brand identity for Akshara Sanjeevani, presented as a deck.',
    tools: ['Figma'],
  },
  {
    id: 'praklens-photography',
    type: 'photography',
    title: 'See all my photography @praklens',
    cta: 'Follow on Instagram ↗',
    // logo for now — swap `cover` for a photo when you have one
    cover: '/work/praklens-logo.jpg',
    coverPosition: 'center',
    href: 'https://www.instagram.com/praklens/',
    role: 'Photographer',
    summary: 'Photography shared on Instagram as @praklens.',
  },
  {
    id: 'thumbnail-designs',
    type: 'visual',
    title: 'YouTube Thumbnail Designs',
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
    role: 'Visual designer',
    summary: 'Twelve YouTube thumbnails for design-career interviews and live sessions.',
  },
  {
    id: 'online-course-brochure',
    type: 'visual',
    title: 'Online Course Brochure Design — Freelance Work',
    coverTitle: 'Online Course Brochure',
    embed: 'https://www.behance.net/embed/project/200337053?ilo0=1',
    embedAspect: '4 / 3',
    role: 'Visual designer (freelance)',
    summary: 'A brochure for an online course, designed as freelance work.',
  },
  {
    id: 'penny-wise-expense-tracker',
    type: 'ux',
    title: 'Penny Wise — Expense Tracking App UX Case Study',
    coverTitle: 'Penny Wise',
    embed: 'https://www.behance.net/embed/project/197476263?ilo0=1',
    embedAspect: '4 / 3',
    role: 'UX designer',
    summary: 'A UX case study for an expense-tracking app.',
  },
  {
    id: 'sahaaya-salesforce-design-challenge',
    type: 'ux',
    title: 'Sahaaya — Salesforce Design Challenge',
    coverTitle: 'Sahaaya',
    embed: 'https://www.behance.net/embed/project/225913447?ilo0=1',
    embedAspect: '4 / 3',
    role: 'UX designer',
    summary: 'A response to the Salesforce Design Challenge.',
  },
  {
    id: 'village-stories-sangameswaram',
    type: 'photography',
    title: 'Village Stories — Sangameswaram',
    coverTitle: 'Village Stories',
    cta: 'View project ▶',
    embed: 'https://www.behance.net/embed/project/246038191?ilo0=1',
    embedAspect: '4 / 3',
    href: 'https://www.instagram.com/praklens/',
    hrefLabel: 'See all work @praklens ↗',
    role: 'Photographer',
    summary: 'A photo story from the village of Sangameswaram.',
  },
];

// The home page shows only these, in this order (the full list lives on the
// all-projects page). Use ids from `projects` above.
export const featuredIds = [
  '6th-mobile-studies-congress',
  'deepak-john-mathew',
  'pedagogy-playcards',
  'dic-iith',
];
export const featuredProjects = featuredIds.map((id) => projects.find((p) => p.id === id));

// Resolve gallery file names to URLs once, so components just use src/thumb.
for (const project of projects) {
  if (project.gallery) {
    project.gallery = project.gallery.map((item) => ({
      ...item,
      src: `/work/visual/${item.name}.jpg`,
      thumb: `/work/visual/${item.name}-sm.webp`,
    }));
  }
}
