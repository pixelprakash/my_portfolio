import Hero from '../components/home/Hero';
import LiveSites from '../components/home/LiveSites';
// import Works from '../components/home/Works';
// import Testimonials from '../components/home/Testimonials';
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

      <LiveSites />

      {/* Full case-study grid and testimonials are switched off for now —
          the case studies are still partly placeholder copy and the
          testimonials are placeholder quotes.
      <Works />
      <Testimonials />
      */}

      <section
        className="section-container"
        style={{
          padding: '5rem 0 6rem',
          textAlign: 'center',
        }}
      >
        <span className="kicker">Under construction</span>
        <p
          style={{
            marginTop: '0.75rem',
            color: 'var(--color-text-secondary)',
            fontSize: '1.05rem',
            maxWidth: '480px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Testimonials are being rebuilt. Check back soon.
        </p>
      </section>
    </>
  );
}
