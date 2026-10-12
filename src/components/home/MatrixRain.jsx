import { useEffect, useRef } from 'react';

const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const FONT_SIZE = 14;

export default function MatrixRain({ color = '#00ff00', opacity = 0.4, speed = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let drops = [];
    let frameId = 0;
    let running = false;
    let onScreen = true;

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

    function step() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
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

        drops[i] += speed * 0.5;
      }

      if (running) frameId = requestAnimationFrame(step);
    }

    // Only animate while the hero is actually visible and the tab is in
    // front — it's a full-viewport canvas, so running it in the background
    // is a steady drain on CPU and battery for no visual gain.
    function sync() {
      const shouldRun = !prefersReducedMotion && onScreen && !document.hidden;
      if (shouldRun && !running) {
        running = true;
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
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
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
