import { useEffect, useRef, useState } from 'react';
import { disciplines, projects, projectTypes } from '../../data/projects';
import GalleryDialog from './GalleryDialog';
import cardStyles from './CaseStudyCard.module.css';
import sectionStyles from './Works.module.css';
import styles from './ProjectShowcase.module.css';

// blue / red / mix (craft sits between the two): one class per accent
const ACCENT = {
  blue: { card: cardStyles.cardBlue, tag: cardStyles.tagBlue, link: cardStyles.linkBlue, slide: styles.slideBlue },
  red: { card: cardStyles.cardRed, tag: cardStyles.tagRed, link: cardStyles.linkRed, slide: styles.slideRed },
  mix: { card: styles.cardMix, tag: styles.tagMix, link: styles.linkMix, slide: styles.slideMix },
};

const TYPE_ORDER = Object.keys(projectTypes);

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
            <button
              type="button"
              className={styles.dialogClose}
              data-sound="none"
              onClick={onClose}
            >
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
  const type = projectTypes[project.type];
  const accent = ACCENT[disciplines[type.discipline].accent];
  // video + presentations open in a lightbox; websites link out
  const opensEmbed = Boolean(project.videoId || project.embed);
  const isGallery = Boolean(project.gallery);
  const opensLightbox = opensEmbed || isGallery;

  return (
    <article
      className={`${cardStyles.card} ${styles.card} ${accent.card}`}
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
              className={`${styles.slide} ${accent.slide}`}
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
            <span className={`${cardStyles.tag} ${accent.tag}`}>IN PROGRESS</span>
          )}
        </div>

        <h4 className={`${cardStyles.title} ${styles.title}`}>
          {opensLightbox ? (
            <button
              type="button"
              className={`${cardStyles.stretchedLink} ${styles.titleButton}`}
              data-sound="open"
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
        </h4>

        {project.summary && <p className={styles.summary}>{project.summary}</p>}

        {/* The same facts on every card, whatever the source of the work */}
        <div className={styles.facts}>
          <p className={styles.role}>
            {project.role}
            {project.year && <span className={styles.year}> · {project.year}</span>}
          </p>
          {project.tools && (
            <ul className={styles.tools} aria-label="Tools">
              {project.tools.slice(0, 3).map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          )}
        </div>

        <span className={`${cardStyles.link} ${accent.link}`} aria-hidden="true">
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

  // one group per discipline that actually has work in it
  const groups = Object.entries(disciplines)
    .map(([key, discipline]) => ({
      key,
      ...discipline,
      // cards follow the order of the types in projectTypes (a stable sort,
      // so projects of one type keep the order they have in the data file)
      items: projects
        .filter((p) => projectTypes[p.type].discipline === key)
        .sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type)),
    }))
    .filter((group) => group.items.length);
  const visibleGroups = filter === 'all' ? groups : groups.filter((group) => group.key === filter);

  return (
    <section id="work" className={sectionStyles.section} aria-labelledby="work-heading">
      <div className="section-container">
        <div className={sectionStyles.header}>
          <span className="kicker">Selected work</span>
          <h2 id="work-heading" className={sectionStyles.heading}>
            Where design meets code
          </h2>
          <p className={sectionStyles.description}>
            Brand, UX and visual design on one side, websites built end to end on the other, and
            film and photography in between. Open any card to see it.
          </p>
        </div>

        <div className={styles.filters} role="group" aria-label="Filter work by discipline">
          {[{ key: 'all', label: 'All', count: projects.length }, ...groups].map((group) => (
            <button
              key={group.key}
              type="button"
              className={`${styles.chip} ${filter === group.key ? styles.chipActive : ''}`}
              aria-pressed={filter === group.key}
              onClick={() => setFilter(group.key)}
            >
              {group.key !== 'all' && (
                <span className={`${styles.dot} ${styles[`dot_${group.accent}`]}`} aria-hidden="true" />
              )}
              {group.label}
              <span className={styles.count}>{group.count ?? group.items.length}</span>
            </button>
          ))}
        </div>

        {visibleGroups.map((group) => (
          <div
            key={group.key}
            className={`${styles.group} ${styles[`group_${group.accent}`]}`}
            role="group"
            aria-labelledby={`work-group-${group.key}`}
          >
            <div className={styles.groupHeader}>
              <h3 id={`work-group-${group.key}`} className={styles.groupTitle}>
                {group.label}
              </h3>
              <span className={styles.groupCount}>{String(group.items.length).padStart(2, '0')}</span>
              <p className={styles.groupBlurb}>{group.blurb}</p>
            </div>

            <ul className={styles.grid}>
              {group.items.map((project) => (
                <li key={project.id} className={styles.item}>
                  <ProjectCard
                    project={project}
                    onOpen={project.gallery ? setGallery : setPlaying}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <EmbedDialog video={playing} onClose={() => setPlaying(null)} />
      <GalleryDialog project={gallery} onClose={() => setGallery(null)} />
    </section>
  );
}
