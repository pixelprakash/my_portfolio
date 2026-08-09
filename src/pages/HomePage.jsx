import Hero from '../components/home/Hero';
import Works from '../components/home/Works';
import Testimonials from '../components/home/Testimonials';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { siteConfig } from '../data/siteConfig';

export default function HomePage() {
  useDocumentHead({
    title: `${siteConfig.role}`,
    description: `Portfolio of ${siteConfig.name} — ${siteConfig.tagline}. Case studies in design and full-stack development.`,
    path: '/',
  });

  return (
    <>
      <Hero />
      <Works />
      <Testimonials />
    </>
  );
}
