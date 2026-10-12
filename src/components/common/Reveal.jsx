import { useEffect, useRef, useState } from 'react';
import styles from './Reveal.module.css';

// Fades + lifts its children in the first time they scroll into view.
// Renders fully visible straight away when the user prefers reduced motion
// or the browser has no IntersectionObserver, so content is never hidden.
export default function Reveal({ as = 'div', delay = 0, className = '', children, ...rest }) {
  const Tag = as;
  const ref = useRef(null);
  const [shown, setShown] = useState(
    () =>
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (shown) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${shown ? styles.in : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
