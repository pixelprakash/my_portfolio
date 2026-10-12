import { useEffect, useRef, useState } from 'react';
import { projects, projectTypes } from '../../data/projects';
import GalleryDialog from './GalleryDialog';
import cardStyles from './CaseStudyCard.module.css';
import sectionStyles from './Works.module.css';
import styles from './ProjectShowcase.module.css';

function hostOf(href) {
  try {
    return new URL(href).host.replace(/^www\./, '');
  } catch {
    return href;
  }
}

// Opens a project's embed (YouTube video or Figma presentation) in a lightbox.
function embedSrc(project) {
  return project.embed ?? `https://www.youtube.com/embed/${project.videoId}?autoplay=1&rel=0`;
}

function EmbedDialog({ video, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (video && !dialog.open) dialog.showModal();
    if (!video && dialog.open) dialog.close();
  }, [video]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={video ? video.title : 'Project'}
      onClose={onClose}
      onClick={(e) => {
        // a click on the backdrop lands on the <dialog> itself
        if (e.target === ref.current) onClose();
      }}
    >
      {video && (
        <>
          <div className={styles.dialogBar}>
            {video.href && (
              <a
                className={styles.dialogLink}
                href={video.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {video.hrefLabel ?? 'Open ↗'}
              </a>
            )}
            <button type="button" className={styles.dialogClose} onClick={onClose}>
              Close ✕
            </button>
          </div>
          <div
            className={styles.player}
            style={video.embedAspect ? { aspectRatio: video.embedAspect } : undefined}
          >
            <iframe
              src={embedSrc(video)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </>
      )}
    </dialog>
  );
}

function ProjectCard({ project, onOpen }) {
  const isBlue = project.accent === 'blue';
  const type = projectTypes[project.type];
  // video + presentations open in a lightbox; websites link out
  const opensEmbed = Boolean(project.videoId || project.embed);
  const isGallery = Boolean(project.gallery);
  const opensLightbox = opensEmbed || isGallery;

  return (
    <article
      className={`${cardStyles.card} ${styles.card} ${isBlue ? cardStyles.cardBlue : cardStyles.cardRed}`}
    >
      <div className={`${styles.cover} ${opensLightbox ? styles.coverVideo : ''}`}>
        {type.frame === 'browser' && (
          <div className={styles.chrome} aria-hidden="true">
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.host}>{hostOf(project.href)}</span>
          </div>
        )}
        <div className={styles.shot}>
          {isGallery ? (
            <div className={styles.mosaic} aria-hidden="true">
              {project.gallery.slice(0, 6).map((item) => (
                <img key={item.name} src={item.thumb} alt="" loading="lazy" width="640" height="360" />
              ))}
              <span className={styles.mosaicCount}>{project.gallery.length} designs</span>
            </div>
          ) : project.cover ? (
            <img
              src={project.cover}
              alt=""
              loading="lazy"
              width="1200"
              height="750"
              style={project.coverPosition ? { objectPosition: project.coverPosition } : undefined}
            />
          ) : (
            // no exported cover yet: title-slide style placeholder
            <div
              className={`${styles.slide} ${isBlue ? styles.slideBlue : styles.slideRed}`}
              aria-hidden="true"
            >
              <span className={styles.slideKicker}>{type.label}</span>
              <span className={styles.slideTitle}>{project.coverTitle ?? project.title}</span>
            </div>
          )}
          {opensEmbed && (
            <span className={styles.play} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="7,4 20,12 7,20" />
              </svg>
            </span>
          )}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.type}>{type.label}</span>
          {project.inProgress && (
            <span
              className={`${cardStyles.tag} ${isBlue ? cardStyles.tagBlue : cardStyles.tagRed}`}
            >
              IN PROGRESS
            </span>
          )}
        </div>

        <h3 className={cardStyles.title}>
          {opensLightbox ? (
            <button
              type="button"
              className={`${cardStyles.stretchedLink} ${styles.titleButton}`}
              onClick={() => onOpen(project)}
            >
              {project.title}
            </button>
          ) : (
            <a
              className={cardStyles.stretchedLink}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.title}
            </a>
          )}
        </h3>

        <span
          className={`${cardStyles.link} ${isBlue ? cardStyles.linkBlue : cardStyles.linkRed}`}
          aria-hidden="true"
        >
          {project.cta ?? type.cta}
        </span>
      </div>
    </article>
  );
}

export default function ProjectShowcase() {
  const [filter, setFilter] = useState('all');
  const [playing, setPlaying] = useState(null);
  const [gallery, setGallery] = useState(null);

  // chips only for types that actually have work in them
  const types = Object.keys(projectTypes).filter((t) => projects.some((p) => p.type === t));
  const visible = filter === 'all' ? projects : projects.filter((p) => p.type === filter);
  const count = (t) => (t === 'all' ? projects.length : projects.filter((p) => p.type === t).length);

  return (
    <section id="work" className={sectionStyles.section} aria-labelledby="work-heading">
      <div className="section-container">
        <div className={sectionStyles.header}>
          <span className="kicker">Selected work</span>
          <h2 id="work-heading" className={sectionStyles.heading}>
            Live projects
          </h2>
        </div>

        {types.length > 1 && (
          <div className={styles.filters} role="group" aria-label="Filter projects by type">
            {['all', ...types].map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.chip} ${filter === t ? styles.chipActive : ''}`}
                aria-pressed={filter === t}
                onClick={() => setFilter(t)}
              >
                {t === 'all' ? 'All' : projectTypes[t].label}
                <span className={styles.count}>{count(t)}</span>
              </button>
            ))}
          </div>
        )}

        <ul className={styles.grid}>
          {visible.map((project) => (
            <li key={project.id} className={styles.item}>
              <ProjectCard
                project={project}
                onOpen={project.gallery ? setGallery : setPlaying}
              />
            </li>
          ))}
        </ul>
      </div>

      <EmbedDialog video={playing} onClose={() => setPlaying(null)} />
      <GalleryDialog project={gallery} onClose={() => setGallery(null)} />
    </section>
  );
}
