import { siteConfig } from '../../data/siteConfig';
import Reveal from '../common/Reveal';
import styles from './ContactCta.module.css';

export default function ContactCta() {
  return (
    <section className={styles.section} aria-labelledby="cta-heading">
      <div className="section-container">
        <Reveal className={styles.panel}>
          <span className="kicker">Let's work together</span>
          <h2 id="cta-heading" className={styles.heading}>
            Have a project <span className="text-gradient">in mind?</span>
          </h2>
          <p className={styles.text}>
            A product to design, a site to build, or both — I'd love to hear about it.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href={`mailto:${siteConfig.email}`}>
              Say hello <span aria-hidden="true">→</span>
            </a>
            <a
              className={styles.secondary}
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
          <p className={styles.email}>{siteConfig.email}</p>
        </Reveal>
      </div>
    </section>
  );
}
