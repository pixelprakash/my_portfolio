import { useEffect, useRef, useState } from 'react';
import styles from './GalleryDialog.module.css';

const SWIPE_PX = 50;

// Lightbox for image galleries: a grid of every design, click one for the
// large view with prev/next (buttons, arrow keys, or swipe).
export default function GalleryDialog({ project, onClose }) {
  const ref = useRef(null);
  const touchX = useRef(null);
  const [index, setIndex] = useState(null); // null = grid, number = large view
  const items = project?.gallery ?? [];

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  const step = (delta) =>
    setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length));

  const handleClose = () => {
    setIndex(null);
    onClose();
  };

  const onKeyDown = (e) => {
    if (index === null) return;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  };

  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > SWIPE_PX) step(dx < 0 ? 1 : -1);
  };

  const current = index === null ? null : items[index];

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={project ? project.title : 'Gallery'}
      onClose={handleClose}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        // a click on the backdrop lands on the <dialog> itself
        if (e.target === ref.current) handleClose();
      }}
    >
      {project && (
        <>
          <header className={styles.bar}>
            {current ? (
              <button type="button" className={styles.barButton} onClick={() => setIndex(null)}>
                ← All designs
              </button>
            ) : (
              <span className={styles.heading}>{project.title}</span>
            )}
            <span className={styles.count}>
              {current ? `${index + 1} / ${items.length}` : `${items.length} designs`}
            </span>
            <button type="button" className={styles.barButton} onClick={handleClose}>
              Close ✕
            </button>
          </header>

          {current ? (
            <div
              className={styles.stage}
              onTouchStart={(e) => {
                touchX.current = e.touches[0].clientX;
              }}
              onTouchEnd={onTouchEnd}
            >
              <button
                type="button"
                className={`${styles.nav} ${styles.navPrev}`}
                aria-label="Previous design"
                onClick={() => step(-1)}
              >
                ‹
              </button>
              <img className={styles.large} src={current.src} alt={current.alt} />
              <button
                type="button"
                className={`${styles.nav} ${styles.navNext}`}
                aria-label="Next design"
                onClick={() => step(1)}
              >
                ›
              </button>
            </div>
          ) : (
            <ul className={styles.grid}>
              {items.map((item, i) => (
                <li key={item.name}>
                  <button
                    type="button"
                    className={styles.thumb}
                    onClick={() => setIndex(i)}
                    aria-label={`Open: ${item.alt}`}
                  >
                    <img src={item.thumb} alt="" loading="lazy" width="640" height="360" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </dialog>
  );
}
