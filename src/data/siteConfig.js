// Central, easily-editable site content. Swap these values for the real
// details whenever they're ready — nothing else in the codebase needs to change.
export const siteConfig = {
  name: 'Surya Prakash Musunuri',
  shortName: 'Surya Prakash',
  role: 'Designer & Developer',
  tagline: 'Working at DIC, Design Department — IIT Hyderabad',
  // Shown as the two stat cards on either side of the hero portrait.
  experience: {
    design: {
      years: 2,
      // **double asterisks** mark the words that get emphasised in the hero.
      label: 'Professional experience in **design**',
      now: { role: 'UX Engineer', at: 'DIC, Design Dept, IIT Hyderabad' },
    },
    development: {
      years: 6,
      label: '**Computer science** education & **hands-on** experience',
    },
  },

  email: 'hello@uxsurya.com',
  location: 'Hyderabad, India',

  social: {
    github: 'https://github.com/pixelprakash',
    linkedin: 'https://www.linkedin.com/in/suryaprakashmusunuri/',
    twitter: 'https://twitter.com/your-username',
  },

  navItems: [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/#about' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
  ],

  footerLinks: [
    { label: 'Work', href: '/#work' },
    { label: 'All projects', href: '/work' },
    { label: 'About', href: '/#about' },
    { label: 'GitHub', href: 'https://github.com/pixelprakash' },
    { label: 'Testimonials', href: '/#testimonials' },
  ],
};
