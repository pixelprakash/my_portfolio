// caseStudies[0] (6th Mobile Studies Congress) is real, compiled from the
// project's actual git history (142 commits, Dec 2025 – Aug 2026) at
// ~/6th mobile conf/mcv3/mcv3 — edit freely, this is a first draft.
// The rest are placeholders — replace summary/section copy with real
// project write-ups — the shape (slug, sections with id/label) is what the
// app relies on.
export const caseStudies = [
  {
    slug: '6th-mobile-studies-congress',
    tag: 'Design + Dev',
    title: '6th Mobile Studies Congress',
    summary:
      'The official website for a live international academic congress at IIT Hyderabad — designed, built, secured, and iterated on solo across 142 commits over 8 months.',
    role: 'Solo Designer & Developer',
    timeline: '8 months (Dec 2025 – Aug 2026)',
    timelineShort: '8 months',
    tools: ['React', 'Vite', 'Bootstrap 5', 'React Router', 'Spline', 'EmailJS', 'Vercel'],
    coverAlt:
      'Homepage of the 6th Mobile Studies Congress website with a 3D particle hero, countdown timer, and keynote speaker cards',
    accent: 'blue',
    sections: [
      {
        id: 'context',
        label: 'Context',
        heading: 'Why this project',
        body: [
          {
            type: 'paragraph',
            text: 'The 6th Mobile Studies Congress is a real international academic conference (Aug 21–23, 2026), hosted by the Department of Design at IIT Hyderabad and organized by Mobile Studies International. Its program committee spans 16 researchers across 8+ countries — University of Salerno, McGill, Swinburne, AJKMCRC, Zhejiang Wanli University, Daffodil International University, and more. It needed a public website credible enough to sit next to those institutions, handling registration, an evolving multi-day schedule, and event logistics.',
          },
        ],
      },
      {
        id: 'problem-space',
        label: 'Problem space',
        heading: 'A site that had to keep moving',
        body: [
          {
            type: 'paragraph',
            text: "This wasn't a launch-and-forget page — it was a living site through the entire run-up to the event. Keynote speakers were still being confirmed in July. Schedule days were reshuffled a month out. Travel and accommodation details changed repeatedly. The site had to stay genuinely editable and resilient to that churn, not a one-off static build.",
          },
        ],
      },
      {
        id: 'design-build',
        label: 'Design & Build',
        heading: 'What I built',
        body: [
          {
            type: 'paragraph',
            text: 'I designed and built the entire site solo, end to end — every one of the 142 commits, from the first scaffold in December 2025 through final pre-event polish in August 2026, is mine. Built on React 19 + Vite with Bootstrap 5 for layout and React Router for six pages: Home, the hosting department, Important Dates, Venue, Contact, and a 404.',
          },
          {
            type: 'list',
            items: [
              'A 3D interactive particle hero (Spline) with animated heading text',
              'A live countdown to the opening day, and a ticker surfacing registration and travel-clearance deadlines',
              'Keynote speaker cards that reveal talk titles on hover',
              'A multi-day schedule, including a hybrid roundtable with cross-timezone timings for international speakers',
              'Site-wide search with a custom cursor, added in the final pre-event sprint',
            ],
          },
        ],
      },
      {
        id: 'hardening',
        label: 'Hardening',
        heading: 'Hardening it for a live domain',
        body: [
          {
            type: 'paragraph',
            text: "Since this sits on a public domain tied to a real institution, I ran a dedicated security and performance pass rather than treating it as a one-off build: a Content-Security-Policy scoped to the exact third-party origins the site actually talks to (Spline, YouTube, EmailJS, Humanitix ticketing, Google Fonts, Vercel) instead of a blanket allow, plus X-Frame-Options, HSTS, Referrer-Policy, and Permissions-Policy headers. Getting the CSP right without breaking the Spline embed took a concentrated debugging stretch — around a dozen commits in a single day tuning unsafe-eval and frame-src rules.",
          },
          {
            type: 'list',
            items: [
              'Code-splitting and lazy loading for the page bundles',
              'Speaker and gallery images converted to WebP with async decoding',
              'DNS-prefetch/preconnect for every third-party host',
              'Schema.org Event + WebSite structured data, sitemap.xml, robots.txt',
              'A dedicated accessibility pass across the site',
            ],
          },
        ],
      },
      {
        id: 'shipping',
        label: 'Shipping',
        heading: 'Shipping against a moving calendar',
        body: [
          {
            type: 'paragraph',
            text: 'Because the event calendar kept moving, the site had to move with it: speaker names and prefixes were corrected in place multiple times, the day-by-day schedule was rebuilt several times as sessions were confirmed and swapped, and features like the brochure download, venue tags, and search kept landing in the final month before the congress. That cadence — real, dated commits running from December through the week before the event — is closer to running a small piece of live infrastructure than shipping a one-time build.',
          },
        ],
      },
      {
        id: 'results',
        label: 'Results',
        heading: 'Where it stands',
        body: [
          {
            type: 'paragraph',
            text: 'Live at the congress domain ahead of the August 21–23, 2026 event, handling registration hand-off to Humanitix, the public presence for an international program committee, and the full multi-day schedule for attendees — 142 commits, solo, over 8 months.',
          },
        ],
      },
      {
        id: 'retrospective',
        label: 'Retrospective',
        heading: 'What I’d do differently',
        body: [
          {
            type: 'paragraph',
            text: "The biggest lesson was scoping the Content-Security-Policy from day one instead of retrofitting it — the June security pass took far longer than it should have because third-party integrations (Spline, EmailJS, the ticketing embed) were added before the policy existed to account for them. Next time, security headers go in during the first scaffold, not months later.",
          },
        ],
      },
    ],
  },
  // Compiled from the project's git history (31 commits, Feb – Oct 2026) at
  // ~/djn2/djn and the live site at djn.vercel.app — first draft, edit freely.
  {
    slug: 'deepak-john-mathew-website',
    tag: 'Design + Dev',
    title: 'Prof. Deepak John Mathew Portfolio Site',
    summary:
      'A personal website for Deepak John Mathew, Professor of Design at IIT Hyderabad — designed and built solo, with a CMS-powered blog and news feed his team can update without touching code.',
    role: 'Solo Designer & Developer',
    timeline: '8 months (Feb – Oct 2026)',
    timelineShort: '8 months',
    tools: ['React', 'Vite', 'React Router', 'GSAP', 'Framer Motion', 'Sanity', 'Vercel'],
    coverAlt:
      'Homepage of the Deepak John Mathew website with a large title, portrait, and a stacked-scrolling works section',
    accent: 'red',
    sections: [
      {
        id: 'context',
        label: 'Context',
        heading: 'Why this project',
        body: [
          {
            type: 'paragraph',
            text: 'Deepak John Mathew is a Professor of Design at IIT Hyderabad whose work spans research, publications, exhibitions, and a design lab (the DIC Lab). That body of work lived in scattered places — department pages, PDFs, and social posts. He needed one personal site that presents it clearly to students, collaborators, and colleagues, and that he could keep current himself.',
          },
        ],
      },
      {
        id: 'problem-space',
        label: 'Problem space',
        heading: 'A lot to show, and it keeps changing',
        body: [
          {
            type: 'paragraph',
            text: 'The content is varied — an About page, selected works, a résumé, lab projects with video, blog posts, and news — and new publications and updates arrive regularly. A hand-edited static site would have gone stale, so the site needed both a strong visual identity and a way to publish new content without a developer.',
          },
        ],
      },
      {
        id: 'design-build',
        label: 'Design & Build',
        heading: 'What I built',
        body: [
          {
            type: 'paragraph',
            text: 'I designed and built the full site solo on React 19 and Vite, with React Router for seven pages: Home, About, Work, Résumé, Lab, Blog, and Contact. A written design system with shared tokens keeps type, colour, and spacing consistent across all of them, rather than each page setting its own sizes.',
          },
          {
            type: 'list',
            items: [
              'A single typeface and shared page-title style, so every page reads as part of one system',
              'An opening animation, animated page titles, and a custom cursor, built with GSAP and Framer Motion',
              'Stacked, scroll-driven sections on the home page and a works timeline',
              'A Lab page with an image slider and project videos for the DIC Lab',
              'Illustration stickers on page headers and a floating menu for navigation',
            ],
          },
        ],
      },
      {
        id: 'content-management',
        label: 'Content management',
        heading: 'Publishing without code',
        body: [
          {
            type: 'paragraph',
            text: 'In the final stretch I connected the Blog and news sections to Sanity, a headless CMS, and rendered article bodies with Portable Text. New posts and news items can be written and published from the CMS and appear on the site, with dedicated article pages, instead of being hard-coded into the repo.',
          },
        ],
      },
      {
        id: 'performance',
        label: 'Performance & mobile',
        heading: 'Making it fast and usable on phones',
        body: [
          {
            type: 'paragraph',
            text: 'Much of the audience opens the site on a phone, so after the first build I did a dedicated mobile pass, fixed the mobile navigation, and then worked on load speed. The site is deployed on Vercel with a region setting chosen for faster loads in India.',
          },
          {
            type: 'list',
            items: [
              'Route-level code splitting and lazy loading',
              'Compressed images',
              'Route preloading for smoother page transitions',
              'An accessibility stylesheet and a design-system document to keep fixes consistent',
            ],
          },
        ],
      },
      {
        id: 'results',
        label: 'Results',
        heading: 'Where it stands',
        body: [
          {
            type: 'paragraph',
            text: 'Live at djn.vercel.app, built and iterated over 31 commits from February to October 2026. Publications, news, and blog posts can now be added through the CMS, while the design stays consistent across pages.',
          },
        ],
      },
      {
        id: 'retrospective',
        label: 'Retrospective',
        heading: 'What I’d do differently',
        body: [
          {
            type: 'paragraph',
            text: 'The design system document came after most pages were already built, so I spent a round of commits aligning title sizes and spacing that shared tokens would have handled from the start. Next time, tokens and the CMS content model get defined before the first page.',
          },
        ],
      },
    ],
  },
  {
    slug: 'campus-club-connect',
    tag: 'Design',
    title: 'Campus Club Connect',
    summary:
      'A mobile app helping college students discover club events and opportunities, designed solo in a four-week sprint.',
    role: 'Product Designer (Solo)',
    timeline: '4 weeks',
    tools: ['Figma', 'Maze', 'Google Forms'],
    coverAlt: 'Mobile app screens showing a club events feed and event detail page',
    accent: 'blue',
    sections: [
      {
        id: 'context',
        label: 'Context',
        heading: 'Why this project',
        body: [
          {
            type: 'paragraph',
            text: 'College clubs run dozens of events every semester, but discovery is scattered across posters, WhatsApp groups, and word of mouth — students routinely miss events they would have loved.',
          },
        ],
      },
      {
        id: 'problem-space',
        label: 'Problem space',
        heading: 'The issue is…',
        body: [
          {
            type: 'paragraph',
            text: 'Students on college campuses struggle to stay informed about club events and opportunities, leading to low participation and reduced engagement. This lack of visibility limits their ability to explore diverse interests and build meaningful connections.',
          },
        ],
      },
      {
        id: 'user-research',
        label: 'User Research',
        heading: 'Talking to students',
        body: [
          {
            type: 'paragraph',
            text: 'Finding participants was hard on a short timeline, so research combined a short quantitative survey (42 responses) with five 20-minute interviews across a mixed group of first-years and seniors.',
          },
          {
            type: 'list',
            items: [
              'Students follow 6+ club social accounts on average, but still miss events',
              'Registration friction (forms, payment links, DMs) causes drop-off',
              'Word-of-mouth is the most trusted channel, but doesn’t scale',
            ],
          },
        ],
      },
      {
        id: 'research-findings',
        label: 'Research Findings',
        heading: 'What stood out',
        body: [
          {
            type: 'list',
            items: [
              'A single, chronological feed beat category browsing in usability tests',
              'One-tap RSVP tripled completed signups in the prototype test',
              'Students wanted club pages, not just isolated event listings',
            ],
          },
        ],
      },
      {
        id: 'design-phase',
        label: 'Design Phase',
        heading: 'From flows to screens',
        body: [
          {
            type: 'paragraph',
            text: 'Three flows were prioritized under the time constraint: finding events, joining clubs, and registering with as few steps as possible. Low-fidelity wireframes were validated before moving to high-fidelity screens.',
          },
        ],
      },
      {
        id: 'onboarding',
        label: 'Onboarding',
        heading: 'First-run experience',
        body: [
          {
            type: 'paragraph',
            text: 'Onboarding asks for interests up front (max 3 taps) so the home feed feels relevant from the very first open, instead of showing an empty or generic list.',
          },
        ],
      },
      {
        id: 'retrospective',
        label: 'Retrospective',
        heading: 'What I’d do differently',
        body: [
          {
            type: 'paragraph',
            text: 'Working solo made decisions fast, but early feedback would have caught the club-page gap sooner. Next time, a lightweight concept test would run in week one, not week three.',
          },
        ],
      },
    ],
  },
  {
    slug: 'realtime-order-pipeline',
    tag: 'Dev',
    title: 'Real-Time Order Pipeline',
    summary:
      'Rebuilt a retail order pipeline from polling to a real-time event stream, cutting order-status latency from minutes to seconds.',
    role: 'Full Stack Developer',
    timeline: '6 weeks',
    tools: ['Node.js', 'PostgreSQL', 'Redis', 'WebSockets'],
    coverAlt: 'Architecture diagram of an event-driven order processing pipeline',
    accent: 'red',
    sections: [
      {
        id: 'context',
        label: 'Context',
        heading: 'Why this project',
        body: [
          {
            type: 'paragraph',
            text: 'Customers polled an endpoint every 10 seconds to see order status, which meant stale data, wasted requests, and a support queue full of "where is my order" tickets.',
          },
        ],
      },
      {
        id: 'the-challenge',
        label: 'The Challenge',
        heading: 'The issue is…',
        body: [
          {
            type: 'paragraph',
            text: 'Order status changes happened in a warehouse system with no event hooks, so the web app had no way to know something changed without asking repeatedly — driving both latency and infrastructure cost.',
          },
        ],
      },
      {
        id: 'architecture',
        label: 'Architecture',
        heading: 'Moving to events',
        body: [
          {
            type: 'list',
            items: [
              'A change-data-capture job streams warehouse DB writes into Redis Streams',
              'A Node.js service consumes the stream and fans out over WebSockets',
              'Clients subscribe per-order-id instead of polling a shared endpoint',
            ],
          },
        ],
      },
      {
        id: 'implementation',
        label: 'Implementation',
        heading: 'Building it',
        body: [
          {
            type: 'paragraph',
            text: 'The trickiest part was backpressure: a burst of warehouse updates could overwhelm slow clients. Per-connection buffering with a bounded queue and drop-oldest policy kept memory flat under load testing.',
          },
        ],
      },
      {
        id: 'performance',
        label: 'Performance',
        heading: 'Results',
        body: [
          {
            type: 'list',
            items: [
              'Median status-update latency: ~4 minutes → ~1.2 seconds',
              'Polling traffic removed entirely (≈12% of API load)',
              'Support tickets tagged "order status" down 38% month over month',
            ],
          },
        ],
      },
      {
        id: 'retrospective',
        label: 'Retrospective',
        heading: 'What I’d do differently',
        body: [
          {
            type: 'paragraph',
            text: 'The migration ran both systems in parallel behind a feature flag, which was the right call for safety but added real complexity — a shorter parallel-run window would have been enough.',
          },
        ],
      },
    ],
  },
  {
    slug: 'design-system-fintech',
    tag: 'Design',
    title: 'Design System for a Fintech Startup',
    summary:
      'Built a token-based design system from scratch to unify a fast-growing product across three squads and two platforms.',
    role: 'Design Systems Lead',
    timeline: '10 weeks',
    tools: ['Figma', 'Storybook', 'React'],
    coverAlt: 'Component library page showing buttons, inputs, and color tokens',
    accent: 'blue',
    sections: [
      {
        id: 'context',
        label: 'Context',
        heading: 'Why this project',
        body: [
          {
            type: 'paragraph',
            text: 'Three product squads had each rebuilt buttons, inputs, and cards independently, creating visual drift and slowing every new feature down with one-off styling decisions.',
          },
        ],
      },
      {
        id: 'problem-space',
        label: 'Problem space',
        heading: 'The issue is…',
        body: [
          {
            type: 'paragraph',
            text: 'Without shared components or tokens, small UI inconsistencies compounded into a product that felt like three different apps, and every design review re-litigated basics like spacing and color.',
          },
        ],
      },
      {
        id: 'design-phase',
        label: 'Design Phase',
        heading: 'Tokens first',
        body: [
          {
            type: 'list',
            items: [
              'Defined a two-tier token system: primitives (raw values) and semantic tokens (usage-based)',
              'Audited 140+ existing components down to a 32-component core set',
              'Paired every Figma component with a matching React/Storybook implementation',
            ],
          },
        ],
      },
      {
        id: 'adoption',
        label: 'Adoption',
        heading: 'Getting squads to switch',
        body: [
          {
            type: 'paragraph',
            text: 'Documentation alone didn’t drive adoption. Pairing with each squad on their first migration, plus a lint rule flagging raw hex values, got the system used instead of just admired.',
          },
        ],
      },
      {
        id: 'retrospective',
        label: 'Retrospective',
        heading: 'What I’d do differently',
        body: [
          {
            type: 'paragraph',
            text: 'Governance was an afterthought — defining a clear contribution process from week one would have avoided a few rounds of components drifting out of sync again.',
          },
        ],
      },
    ],
  },
];

export function getCaseStudyBySlug(slug) {
  return caseStudies.find((study) => study.slug === slug);
}
