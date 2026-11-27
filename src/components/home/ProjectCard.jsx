import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { disciplines, projectTypes } from '../../data/projects';
import { getCaseStudyBySlug } from '../../data/caseStudies';
import { lockAgain, lockWords, useUnlocked } from '../../lib/lock';
import { useUiVersion } from '../../lib/uiVersion';
import LockDialog, { LockIcon } from './LockDialog';
import cardStyles from './CaseStudyCard.module.css';
import styles from './ProjectShowcase.module.css';

// blue / red / mix (craft sits between the two): one class per accent
const ACCENT = {
  blue: { card: `${cardStyles.cardBlue} ${styles.toneBlue}`, tag: cardStyles.tagBlue, link: cardStyles.linkBlue, slide: styles.slideBlue },
  red: { card: `${cardStyles.cardRed} ${styles.toneRed}`, tag: cardStyles.tagRed, link: cardStyles.linkRed, slide: styles.slideRed },
  mix: { card: `${styles.cardMix} ${styles.toneMix}`, tag: styles.tagMix, link: styles.linkMix, slide: styles.slideMix },
};

// A soft light follows the pointer across the card (mouse only). The position
// goes straight into CSS variables, so moving the mouse never re-renders.
function trackPointer(event) {
  if (event.pointerType === 'touch') return;
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  event.currentTarget.style.setProperty('--mx', `${x}px`);
  event.currentTarget.style.setProperty('--my', `${y}px`);
  // the same point from the centre, -0.5 to 0.5, for v2's tilting laptops
  event.currentTarget.style.setProperty('--tx', (x / rect.width - 0.5).toFixed(3));
  event.currentTarget.style.setProperty('--ty', (y / rect.height - 0.5).toFixed(3));
}

// Each cover has a 600w and a 1200w WebP next to the JPG (see public/work):
// phones get the small one, and the JPG stays as the plain `src` fallback.
// A cover marked `coverHd` has a third, 1800w tier for sharp (retina) screens.
function coverSrcSet(cover, hd) {
  const base = cover.replace(/\.jpg$/, '');
  return hd
    ? `${base}-600.webp 700w, ${base}-1200.webp 1200w, ${base}.webp 1800w`
    : `${base}-600.webp 600w, ${base}.webp 1200w`;
}
const COVER_SIZES = '(min-width: 1100px) 380px, (min-width: 640px) 46vw, 92vw';

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

export function EmbedDialog({ video, onClose }) {
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

// A card's second way in: the story behind a site whose card opens the site
// itself. Until the case study is written it only says so, and leads nowhere.
function CaseStudyButton({ slug, title }) {
  if (!getCaseStudyBySlug(slug)) {
    return (
      <span className={`${styles.studyButton} ${styles.studySoon}`} data-skin="study-soon">
        Case study <span className={styles.soonTag}>Soon</span>
      </span>
    );
  }
  return (
    <Link className={styles.studyButton} data-skin="pill-primary" to={`/work/${slug}`}>
      Case study <span aria-hidden="true">→</span>
      <span className="visually-hidden">: {title}</span>
    </Link>
  );
}

export function ProjectCard({ project: listed, onOpen, index, lead = false, sizes = COVER_SIZES }) {
  // NDA projects carry no link, screenshot or description in the page: those
  // come from the encrypted file, once the visitor has the password.
  const unlocked = useUnlocked(listed.lockId);
  const isNda = Boolean(listed.lockId);
  const locked = isNda && !unlocked;
  const project = unlocked ? { ...listed, ...unlocked } : listed;
  const [asking, setAsking] = useState(false);
  const words = lockWords(listed);

  const type = projectTypes[project.type];
  const accent = ACCENT[disciplines[type.discipline].accent];
  // v2 shows a cut-out device on a lit stage, where a project has one. The
  // mock-up draws its own browser bar, so the card's frame is left off.
  const version = useUiVersion();
  const stage = version === 'v2' && !locked ? project.stage : undefined;
  const studySlug = version === 'v2' && !locked ? project.caseStudyButton : undefined;
  // video + presentations open in a lightbox; websites link out
  const opensEmbed = Boolean(project.videoId || project.embed);
  const isGallery = Boolean(project.gallery);
  const opensLightbox = opensEmbed || isGallery;

  return (
    <article
      onPointerMove={trackPointer}
      data-skin="card"
      // a project with its own colours (a lit stage, or a theme) glows in them
      data-themed={stage || project.theme ? '' : undefined}
      style={
        stage || project.theme
          ? { '--stage-light': (stage ?? project.theme).light, '--stage-accent': (stage ?? project.theme).accent }
          : undefined
      }
      className={`${cardStyles.card} ${styles.card} ${accent.card} ${lead ? styles.cardLead : ''}`}
    >
      <div className={`${styles.cover} ${opensLightbox ? styles.coverVideo : ''}`} data-skin="card-cover" data-stage={stage ? '' : undefined}>
        {type.frame === 'browser' && !stage && (
          <div className={styles.chrome} data-skin="card-chrome" aria-hidden="true">
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.host}>{locked ? words.host : hostOf(project.href)}</span>
          </div>
        )}
        <div className={styles.shot} data-skin="card-shot">
          {isGallery ? (
            <div className={styles.mosaic} aria-hidden="true">
              {project.gallery.slice(0, 6).map((item) => (
                <img key={item.name} src={item.thumb} alt="" loading="lazy" width="640" height="360" />
              ))}
              <span className={styles.mosaicCount}>{project.gallery.length} designs</span>
            </div>
          ) : locked ? (
            // no screenshot at all while locked: a placeholder, not a blurred copy
            <div className={`${styles.slide} ${accent.slide} ${styles.lockedCover}`} data-skin="card-slide" aria-hidden="true">
              <span className={styles.lockMark}>
                <LockIcon size={34} />
              </span>
              <span className={styles.slideKicker}>{words.kicker}</span>
              <span className={styles.slideTitle}>{project.title}</span>
            </div>
          ) : stage ? (
            <img data-skin="stage-device" src={stage.image} alt="" loading="lazy" width="2000" height="1485" />
          ) : project.cover ? (
            <img
              src={project.cover}
              // the unlocked screenshot is an inline image, so no responsive set
              srcSet={
                project.cover.startsWith('data:')
                  ? undefined
                  : (project.coverSet ?? coverSrcSet(project.cover, project.coverHd))
              }
              sizes={sizes}
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
              data-skin="card-slide"
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
          <span className={styles.type}>
            {index !== undefined && (
              <span className={styles.index} data-skin="card-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
            {type.label}
          </span>
          <span className={styles.tags}>
            {isNda && (
              <span className={`${cardStyles.tag} ${accent.tag} ${styles.ndaTag}`}>
                <LockIcon size={11} /> {words.tag}
              </span>
            )}
            {project.inProgress && (
              <span className={`${cardStyles.tag} ${accent.tag}`}>IN PROGRESS</span>
            )}
          </span>
        </div>

        <h3 className={`${cardStyles.title} ${styles.title}`} data-skin="card-title">
          {locked ? (
            <button
              type="button"
              className={`${cardStyles.stretchedLink} ${styles.titleButton}`}
              data-sound="open"
              onClick={() => setAsking(true)}
            >
              {project.title}
            </button>
          ) : opensLightbox ? (
            <button
              type="button"
              className={`${cardStyles.stretchedLink} ${styles.titleButton}`}
              data-sound="open"
              onClick={() => onOpen(project)}
            >
              {project.title}
            </button>
          ) : project.caseStudy ? (
            <Link className={cardStyles.stretchedLink} to={`/work/${project.caseStudy}`}>
              {project.title}
            </Link>
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

        {unlocked && (
          <button
            type="button"
            className={styles.relock}
            data-sound="none"
            onClick={() => lockAgain(listed.lockId)}
          >
            <LockIcon size={13} /> Lock again
          </button>
        )}

        {studySlug ? (
          <div className={styles.actionRow}>
            <span data-skin="card-link" className={`${cardStyles.link} ${accent.link}`} aria-hidden="true">
              {locked ? 'Unlock with password' : (project.cta ?? type.cta)}
            </span>
            <CaseStudyButton slug={studySlug} title={project.title} />
          </div>
        ) : (
          <span data-skin="card-link" className={`${cardStyles.link} ${accent.link}`} aria-hidden="true">
            {locked ? 'Unlock with password' : (project.cta ?? type.cta)}
          </span>
        )}
      </div>

      {isNda && (locked || asking) && (
        <LockDialog project={listed} open={asking} onClose={() => setAsking(false)} />
      )}
    </article>
  );
}
