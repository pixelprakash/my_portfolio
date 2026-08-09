import { useEffect, useState } from 'react';

// Scroll-spy: watches a list of section ids and reports whichever one is
// currently nearest the top of the viewport, offset for the sticky navbar.
export function useActiveSection(sectionIds, { navHeight = 0 } = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);

  useEffect(() => {
    if (!sectionIds.length) return undefined;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const visibleIds = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        });

        const firstVisible = sectionIds.find((id) => visibleIds.has(id));
        if (firstVisible) {
          setActiveId(firstVisible);
        }
      },
      {
        rootMargin: `-${navHeight + 16}px 0px -65% 0px`,
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sectionIds, navHeight]);

  return activeId;
}
