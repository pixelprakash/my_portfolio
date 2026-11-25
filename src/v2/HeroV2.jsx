import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import portrait from '../assets/portrait-cutout.webp';
import portraitSmall from '../assets/portrait-cutout-700.webp';
import { createLightStage, CROP } from './lightStage';
import styles from './HeroV2.module.css';

const { design, development } = siteConfig.experience;

// How long the clear patch lingers after a finger lifts off the glass.
const TOUCH_LINGER_MS = 1400;

// "plain **bold** plain" -> plain <strong>bold</strong> plain
function Emphasis({ text }) {
  return text
    .split('**')
    .map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

function Stat({ tone, years, label, now }) {
  return (
    <div className={`${styles.stat} ${tone === 'warm' ? styles.warm : styles.cool}`}>
      <p className={styles.years}>
        <span className={styles.yearsNum}>{years}</span>
        <span className={styles.yearsUnit}>years</span>
      </p>
      <p className={styles.statLabel}>
        <Emphasis text={label} />
      </p>
      {now && (
        <p className={styles.now}>
          <span className={styles.nowTag}>Now</span>
          <span>
            <strong>{now.role}</strong> at {now.at}
          </span>
        </p>
      )}
    </div>
  );
}

export default function HeroV2() {
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const imageRef = useRef(null);
  const lightRef = useRef(null);
  const [live, setLive] = useState(false);
  const [clean, setClean] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    let cancelled = false;
    let stage = null;

    // the shader samples the same file the <img> loaded
    image
      .decode()
      .then(() => {
        if (cancelled) return;
        stage = createLightStage({
          host: stageRef.current,
          frame: frameRef.current,
          image,
          onReady: () => setLive(true),
          onLost: () => setLive(false),
        });
        lightRef.current = stage;
      })
      .catch(() => {}); // no picture, no effect: the layout still stands

    return () => {
      cancelled = true;
      stage?.destroy();
      lightRef.current = null;
    };
  }, []);

  useEffect(() => {
    lightRef.current?.setClean(clean);
  }, [clean, live]);

  const lingerRef = useRef(0);
  useEffect(() => () => window.clearTimeout(lingerRef.current), []);

  function clearGlassAt(event) {
    const light = lightRef.current;
    if (!light) return;
    window.clearTimeout(lingerRef.current);
    const box = stageRef.current.getBoundingClientRect();
    light.point(event.clientX - box.left, event.clientY - box.top);
  }

  function fogOver(delay = 0) {
    window.clearTimeout(lingerRef.current);
    lingerRef.current = window.setTimeout(() => lightRef.current?.release(), delay);
  }

  return (
    <section
      className={`${styles.hero} ${live ? styles.live : ''}`}
      aria-labelledby="hero-heading"
      onPointerMove={clearGlassAt}
      onPointerDown={clearGlassAt}
      onPointerUp={(event) => event.pointerType === 'touch' && fogOver(TOUCH_LINGER_MS)}
      onPointerCancel={() => fogOver(TOUCH_LINGER_MS)}
      onPointerLeave={(event) => event.pointerType !== 'touch' && fogOver()}
    >
      <div ref={stageRef} className={styles.stage} />

      <h1
        id="hero-heading"
        className={styles.headline}
        aria-label={`${siteConfig.name}, ${siteConfig.role}`}
      >
        <span className={styles.headLeft}>
          <span className={styles.eyebrow}>{siteConfig.name}</span>
          <span className={styles.word}>Designer</span>
        </span>
        <span className={styles.headRight}>
          <span className={styles.eyebrow}>{siteConfig.location}</span>
          <span className={styles.word}>
            <em className={styles.amp}>&amp;</em> Developer
          </span>
        </span>
      </h1>

      <div ref={frameRef} className={styles.frame} style={{ '--crop': CROP }}>
        <img
          ref={imageRef}
          className={styles.photo}
          src={portrait}
          srcSet={`${portraitSmall} 700w, ${portrait} 1100w`}
          sizes="(min-width: 900px) 800px, 100vw"
          alt="Portrait of Surya Prakash Musunuri in sunglasses and a leather jacket"
          width="1100"
          height="1422"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className={styles.stats}>
        <Stat tone="cool" years={design.years} label={design.label} now={design.now} />
        <Stat tone="warm" years={development.years} label={development.label} />
      </div>

      {live && (
        <button
          type="button"
          className={styles.cleanToggle}
          aria-pressed={clean}
          onClick={() => setClean((on) => !on)}
          // moving onto the button shouldn't drag the clear patch with it
          onPointerMove={(event) => {
            event.stopPropagation();
            fogOver();
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <span className={styles.swatch} aria-hidden="true" />
          {clean ? 'Bring back the glass' : 'Show the clear photo'}
        </button>
      )}
    </section>
  );
}
