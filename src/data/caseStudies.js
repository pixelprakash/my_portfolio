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
  // Written from the ProgressFlow repository (~/progressflow, 3 – 4 Nov 2026), its docs, and the
  // earlier PDF write-up, then brought up to date with the 4 Nov build: batch capture, an editable
  // rubric and assessment types, progress views and reports, class import, and phone OTP.
  // Figures are the real app and dashboard with sample data. Edit freely: the role, team and
  // anything marked "not yet confirmed" are for you to check.
  {
    slug: 'progressflow',
    tag: 'Design + Dev',
    title: 'ProgressFlow: formative assessment for Indian art classrooms',
    summary:
      'A phone app, teacher dashboard and student portal that help art teachers in Classes 6 to 8 assess drawings and paintings against a rubric, in English, Hindi and Telugu, with or without a signal. A grant-funded research prototype, designed and built end to end.',
    role: 'Product design, UX/UI, front-end and design engineering',
    timeline: '6-month grant (Aug – Dec 2026), written up to early Nov',
    timelineShort: '6 months',
    tools: [
      'React Native (Expo)',
      'React (Vite)',
      'Express',
      'Prisma',
      'PostgreSQL',
      'TypeScript',
      'ML Kit',
      'Firebase Phone Auth',
    ],
    coverAlt:
      "The ProgressFlow teacher dashboard showing a student's drawing with the teacher's markup beside the four-criterion rubric, next to the phone app's scan review screen",
    accent: 'blue',
    facts: [
      {
        label: 'Surfaces',
        value: 'Android app, teacher web dashboard, student web portal, public project page',
      },
      { label: 'Languages', value: 'English, Hindi, Telugu' },
      {
        label: 'Team',
        value:
          'Project lead Ganesh Kumar Malthurkar (PhD scholar, Department of Design, IIT Hyderabad); mentor Prof. Deepak John Mathew',
      },
      {
        label: 'Status',
        value:
          'Working Android prototype. Teacher and student flows run end to end; no classroom has used it yet. Pilot planned for late Nov and Dec 2026.',
      },
    ],
    sections: [
      {
        id: 'overview',
        label: 'Overview',
        heading: 'What it is, and what is proven so far',
        body: [
          {
            type: 'paragraph',
            text: 'ProgressFlow is a phone app, a teacher dashboard and a student portal that help art teachers in Classes 6 to 8 assess drawings and paintings against a rubric, in English, Hindi and Telugu, with or without a signal. It is a six-month, grant-funded research prototype (August to December 2026), built from a mixed-methods study of 70 art educators in Telangana. This write-up covers the work up to early November.',
          },
          {
            type: 'paragraph',
            text: "A rubric a teacher can use one-handed between periods, a camera that photographs a whole stack of papers without stopping, and a student view that treats a child's work as private by default. This is how I designed and built it, what I got wrong, and what is still unproven.",
          },
          {
            type: 'figure',
            src: '/work/progressflow/dashboard-submission.webp',
            alt: "The teacher dashboard showing a student's pencil drawing with a red circle, a blue arrow and a highlighted roll number, beside four rubric criteria rated Exemplary or Proficient",
            caption:
              "The teacher dashboard, with sample data: one student's piece with the teacher's markup beside the four-criterion rubric.",
            width: 800,
            height: 536,
          },
        ],
      },
      {
        id: 'problem',
        label: 'Problem',
        heading: "What the tools teachers have don't give them",
        body: [
          {
            type: 'paragraph',
            text: 'Assessing art well needs a shared language for quality, feedback that arrives while it can still be used, and a record of growth. The tools teachers have offer none of the three.',
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
                lead: "Children's data.",
                text: "Photos, voices and judgements about minors fall under India's Digital Personal Data Protection Act, 2023.",
              },
            ],
          },
          {
            type: 'paragraph',
            text: 'The design question I worked from: how might a teacher give specific, kind and trustworthy feedback on a child’s drawing, in the minutes between periods, on a phone, offline, in the language the child thinks in?',
          },
        ],
      },
      {
        id: 'users',
        label: 'Users',
        heading: 'Two users, and the limits they set',
        body: [
          {
            type: 'paragraph',
            text: 'The two users are a time-poor art teacher on a mid-range Android phone and a child of 11 to 14 on a phone that may be shared. Those two facts set most of the constraints.',
          },
          {
            type: 'note',
            label: 'A caveat I want to be clear about.',
            text: 'These are working assumptions from the project brief and my own reasoning. I have not yet run interviews or usability sessions with teachers or students, so they are hypotheses for the pilot to test.',
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
                "Minors' photos and voices",
                'Device PIN lock, per-teacher separation, no cloud backup, teacher approval before classmates see feedback',
              ],
            ],
          },
        ],
      },
      {
        id: 'principles',
        label: 'Principles',
        heading: 'Six principles that settled the trade-offs',
        body: [
          {
            type: 'paragraph',
            text: 'Six principles decided almost every trade-off that follows.',
          },
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
                lead: "Explain, don't just score.",
                text: 'The rubric is a teaching tool. Each criterion has a diagram, three things to look for, a question to ask the student and a description of every level.',
              },
              {
                lead: "A child's work is private by default.",
                text: "Design for the awkward case, not the happy one. Classmates' feedback is hidden until the teacher approves it.",
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
        id: 'process',
        label: 'Process',
        heading: 'How I worked',
        body: [
          {
            type: 'paragraph',
            text: 'I agreed the shape of the product on a clickable prototype first, then built the real thing in the order that carried the most risk.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Scope.',
                text: 'From the project’s pitch deck I locked five features (scoring, annotation and voice, self and peer review, teacher dashboard, student portal) and a phased roadmap.',
              },
              {
                lead: 'Clickable prototype.',
                text: 'A single HTML file with five screens, so the flow could be judged before any native code existed.',
              },
              {
                lead: 'One source of truth.',
                text: 'A monorepo whose shared package holds the data model, the rubric text and the translations, so the phone, the web and the server cannot drift apart.',
              },
              {
                lead: 'The Android app, on a real phone.',
                text: 'I ran builds on a Samsung Galaxy S25 Ultra over USB. That is where I found problems a desktop preview hides, such as controls pushed below the fold.',
              },
              {
                lead: 'Web dashboard, then the student portal.',
                text: 'Read-only for teachers first, because a laptop view of data entered on the phone has nothing to merge.',
              },
              {
                lead: 'Critique.',
                text: 'The public project page went through three versions after two rounds of blunt feedback; see the last decision below.',
              },
              {
                lead: 'A second pass on capture and set-up.',
                text: 'Once the first full flow ran, I rebuilt capture around batches and added class import, an editable rubric, progress views and reports (4 November).',
              },
            ],
          },
        ],
      },
      {
        id: 'capture',
        label: 'Capture',
        heading: 'Decision 1: photograph the whole stack, sort afterwards',
        body: [
          {
            type: 'paragraph',
            text: 'A class set of papers means dozens of photos, so I stopped treating capture as one careful scan at a time. The camera now takes a whole stack in a row and the thinking happens afterwards, in a class inbox.',
          },
          {
            type: 'figure',
            src: '/work/progressflow/scan-review.webp',
            alt: "The phone app's scan review screen: a photographed notebook cover, a green “Good scan” banner with sharpness and brightness readings, a thumbnail strip, and Keep scanning and Save buttons",
            caption:
              'The first capture flow (3 Nov): scan a page, check it, save it. A real build with sample data. Since 4 Nov capture is batch-first, and the same checks run in the class inbox.',
            width: 540,
            height: 1108,
            narrow: true,
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Batch first.',
                text: "Each shot goes straight into the class's inbox with no review in between, so nothing is lost if the phone goes back in a pocket.",
              },
              {
                lead: 'Two ways to shoot.',
                text: '“Edge detect + crop” (the default) finds the page edges and crops, with no filters. “Full photo” keeps the camera’s own picture whole. I patched the scanner plugin down to its crop-only mode, so the app never changes the colour of a child’s artwork.',
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
                lead: 'Cheap on old phones.',
                text: 'The checks run on a 640 px copy of the photo.',
              },
              {
                lead: 'Permissions that recover.',
                text: 'If Android will no longer show the camera prompt, the screen offers Open settings and picks the new permission up when the teacher comes back. A first-launch screen explains why the camera and microphone are needed.',
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
        id: 'matching',
        label: 'Matching',
        heading: 'Decision 2: knowing whose work it is, without silently misfiling',
        body: [
          {
            type: 'paragraph',
            text: 'Misfiling a child’s work is worse than asking, so the app reads each paper, proposes a student, shows why, and leaves anything it is unsure of for the teacher. The inbox keeps count: “12 ready · 3 to check · 2 not read”.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Roll number first, name second.',
                text: 'The roll number written in digits is the strong signal; a fuzzy name match is the backup. A misspelt name (“Dlya”) with the right roll still resolves to the right student.',
              },
              {
                lead: 'Header first.',
                text: 'The name and roll number are normally at the top of a page, so the reader looks at the top third first and the whole page only if that finds nobody. That stops a stray number in the drawing being taken for a roll number.',
              },
              {
                lead: 'Reasoning on screen.',
                text: 'The student chip reads “Matched by roll number”, “Matched by name, please check” or “Could not read a roll number or name. Choose the student.” Lower-confidence matches use a warning colour.',
              },
              {
                lead: 'Only confident matches file themselves.',
                text: 'A match on the roll number is filed without a second look. A match on the name alone, or a roll number that disagrees with the name, is marked and waits for the teacher to confirm or change it.',
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
                text: 'The on-device text reader handles Latin script but has no Telugu model, and handwriting is unreliable. Instead of pretending, the design leans on digits and asks students to write “Roll No: 12” and their name in block letters. The project page says so plainly.',
              },
            ],
          },
        ],
      },
      {
        id: 'rubric',
        label: 'Rubric',
        heading: 'Decision 3: a rubric that teaches, and that a teacher can change',
        body: [
          {
            type: 'paragraph',
            text: 'I treated the rubric as the main interface for teachers and the main learning tool for students, not as a form to fill in.',
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
                lead: "The teacher's own rubric.",
                text: 'A teacher can rename, add or remove criteria and pick each one’s icon and colour. The assessment types (Assignment, Exam 1, Exam 2, Quarterly, Sketch, Progress, Portfolio) can be renamed, reordered and added to.',
              },
              {
                lead: 'A Save button that tells the truth.',
                text: 'An evaluation counts as saved only when the teacher presses Save and has not changed it since. If they have, the screen says “Changed since saved”.',
              },
              {
                lead: 'One source of text.',
                text: 'The wording lives in the shared package and is used by the phone, the dashboard, the student form and the translations, so a teacher and a student read the same descriptor.',
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
        label: 'Feedback',
        heading: 'Decision 4: marking up, speaking and attaching',
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
                lead: 'Markup that survives every screen.',
                text: "Strokes are stored as fractions of the image (0 to 1), so the same circle lands in the same place on the phone, the laptop dashboard and the student's screen.",
              },
              {
                lead: "Voice in the child's language.",
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
            label: 'A bug worth naming.',
            text: "My first link check used the browser's URL parser, which React Native only half implements, so every link would have been rejected as invalid. I found it by reading the framework's source before it reached a teacher, and replaced it with a small parser that also refuses non-web schemes.",
          },
          {
            type: 'note',
            label: 'Not built yet.',
            text: 'Automatic transcripts of voice notes. The audio is saved, but nothing turns it into text.',
          },
        ],
      },
      {
        id: 'offline',
        label: 'Offline & sync',
        heading: "Decision 5: offline-first, accounts and the teacher's laptop",
        body: [
          {
            type: 'paragraph',
            text: "The phone is the only place data is entered, which removes almost every sync conflict and keeps the teacher's workflow independent of the network.",
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
                lead: 'One writer.',
                text: 'The phone pushes classes, students and the submissions that changed. The server says which photos and recordings it still lacks, and the phone uploads only those. If two versions meet, the newer one wins per submission.',
              },
              {
                lead: 'Quiet, visible status.',
                text: 'Sync starts a few seconds after a change and retries every minute when offline. The Account sheet says “Up to date”, “Waiting for a connection” or “3 waiting to upload”; it never blocks the screen.',
              },
              {
                lead: 'A laptop view, read-only.',
                text: 'The dashboard moves from Overview to Class to Student to Submission, with class averages, a monthly trend, a student’s growth over time and the original work with its markup. Signing in is a web password with an httpOnly cookie; the phone keeps its own PIN.',
              },
              {
                lead: 'Lock the phone, not just the account.',
                text: 'The PIN is stored in the device keystore, repeated wrong guesses cause lockouts that start at 30 seconds and double up to 15 minutes, and the app locks after five minutes away.',
              },
              {
                lead: 'A forgotten PIN no longer erases a child’s data.',
                text: 'The first build erased the account, because the data belongs to children and cannot be recovered offline. It now verifies the teacher’s phone number with a six-digit code and sets a new PIN instead. Registration asks for the same code, with “Skip for now” so the app still works with no connection and the number can be verified later.',
              },
              {
                lead: 'Set-up without typing.',
                text: 'A class list can be imported from a spreadsheet, Word file, CSV or text file, with names and roll numbers read from it. Classes are organised by grade and section (6-A, 6-B, 7-A), and can be edited or deleted. A sample-data mode lets someone try the app before adding real students.',
              },
            ],
          },
          {
            type: 'note',
            label: 'Status of the code check.',
            text: 'It uses Firebase Phone Auth, with a demo mode so builds never depend on a Firebase project. Real SMS delivery is not yet confirmed.',
          },
          {
            type: 'note',
            label: 'The trade-offs I accepted.',
            text: 'A new phone cannot yet download older data, scores cannot be edited from the web, and deleting a class, student or paper erases its files on the phone but is not yet passed on to the server.',
          },
        ],
      },
      {
        id: 'students',
        label: 'Students',
        heading: 'Decision 6: the student side, self-review, peer review and privacy',
        body: [
          {
            type: 'paragraph',
            text: 'I gave students a portal with no account to create, and designed peer review around the ways it could hurt a child.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'A code, not an account.',
                text: 'Each student has a 6-character join code that the teacher prints from the class page and can replace at any time. It opens a separate kind of session that can read only that student’s own work.',
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
              {
                lead: 'Proven by trying to break it.',
                text: 'An automated suite of 63 checks attempts cross-student reads, reuse of a teacher session as a student and the reverse, reviewing your own work and reading another class’s images.',
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
        label: 'Languages',
        heading: 'Decision 7: Hindi, Telugu and English as interface, not an afterthought',
        body: [
          {
            type: 'paragraph',
            text: 'I made translation a build-time guarantee, so no screen can quietly fall back to English.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'One typed dictionary.',
                text: 'English is the source (673 strings); Hindi and Telugu are typed against it, so a missing translation does not compile. It covers the student portal, the teacher dashboard, the phone app and all rubric text.',
              },
              {
                lead: 'Switch where it is needed.',
                text: "Language chips sit on the phone's sign-in screen and in the student portal's header. A language is picked from the phone's own setting, then the teacher's profile, until the person chooses.",
              },
              {
                lead: "A test for what the compiler can't see.",
                text: '1,346 checks confirm no placeholder such as {name} was lost and no string was left in English by mistake.',
              },
              {
                lead: 'Details that are easy to miss.',
                text: 'Dates follow the chosen language, the rubric diagrams contain no text, and language-tagged markup lets screen readers pronounce each script correctly.',
              },
            ],
          },
          {
            type: 'note',
            label: 'A leak I caught.',
            text: "A signed-in teacher's profile language was being applied to the student page in the same browser, so a child could see the teacher's language. It now applies only to teacher pages.",
          },
          {
            type: 'note',
            label: 'What I have not done.',
            text: "I wrote the Hindi and Telugu myself, with no native-speaker review. They are drafts, and the rubric descriptors in particular need teachers' eyes before any student relies on them. The newest strings (phone verification, the inbox, reports) are drafts too. The project page and server error messages are English only.",
          },
        ],
      },
      {
        id: 'insight',
        label: 'Progress & reports',
        heading: 'Decision 8: from scores to a story, with progress views and reports',
        body: [
          {
            type: 'paragraph',
            text: 'A rubric score on its own is just a number. The phone now turns a teacher’s marks into pictures that can be read at a glance and documents that can be handed over.',
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
                text: 'Class and student reports as PDF, Word, Excel or CSV through the phone’s share sheet. All four are built from one neutral report model, so they always say the same thing.',
              },
              {
                lead: 'Plain maths, tested.',
                text: 'The numbers behind the charts are plain functions over the phone’s own data, so they run in Node tests. 46 checks cover roster import, the analytics, the report files and the name matching.',
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
        id: 'project-page',
        label: 'Project page',
        heading: 'Decision 9: the project page, and what two rounds of critique taught',
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
      {
        id: 'engineering',
        label: 'Engineering',
        heading: 'Design engineering: keeping design decisions true in code',
        body: [
          {
            type: 'paragraph',
            text: 'The design decisions above only hold if the code cannot quietly undo them, so I built the guarantees into the system.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'A shared package as the source of truth.',
                text: 'Data types, rubric descriptors, translations and the sync and review contracts live in one package that the phone, the web app and the server all import. Change a descriptor once and every screen changes.',
              },
              {
                lead: 'The compiler enforces completeness.',
                text: 'A missing translation, a wrong score range or a malformed sync payload is a build error, not a blank on a child’s screen.',
              },
              {
                lead: 'Tests written as attacks.',
                text: '31 checks cover accounts, sync and teacher isolation, and 63 cover the student and peer-review privacy rules. They try to break the rules instead of confirming the happy path. 1,346 translation checks and 46 phone-logic checks sit beside them.',
              },
              {
                lead: 'Measured, not eyeballed.',
                text: 'Image-quality thresholds, colour contrast and text sizes were measured and the numbers recorded.',
              },
              {
                lead: 'Real artefacts.',
                text: 'Every screenshot on the project page is the working app or dashboard with sample data, and every build was installed on a real phone.',
              },
              {
                lead: 'Native patches kept in the repo.',
                text: 'The scanner patch is applied by patch-package in every build, so a clean build gets the same crop-only behaviour.',
              },
              {
                lead: 'Reproducible from a clean clone.',
                text: 'Builds, the database migration and the deployable server function were each verified from nothing, because that is what a host does.',
              },
            ],
          },
        ],
      },
      {
        id: 'mistakes',
        label: 'Mistakes',
        heading: 'What went wrong, and what I would do differently',
        body: [
          {
            type: 'paragraph',
            text: 'Most of the real problems appeared only when I ran something on a real device or tried to break my own rules.',
          },
          {
            type: 'list',
            items: [
              {
                lead: 'Controls below the fold.',
                text: 'The review screen hid its main actions on a real phone. A desktop preview never showed it.',
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
              { lead: 'A language leak.', text: "A teacher's language setting leaked onto the student page." },
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
        id: 'evidence',
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
                'Contrast and text size on the project page meet WCAG 2.2 AA',
                'Contrast measured on every colour',
                'Measured; no screen-reader or automated audit',
              ],
              ['The app halves assessment time per student', 'None', 'Not measured'],
              ['Teachers find the rubric hints and progress views useful', 'None', 'Not measured'],
              ['Sync works on a school’s network', 'Local test setup only', 'Not tested'],
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
        id: 'next',
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
