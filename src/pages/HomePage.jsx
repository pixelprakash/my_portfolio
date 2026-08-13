import Hero from '../components/home/Hero';
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

      {/* Rest of the home page is temporarily disabled while it's being
          rebuilt around the new hero — nothing deleted, just switched off.
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
          The rest of this site — case studies, testimonials — is being rebuilt. Check back soon.
        </p>
      </section>
    </>
  );
}
