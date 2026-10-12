import { useEffect, useState } from 'react';

// Only glyphs the display face actually has, so the width doesn't jump when
// a fallback font kicks in mid-scramble.
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/+=';
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const noise = (text) => [...text].map((c) => (c === ' ' ? ' ' : randomGlyph())).join('');

// "Decrypts" `text` left to right: starts as random glyphs and resolves one
// character at a time. `enabled: false` holds it as noise until you're ready
// (the intro waits on a choice before it starts); `done` snaps straight to
// the final text (used when the intro is skipped).
export function useScramble(
  text,
  { delay = 0, duration = 1200, done = false, enabled = true } = {}
) {
  const [value, setValue] = useState(() => noise(text));

  useEffect(() => {
    if (!enabled) return undefined;

    const chars = [...text];
    let frame = 0;
    let start = 0;
    let last = 0;

    function step(now) {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const resolved = Math.floor(t * chars.length);

      // ~22fps reads as a deliberate "terminal" flicker and costs less.
      if (now - last > 45 || t === 1) {
        last = now;
        setValue(chars.map((c, i) => (c === ' ' || i < resolved ? c : randomGlyph())).join(''));
      }
      if (t < 1) frame = requestAnimationFrame(step);
    }

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [text, delay, duration, enabled]);

  return done ? text : value;
}
