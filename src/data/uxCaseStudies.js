// The two UX case studies, brought over from Behance (Nov 2026). The wording is
// from the original slides, with only spelling and grammar tidied; the pictures
// are the original screens and diagrams (public/work/pennywise, …/sahaaya).
// Block types are listed at the top of pages/CaseStudyPage.jsx.

// A full slide from Penny Wise: 1400px wide, with a 2800px version that sharp
// screens use and that opens when the picture is clicked.
const slide = (name, alt, caption, height = 989) => ({
  type: 'figure',
  src: `/work/pennywise/${name}.webp`,
  full: `/work/pennywise/${name}@2x.webp`,
  alt,
  caption,
  width: 1400,
  height,
});

export const pennyWise = {
  slug: 'penny-wise',
  tag: 'UX Design',
  accent: 'blue',
  theme: { light: '#7c62ee', accent: '#ccff80' },
  title: 'Penny Wise: an expense tracking app',
  summary:
    'A phone app that helps students and working professionals track spending without extra effort and save for their goals. Researched and designed by a team of seven in a two-day designathon.',
  role: 'UX designer, collaborating in every phase',
  timeline: '2 days (28–29 April 2023)',
  tools: ['Figma'],
  facts: [
    { label: 'Team', value: 'Team 08, seven members' },
    { label: 'Event', value: 'Designathon ’23' },
  ],
  links: [
    {
      label: 'Try the Figma prototype',
      href: 'https://www.figma.com/proto/sbVyoxodeYKXVbnnhYWI8V/UX%2FUI?page-id=71%3A35130&node-id=71-35275&viewport=409%2C414%2C0.14&scaling=min-zoom&starting-point-node-id=71%3A35244',
    },
    {
      label: 'View on Behance',
      href: 'https://www.behance.net/gallery/197476263/Penny-Wise-Expense-tracking-app-UX-case-study',
    },
  ],
  hero: {
    src: '/work/pennywise/cover.webp',
    full: '/work/pennywise/cover@2x.webp',
    alt: 'Two phones showing Penny Wise: the splash screen, and a home screen with cash and bank balances, expense categories and a savings goal',
    width: 1400,
    height: 1061,
  },
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      heading: 'Spend less, without extra effort',
      body: [
        {
          type: 'paragraph',
          text: 'We wanted to help people avoid overspending, and manage their expenses in a way that is effortless but efficient.',
        },
        {
          type: 'steps',
          items: [
            { title: 'Research', text: 'We studied the users, and what competitors do to win their audience.' },
            { title: 'Personas and problem', text: 'We built user personas and drew a problem statement from the problems.' },
            { title: 'Structure', text: 'We settled the app’s functions and selling points, then its information architecture.' },
            { title: 'Design', text: 'We divided the work: wireframes, mood boards, style guide, visuals and, last, the prototype.' },
          ],
        },
      ],
    },
    {
      id: 'audience',
      label: 'Audience',
      heading: 'Two groups of people',
      body: [
        {
          type: 'board',
          columns: 2,
          items: [
            {
              title: 'Students',
              tone: 'a',
              notes: [
                'Freelancing, working part-time or living on pocket money.',
                'Want to track spending well without any extra effort.',
              ],
            },
            {
              title: 'Working professionals',
              tone: 'b',
              notes: [
                'Find it hard to track and save around tight, busy schedules.',
                'Not ready to share bank details with an unfamiliar app.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'research',
      label: 'Research',
      heading: 'What 58 people told us',
      body: [
        {
          type: 'stats',
          items: [
            { value: '81%', label: 'spend mostly on their needs' },
            { value: '36.2%', label: 'are most likely to run out of money by the end of the month' },
            { value: '63%', label: 'track their expenses even though they don’t plan them' },
            { value: '86%', label: 'pay with UPI' },
          ],
        },
        {
          type: 'paragraph',
          text: 'To follow their spending, 62% refer to bank statements, followed by 32% who use tracking apps.',
        },
        slide(
          'survey',
          'Six charts from the survey: who the respondents are, how they track expenses, when they are likely to run out of money, how they spend, how they pay and how they manage expenses',
          'The survey answers, from 58 people.'
        ),
      ],
    },
    {
      id: 'personas',
      label: 'Personas',
      heading: 'Anjali and Rahul',
      body: [
        {
          type: 'paragraph',
          text: 'Anjali, 20, is a design student living in a college hostel. She is a foodie who likes exploring cafés with friends. College keeps her busy, though she sometimes manages some freelance work for extra money, and spends her free time on Instagram or Netflix.',
        },
        {
          type: 'board',
          columns: 2,
          items: [
            {
              title: 'Anjali says',
              tone: 'a',
              notes: [
                'I have been wanting to go to this expensive café with my friends and try the food there, but I don’t seem to have enough money.',
                'I love to be organised, but I am too lazy.',
              ],
            },
            {
              title: 'Thinks',
              tone: 'a',
              notes: [
                'I wish I was better at managing money.',
                'Tracking money is tedious and I have no time or energy left for it.',
                'I want more relaxed days.',
              ],
            },
            {
              title: 'Goals',
              tone: 'b',
              notes: [
                'A trip to Goa with my friends.',
                'To be more conscious about my money.',
                'More freelance projects and experience.',
              ],
            },
            {
              title: 'Frustrations',
              tone: 'b',
              notes: [
                'A busy, tedious schedule.',
                'No track of her money, and sometimes unable to pay for necessities.',
                'Spends too much on food.',
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          text: 'Rahul, 26, works in marketing. He loves to travel and try new restaurants. His salary is decent, but there never seems to be enough at the end of the month. He knows he needs to track his expenses, and finds it tedious and time-consuming.',
        },
        {
          type: 'board',
          columns: 2,
          items: [
            {
              title: 'Rahul says',
              tone: 'a',
              notes: ['I want to track my expenses, but I can’t bring myself to do it every day.'],
            },
            {
              title: 'Thinks',
              tone: 'a',
              notes: ['Tracking my expenses feels like it takes too much time.'],
            },
            {
              title: 'Goals',
              tone: 'b',
              notes: ['To save efficiently, so that I can buy a house.'],
            },
            {
              title: 'Frustrations',
              tone: 'b',
              notes: [
                'A busy, tedious schedule.',
                'No track of his money, and sometimes unable to pay for necessities.',
                'Spends too much on food.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'problems',
      label: 'Problems',
      heading: 'What gets in the way',
      body: [
        {
          type: 'list',
          items: [
            'Busy schedules leave no time to record expenses or plan a budget.',
            'Without self-control, people overspend and run short for necessities.',
            'Little is saved or left to invest.',
            'They don’t know exactly where the money goes.',
            'They forget to keep track of expenses.',
            'They hesitate to trust automated features with personal financial accounts.',
            'The market lacks intuitive apps.',
          ],
        },
        {
          type: 'note',
          label: 'Our solution:',
          text: 'make tracking spending effortless, and put saving at the centre, so people can use what they save on the things they need.',
        },
      ],
    },
    {
      id: 'business',
      label: 'Business',
      heading: 'Competitors and business model',
      body: [
        {
          type: 'board',
          columns: 3,
          items: [
            {
              title: 'Expensify',
              tone: 'plain',
              notes: ['Extensive automation', 'SmartScan technology', 'Report management'],
            },
            {
              title: 'Zoho Expense',
              tone: 'plain',
              notes: ['Built-in GPS tracker and maps', 'Records information offline', 'Batches expenses and sends them for approval'],
            },
            {
              title: 'Wallet',
              tone: 'plain',
              notes: ['Keeps track of bills', 'Shows how upcoming payments affect cash flow', 'Syncs, categorises and budgets transactions automatically'],
            },
          ],
        },
        {
          type: 'board',
          columns: 2,
          items: [
            {
              title: 'Free',
              tone: 'a',
              notes: [
                'Track expenses',
                'See transaction history',
                'Reminders to record transactions',
                'Add a category to any expense easily',
                'Set goals and put money towards them',
              ],
            },
            {
              title: 'Premium',
              tone: 'b',
              notes: [
                'Everything in the free plan',
                'Deeper insight into which categories take the most money',
                'Detailed reports and spending trends',
                'An AI-suggested monthly budget based on last month’s expenses',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'structure',
      label: 'Structure',
      heading: 'From questions to flows',
      body: [
        slide(
          'how-might-we',
          'A board of colour-coded sticky notes in seven columns, working through How Might We questions',
          '“How might we” questions, worked through as a team.'
        ),
        slide(
          'information-architecture',
          'The app’s structure: a home area for expenses, balances and goals, and a dashboard for goals, balances, categories and transaction reports',
          'Information architecture.'
        ),
        slide(
          'user-flows',
          'Three user flows: scanning a receipt, recording an expense from a notification, and setting a goal',
          'User flows: scan a receipt, act on a notification, set a goal.'
        ),
      ],
    },
    {
      id: 'identity',
      label: 'Identity',
      heading: 'A piggy bank in a letter',
      body: [
        {
          type: 'paragraph',
          text: 'The logo stands for a piggy bank: every penny you put inside is a step closer to your goal.',
        },
        slide('logo', 'The Penny Wise logo: a lime letter P with a coin slot, on a black disc', 'The logo.'),
        {
          ...slide(
            'style-guide',
            'The style guide: colours, the Poppins type scale, icons, margins, buttons and spacing',
            'The style guide. Scroll inside the frame to read it all.',
            6440
          ),
          scroll: true,
        },
      ],
    },
    {
      id: 'wireframes',
      label: 'Wireframes',
      heading: 'Wireframes',
      body: [
        {
          type: 'gallery',
          items: [
            slide('wireframe-onboarding', 'Wireframes of three onboarding screens', 'Onboarding'),
            slide('wireframe-sign-in', 'Wireframes of sign in and sign up with a one-time password', 'Sign in and sign up'),
            slide('wireframe-connect-bank', 'Wireframes for choosing and connecting a bank', 'Connecting a bank'),
            slide('wireframe-home', 'Wireframes of the home screen, the add-expense options, the camera and the expense details', 'Home and scanning'),
            slide('wireframe-goals', 'Wireframes of a saved-expense message and the goals screen', 'Goals'),
            slide('wireframe-add-expense', 'Wireframes of recording a bank debit and choosing its category', 'Recording a debit'),
          ],
        },
      ],
    },
    {
      id: 'design',
      label: 'Final design',
      heading: 'The final screens',
      body: [
        slide(
          'screens-overview',
          'Final screens: splash, two onboarding screens, connecting a bank, and the home page',
          'Getting started, through to the home page.'
        ),
        slide(
          'screens-add-expense',
          'Recording a 5,000 rupee bank debit: choose a category or split it, then see it confirmed',
          'Adding an expense from a bank debit, with the option to split it across categories.'
        ),
        slide(
          'screens-scan-receipt',
          'Scanning a paper receipt, checking the amount and category, then seeing it confirmed',
          'Adding a cash expense by scanning its receipt.'
        ),
      ],
    },
  ],
};

export const sahaaya = {
  slug: 'sahaaya',
  tag: 'UX Design',
  accent: 'blue',
  theme: { light: '#4a6ffc', accent: '#f9d66b' },
  title: 'Sahaaya: reproductive health support',
  summary:
    'A concept app that connects people with reproductive health experts, and opens up conversation about family planning, contraception and fertility. A response to the Salesforce Design Days ’24 challenge.',
  role: 'UX designer: research and design shared with Anudeep Thota',
  timeline: 'Salesforce Design Days ’24 challenge',
  tools: ['Figma'],
  facts: [{ label: 'Team', value: 'Vaarahi: Anudeep Thota and Surya Prakash Musunuri' }],
  links: [
    {
      label: 'View on Behance',
      href: 'https://www.behance.net/gallery/225913447/Sahaaya-Salesforce-Design-Challenge',
    },
  ],
  hero: {
    src: '/work/sahaaya/cover.jpg',
    full: '/work/sahaaya/cover@2x.jpg',
    alt: 'Three Sahaaya screens: a list of doctors in Hyderabad, the home screen with emergency, health, legal guide and campaign services, and upcoming awareness campaigns',
    width: 1200,
    height: 750,
  },
  sections: [
    {
      id: 'about',
      label: 'About',
      heading: 'Support for informed choices',
      body: [
        {
          type: 'paragraph',
          text: 'We created a platform that improves access to family planning, protects reproductive rights, and raises awareness about contraception and fertility, helping people make informed decisions with the support they need.',
        },
        {
          type: 'note',
          label: 'The brief:',
          text: 'innovate solutions to support family planning, reproductive rights, contraception access and fertility awareness.',
        },
      ],
    },
    {
      id: 'users',
      label: 'Target users',
      heading: 'Who it serves',
      body: [
        {
          type: 'paragraph',
          text: 'The solution helps women, young adults, couples and men get information on family planning, contraception and fertility. Healthcare providers, community leaders, rural populations and NGOs can use the platform to educate, counsel and spread awareness.',
        },
      ],
    },
    {
      id: 'research',
      label: 'Research',
      heading: 'What desk research showed',
      body: [
        {
          type: 'paragraph',
          text: 'Many women face judgment and pressure over their reproductive choices, often choosing careers over motherhood. Behind this is a lack of understanding about women’s health, the effects of pregnancy and the contraception available. Without that knowledge, women struggle to make informed decisions, and are often forced to conform to family or social expectations.',
        },
        {
          type: 'paragraph',
          text: 'Using “How might we” questions, we picked out the key issues in women’s reproductive choices and wrote user stories to understand their perspectives. This helped us shape solutions that address these problems, raise awareness and support a wider audience.',
        },
      ],
    },
    {
      id: 'family-journey',
      label: 'Family journey',
      heading: 'The family planning journey',
      body: [
        {
          type: 'steps',
          items: [
            { title: 'Conceiving', text: 'A couple who want a child go ahead with the pregnancy. A woman who is not ready may plan an abortion.' },
            { title: 'Consulting a doctor', text: 'They take advice from a doctor or family on caring for mother and baby, and follow medication. This is also where advice on contraception can prevent a later unwanted pregnancy.' },
            { title: 'Birth', text: 'Some then plan another child. Those who don’t are encouraged towards family planning.' },
            { title: 'Deciding on an operation', text: 'The partners decide which of them will have the family planning operation.' },
            { title: 'After surgery', text: 'They consult the doctor and take medication.' },
          ],
        },
      ],
    },
    {
      id: 'problems',
      label: 'Problems',
      heading: 'Problems up close',
      body: [
        {
          type: 'board',
          columns: 2,
          items: [
            {
              title: 'A wanted pregnancy, without knowing how to care for it',
              tone: 'b',
              notes: [
                'Not looking after their own health',
                'Carrying on as before',
                'No change in lifestyle or diet',
                'Not consulting a doctor',
                'Not following the doctor’s precautions',
              ],
            },
            {
              title: 'An unwanted pregnancy',
              tone: 'a',
              notes: [
                'Contraception not followed, or precautions not used',
                'Little awareness of how fertility works, and little education',
                'Following their own method on others’ suggestions',
                'Contraception, or particular methods, failing',
                'Lack of fertility for inconsistency',
                'Being judged for an abortion, and for gaps in contraception and fertility awareness',
              ],
            },
            {
              title: 'Deciding on a family planning operation',
              tone: 'b',
              notes: [
                'Not knowing its after-effects',
                'Fears and misconceptions about health problems for men who have it',
                'Pushing the partner to take it on',
                'Biased opinions from family members',
                'Lack of awareness',
              ],
            },
            {
              title: 'Asking a doctor about contraception',
              tone: 'a',
              notes: ['No doctor’s services in their region', 'Feeling awkward asking'],
            },
          ],
        },
      ],
    },
    {
      id: 'solution',
      label: 'Solution',
      heading: 'Erasing stigma through open talk and expert advice',
      body: [
        {
          type: 'paragraph',
          text: 'Train local community leaders, health workers and volunteers as reproductive health advocates, who can lead discussions, run workshops and support their communities, spreading accurate information and reducing stigma.',
        },
        {
          type: 'paragraph',
          text: 'Peer educator networks carry it further: trained people share what they know with friends, family and neighbours, so awareness spreads on its own.',
        },
      ],
    },
    {
      id: 'features',
      label: 'The app',
      heading: 'Introducing Sahaaya',
      body: [
        {
          type: 'paragraph',
          text: 'The app connects people with reproductive health experts online for consultations, questions and anonymous chat.',
        },
        {
          type: 'list',
          items: [
            { lead: 'Expert access:', text: 'ask questions and get advice from certified doctors and gynaecologists.' },
            { lead: 'Campaigns and podcasts:', text: 'join campaigns and listen to open discussion of reproductive health.' },
            { lead: 'Workshops and events:', text: 'book and attend local, in-person sessions.' },
            { lead: 'Contraceptive access:', text: 'find nearby medical facilities that offer contraceptive services.' },
            { lead: 'Counselling support:', text: 'request a call or home visit for critical counselling, especially without family support.' },
            { lead: 'Anonymous chat:', text: 'ask health questions through an AI-powered chat without revealing who you are.' },
            { lead: 'AI assistance:', text: 'answer common queries quickly, easing the load on doctors.' },
          ],
        },
      ],
    },
    {
      id: 'stories',
      label: 'User stories',
      heading: 'Three user stories',
      body: [
        {
          type: 'board',
          columns: 1,
          items: [
            {
              title: 'Teja, a working woman building her career',
              tone: 'plain',
              text: 'She is not ready for a child and decides to seek an abortion. Facing judgment from her husband, family and society, she turns to the app and gets counselling for herself and her family. They learn about reproductive rights and come to accept her decision. With a doctor the app recommends, Teja goes ahead and can focus on her career without being judged.',
            },
            {
              title: 'Swati, a college student',
              tone: 'plain',
              text: 'After an unwanted pregnancy, she tried various pills before eventually having an abortion. Wanting better guidance to avoid another, she joins the app. Certified doctors and gynaecologists show her how to use contraception effectively, so she can make informed decisions about her reproductive health.',
            },
            {
              title: 'Baloo, a farmer with two children',
              tone: 'plain',
              text: 'He wants another child, though his income and work make one hard to support. His wife suggests he have a family planning operation; fearing what people will think, he refuses and presses her to have surgery, despite her two earlier caesareans. She reaches local volunteers through the app. They explain women’s reproductive health, clear up myths about family planning and talk through the cost of raising children. Baloo comes to understand, has the operation himself, and helps raise awareness in his community.',
            },
          ],
        },
      ],
    },
    {
      id: 'app-journey',
      label: 'In the app',
      heading: 'The journey through the app',
      body: [
        {
          type: 'steps',
          items: [
            { title: 'Install', text: 'Get the app.' },
            { title: 'Enrol', text: 'Fill in personal details, with an Aadhaar card.' },
            { title: 'Get guidance', text: 'Awareness videos from experts, articles, news and real stories; community gatherings and open-mic workshops; volunteering for students; and talks and information on contraception, with products available.' },
            { title: 'Consult an expert', text: 'Book one-to-one guidance or counselling, online or in person.' },
          ],
        },
      ],
    },
    {
      id: 'decisions',
      label: 'Key decisions',
      heading: 'Key decisions',
      body: [
        {
          type: 'list',
          items: [
            { lead: 'Public awareness campaigns:', text: 'encourage people to talk openly about reproductive health.' },
            { lead: 'Community conversations:', text: 'regular online and in-person forums on family planning, contraception and reproductive rights.' },
            { lead: 'One-to-one consultations:', text: 'confidential, personal advice from certified doctors, gynaecologists and reproductive health experts.' },
            { lead: 'Interactive group sessions:', text: 'workshops with discussion, role-play and problem-solving.' },
          ],
        },
      ],
    },
    {
      id: 'impact',
      label: 'Impact',
      heading: 'The change it aims for',
      body: [
        {
          type: 'paragraph',
          text: 'Through open dialogue and expert-led education, the solution aims to erase the stigma around family planning, contraception and reproductive rights.',
        },
        {
          type: 'paragraph',
          text: 'With community engagement and continuing support, it aims for a lasting effect: people able to make informed decisions, and women’s reproductive choices supported.',
        },
      ],
    },
  ],
};
