import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import MatrixRain from '../home/MatrixRain';
import { useScramble } from '../../hooks/useScramble';
import { createIntroSound } from '../../audio/introSound';
import styles from './Loader.module.css';

// Timeline (ms). After the visitor picks a pill the progress bar runs for
// PROGRESS_MS (after a short start delay), holds a beat at 100, then the exit
// plays for EXIT_MS. The exit itself is choreographed in Loader.module.css:
// a held beat, then the doors part from 250ms (1100ms, expo in-out) — keep
// EXIT_MS at or past the end of that, and REVEAL_AT at the moment they start.
const PROGRESS_DELAY = 250;
const PROGRESS_MS = 1700;
const HOLD_MS = 250;
const EXIT_MS = 1500;
const REVEAL_AT = 250;

const LOG = [
  { label: 'design.core', tone: styles.okBlue },
  { label: 'dev.core', tone: styles.okRed },
  { label: 'ux.engineer@dic', tone: styles.okWhite },
];
// progress % at which each line appears (the last is the final "hello, world")
const LOG_AT = [6, 34, 62, 90];

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const canPlaySound = () =>
  typeof window !== 'undefined' && Boolean(window.AudioContext || window.webkitAudioContext);

// One fixed-width cell per character: a deliberate monospace grid, which
// also stops the line shimmying while the glyphs scramble.
function Cells({ text, tone }) {
  return [...text].map((ch, i) => (
    <span
      key={i}
      className={`${styles.cell} ${ch === ' ' ? styles.space : ''} ${tone ? tone(i) : ''}`}
    >
      {ch}
    </span>
  ));
}

// A horizontal capsule centred on the seam: the screen's left/right split
// divides it exactly into its blue and red halves, so when the doors part it
// separates with them.
function Capsule() {
  const clipId = useId();
  return (
    <svg className={styles.capsule} viewBox="0 0 160 64" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x="4" y="8" width="152" height="48" rx="24" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="80" height="64" fill="#00d4ff" />
        <rect x="80" y="0" width="80" height="64" fill="#ff3b0e" />
        <rect x="16" y="14" width="128" height="7" rx="3.5" fill="rgba(255,255,255,0.35)" />
        <rect x="79" y="0" width="2" height="64" fill="rgba(0,0,0,0.35)" />
      </g>
    </svg>
  );
}

// The progress bar as an oscilloscope: a track that fills outward from the
// centre (blue left, red right) with the live waveform riding on it. With
// sound on it draws the real signal; in quiet mode it draws a synthetic one.
function ScopeBar({ analyserRef, progressRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas.getContext('2d');
    const t0 = performance.now();
    let samples = null;
    let frame = 0;

    function draw(now) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);

      const mid = h / 2;
      const half = w / 2;
      const progress = progressRef.current;

      // track + the filled stretch, growing from the centre outward
      g.fillStyle = 'rgba(255,255,255,0.14)';
      g.fillRect(0, mid - 1, w, 2);
      g.shadowBlur = 12;
      g.shadowColor = '#00d4ff';
      g.fillStyle = '#00d4ff';
      g.fillRect(half - half * progress, mid - 1.5, half * progress, 3);
      g.shadowColor = '#ff3b0e';
      g.fillStyle = '#ff3b0e';
      g.fillRect(half, mid - 1.5, half * progress, 3);
      g.shadowBlur = 0;

      // waveform
      const analyser = analyserRef.current;
      if (analyser) {
        if (!samples || samples.length !== analyser.fftSize) {
          samples = new Uint8Array(analyser.fftSize);
        }
        analyser.getByteTimeDomainData(samples);
      }
      const t = (now - t0) / 1000;
      const points = 110;
      const gradient = g.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop(0, '#00d4ff');
      gradient.addColorStop(0.5, '#ffffff');
      gradient.addColorStop(1, '#ff3b0e');
      g.strokeStyle = gradient;
      g.lineWidth = 1.6;
      g.globalAlpha = 0.9;
      g.beginPath();
      for (let i = 0; i < points; i++) {
        const k = i / (points - 1);
        const v = analyser
          ? (samples[Math.floor(k * (samples.length - 1))] - 128) / 128
          : (Math.sin(i * 0.33 + t * 5) * 0.5 + Math.sin(i * 0.12 - t * 3) * 0.35) *
            (0.12 + 0.55 * progress);
        const taper = Math.sin(Math.PI * k); // calm at both ends
        const y = mid + v * mid * 0.95 * taper;
        if (i === 0) g.moveTo(k * w, y);
        else g.lineTo(k * w, y);
      }
      g.stroke();
      g.globalAlpha = 1;

      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [analyserRef, progressRef]);

  return <canvas ref={canvasRef} className={styles.scope} />;
}

// The centre stack. It is rendered once inside each screen half (each copy is
// a full viewport wide and centred on the seam, so the halves clip it down the
// middle): at rest it looks whole, and when the doors part it splits with them.
function SplitLayer({ side, stage, names, role, analyserRef, progressRef }) {
  const roleTone = (i) => (i < 8 ? styles.blueText : i > 10 ? styles.redText : '');
  const showTitle = stage !== 'gate';

  return (
    <div
      className={`${styles.splitLayer} ${side === 'left' ? styles.layerL : styles.layerR}`}
      aria-hidden="true"
    >
      {showTitle && <Capsule />}
      {showTitle && (
        <>
          <div className={styles.name}>
            {names.map((name, i) => (
              <span key={i} className={styles.line}>
                <span className={styles.lineInner}>
                  <Cells text={name} />
                </span>
              </span>
            ))}
          </div>
          <p className={styles.role}>
            <Cells text={role} tone={roleTone} />
          </p>
          <div className={styles.progress}>
            <ScopeBar analyserRef={analyserRef} progressRef={progressRef} />
            <div className={styles.barLabels}>
              <span className={styles.blueText}>Design</span>
              <span className={styles.redText}>Develop</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Loader({ onDone }) {
  const gateTitleId = useId();
  const [stage, setStage] = useState(() => (canPlaySound() ? 'gate' : 'boot')); // gate | boot | exit
  const [lines, setLines] = useState(0);

  const rootRef = useRef(null);
  const counter = useRef(null);
  const soundButton = useRef(null);
  const skipButton = useRef(null);
  const soundRef = useRef(null);
  const analyserRef = useRef(null);
  const progressRef = useRef(0);
  const bluppedRef = useRef(0);
  const exitedRef = useRef(false);
  const holdTimer = useRef(0);
  const doneTimer = useRef(0);
  const revealTimer = useRef(0);

  const booting = stage !== 'gate';
  const exiting = stage === 'exit';
  const nameTop = useScramble('SURYA PRAKASH', {
    delay: 450,
    duration: 1100,
    done: exiting,
    enabled: booting,
  });
  const nameBottom = useScramble('MUSUNURI', {
    delay: 800,
    duration: 900,
    done: exiting,
    enabled: booting,
  });
  const role = useScramble('DESIGNER × DEVELOPER', {
    delay: 1050,
    duration: 750,
    done: exiting,
    enabled: booting,
  });

  const paint = useCallback((progress) => {
    progressRef.current = progress;
    if (counter.current) {
      counter.current.textContent = String(Math.round(progress * 100)).padStart(3, '0');
    }
  }, []);

  const beginExit = useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    clearTimeout(holdTimer.current);
    paint(1);
    setLines(LOG_AT.length);
    setStage('exit');
    soundRef.current?.exit();

    // As the doors begin to part: release the page's held animations and let
    // it settle in with a soft focus-pull.
    revealTimer.current = setTimeout(() => {
      const html = document.documentElement;
      html.classList.remove('intro-playing');
      html.classList.add('intro-reveal');
    }, REVEAL_AT);
    doneTimer.current = setTimeout(onDone, EXIT_MS);
  }, [onDone, paint]);

  // The visitor picks a pill: blue is a quiet entrance, red turns sound on.
  // The click itself is the user gesture browsers require to start audio.
  const enter = useCallback((withSound) => {
    if (withSound) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContextClass();
        context.resume?.();
        const sound = createIntroSound(context);
        sound.start();
        soundRef.current = sound;
        analyserRef.current = sound.analyser;
      } catch {
        soundRef.current = null;
        analyserRef.current = null;
      }
    }
    setStage('boot');
  }, []);

  // While the loader is up, hold the page's own entrance animations (the hero
  // read-outs, leader lines…) at frame zero via a global rule in index.css,
  // so they play as the doors open instead of behind them. Done in a layout
  // effect so it lands before the first paint.
  useLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.add('intro-playing');
    return () => html.classList.remove('intro-playing', 'intro-reveal');
  }, []);

  // Lock scroll, and let Escape skip from any stage.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') beginExit();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [beginExit]);

  // The page behind is inert while this is up, so keyboard users start here.
  useEffect(() => {
    if (stage === 'gate') soundButton.current?.focus();
    if (stage === 'boot') skipButton.current?.focus();
  }, [stage]);

  // Progress timeline: starts when the visitor has chosen.
  useEffect(() => {
    if (stage !== 'boot') return undefined;

    const start = performance.now();
    let frame = 0;

    function tick(now) {
      const raw = Math.min(1, Math.max(0, (now - start - PROGRESS_DELAY) / PROGRESS_MS));
      const progress = ease(raw);
      paint(progress);

      const shown = LOG_AT.filter((at) => progress * 100 >= at).length;
      setLines(shown);
      while (bluppedRef.current < shown) {
        soundRef.current?.blip(bluppedRef.current);
        bluppedRef.current += 1;
      }

      if (raw >= 1) {
        holdTimer.current = setTimeout(beginExit, HOLD_MS);
        return;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(holdTimer.current);
    };
  }, [stage, beginExit, paint]);

  // Bass energy → a --pulse custom property on the root, which the glow of the
  // seam, pill and title follow. Real analysis with sound on, a faint
  // synthetic heartbeat in quiet mode. Runs through the exit so the boom lands.
  useEffect(() => {
    if (stage === 'gate') return undefined;

    let frame = 0;
    let pulse = 0;
    let spectrum = null;

    function loop(now) {
      const analyser = analyserRef.current;
      let bass;
      if (analyser) {
        if (!spectrum) spectrum = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(spectrum);
        bass = (spectrum[0] + spectrum[1] + spectrum[2]) / (3 * 255);
      } else {
        bass = progressRef.current * 0.5 * Math.pow(Math.max(0, Math.sin((now / 1000) * 6.5)), 6);
      }
      pulse = Math.max(bass, pulse * 0.88);
      rootRef.current?.style.setProperty('--pulse', pulse.toFixed(3));
      frame = requestAnimationFrame(loop);
    }
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [stage]);

  // On unmount: clear timers, and fade the audio out unless the exit score
  // is still ringing on (release() leaves that tail alone).
  useEffect(
    () => () => {
      clearTimeout(holdTimer.current);
      clearTimeout(doneTimer.current);
      clearTimeout(revealTimer.current);
      soundRef.current?.release();
    },
    []
  );

  const names = [nameTop, nameBottom];
  const splitProps = { stage, names, role, analyserRef, progressRef };

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${exiting ? styles.exit : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={stage === 'gate' ? 'Choose how to enter' : 'Loading portfolio'}
    >
      <span className="visually-hidden" role="status">
        {stage === 'gate' ? 'Choose how to enter the site' : 'Loading portfolio'}
      </span>

      {/* The hero's two halves. Everything decorative lives inside them (the
          centre stack is split across both), so on exit it all goes with the
          doors. */}
      <div className={`${styles.panel} ${styles.panelBlue}`} aria-hidden="true">
        <MatrixRain color="#00d4ff" opacity={0.3} speed={1.1} />
        <span className={styles.scanlines} />
        <SplitLayer side="left" {...splitProps} />

        <div className={`${styles.hud} ${styles.hudLeft}`}>
          <span className={`${styles.corner} ${styles.cTL}`} />
          <span className={`${styles.corner} ${styles.cBL}`} />
          <div>
            <p>SP / 2026</p>
            <p>PORTFOLIO.EXE</p>
          </div>
          {booting && (
            <ul className={styles.log}>
              {LOG.slice(0, Math.min(lines, LOG.length)).map((line) => (
                <li key={line.label} className={styles.logLine}>
                  <span>&gt; {line.label}</span>
                  <span className={styles.dots}>{'.'.repeat(60)}</span>
                  <span className={`${styles.ok} ${line.tone}`}>OK</span>
                </li>
              ))}
              {lines >= LOG_AT.length && (
                <li className={`${styles.logLine} ${styles.caret}`}>&gt; hello, world.</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className={`${styles.panel} ${styles.panelRed}`} aria-hidden="true">
        <MatrixRain color="#ff0033" opacity={0.3} speed={1.1} />
        <span className={styles.scanlines} />
        <SplitLayer side="right" {...splitProps} />

        <div className={`${styles.hud} ${styles.hudRight}`}>
          <span className={`${styles.corner} ${styles.cTR}`} />
          <span className={`${styles.corner} ${styles.cBR}`} />
          <div className={styles.alignRight}>
            <p>Hyderabad, IN</p>
            <p>17.38°N 78.48°E</p>
          </div>
          {booting && (
            <div className={styles.br}>
              <p className={styles.loadingLabel}>Loading</p>
              <p className={styles.counterRow}>
                <span ref={counter} className={styles.counter}>
                  000
                </span>
                <span className={styles.pct}>%</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <span className={styles.vignette} aria-hidden="true" />

      {/* The one interactive layer (a single copy, so there's one tab stop).
          It fades first on exit; the doors then take everything else. */}
      <div className={styles.controls}>
        {stage === 'gate' ? (
          <div className={styles.gate} role="group" aria-labelledby={gateTitleId}>
            <p className={styles.gateKicker}>Surya Prakash Musunuri · Portfolio</p>
            <h2 id={gateTitleId} className={styles.gateTitle}>
              Choose your pill
            </h2>
            <div className={styles.choices}>
              <button
                type="button"
                className={`${styles.choice} ${styles.choiceBlue}`}
                onClick={() => enter(false)}
              >
                <span className={styles.choiceDot} aria-hidden="true" />
                <span className={styles.choiceText}>
                  <span className={styles.choiceName}>Blue pill</span>
                  <span className={styles.choiceSub}>Quiet entrance</span>
                </span>
              </button>
              <button
                ref={soundButton}
                type="button"
                className={`${styles.choice} ${styles.choiceRed}`}
                onClick={() => enter(true)}
              >
                <span className={styles.choiceDot} aria-hidden="true" />
                <span className={styles.choiceText}>
                  <span className={styles.choiceName}>Red pill</span>
                  <span className={styles.choiceSub}>With sound</span>
                </span>
              </button>
            </div>
            <p className={styles.gateNote}>Best with headphones</p>
            <button type="button" className={styles.skip} onClick={beginExit}>
              Skip intro
            </button>
          </div>
        ) : (
          <button ref={skipButton} type="button" className={styles.skipFloat} onClick={beginExit}>
            Skip intro
          </button>
        )}
      </div>
    </div>
  );
}
