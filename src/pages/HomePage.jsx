import { lazy, Suspense } from 'react';
import Hero from '../components/home/Hero';
import FeaturedWork from '../components/home/FeaturedWork';
import About from '../components/home/About';
import Testimonials from '../components/home/Testimonials';
import ContactCta from '../components/home/ContactCta';
// import Works from '../components/home/Works';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { siteConfig } from '../data/siteConfig';
import { useHeroOption, useUiVersion } from '../lib/uiVersion';

const HeroV2 = lazy(() => import('../v2/HeroV2'));
const HeroPills = lazy(() => import('../v2/HeroPills'));

export default function HomePage() {
  const version = useUiVersion();
  const NewHero = useHeroOption() === '2' ? HeroPills : HeroV2;
  useDocumentHead({
    title: `${siteConfig.role}`,
    description: `Portfolio of ${siteConfig.name} — ${siteConfig.tagline}. Websites, films, branding, visual design and app projects.`,
    path: '/',
  });

  return (
    <>
      {version === 'v2' ? (
        <Suspense fallback={<div style={{ minHeight: 'calc(100vh - var(--nav-height))' }} />}>
          <NewHero />
        </Suspense>
      ) : (
        <Hero />
      )}

      <FeaturedWork />

      <About />

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
