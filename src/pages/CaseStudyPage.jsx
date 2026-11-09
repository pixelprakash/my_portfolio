import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import BackButton from '../components/common/BackButton';
import NotFoundPage from './NotFoundPage';
import { getCaseStudyBySlug } from '../data/caseStudies';
import { useActiveSection } from '../hooks/useActiveSection';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { NAV_HEIGHT } from '../constants';
import styles from './CaseStudyPage.module.css';

// A section's body is a list of blocks:
//   { type: 'paragraph', text }
//   { type: 'list', items: [string | { lead, text }] }   (lead is shown in bold)
//   { type: 'table', caption, head: [...], rows: [[...]] }
//   { type: 'figure', src, alt, caption, width, height, narrow? }
//   { type: 'note', label?, text }                        (a caveat worth setting apart)
//   { type: 'stats', items: [{ value, label }] }          (big numbers)
//   { type: 'steps', items: [{ title, text, part? }] }    (a numbered journey; part = 'design' | 'engineering' adds a link chip)
//   { type: 'cards', items: [{ kicker, title, text, points?, href, linkLabel, accent? }] }  (large link cards)
// A case study can also be split into parts: study.parts holds each part's banner
// ({ number, kicker, name, blurb, accent }); a section joins one with section.part,
// and section.group names its heading in the contents list.
function Block({ block }) {
  switch (block.type) {
    case 'list':
      return (
        <ul className={styles.bulletList}>
          {block.items.map((item) => {
            const lead = typeof item === 'string' ? null : item.lead;
            const text = typeof item === 'string' ? item : item.text;
            return (
              <li key={lead ?? text}>
                {lead && <strong className={styles.lead}>{lead} </strong>}
                {text}
              </li>
            );
          })}
        </ul>
      );

    case 'table':
      return (
        <div className={styles.tableBlock}>
          {block.caption && <p className={styles.tableCaption}>{block.caption}</p>}
          <table className={styles.table}>
            <thead>
              <tr>
                {block.head.map((heading) => (
                  <th key={heading} scope="col">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={block.head[i]} scope="row">
                        {cell}
                      </th>
                    ) : (
                      // data-label lets the stacked phone layout name each cell
                      <td key={block.head[i]} data-label={block.head[i]}>
                        {cell}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'figure':
      return (
        <figure className={`${styles.figure} ${block.narrow ? styles.figureNarrow : ''}`}>
          <img
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading="lazy"
            decoding="async"
          />
          {block.caption && <figcaption className={styles.figcaption}>{block.caption}</figcaption>}
        </figure>
      );

    case 'note':
      return (
        <p className={styles.note}>
          {block.label && <strong className={styles.lead}>{block.label} </strong>}
          {block.text}
        </p>
      );

    case 'stats':
      return (
        <ul className={styles.stats}>
          {block.items.map((item) => (
            <li key={item.label} className={styles.stat}>
              <span className={styles.statValue}>{item.value}</span>
              <span className={styles.statLabel}>{item.label}</span>
            </li>
          ))}
        </ul>
      );

    case 'steps':
      return (
        <ol className={styles.steps}>
          {block.items.map((item, i) => (
            <li key={item.title} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={styles.stepBody}>
                <p className={styles.stepTitle}>{item.title}</p>
                <p className={styles.stepText}>{item.text}</p>
                {item.part && (
                  <p className={styles.stepParts}>
                    {[].concat(item.part).map((part) => (
                      <a
                        key={part}
                        href={`#part-${part}`}
                        className={`${styles.chip} ${part === 'design' ? styles.chipBlue : styles.chipRed}`}
                      >
                        {part === 'design' ? 'Design' : 'Engineering'} →
                      </a>
                    ))}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      );

    case 'cards':
      return (
        <ul className={styles.partCards}>
          {block.items.map((item) => (
            <li key={item.title}>
              <a
                href={item.href}
                className={`${styles.partCard} ${item.accent === 'red' ? styles.partCardRed : styles.partCardBlue}`}
              >
                <span className={styles.partCardKicker}>{item.kicker}</span>
                <span className={styles.partCardTitle}>{item.title}</span>
                <span className={styles.partCardText}>{item.text}</span>
                {item.points && (
                  <span className={styles.partCardPoints}>
                    {item.points.map((point) => (
                      <span key={point}>{point}</span>
                    ))}
                  </span>
                )}
                <span className={styles.partCardLink}>{item.linkLabel} →</span>
              </a>
            </li>
          ))}
        </ul>
      );

    default:
      return <p className={styles.paragraph}>{block.text}</p>;
  }
}

// ── Parts ──
// A split case study (study.parts) shows one part at a time, chosen with a
// switch. Overview and outcome sections are always visible; the sections of
// each part live in a panel, and the inactive panel is hidden "until found" so
// browsers that support it still reveal it on a Find-in-page match.

const firstPart = (study) => Object.keys(study.parts)[0];

// Which part a #hash points at: a part itself, or any section inside one.
function partFromHash(study) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return firstPart(study);
  if (id.startsWith('part-') && study.parts[id.slice(5)]) return id.slice(5);
  return study.sections.find((section) => section.id === id)?.part ?? firstPart(study);
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll to a section (or to the switch, for a part's id) once the panel that
// holds it is showing: two frames, so React has rendered and laid it out.
function scrollToId(id, smooth = true) {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const target = document.getElementById(id.startsWith('part-') ? 'parts' : id);
      if (!target) return;
      target.setAttribute('tabindex', '-1');
      target.scrollIntoView({ behavior: smooth && !reducedMotion() ? 'smooth' : 'auto', block: 'start' });
      target.focus({ preventScroll: true });
    })
  );
}

function SectionView({ section, inPart }) {
  // inside a part the banner is the h2, so its sections are h3s
  const Heading = inPart ? 'h3' : 'h2';
  return (
    <section
      id={section.id}
      className={styles.section}
      aria-labelledby={`${section.id}-heading`}
    >
      <span className="kicker">{section.label}</span>
      <Heading id={`${section.id}-heading`} className={styles.sectionHeading}>
        {section.heading}
      </Heading>
      {section.body.map((block, i) => (
        <Block block={block} key={i} />
      ))}
    </section>
  );
}

// The banner that opens each part of a split case study.
function PartBanner({ id, part }) {
  return (
    <div
      className={`${styles.partBanner} ${part.accent === 'red' ? styles.partRed : styles.partBlue}`}
      role="group"
      aria-labelledby={`${id}-title`}
    >
      <span className={styles.partNumber} aria-hidden="true">
        {part.number}
      </span>
      <div>
        <span className="kicker">{part.kicker}</span>
        <h2 id={`${id}-title`} className={styles.partTitle}>
          {part.name}
        </h2>
        <p className={styles.partBlurb}>{part.blurb}</p>
      </div>
    </div>
  );
}

// The switch between the parts. Large: a proper tab control above the panels.
// Compact: a pair of toggle buttons that stays with the contents list.
function PartSwitch({ parts, counts, active, onSelect, compact = false }) {
  const keys = Object.keys(parts);

  if (compact) {
    return (
      <div className={styles.miniSwitch} role="group" aria-label="Part of the case study">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            className={styles.miniTab}
            data-part={key}
            data-sound="toggle"
            aria-pressed={key === active}
            onClick={() => onSelect(key)}
          >
            {parts[key].name}
          </button>
        ))}
      </div>
    );
  }

  // arrow keys, Home and End move between tabs, as in any tab control
  function onKeyDown(event) {
    const at = keys.indexOf(active);
    let next = null;
    if (event.key === 'ArrowRight') next = keys[(at + 1) % keys.length];
    if (event.key === 'ArrowLeft') next = keys[(at - 1 + keys.length) % keys.length];
    if (event.key === 'Home') next = keys[0];
    if (event.key === 'End') next = keys[keys.length - 1];
    if (!next) return;
    event.preventDefault();
    onSelect(next);
    document.getElementById(`tab-${next}`)?.focus();
  }

  return (
    <div
      className={styles.switch}
      data-active={active}
      role="tablist"
      aria-label="Choose a part of the case study"
      onKeyDown={onKeyDown}
    >
      <span className={styles.switchThumb} aria-hidden="true" />
      {keys.map((key) => (
        <button
          key={key}
          id={`tab-${key}`}
          type="button"
          role="tab"
          className={styles.switchTab}
          data-sound="toggle"
          aria-selected={key === active}
          aria-controls={`panel-${key}`}
          tabIndex={key === active ? 0 : -1}
          onClick={() => onSelect(key)}
        >
          <span className={styles.switchKicker}>{parts[key].kicker}</span>
          <span className={styles.switchName}>{parts[key].name}</span>
          <span className={styles.switchMeta}>
            {parts[key].tagline} · {counts[key]} sections
          </span>
        </button>
      ))}
    </div>
  );
}

function PartsArea({ study, active, counts, onSelect, onReveal }) {
  const keys = Object.keys(study.parts);
  const panels = useRef({});
  const reveal = useRef(onReveal);
  useEffect(() => {
    reveal.current = onReveal;
  });

  // React has no support for hidden="until-found", so the inactive panel gets it
  // here: hidden from view, yet still found by the browser's Find in page
  useLayoutEffect(() => {
    Object.entries(panels.current).forEach(([key, panel]) => {
      if (!panel) return;
      if (key === active) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', 'until-found');
    });
  }, [active]);

  // a browser that reveals a hidden-until-found panel (Find in page, a link to
  // something inside it) tells us here, so the switch follows
  useEffect(() => {
    const cleanups = Object.keys(study.parts).map((key) => {
      const panel = panels.current[key];
      if (!panel) return undefined;
      // only show the panel: the address keeps pointing at whatever was found
      const show = () => reveal.current(key);
      panel.addEventListener('beforematch', show);
      return () => panel.removeEventListener('beforematch', show);
    });
    return () => cleanups.forEach((cleanup) => cleanup?.());
  }, [study.parts]);

  return (
    <div id="parts" className={styles.partsArea}>
      <span className="kicker">Two parts</span>
      <p className={styles.partsIntro}>
        One story, told twice: first what we designed and why, then how it is built. Pick one; you
        can switch at any time.
      </p>
      <PartSwitch parts={study.parts} counts={counts} active={active} onSelect={onSelect} />

      {keys.map((key, i) => {
        const part = study.parts[key];
        const prev = study.parts[keys[i - 1]];
        const next = study.parts[keys[i + 1]];
        return (
          <div
            key={key}
            id={`panel-${key}`}
            ref={(element) => {
              panels.current[key] = element;
            }}
            role="tabpanel"
            aria-labelledby={`tab-${key}`}
            className={styles.partPanel}
          >
            <PartBanner id={`banner-${key}`} part={part} />
            {study.sections
              .filter((section) => section.part === key)
              .map((section) => (
                <SectionView key={section.id} section={section} inPart />
              ))}

            <div className={styles.partNav}>
              {prev && (
                <button
                  type="button"
                  className={styles.partPrev}
                  data-sound="toggle"
                  onClick={() => onSelect(keys[i - 1])}
                >
                  ← {prev.kicker}: {prev.name}
                </button>
              )}
              {next ? (
                <button
                  type="button"
                  className={styles.partNext}
                  data-sound="toggle"
                  onClick={() => onSelect(keys[i + 1])}
                >
                  Next, {next.kicker}: {next.name} →
                </button>
              ) : (
                <a className={styles.partNext} href="#evidence">
                  On to the evidence ↓
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CaseStudyPage() {
  const { slug } = useParams();
  const study = getCaseStudyBySlug(slug);
  const hasParts = Boolean(study?.parts);

  // The part being read. Remembered with its slug, so moving to another case
  // study starts fresh from that page's own hash.
  const [choice, setChoice] = useState({ slug: null, part: null });
  const activePart = hasParts
    ? choice.slug === slug
      ? choice.part
      : partFromHash(study)
    : null;

  const visibleSections = study
    ? study.sections.filter((section) => !section.part || section.part === activePart)
    : [];
  const sectionIds = visibleSections.map((section) => section.id);
  const activeId = useActiveSection(sectionIds, { navHeight: NAV_HEIGHT });

  useDocumentHead({
    title: study?.title ?? 'Case study not found',
    description: study?.summary,
    path: study ? `/work/${study.slug}` : undefined,
  });

  // Go to a section or a part: switch to its part if it is in one, keep the
  // #hash in the address (so a link to it works), and scroll to it once the
  // right panel is showing.
  function goTo(id, { scroll = true } = {}) {
    if (!study?.parts) return;
    const isPart = id.startsWith('part-');
    const partKey = isPart ? id.slice(5) : study.sections.find((s) => s.id === id)?.part;
    if (partKey && study.parts[partKey]) setChoice({ slug: study.slug, part: partKey });
    window.history.replaceState(window.history.state, '', `#${id}`);
    if (scroll) scrollToId(id);
  }

  // a part that has to be showing because something inside it was found or linked to
  function showPart(key) {
    setChoice({ slug: study.slug, part: key });
  }

  function selectPart(key, options) {
    goTo(`part-${key}`, options);
  }

  // The address can change on its own (a typed link, the back and forward
  // buttons), and a page can open on a #section inside a part that is not
  // showing yet: show that part, then scroll to the section.
  useEffect(() => {
    if (!study?.parts) return undefined;
    const arrive = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      setChoice({ slug: study.slug, part: partFromHash(study) });
      if (id) scrollToId(id, false);
    };
    if (window.location.hash) arrive();
    window.addEventListener('hashchange', arrive);
    return () => window.removeEventListener('hashchange', arrive);
  }, [study]);

  // Links to #something inside a split case study (the contents list, the
  // chips and cards in the text) go through goTo, so they can open the right part.
  function handleClick(event) {
    if (!hasParts || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest?.('a[href^="#"]');
    const id = anchor && decodeURIComponent(anchor.getAttribute('href').slice(1));
    if (!id) return;
    event.preventDefault();
    goTo(id);
  }

  if (!study) {
    return <NotFoundPage />;
  }

  const isBlue = study.accent === 'blue';
  const counts = hasParts
    ? Object.fromEntries(
        Object.keys(study.parts).map((key) => [
          key,
          study.sections.filter((section) => section.part === key).length,
        ])
      )
    : {};
  const firstPartIndex = study.sections.findIndex((section) => section.part);

  return (
    <article className={styles.page} onClick={handleClick}>
      <div className="section-container">
        <div className={styles.topRow}>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'All projects', href: '/work' },
              { label: study.title },
            ]}
          />
          <BackButton fallbackTo="/work" label="Back to all projects" />
        </div>

        <header className={styles.header}>
          <span className={`${styles.tag} ${isBlue ? styles.tagBlue : styles.tagRed}`}>
            {study.tag}
          </span>
          <h1 className={styles.title}>{study.title}</h1>
          <p className={styles.summary}>{study.summary}</p>

          <dl className={styles.metaList}>
            <div>
              <dt className={styles.metaLabel}>Role</dt>
              <dd className={styles.metaValue}>{study.role}</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Timeline</dt>
              <dd className={styles.metaValue}>{study.timeline}</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Tools</dt>
              <dd className={styles.metaValue}>{study.tools.join(', ')}</dd>
            </div>
          </dl>

          {study.facts && (
            <dl className={styles.factList}>
              {study.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className={styles.metaLabel}>{fact.label}</dt>
                  <dd className={styles.factValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        <div className={styles.layout}>
          <nav className={styles.sidebar} aria-label="Case study contents">
            <span className={`kicker ${hasParts ? styles.sidebarKicker : ''}`}>Contents</span>
            {hasParts && (
              <PartSwitch
                compact
                parts={study.parts}
                counts={counts}
                active={activePart}
                onSelect={selectPart}
              />
            )}
            <ul className={styles.sidebarList}>
              {visibleSections.map((section, index) => {
                const isActive = section.id === activeId;
                // a heading in the list whenever a new group starts
                const startsGroup =
                  section.group && section.group !== visibleSections[index - 1]?.group;
                return (
                  <Fragment key={section.id}>
                    {startsGroup && <li className={styles.sidebarGroup}>{section.group}</li>}
                    <li>
                      <a
                        href={`#${section.id}`}
                        className={`${styles.sidebarLink} ${
                          isActive ? styles.sidebarLinkActive : ''
                        }`}
                        aria-current={isActive ? 'location' : undefined}
                      >
                        {section.label}
                      </a>
                    </li>
                  </Fragment>
                );
              })}
            </ul>
          </nav>

          <div className={styles.content}>
            {study.sections.map((section, index) => {
              if (!section.part) return <SectionView key={section.id} section={section} />;
              // the parts are shown together, once, where the first one starts
              if (index !== firstPartIndex) return null;
              return (
                <PartsArea
                  key="parts"
                  study={study}
                  active={activePart}
                  counts={counts}
                  onSelect={selectPart}
                  onReveal={showPart}
                />
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
