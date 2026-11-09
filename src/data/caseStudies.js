// caseStudies[0] (6th Mobile Studies Congress), [1] (Deepak John Mathew) and ProgressFlow are real, compiled from the
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
  // ProgressFlow, in two parts: Design (what we learned, the idea, how it was shaped and tested)
  // and Engineering (how it runs). Written from the repository (~/progressflow, through the
  // 5 Nov 2026 "version 2" commits), its docs, the project's prototype and research figures, and the
  // earlier PDF write-up. Figures are the real app, dashboard and prototype with sample data.
  // Edit freely: the role split, the "reasoning" column of the version table and anything marked
  // "not yet confirmed" are for you to check.
  {
    slug: 'progressflow',
    tag: 'Design + Dev',
    title: 'ProgressFlow: formative assessment for Indian art classrooms',
    summary:
      'A phone app, teacher dashboard and student portal that help art teachers assess drawings and paintings against a rubric, in English, Hindi and Telugu, with or without a signal. Designed with a PhD researcher after a workshop and interviews with 10 art educators, and engineered end to end.',
    role: 'Product design (with Ganesh) and full-stack engineering',
    timeline: '6-month research grant (Aug – Dec 2026), written up to early Nov',
    timelineShort: '6 months',
    tools: [
      'React Native (Expo)',
      'React (Vite)',
      'Express',
      'Prisma',
      'PostgreSQL (Neon)',
      'TypeScript',
      'ML Kit',
      'Firebase Phone Auth',
    ],
    coverAlt:
      'The ProgressFlow teacher dashboard showing a student’s drawing with the teacher’s markup beside the four-criterion rubric, next to the phone app’s scan review screen',
    accent: 'blue',
    facts: [
      {
        label: 'Surfaces',
        value: 'Android app, API server, teacher web dashboard, student web portal, public project page',
      },
      { label: 'Languages', value: 'English, Hindi, Telugu' },
      {
        label: 'Team',
        value:
          'Project lead Ganesh Kumar Malthurkar (PhD scholar, Department of Design, IIT Hyderabad); mentor Prof. Deepak John Mathew. Designed together; engineered by me.',
      },
      {
        label: 'Status',
        value:
          'Working Android prototype and a deployed API. Teacher and student flows run end to end; no classroom has used it yet. Pilot planned for late Nov and Dec 2026.',
      },
    ],
    parts: {
      design: {
        number: '01',
        kicker: 'Part 1',
        name: 'Design',
        tagline: 'the why',
        blurb:
          'What we learned from educators, the idea we settled on, and how it was shaped, tested and improved.',
        accent: 'blue',
      },
      engineering: {
        number: '02',
        kicker: 'Part 2',
        name: 'Engineering',
        tagline: 'the how',
        blurb:
          'How it runs: a phone that works offline, a server that keeps everything in sync, and the guarantees that keep a child’s work private.',
        accent: 'red',
      },
    },
    sections: [
      // ───────────────────────── Overview ─────────────────────────
      {
        id: 'overview',
        group: 'Overview',
        label: 'Overview',
        heading: 'Art is hard to assess fairly, and harder to assess fast',
        body: [
          {
            type: 'paragraph',
            text: 'ProgressFlow is a phone app, a teacher dashboard and a student portal that help art teachers in Classes 6 to 8 assess drawings and paintings against a rubric, in English, Hindi and Telugu, with or without a signal. A teacher photographs a stack of papers, the phone sorts them by student, and feedback travels from the teacher’s phone to the student’s.',
          },
          {
            type: 'paragraph',
            text: 'It began as part of Ganesh Kumar Malthurkar’s PhD research at IIT Hyderabad, with a workshop and interviews with 10 art educators from residential schools in Telangana. We designed it together. I built every part of the technology.',
          },
          {
            type: 'stats',
            items: [
              { value: '3', label: 'languages, built into every screen' },
              { value: '4', label: 'surfaces: phone, server, dashboard, student portal' },
              { value: '127', label: 'server checks, 63 of them trying to break privacy rules' },
              { value: '1,346', label: 'translation checks, all passing' },
            ],
          },
          {
            type: 'paragraph',
            text: 'Short on time? This overview and the journey below tell the whole story. The two parts go deeper.',
          },
          {
            type: 'cards',
            items: [
              {
                kicker: 'Part 1',
                title: 'Design',
                text: 'What the research told us, the idea we settled on, and how it was shaped, tested and improved.',
                points: [
                  'Insights from educators',
                  'A pocket assessor for the minutes between periods',
                  'Wireframes, a prototype and two versions',
                ],
                href: '#part-design',
                linkLabel: 'Read the design',
                accent: 'blue',
              },
              {
                kicker: 'Part 2',
                title: 'Engineering',
                text: 'How it runs: a phone that works offline, a server that keeps everything in sync, and the guarantees that keep a child’s work private.',
                points: [
                  'One codebase, four surfaces',
                  'Offline-first sync and on-device intelligence',
                  'Privacy, deployment and tests written as attacks',
                ],
                href: '#part-engineering',
                linkLabel: 'Read the engineering',
                accent: 'red',
              },
            ],
          },
          {
            type: 'figure',
            src: '/work/progressflow/dashboard-submission.webp',
            alt: 'The teacher dashboard showing a student’s pencil drawing with a red circle, a blue arrow and a highlighted roll number, beside four rubric criteria rated Exemplary or Proficient',
            caption:
              'The teacher dashboard, with sample data: one student’s piece with the teacher’s markup beside the four-criterion rubric.',
            width: 800,
            height: 536,
          },
        ],
      },
      {
        id: 'journey',
        group: 'Overview',
        label: 'The journey',
        heading: 'From a workshop to a working system',
        body: [
          {
            type: 'paragraph',
            text: 'Six steps took it from a room of educators to a deployed system. The chips show where each one is covered.',
          },
          {
            type: 'steps',
            items: [
              {
                title: 'Listen to educators',
                text: 'As part of Ganesh’s PhD research we ran a workshop and qualitative interviews with 10 art educators from residential schools in Telangana. It built on a wider study of 70 educators across the state.',
                part: 'design',
              },
              {
                title: 'Turn insights into a brief',
                text: 'We pulled out the key insights, then brainstormed a better way to evaluate exams and submissions.',
                part: 'design',
              },
              {
                title: 'Decide on the idea',
                text: 'We chose an app-shaped answer: a pocket assessor a teacher can use between periods. Photograph the papers, score them against a rubric that teaches, mark up and speak the feedback, and let students see it and answer.',
                part: 'design',
              },
              {
                title: 'Shape it on paper',
                text: 'We wrote the features, drew the wireframes and flows, and agreed them on a clickable prototype before any native code existed.',
                part: 'design',
              },
              {
                title: 'Version 1: build, test, improve',
                text: 'I built the first version of the app. We reviewed and tested it, then added a handful of features and options to improve the UX.',
                part: ['design', 'engineering'],
              },
              {
                title: 'Version 2: make it a system',
                text: 'With the app’s expectations settled, I built the server, the database and everything else needed to run and use it, and made sure it worked end to end.',
                part: 'engineering',
              },
            ],
          },
        ],
      },

      // ───────────────────────── Part 1: Design ─────────────────────────
      {
        id: 'insights',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'Insights',
        heading: 'What the research told us',
        body: [
          {
            type: 'paragraph',
            text: 'Ganesh’s research gave the project its evidence, and the workshop and interviews gave it voices.',
          },
          {
            type: 'stats',
            items: [
              { value: '70', label: 'art educators studied across Telangana' },
              { value: '10', label: 'educators from residential schools in the workshop and interviews' },
              { value: '58%', label: 'cited limited documentation' },
              { value: '32%', label: 'cited time scarcity: 50+ students, two periods a week' },
            ],
          },
          {
            type: 'paragraph',
            text: 'Together they pointed to four problems the app had to solve.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'No shared language.',
                text: 'Two teachers can look at one drawing, use the same rubric words and mean different things. Students usually see a grade, not the reasons.',
              },
              {
                lead: 'Feedback arrives late.',
                text: 'Marking a class set takes evenings, so comments reach a student after the next piece has started.',
              },
              {
                lead: 'Wrong assumptions.',
                text: 'Most assessment apps assume steady internet and English-only input. Many Indian classrooms have neither, and spoken feedback in Telugu or Hindi has nowhere to live.',
              },
              {
                lead: 'Children’s data.',
                text: 'Photos, voices and judgements about minors fall under India’s Digital Personal Data Protection Act, 2023.',
              },
            ],
          },
          {
            type: 'paragraph',
            text: 'The design question we worked from: how might a teacher give specific, kind and trustworthy feedback on a child’s drawing, in the minutes between periods, on a phone, offline, in the language the child thinks in?',
          },
        ],
      },
      {
        id: 'idea',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'The idea',
        heading: 'A pocket assessor for the minutes between periods',
        body: [
          {
            type: 'paragraph',
            text: 'We answered with an app, because the phone is the one device every teacher already has in the classroom. The idea is to turn the dead minutes between periods into assessment that is quick, specific and kind. One loop, six moves:',
          },
          {
            type: 'steps',
            items: [
              {
                title: 'Capture',
                text: 'Photograph a stack of papers in a row, without stopping to review each one.',
              },
              {
                title: 'Sort',
                text: 'The phone reads whose paper each one is, shows why, and files it. The teacher confirms anything it is unsure of.',
              },
              {
                title: 'Score',
                text: 'Tap a level on each of four criteria. Every level explains itself.',
              },
              {
                title: 'Mark up and speak',
                text: 'Circle, highlight, draw an arrow, and leave a voice note in English, Hindi or Telugu.',
              },
              {
                title: 'Reflect',
                text: 'Students see the work and the feedback on their own phone, rate themselves, and review a classmate’s piece with guard rails.',
              },
              {
                title: 'See growth',
                text: 'A teacher sees progress across a term, per student and per criterion, and can hand it over as a report.',
              },
            ],
          },
          {
            type: 'paragraph',
            text: 'Underneath it sits one rule: never block the teacher on the network. Everything works offline, and the server exists only to sync and to give a laptop view.',
          },
          {
            type: 'paragraph',
            text: 'Two people use it: a time-poor art teacher on a mid-range Android phone, and a child of 11 to 14 on a phone that may be shared. Those two facts set most of the constraints.',
          },
          {
            type: 'note',
            label: 'A caveat I want to be clear about.',
            text: 'The research was with teachers. What I assume about children (shared phones, limited English, reading level) comes from the project brief and my own reasoning, and I have not yet tested the student side with children. They are hypotheses for the pilot.',
          },
          {
            type: 'table',
            caption: 'Constraints and what each one forced',
            head: ['Constraint', 'What it forced'],
            rows: [
              [
                'Teacher has one hand free and a few minutes',
                'Large tap targets (56 px minimum), one decision per screen, no typing for feedback',
              ],
              [
                'Connectivity is unreliable',
                'Everything works offline; the network is only used to sync later',
              ],
              [
                'Mid-range and older phones',
                'Photo checks run on a 640 px copy and name reading on a 1,600 px copy, never the full photo',
              ],
              [
                'Three languages in one classroom',
                'Interface, rubric text and voice notes in English, Hindi and Telugu',
              ],
              [
                'Students have no email and may not read English well',
                'Sign-in by a 6-character code; plain wording; hints on demand',
              ],
              [
                'Minors’ photos and voices',
                'Device PIN lock, per-teacher separation, no cloud backup, teacher approval before classmates see feedback',
              ],
            ],
          },
        ],
      },
      {
        id: 'principles',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'Principles',
        heading: 'Six principles that settled the trade-offs',
        body: [
          {
            type: 'list',
            items: [
              {
                lead: 'Never block the teacher on the network.',
                text: 'Anything that needs a connection happens later, quietly. Scans, scores, markup and voice notes are saved on the phone first.',
              },
              {
                lead: 'The machine suggests; the teacher decides.',
                text: 'Every automatic guess shows its reasoning and can be changed. The app says “Matched by roll number” and offers a Change button.',
              },
              {
                lead: 'Explain, don’t just score.',
                text: 'The rubric is a teaching tool. Each criterion has a diagram, three things to look for, a question to ask the student and a description of every level.',
              },
              {
                lead: 'A child’s work is private by default.',
                text: 'Design for the awkward case, not the happy one. Classmates’ feedback is hidden until the teacher approves it.',
              },
              {
                lead: 'Language is interface.',
                text: 'Hindi and Telugu are built in, not bolted on. The language switch sits on the sign-in screen, because someone who cannot read English cannot find a setting behind it.',
              },
              {
                lead: 'Say what is not done.',
                text: 'Status is part of the product. The rubric wording is labelled a draft wherever it appears.',
              },
            ],
          },
        ],
      },
      {
        id: 'prototype',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'Prototype',
        heading: 'Wireframes, flows and a clickable prototype',
        body: [
          {
            type: 'paragraph',
            text: 'We wrote the features, drew the wireframes and mapped the flows. The research framework had four components; we turned them into five MVP features: visual rubric scoring, photo with annotation and voice, peer and self assessment, a teacher dashboard and a student portal.',
          },
          {
            type: 'paragraph',
            text: 'Then I built a single-file clickable prototype with five screens, so the whole flow could be judged on a phone before any native code existed. Every screen is tagged with the feature it answers and the research component behind it, so nothing in the app exists without a reason.',
          },
          {
            type: 'figure',
            src: '/work/progressflow/prototype.webp',
            alt: 'Four screens of the clickable prototype side by side: the class roster, tap-to-rate rubric scoring, markup and voice recording, and a student’s My Work screen with a growth chart',
            caption:
              'The clickable prototype: the class roster, rubric scoring, markup with a voice note, and the student’s own view. Each screen maps to one of the five MVP features.',
            width: 1964,
            height: 1131,
          },
        ],
      },
      {
        id: 'capture',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'Capture & sorting',
        heading: 'Photograph the whole stack, then sort it with reasoning',
        body: [
          {
            type: 'paragraph',
            text: 'A class set of papers means dozens of photos, so we stopped treating capture as one careful scan at a time. The camera takes a whole stack in a row, and the thinking happens afterwards in a class inbox.',
          },
          {
            type: 'figure',
            src: '/work/progressflow/scan-review.webp',
            alt: 'The phone app’s scan review screen: a photographed notebook cover, a green “Good scan” banner with sharpness and brightness readings, a thumbnail strip, and Keep scanning and Save buttons',
            caption:
              'The first capture flow (version 1): scan a page, check it, save it. A real build with sample data. Version 2 is batch-first, and the same checks run in the class inbox.',
            width: 540,
            height: 1108,
            narrow: true,
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Batch first.',
                text: 'Each shot goes straight into the class’s inbox with no review in between, so nothing is lost if the phone goes back in a pocket.',
              },
              {
                lead: 'Two ways to shoot.',
                text: '“Edge detect + crop” (the default) finds the page edges and crops, with no filters. “Full photo” keeps the camera’s own picture whole. The app never changes the colour of a child’s artwork.',
              },
              {
                lead: 'A gate with reasons.',
                text: 'Each paper is checked for blur, low resolution, darkness, glare, cut-off edges and an orientation that differs from the rest. A flagged paper says what is wrong and how to fix it (“Move closer so the artwork fills the frame”) and offers Retake.',
              },
              {
                lead: 'An escape hatch.',
                text: 'Filing papers that look poor raises “3 photos look poor”, with Look and File anyway, because the teacher knows things the checker cannot, such as a drawing that is meant to be sideways.',
              },
              {
                lead: 'Permissions that recover.',
                text: 'If Android will no longer show the camera prompt, the screen offers Open settings and picks the new permission up when the teacher comes back. A first-launch screen explains why the camera and microphone are needed.',
              },
            ],
          },
          {
            type: 'paragraph',
            text: 'Then comes the part where a mistake would hurt most. Misfiling a child’s work is worse than asking, so the app reads each paper, proposes a student, shows why, and leaves anything it is unsure of for the teacher. The inbox keeps count: “12 ready · 3 to check · 2 not read”.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Roll number first, name second.',
                text: 'The roll number written in digits is the strong signal; a fuzzy name match is the backup. A misspelt name (“Dlya”) with the right roll still resolves to the right student.',
              },
              {
                lead: 'Reasoning on screen.',
                text: 'The student chip reads “Matched by roll number”, “Matched by name, please check” or “Could not read a roll number or name. Choose the student.” Lower-confidence matches use a warning colour.',
              },
              {
                lead: 'Only confident matches file themselves.',
                text: 'A match on the roll number is filed without a second look. A match on the name alone, or a roll number that disagrees with the name, is marked and waits for the teacher.',
              },
              {
                lead: 'Scoped to the open class.',
                text: 'Matching only looks at the class being sorted. Roll 2 in Class 7-A can never claim a paper from 7-B.',
              },
              {
                lead: 'No orphans.',
                text: 'Papers are filed only onto a student, and two papers for the same student join one submission with several pages.',
              },
              {
                lead: 'Designing around a limit.',
                text: 'The on-device text reader handles Latin script but has no Telugu model, and handwriting is unreliable. Instead of pretending, the design leans on digits and asks students to write “Roll No: 12” and their name in block letters.',
              },
            ],
          },
        ],
      },
      {
        id: 'rubric',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'Rubric',
        heading: 'A rubric that teaches, and that a teacher can change',
        body: [
          {
            type: 'paragraph',
            text: 'We treated the rubric as the main interface for teachers and the main learning tool for students, not as a form to fill in.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Four criteria, four levels.',
                text: 'By default: composition, colour theory, technical skill and conceptual depth, each rated Emerging, Developing, Proficient or Exemplary. Four tap targets, each at least 56 px tall, with the number and the level name together.',
              },
              {
                lead: 'Hints you can open.',
                text: 'Each criterion has a hint sheet with a small diagram (rule of thirds, colour wheel, shading ramp, idea-to-artwork), three things to look for, a question to ask the student, and what every level looks like. The diagrams carry no text, so they work in any language.',
              },
              {
                lead: 'Support for the decision.',
                text: 'Once a level is chosen, the description of that level appears under the buttons. A line like “+1 since 7 Oct” shows growth against the student’s previous piece.',
              },
              {
                lead: 'The teacher’s own rubric.',
                text: 'A teacher can rename, add or remove criteria and pick each one’s icon and colour. The assessment types (Assignment, Exam 1, Exam 2, Quarterly, Sketch, Progress, Portfolio) can be renamed, reordered and added to.',
              },
              {
                lead: 'A Save button that tells the truth.',
                text: 'An evaluation counts as saved only when the teacher presses Save and has not changed it since. If they have, the screen says “Changed since saved”.',
              },
            ],
          },
          {
            type: 'note',
            label: 'Honest about its status.',
            text: 'The default wording is a working draft, and says so wherever it appears. The plan is to replace it with descriptors written by art teachers, with example images for each level.',
          },
        ],
      },
      {
        id: 'feedback',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'Feedback',
        heading: 'Marking up, speaking and attaching',
        body: [
          {
            type: 'paragraph',
            text: 'Feedback should be as quick as pointing and speaking, so typing is optional everywhere.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Markup you can switch off.',
                text: 'Circle, highlight, arrow and pen, in four colours, with Undo and Clear. A single switch hides all markup without deleting it, so the teacher can show the clean work and the corrections separately.',
              },
              {
                lead: 'Voice in the child’s language.',
                text: 'A voice note can be recorded and tagged English, Hindi or Telugu. Spoken feedback is quicker for the teacher and easier for many students to take in.',
              },
              {
                lead: 'References and links.',
                text: 'An image, a file, a link or a short note can be attached to any piece of feedback.',
              },
            ],
          },
          {
            type: 'note',
            label: 'Not built yet.',
            text: 'Automatic transcripts of voice notes. The audio is saved, but nothing turns it into text.',
          },
        ],
      },
      {
        id: 'students',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'The student side',
        heading: 'A student side that treats a child’s work as private',
        body: [
          {
            type: 'paragraph',
            text: 'We gave students a portal with no account to create, and designed peer review around the ways it could hurt a child.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'A code, not an account.',
                text: 'Each student has a 6-character join code that the teacher prints from the class page and can replace at any time. It shows only that student’s own work.',
              },
              {
                lead: 'Built for a phone and a child.',
                text: 'Large targets, level buttons in a 2 by 2 grid on small screens, hints inline, character counters, one idea per step.',
              },
              {
                lead: 'Self-review in two steps.',
                text: 'Rate the four criteria, then answer what went well, what to change and how sure you are. Afterwards the student’s scores appear beside the teacher’s, which is where the learning is.',
              },
              {
                lead: 'Peer review, with guard rails.',
                text: 'A classmate sees only the image of a piece the teacher has opened in their own class: no name, no scores, no voice note. Their feedback stays hidden until the teacher approves it, and the author never learns who wrote it.',
              },
            ],
          },
          {
            type: 'note',
            label: 'A limit I could not design away.',
            text: 'If a child wrote their name on the drawing, which is exactly what we ask them to do so the scanner can identify it, classmates will see it and the anonymity is gone. The teacher is warned where they switch sharing on. The approval step also adds work for the teacher, and I have not measured how much.',
          },
        ],
      },
      {
        id: 'languages',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'Languages',
        heading: 'Hindi, Telugu and English as interface, not an afterthought',
        body: [
          {
            type: 'list',
            items: [
              {
                lead: 'Switch where it is needed.',
                text: 'Language chips sit on the phone’s sign-in screen and in the student portal’s header. A language is picked from the phone’s own setting, then the teacher’s profile, until the person chooses.',
              },
              {
                lead: 'Details that are easy to miss.',
                text: 'Dates follow the chosen language, the rubric diagrams contain no text, and language-tagged markup lets screen readers pronounce each script correctly.',
              },
            ],
          },
          {
            type: 'note',
            label: 'What I have not done.',
            text: 'I wrote the Hindi and Telugu myself, with no native-speaker review. They are drafts, and the rubric descriptors in particular need teachers’ eyes before any student relies on them. The newest strings (phone verification, the inbox, reports) are drafts too. The project page and server error messages are English only.',
          },
        ],
      },
      {
        id: 'progress',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'Progress & reports',
        heading: 'From scores to a story',
        body: [
          {
            type: 'paragraph',
            text: 'A rubric score on its own is just a number. The phone turns a teacher’s marks into pictures that can be read at a glance and documents that can be handed over.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Four views of one student.',
                text: 'Progress (growth over time), Compare (against the class), Holistic (a radar across the criteria) and Analysis (a heatmap). Each has a one-line hint saying what it shows.',
              },
              {
                lead: 'Reports in formats teachers already use.',
                text: 'Class and student reports as PDF, Word, Excel or CSV through the phone’s share sheet.',
              },
            ],
          },
          {
            type: 'note',
            label: 'Not validated.',
            text: 'I have not yet watched a teacher use these views, so I do not know which of the four earns its place.',
          },
        ],
      },
      {
        id: 'iteration',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'Version 1 to 2',
        heading: 'Version 1: test, review, improve',
        body: [
          {
            type: 'paragraph',
            text: 'We reviewed and tested the first version of the app, then added a handful of features and options to improve the UX. These are the changes that mattered most between version 1 and version 2.',
          },
          {
            type: 'table',
            caption: 'What changed, and the reasoning behind it',
            head: ['Area', 'Version 1', 'Version 2', 'The reasoning'],
            rows: [
              [
                'Capture',
                'Scan one page at a time: scan, check, save',
                'Photograph a whole stack, sort it afterwards in a class inbox',
                'A class set is dozens of papers; stopping to review each one costs more than sorting them together',
              ],
              [
                'Forgotten PIN',
                'Erased that account’s data on the phone',
                'Verified by a six-digit code, then a new PIN',
                'The data belongs to children and cannot be recovered offline',
              ],
              [
                'Rubric and types',
                'Four fixed criteria',
                'A teacher-editable rubric and assessment types',
                'Teachers assess different things in different exams',
              ],
              [
                'Insight',
                'A score per criterion',
                'Four progress views, and reports in PDF, Word, Excel and CSV',
                'A teacher needs something to hand over, not only a number to read',
              ],
              [
                'Set-up',
                'Add students one by one',
                'Import a class list from a spreadsheet, Word file, CSV or text',
                'Typing 50 names on a phone is the wrong job',
              ],
            ],
          },
        ],
      },
      {
        id: 'project-page',
        part: 'design',
        group: 'Part 1 · Design',
        label: 'Project page',
        heading: 'The project page, and what two rounds of critique taught',
        body: [
          {
            type: 'paragraph',
            text: 'The public project page went through three designs, and the two rejections taught me more than the final version did.',
          },
          {
            type: 'table',
            caption: 'Three versions of the project page',
            head: ['Version', 'What I made', 'Feedback', 'What I learned'],
            rows: [
              [
                '1',
                'A familiar product landing page: gradient glow, phone mock-up with floating cards, icon cards',
                '“Purely AI slop”',
                'A polished template is invisible; nothing in it came from this product',
              ],
              [
                '2',
                'An editorial paper look: serif headings, numbered sections, a hand-drawn circle over the headline',
                '“This is good, but still feels like AI slop. Make it more human, dev-made”',
                'The new look was a different template, applied uniformly, with decoration I had generated rather than anything the product produced',
              ],
              [
                '3',
                'A research project page: plain type, an abstract, real screenshots, a table of what works and what does not',
                'No further objection raised (not formally reviewed)',
                'Specific, honest content and real artefacts do the work that decoration was pretending to do',
              ],
            ],
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Accessibility as a design material, measured.',
                text: 'I checked contrast on every colour instead of trusting my eye. My red labels measured 3.75:1 on the paper tone and failed the 4.5:1 requirement, two chart label colours came out at 4.4, and text faded with opacity fell to 3.0. I replaced them with darker text colours that all clear 6:1 in light and dark.',
              },
              {
                lead: 'Readable by default.',
                text: 'Body text is 18 px on a 1.65 line height, nothing moves for more than a few seconds, and the rubric is a real table that stacks into readable blocks on a phone with no sideways scrolling. The page sets no cookies and makes no outside requests.',
              },
            ],
          },
          {
            type: 'note',
            text: 'I have not run an automated checker or a screen-reader pass on it.',
          },
        ],
      },

      // ───────────────────────── Part 2: Engineering ─────────────────────────
      {
        id: 'architecture',
        part: 'engineering',
        group: 'Part 2 · Engineering',
        label: 'Architecture',
        heading: 'One codebase, four surfaces',
        body: [
          {
            type: 'paragraph',
            text: 'Version 2 turned the app into a system. One TypeScript monorepo holds the phone app, the API server, the teacher dashboard, the student portal and the public project page, all built around a single shared package.',
          },
          {
            type: 'figure',
            src: '/work/progressflow/architecture.svg',
            alt: 'System diagram. A shared TypeScript package feeds everything. The teacher’s phone pushes snapshots to an API server, a Vercel function in Singapore, which stores data in a Neon PostgreSQL database and files in private object storage, and serves a read-only teacher dashboard and a student portal. Firebase Phone Auth sends the phone a verification code.',
            caption:
              'How the pieces fit. The phone works fully offline; the server and web apps exist for sync, the laptop view and students.',
            width: 1200,
            height: 700,
          },
          {
            type: 'stats',
            items: [
              { value: '≈19k', label: 'lines of TypeScript and CSS across five apps and a shared package' },
              { value: '18', label: 'database models' },
              { value: '6', label: 'API route groups: auth, sync, media, dashboard, student, health' },
              { value: '1', label: 'shared package that every surface imports' },
            ],
          },
          {
            type: 'table',
            caption: 'The four surfaces and the project page',
            head: ['Surface', 'Built with', 'What it does'],
            rows: [
              [
                'Phone app',
                'React Native (Expo), TypeScript, ML Kit',
                'Capture, sort, score, mark up and record; works offline; syncs when it can',
              ],
              [
                'API server',
                'Express, Prisma, PostgreSQL (Neon), S3-compatible storage, running as a Vercel function',
                'Accepts the phone’s pushes, keeps the data and files, answers the dashboards',
              ],
              [
                'Teacher dashboard',
                'React (Vite)',
                'A read-only laptop view: class averages, trends, a student’s growth, the original work with its markup',
              ],
              [
                'Student portal',
                'React (Vite)',
                'Join-code sign-in; a student’s own work, self-review and approved peer review',
              ],
              [
                'Project page',
                'Static React, plain CSS',
                'The public explanation of the project',
              ],
            ],
          },
        ],
      },
      {
        id: 'sync',
        part: 'engineering',
        group: 'Part 2 · Engineering',
        label: 'Offline & sync',
        heading: 'Offline-first, with one writer',
        body: [
          {
            type: 'paragraph',
            text: 'The phone is the only place data is entered. That removes almost every sync conflict and keeps the teacher’s workflow independent of the network.',
          },
          {
            type: 'figure',
            src: '/work/progressflow/dashboard-class.webp',
            alt: 'The teacher dashboard for Class 7-B: five students, six submissions, a class average of 2.8 out of 4, bars for the average of each criterion and a trend line below',
            caption:
              'The laptop view, with sample data: a class at a glance, with the average for each criterion and a trend over time.',
            width: 800,
            height: 528,
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Snapshot push.',
                text: 'The phone pushes classes, students and the submissions that changed. The server replies with the photos and recordings it still lacks, and the phone uploads only those. If two versions meet, the newer one wins per submission.',
              },
              {
                lead: 'Photos sized for the host.',
                text: 'The original stays on the phone. The dashboard gets a 2,000 px copy, well under 1 MB, so it fits hosts that cap a request near 4.5 MB.',
              },
              {
                lead: 'Quiet, visible status.',
                text: 'Sync starts a few seconds after a change and retries every minute when offline. The Account sheet says “Up to date”, “Waiting for a connection” or “3 waiting to upload”; it never blocks the screen.',
              },
              {
                lead: 'Version 2 taught the server about the teacher.',
                text: 'The teacher’s own assessment types and rubric now travel with the push and are kept in their settings, so the dashboard averages only the criteria in the current rubric. The Save status syncs too: “waiting” on the dashboard means photographed but not saved.',
              },
              {
                lead: 'Deletions travel as tombstones.',
                text: 'A delete on the phone is sent on the next push. The server soft-deletes the rows with their cascade, erases the stored photos and recordings, and closes the student’s portal code. Ids that are not the teacher’s are ignored.',
              },
              {
                lead: 'An assessment kind that can be anything.',
                text: 'The kind of assessment went from a fixed set of four values to any short id, through a migration that turned the column into text.',
              },
            ],
          },
          {
            type: 'note',
            label: 'The trade-offs I accepted.',
            text: 'A new phone cannot yet download older data, scores cannot be edited from the web, and the student portal’s review form still uses the standard four criteria.',
          },
        ],
      },
      {
        id: 'on-device',
        part: 'engineering',
        group: 'Part 2 · Engineering',
        label: 'On-device intelligence',
        heading: 'On-device intelligence, cheap on old phones',
        body: [
          {
            type: 'paragraph',
            text: 'Capture and sorting run on the phone, so they work with no signal, and no photo has to leave the device to be understood.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'A quality gate with measured thresholds.',
                text: 'Each photo is checked on a 640 px copy: a shorter side of at least 900 px, sharpness measured as the variance of the Laplacian divided by luminance variance, brightness between 70 and 245, a plausible aspect ratio, and no dark strip along an edge where the background crept in.',
              },
              {
                lead: 'Reading names.',
                text: 'ML Kit’s on-device text recognition reads a 1,600 px copy. The top third of the page is read first, and the whole page only if that finds nobody, so a stray number in the drawing is not taken for a roll number.',
              },
              {
                lead: 'A matcher you can test.',
                text: 'Matching is plain TypeScript with no native modules, so it runs under Node. A roll number found by pattern is the strong signal; a fuzzy name (edit-distance similarity of 0.8 or more on the first name) is the backup. The resulting confidence decides whether a paper files itself.',
              },
              {
                lead: 'Crop-only scanning.',
                text: 'The scanner plugin is patched down to its crop-only mode. The patch is applied by patch-package in every build, so a clean build behaves the same as mine.',
              },
            ],
          },
          {
            type: 'paragraph',
            text: 'The calibration story. My first blur threshold was a guess. To replace it with evidence I generated test pages and measured them with the same algorithm: sharp pages scored 2.4 to 3.1, a mildly blurred page 0.09 and a heavily blurred one 0.012. One real scan from the phone read 3.05, which matched. A threshold of 0.06 would have let the mildly blurred page through, so I raised it to 0.3. The raw numbers are shown on the review screen so the next person can tune them. This is still based on a handful of photos.',
          },
        ],
      },
      {
        id: 'privacy',
        part: 'engineering',
        group: 'Part 2 · Engineering',
        label: 'Privacy & security',
        heading: 'Privacy and security, built in',
        body: [
          {
            type: 'paragraph',
            text: 'The design says a child’s work is private by default. The code has to make that true even when something goes wrong.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Separate sessions.',
                text: 'Student and teacher sessions are different token types; neither works on the other’s routes. A student’s id always comes from the session, never from the request.',
              },
              {
                lead: 'Every id is checked.',
                text: 'Every id in a push is checked against the signed-in teacher before anything is written, and media is looked up by database row, never by a path the client supplies.',
              },
              {
                lead: 'Guard rails on peer review.',
                text: 'A reviewer can load only the images of a piece open for review in their own class: not the author’s name, scores, voice note or attachments. Join-code sign-in is rate-limited, and a replaced code stops working at once.',
              },
              {
                lead: 'Files stay private.',
                text: 'Photos, voice notes and attachments live in a private S3-compatible bucket, and every read passes through the API’s ownership check. Uploads are served with nosniff, and only images and audio are shown inline.',
              },
              {
                lead: 'Two different locks.',
                text: 'On the web: scrypt password hashes and an httpOnly, SameSite cookie. On the phone: a PIN kept in the device keystore, lockouts that start at 30 seconds and double up to 15 minutes, a lock after five minutes away, and no operating-system backup.',
              },
              {
                lead: 'A forgotten PIN no longer erases a child’s data.',
                text: 'The phone number is verified with a six-digit code (Firebase Phone Auth, with a demo mode so builds never depend on a Firebase project) and a new PIN is set. Registration asks for the same code, with “Skip for now” so the app stays offline-first.',
              },
            ],
          },
          {
            type: 'note',
            label: 'Not done yet.',
            text: 'Token revocation, an audit log, guardian consent records, and application-level encryption of stored photos and recordings. Real SMS delivery for the phone code is not yet confirmed.',
          },
        ],
      },
      {
        id: 'i18n',
        part: 'engineering',
        group: 'Part 2 · Engineering',
        label: 'Translation',
        heading: 'Translation as a build-time guarantee',
        body: [
          {
            type: 'paragraph',
            text: 'I made translation something the compiler enforces, so no screen can quietly fall back to English.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'One typed dictionary.',
                text: 'English is the source (673 strings); Hindi and Telugu are typed against it, so a missing translation does not compile. It covers the student portal, the teacher dashboard, the phone app and all rubric text.',
              },
              {
                lead: 'A test for what the compiler can’t see.',
                text: '1,346 checks confirm no placeholder such as {name} was lost and no string was left in English by mistake.',
              },
              {
                lead: 'A shared package as the source of truth.',
                text: 'Data types, rubric descriptors, translations and the sync and review contracts live in one package that the phone, the web apps and the server all import. Change a descriptor once and every screen changes. A wrong score range or a malformed sync payload is a build error, not a blank on a child’s screen.',
              },
            ],
          },
          {
            type: 'note',
            label: 'A leak I caught.',
            text: 'A signed-in teacher’s profile language was being applied to the student page in the same browser, so a child could see the teacher’s language. It now applies only to teacher pages.',
          },
        ],
      },
      {
        id: 'shipping',
        part: 'engineering',
        group: 'Part 2 · Engineering',
        label: 'Shipping it',
        heading: 'Shipping it: from a laptop to a live API',
        body: [
          {
            type: 'paragraph',
            text: 'Most of the real engineering problems showed up only when the system left my laptop.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Builds from a clean clone.',
                text: 'The shared package’s compiled output is not committed, so a clean clone had no types and the compiler failed on every import. The web app and the project page now build the shared package first. I verified it by deleting the output and rebuilding.',
              },
              {
                lead: 'A function, not a server.',
                text: 'The API runs as a Vercel function: the build generates the database client and runs the migrations, and the Express app is wrapped as the handler.',
              },
              {
                lead: 'No disk on a function.',
                text: 'Photos and recordings go to a private S3-compatible bucket. Without its keys, uploads answer a clear 503 while scores and notes still sync.',
              },
              {
                lead: 'The Mumbai timeout.',
                text: 'A sync push of 25 students and 6 submissions timed out at 30 seconds. The server makes a few hundred sequential queries and each one paid the round trip from Mumbai to the database. I moved the function to Singapore beside the database and raised the limit to 60 seconds.',
              },
              {
                lead: 'Readiness, not guesswork.',
                text: 'A readiness check now probes object storage and reports “ok” or the error name and status, with no secrets, so a deploy can be checked without reading logs. Unknown pages answer 404, not 500.',
              },
              {
                lead: 'Cookies that stay same-origin.',
                text: 'The web dashboard proxies its API calls to the deployed server, so the session cookie never crosses an origin.',
              },
              {
                lead: 'A different compiler on the host.',
                text: 'Vercel’s own compile resolved the default imports of two middleware libraries as the module object, a type error that never appeared locally. Importing them by name works under every resolution.',
              },
            ],
          },
        ],
      },
      {
        id: 'quality',
        part: 'engineering',
        group: 'Part 2 · Engineering',
        label: 'Testing',
        heading: 'Tests written as attacks, devices as truth',
        body: [
          {
            type: 'paragraph',
            text: 'The privacy tests try to break the rules instead of confirming the happy path.',
          },
          {
            type: 'list',
            items: [
              {
                lead: '127 server checks.',
                text: '31 cover accounts, sync and teacher isolation, including a second teacher. 63 cover the student and peer-review rules: cross-student reads, reuse of a teacher session as a student and the reverse, reviewing your own work, and reading another class’s images. 33 cover version 2: teacher types, the rubric, Save status and deletions.',
              },
              {
                lead: '1,346 translation checks and 47 phone-logic checks.',
                text: 'The logic checks cover roster import, the analytics, the report files and the name matching.',
              },
              {
                lead: 'Plain functions, so they can be tested.',
                text: 'The numbers behind the charts are plain functions over the phone’s own data. All four report formats are built from one neutral report model, so they always say the same thing. Importing a class list from a spreadsheet, Word file, CSV or text file is pure TypeScript that runs in Node.',
              },
              {
                lead: 'Measured, not eyeballed.',
                text: 'Image-quality thresholds, colour contrast and text sizes were measured and the numbers recorded.',
              },
              {
                lead: 'A real phone.',
                text: 'I ran builds on a Samsung Galaxy S25 Ultra over USB. That is where I found problems a desktop preview hides, such as controls pushed below the fold.',
              },
            ],
          },
        ],
      },

      // ───────────────────────── Outcome ─────────────────────────
      {
        id: 'evidence',
        group: 'Outcome',
        label: 'Evidence',
        heading: 'What is validated and what is not yet',
        body: [
          {
            type: 'paragraph',
            text: 'The system works; whether it helps a teacher is still unknown, because no teacher has used it in a classroom.',
          },
          {
            type: 'table',
            caption: 'Claims, the evidence so far, and their status',
            head: ['Claim', 'Evidence so far', 'Status'],
            rows: [
              [
                'The design answers what educators described',
                'A workshop and interviews with 10 educators, and a study of 70, shaped the brief',
                'Research-informed; not yet tested in a classroom',
              ],
              [
                'The teacher flow runs end to end on a real Android phone',
                'Installed and run on a Galaxy S25 Ultra over USB; sign-in, class list and review screens observed',
                'Partly observed, not every screen on the latest build',
              ],
              [
                'A student cannot read another student’s work',
                '63 automated checks that try to cross the boundary',
                'Verified in code',
              ],
              [
                'Teachers cannot see each other’s data',
                '31 automated checks including a second teacher',
                'Verified in code',
              ],
              [
                'Translations are complete and consistent',
                'Compile-time completeness plus 1,346 checks',
                'Verified in code; wording unreviewed',
              ],
              ['The Hindi and Telugu read naturally', 'None', 'Not validated'],
              [
                'Name reading files papers correctly',
                'Matching rules covered by tests on sample papers; handwriting on real classroom papers not tried',
                'Weak evidence',
              ],
              [
                'Blur and lighting thresholds suit real classroom photos',
                'Synthetic pages and one real scan',
                'Weak evidence',
              ],
              [
                'The server holds up beyond a laptop',
                'Deployed as a function beside a managed database; a timeout on a 25-student push led to moving it to the database’s region',
                'Deployed; not load-tested',
              ],
              [
                'Contrast and text size on the project page meet WCAG 2.2 AA',
                'Contrast measured on every colour',
                'Measured; no screen-reader or automated audit',
              ],
              ['The app halves assessment time per student', 'None', 'Not measured'],
              ['Teachers find the rubric hints and progress views useful', 'None', 'Not measured'],
              ['Sync works on a school’s network', 'A deployed server; no school network yet', 'Not tested'],
              [
                'The phone verification code reaches real numbers',
                'Firebase Phone Auth wired in, with a demo mode',
                'Not yet confirmed',
              ],
              ['The iPhone version works', 'Same code, never built', 'Not built'],
            ],
          },
        ],
      },
      {
        id: 'mistakes',
        group: 'Outcome',
        label: 'Mistakes',
        heading: 'What went wrong, and what I would do differently',
        body: [
          {
            type: 'paragraph',
            text: 'Most of the real problems appeared only when I ran something on a real device, on a real host, or tried to break my own rules.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Controls below the fold.',
                text: 'The review screen hid its main actions on a real phone. A desktop preview never showed it.',
              },
              {
                lead: 'A sync that worked on my laptop.',
                text: 'It timed out over a real network because every query paid a round trip to a distant database. Where code runs matters as much as what it does.',
              },
              {
                lead: 'Sample data that clashed.',
                text: 'The sample classes used fixed IDs, so a second teacher trying them would have been refused by the server. Caught by testing with two teachers.',
              },
              {
                lead: 'A dev setting that broke uploads.',
                text: 'The example configuration switched on cloud storage by default, which does not exist on a laptop.',
              },
              {
                lead: 'Drift between two packages.',
                text: 'After changing what the portal returns, a stale server crashed the student page to blank. I now treat the API contract as something to test, not assume.',
              },
              {
                lead: 'Two rejected pages.',
                text: 'I shipped a generic page twice before asking what the product itself could show.',
              },
              {
                lead: 'Translations without a reviewer.',
                text: 'I wrote the Hindi and Telugu myself. That is a risk I accepted to keep moving and will not repeat for the pilot.',
              },
            ],
          },
          {
            type: 'paragraph',
            text: 'What I would change. Put one teacher in front of the review screen in the first week instead of the fifth. Test peer review with a small group of real students before designing its guard rails. Photograph real classroom artwork early, so the quality thresholds start from evidence, not synthetic pages.',
          },
        ],
      },
      {
        id: 'next',
        group: 'Outcome',
        label: 'Next steps',
        heading: 'Next steps',
        body: [
          {
            type: 'paragraph',
            text: 'The classroom pilot, planned for late November and December 2026, is what turns this from a well-built prototype into evidence. Its targets are to halve the time spent assessing each student, reach an average teacher rating of 4 out of 5, and involve 3 to 5 teachers and at least 20 students in Classes 6 to 8. These are targets, not results. The grant also asks for a working build on TestFlight and Google Play by December 2026.',
          },
          {
            type: 'list',
            items: [
              'Usability sessions with teachers on the capture inbox, the review and the rubric screens',
              'A native-speaker review of the Hindi and Telugu, led by art teachers',
              'Tuning the photo-quality thresholds on real classroom photos',
              'Guardian consent records and encryption of stored photos and recordings',
              'A screen-reader and automated accessibility audit',
              'Student-side testing of self-review and peer review with a small group',
              'Measuring time per student before and during the pilot',
            ],
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
