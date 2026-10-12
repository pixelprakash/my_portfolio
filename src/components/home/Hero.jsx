import { siteConfig } from '../../data/siteConfig';
import MatrixRain from './MatrixRain';
import portrait from '../../assets/portrait-cutout.webp';
import styles from './Hero.module.css';

const PORTRAIT_WIDTH = 1100;
const PORTRAIT_HEIGHT = 1422;
const { design, development } = siteConfig.experience;

// Both tick rows share one scale, so "2 of 6" vs "6 of 6" is a fair comparison.
const YEAR_SCALE = Math.max(design.years, development.years);

// "plain **bold** plain" -> plain <strong>bold</strong> plain
function Emphasis({ text }) {
  return text
    .split('**')
    .map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

function YearTicks({ filled }) {
  return (
    <span className={styles.ticks} aria-hidden="true">
      {Array.from({ length: YEAR_SCALE }, (_, i) => (
        <span key={i} className={i < filled ? styles.tickOn : styles.tick} />
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.split}>
        <div className={styles.splitBlue}>
          <MatrixRain color="#00d4ff" opacity={0.32} speed={1.2} />
        </div>
        <div className={styles.splitRed}>
          <MatrixRain color="#ff0033" opacity={0.32} speed={1.2} />
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

      <div className={styles.info}>
        <div className={`${styles.stat} ${styles.statBlue}`}>
          <span className={styles.scrim} aria-hidden="true" />
          <span className={styles.num}>{design.years}</span>
          <div className={styles.statBody}>
            <p className={styles.kickerRow}>
              <span className={styles.kicker}>Years</span>
              <YearTicks filled={design.years} />
            </p>
            <p className={styles.label}>
              <Emphasis text={design.label} />
            </p>
            <div className={styles.now}>
              <p className={styles.nowTop}>
                <span className={styles.nowTag}>Now</span>
                <strong className={styles.nowRole}>{design.now.role}</strong>
              </p>
              <p className={styles.nowAt}>@ {design.now.at}</p>
            </div>
          </div>
        </div>

        <div className={`${styles.stat} ${styles.statRed}`}>
          <span className={styles.scrim} aria-hidden="true" />
          <span className={styles.num}>{development.years}</span>
          <div className={styles.statBody}>
            <p className={styles.kickerRow}>
              <span className={styles.kicker}>Years</span>
              <YearTicks filled={development.years} />
            </p>
            <p className={styles.label}>
              <Emphasis text={development.label} />
            </p>
          </div>
        </div>
      </div>

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

        {/* Annotations pinned to the actual pills in the photo (positions are
            % of the image). Ring + leader are decorative; the label is text. */}
        <div className={`${styles.callout} ${styles.calloutBlue}`}>
          <span className={styles.ring} aria-hidden="true" />
          <span className={styles.leader} aria-hidden="true" />
          <span className={styles.tag}>
            <span className={styles.tagName}>Designer</span>
            <span className={styles.tagSub}>UX / UI</span>
          </span>
        </div>
        <div className={`${styles.callout} ${styles.calloutRed}`}>
          <span className={styles.ring} aria-hidden="true" />
          <span className={styles.leader} aria-hidden="true" />
          <span className={styles.tag}>
            <span className={styles.tagName}>Developer</span>
            <span className={styles.tagSub}>Full Stack</span>
          </span>
        </div>
      </div>
    </section>
  );
}
