import Hero from '../components/home/Hero';
import ProjectShowcase from '../components/home/ProjectShowcase';
import Testimonials from '../components/home/Testimonials';
import ContactCta from '../components/home/ContactCta';
// import Works from '../components/home/Works';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { siteConfig } from '../data/siteConfig';

export default function HomePage() {
  useDocumentHead({
    title: `${siteConfig.role}`,
    description: `Portfolio of ${siteConfig.name} — ${siteConfig.tagline}. Websites, films, branding, visual design and app projects.`,
    path: '/',
  });

  return (
    <>
      <Hero />

      <ProjectShowcase />

      <Testimonials />

      <ContactCta />

      {/* The full case-study grid is switched off for now — the case studies
          are still partly placeholder copy. Case-study pages themselves are
          still reachable by URL.
      <Works />
      */}
    </>
  );
}
