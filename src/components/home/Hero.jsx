import { siteConfig } from '../../data/siteConfig';
import MatrixRain from './MatrixRain';
import portrait from '../../assets/portrait-cutout.webp';
import styles from './Hero.module.css';

const PORTRAIT_WIDTH = 1100;
const PORTRAIT_HEIGHT = 1422;

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.split}>
        <div className={styles.splitBlue}>
          <MatrixRain color="#00d4ff" opacity={0.5} speed={1.2} />
        </div>
        <div className={styles.splitRed}>
          <MatrixRain color="#ff0033" opacity={0.5} speed={1.2} />
        </div>
      </div>

      {/* Kept in the DOM (visually hidden) so the page still has a real h1
          and Layout's route-change focus management has something to find,
          even while the visible name card below is switched off. */}
      <h1 id="hero-heading" className="visually-hidden">
        {siteConfig.name}
      </h1>

      {/* Name card — temporarily disabled while the portrait is full-size.
      <div className={styles.content}>
        <div className={styles.intro}>
          <h1 id="hero-heading" className={styles.name}>
            {siteConfig.name}
          </h1>
          <p className={styles.tagline}>{siteConfig.tagline}</p>
          <p className={styles.location}>{siteConfig.location}</p>
        </div>
      </div>
      */}

      <div className={styles.portraitFrame}>
        <div className={styles.glow} aria-hidden="true" />
        <img
          className={styles.portraitImg}
          src={portrait}
          alt="Portrait of Surya Prakash Musunuri holding a blue pill in one hand and a red pill in the other"
          width={PORTRAIT_WIDTH}
          height={PORTRAIT_HEIGHT}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <span className={`${styles.badge} ${styles.badgeBlue}`}>
          <span className={styles.badgeDot} aria-hidden="true" />
          Designer
        </span>
        <span className={`${styles.badge} ${styles.badgeRed}`}>
          <span className={styles.badgeDot} aria-hidden="true" />
          Developer
        </span>
      </div>
    </section>
  );
}
