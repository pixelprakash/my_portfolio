import { useEffect, useState } from 'react';

// Reports which of the given section ids the reader is currently "in": the
// last one whose top has passed a line a little above the middle of the
// viewport. `null` means above the first section (i.e. still at the top).
// `ids` should be a stable array (module constant or memoised).
export function useScrollSpy(ids, { offset = 0 } = {}) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!ids.length) return undefined;

    let frame = 0;

    function compute() {
      frame = 0;
      const line = offset + window.innerHeight * 0.35;
      let current = null;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }

      // Short last sections (the footer) may never reach the line.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = ids[ids.length - 1];

      setActive(current);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(compute);
    }

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids, offset]);

  return ids.length ? active : null;
}
