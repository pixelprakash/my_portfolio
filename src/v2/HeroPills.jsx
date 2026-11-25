// v2 hero, option 2: "choose your pill". (Option 1 is HeroV2.)
//
// Hover a pill and it leaves the palm, and its world spreads across the stage:
// blue turns the portrait into a design canvas, red rebuilds it out of code.
// Click (or tap) to take the pill: the world stays, with a link to that side's
// work. Click it again, or press Escape, to put it back.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { about } from '../data/about';
import { siteConfig } from '../data/siteConfig';
import portrait from '../assets/portrait-cutout.webp';
import portraitSmall from '../assets/portrait-cutout-700.webp';
import { createPillStage } from './pillStage';
import { across, CROP, down, HEAD_BOX, PHOTO, PILLS } from './pills';
import Years from './Years';
import styles from './HeroPills.module.css';

const { design, development } = siteConfig.experience;

// How long the clear patch lingers after a finger lifts off the glass.
const TOUCH_LINGER_MS = 1400;

const TONE = { blue: styles.cool, red: styles.warm };
// Both year scales share a length, so the two can be compared at a glance.
const YEAR_SCALE = Math.max(design.years, development.years);
// how each side's numeral looks while its own pill is in play
const WORLD_LOOK = { blue: 'design', red: 'code' };

// "plain **bold** plain" -> plain <strong>bold</strong> plain
function Emphasis({ text }) {
  return text
    .split('**')
    .map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

function Stat({ id, years, label, now, peek, active }) {
  return (
    <div className={`${styles.stat} ${TONE[id]}`} data-side={id} data-peek {...peek(id)}>
      <Years
        value={years}
        outOf={YEAR_SCALE}
        tone={id === 'red' ? 'warm' : 'cool'}
        look={active === id ? WORLD_LOOK[id] : 'light'}
      />
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

// Blue world furniture: a design tool's layers list and colour styles.
function DesignPanel() {
  return (
    <div className={`${styles.panel} ${styles.designPanel}`} aria-hidden="true">
      <p className={styles.panelTitle}>Layers</p>
      <ul className={styles.layers}>
        {about.tools.design.map((tool, i) => (
          <li key={tool} style={{ '--i': i }}>
            <span className={styles.layerIcon} />
            {tool}
          </li>
        ))}
      </ul>
      <p className={styles.panelTitle}>Colour styles</p>
      <div className={styles.swatches}>
        {['#2347FF', '#35C8FF', '#F4F2EE', '#FF4D2E'].map((hex, i) => (
          <span key={hex} style={{ '--i': i, '--c': hex }}>
            <i />
            {hex}
          </span>
        ))}
      </div>
    </div>
  );
}

// Red world furniture: the same person, written as code.
function CodePanel() {
  const lines = [
    <>
      <b>const</b> developer = {'{'}
    </>,
    <>
      {'  '}years: <em>{development.years}</em>,
    </>,
    <>{'  '}stack: [</>,
    ...about.tools.development.map((tool) => (
      <>
        {'    '}
        <em>'{tool}'</em>,
      </>
    )),
    <>{'  '}],</>,
    <>{'};'}</>,
  ];

  return (
    <pre className={`${styles.panel} ${styles.codePanel}`} aria-hidden="true">
      {lines.map((line, i) => (
        <span key={i} className={styles.line} style={{ '--i': i }}>
          {line}
        </span>
      ))}
    </pre>
  );
}

export default function HeroPills() {
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const imageRef = useRef(null);
  const tagRef = useRef(null);
  const lightRef = useRef(null);
  const lingerRef = useRef(0);
  const [live, setLive] = useState(false);
  const [clean, setClean] = useState(false);
  const [peeking, setPeeking] = useState(null); // under the pointer or focus
  const [taken, setTaken] = useState(null); // clicked: stays until put back
  const [pointing, setPointing] = useState(false); // a mouse is over the stage
  const active = peeking ?? taken;

  useEffect(() => {
    const image = imageRef.current;
    let cancelled = false;
    let stage = null;

    // the shader samples the same file the <img> loaded
    image
      .decode()
      .then(() => {
        if (cancelled) return;
        stage = createPillStage({
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

  useEffect(() => {
    lightRef.current?.setPill(active);
  }, [active, live]);

  useEffect(() => () => window.clearTimeout(lingerRef.current), []);

  useEffect(() => {
    if (!taken) return undefined;
    function putBack(event) {
      if (event.key !== 'Escape') return;
      setTaken(null);
      setPeeking(null);
    }
    window.addEventListener('keydown', putBack);
    return () => window.removeEventListener('keydown', putBack);
  }, [taken]);

  function fogOver(delay = 0) {
    window.clearTimeout(lingerRef.current);
    lingerRef.current = window.setTimeout(() => lightRef.current?.release(), delay);
  }

  function onPointer(event) {
    const box = stageRef.current.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;

    const onControl = Boolean(event.target.closest('button, a, [data-peek]'));

    if (event.pointerType === 'mouse') {
      // no name tag over a control: it would sit on the control's own label
      setPointing(!onControl);
      // moved straight on the element: no re-render per mouse move
      if (tagRef.current) tagRef.current.style.transform = `translate(${x + 18}px, ${y + 20}px)`;
    }

    // over a control, the pointer is choosing, not wiping the glass
    if (onControl) {
      fogOver();
    } else if (lightRef.current) {
      window.clearTimeout(lingerRef.current);
      lightRef.current.point(x, y);
    }
  }

  // hovering with a mouse previews a side; touch has no hover, so it clicks
  const peek = (id) => ({
    onPointerEnter: (event) => event.pointerType !== 'touch' && setPeeking(id),
    onPointerLeave: (event) => event.pointerType !== 'touch' && setPeeking(null),
  });

  function toggle(id) {
    if (taken === id) {
      setTaken(null);
      setPeeking(null);
    } else {
      setTaken(id);
    }
  }

  return (
    <section
      className={`${styles.hero} ${live ? styles.live : ''}`}
      aria-labelledby="hero-heading"
      data-world={active ?? undefined}
      onPointerMove={onPointer}
      onPointerDown={onPointer}
      onPointerUp={(event) => event.pointerType === 'touch' && fogOver(TOUCH_LINGER_MS)}
      onPointerCancel={() => fogOver(TOUCH_LINGER_MS)}
      onPointerLeave={(event) => {
        if (event.pointerType === 'touch') return;
        setPointing(false);
        fogOver();
      }}
    >
      <div ref={stageRef} className={styles.stage} />

      <h1
        id="hero-heading"
        className={styles.headline}
        aria-label={`${siteConfig.name}, ${siteConfig.role}`}
      >
        <span className={styles.headLeft}>
          <span className={styles.eyebrow}>{siteConfig.name}</span>
          <span className={styles.word} data-side="blue" data-peek {...peek('blue')}>
            Designer
            <span className={styles.selection} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          </span>
        </span>
        <span className={styles.headRight}>
          <span className={styles.eyebrow}>{siteConfig.location}</span>
          <span className={styles.word} data-side="red" data-peek {...peek('red')}>
            <em className={styles.amp}>&amp;</em> Developer
            <span className={styles.caret} aria-hidden="true" />
          </span>
        </span>
      </h1>

      <DesignPanel />
      <CodePanel />

      <div ref={frameRef} className={styles.frame} style={{ '--crop': CROP }}>
        <img
          ref={imageRef}
          className={styles.photo}
          src={portrait}
          srcSet={`${portraitSmall} 700w, ${portrait} 1100w`}
          sizes="(min-width: 900px) 668px, 100vw"
          alt="Portrait of Surya Prakash Musunuri in sunglasses, holding a blue pill in one palm and a red pill in the other"
          width={PHOTO.width}
          height={PHOTO.height}
          loading="eager"
          fetchPriority="high"
        />

        {/* the design tool's selection round the head */}
        <span
          className={styles.headBox}
          aria-hidden="true"
          style={{
            left: across(HEAD_BOX.x),
            top: down(HEAD_BOX.y),
            width: across(HEAD_BOX.width),
            height: down(HEAD_BOX.height),
          }}
        >
          <i />
          <i />
          <i />
          <i />
          <b>Portrait</b>
          <s>
            {HEAD_BOX.width} × {HEAD_BOX.height}
          </s>
        </span>

        {Object.entries(PILLS).map(([id, pill]) => (
          <button
            key={id}
            type="button"
            className={`${styles.pill} ${TONE[id]}`}
            style={{ left: across(pill.x), top: down(pill.y) }}
            aria-pressed={taken === id}
            aria-label={`${pill.colour} pill: the ${pill.side} side`}
            data-side={id}
            data-sound="open"
            data-sound-hover="scan"
            data-sound-tone={id}
            {...peek(id)}
            onFocus={(event) => {
              if (event.currentTarget.matches(':focus-visible')) setPeeking(id);
            }}
            onBlur={() => setPeeking(null)}
            onClick={() => toggle(id)}
          >
            <span className={styles.pillTag} aria-hidden="true">
              {taken === id ? 'Put it back' : `${pill.colour} pill`}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.choice}>
        {/* the link only shows while the world on screen is the one it leads to */}
        {taken && active === taken ? (
          <Link className={`${styles.cta} ${TONE[taken]}`} to={PILLS[taken].href}>
            {PILLS[taken].cta} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <p className={styles.hint}>{peeking ? 'Click to take it' : 'Choose your pill'}</p>
        )}
      </div>
      <p className="visually-hidden" role="status">
        {taken ? `${PILLS[taken].colour} pill taken: the ${PILLS[taken].side} side.` : ''}
      </p>

      <div className={styles.stats}>
        <Stat
          id="blue"
          years={design.years}
          label={design.label}
          now={design.now}
          peek={peek}
          active={active}
        />
        <Stat
          id="red"
          years={development.years}
          label={development.label}
          peek={peek}
          active={active}
        />
      </div>

      {live && (
        <button
          type="button"
          className={styles.cleanToggle}
          aria-pressed={clean}
          onClick={() => setClean((on) => !on)}
        >
          <span className={styles.swatch} aria-hidden="true" />
          {clean ? 'Bring back the effects' : 'Show the clear photo'}
        </button>
      )}

      <span
        ref={tagRef}
        className={`${styles.cursorTag} ${active && pointing ? styles.cursorOn : ''}`}
        aria-hidden="true"
      >
        {active === 'red' ? '> developer' : 'Designer'}
      </span>
    </section>
  );
}
