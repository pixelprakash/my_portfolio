import { useEffect, useRef, useState } from 'react';
import styles from './ScrollAids.module.css';

// A thin reading-progress bar under the navbar, plus a back-to-top button
// that appears once the page is a screen or two long behind you.
export default function ScrollAids() {
  const barRef = useRef(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      // Written straight to the element: no re-render on every scroll tick.
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      setShowTop(window.scrollY > window.innerHeight * 1.2);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  function backToTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    // Keep keyboard users oriented: land focus at the top of the content.
    const main = document.getElementById('main');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
    }
  }

  return (
    <>
      <div className={styles.progress} aria-hidden="true">
        <div ref={barRef} className={styles.bar} />
      </div>

      <button
        type="button"
        className={`${styles.top} ${showTop ? styles.topShown : ''}`}
        onClick={backToTop}
        aria-label="Back to top"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 19V5M5 12l7-7 7 7"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
