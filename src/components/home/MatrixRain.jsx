import { useEffect, useRef } from 'react';

const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const FONT_SIZE = 14;

// The rain is drawn at 30 fps (24 on phones): it's a soft background, the eye
// can't tell, and a full-screen canvas redrawn at 60 fps is a heavy ask of a
// phone. Speed and trail length are scaled by elapsed time, so it looks the same.
const REFERENCE_FRAME_MS = 1000 / 60;

export default function MatrixRain({ color = '#00ff00', opacity = 0.4, speed = 1, paused = false }) {
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);
  const syncRef = useRef(null);

  // `paused` is read live, so toggling it never rebuilds the canvas.
  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current?.();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const frameGap = window.matchMedia('(pointer: coarse), (max-width: 768px)').matches
      ? 1000 / 24
      : 1000 / 30;
    // While the opening sequence is up, the page behind it isn't visible, so
    // its canvases wait (the loader's own canvases live outside #main).
    const behindIntro = () =>
      document.documentElement.classList.contains('intro-playing') && Boolean(canvas.closest('#main'));

    let drops = [];
    let frameId = 0;
    let running = false;
    let onScreen = true;
    let lastFrame = 0;

    const randomChar = () => CHARS.charAt(Math.floor(Math.random() * CHARS.length));

    function drawStatic() {
      // Reduced motion: one still frame of scattered glyphs, no animation.
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = `${FONT_SIZE}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const length = 3 + Math.floor(Math.random() * 6);
        const start = Math.floor(Math.random() * (canvas.height / FONT_SIZE));
        for (let j = 0; j < length; j++) {
          ctx.fillText(randomChar(), i * FONT_SIZE, (start + j) * FONT_SIZE);
        }
      }
    }

    // (Re)build the column state whenever the canvas changes size, so the
    // rain always spans the full width instead of the width at first paint.
    function setup() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drops = new Array(Math.floor(canvas.width / FONT_SIZE)).fill(1);
      if (prefersReducedMotion) drawStatic();
    }

    function step(now) {
      if (running) frameId = requestAnimationFrame(step);

      const elapsed = now - lastFrame;
      if (elapsed < frameGap) return;
      lastFrame = now;
      const frames = Math.min(elapsed, 100) / REFERENCE_FRAME_MS;

      // the trail fades 5% per 60 fps frame; scale that to the real gap
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - Math.pow(0.95, frames)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        ctx.fillText(randomChar(), x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += speed * 0.5 * frames;
      }
    }

    // Only animate while the hero is actually visible and the tab is in
    // front — it's a full-viewport canvas, so running it in the background
    // is a steady drain on CPU and battery for no visual gain.
    function sync() {
      const shouldRun =
        !prefersReducedMotion && onScreen && !document.hidden && !pausedRef.current && !behindIntro();
      if (shouldRun && !running) {
        running = true;
        lastFrame = 0;
        frameId = requestAnimationFrame(step);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frameId);
      }
    }

    setup();

    const resizeObserver = new ResizeObserver(setup);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(canvas);

    document.addEventListener('visibilitychange', sync);

    // start / stop as the opening sequence goes up and comes down
    const classObserver = new MutationObserver(sync);
    classObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    syncRef.current = sync;
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      classObserver.disconnect();
      syncRef.current = null;
      document.removeEventListener('visibilitychange', sync);
    };
  }, [color, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity,
      }}
    />
  );
}
