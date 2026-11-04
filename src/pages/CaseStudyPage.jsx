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

    default:
      return <p className={styles.paragraph}>{block.text}</p>;
  }
}

export default function CaseStudyPage() {
  const { slug } = useParams();
  const study = getCaseStudyBySlug(slug);

  const sectionIds = study ? study.sections.map((section) => section.id) : [];
  const activeId = useActiveSection(sectionIds, { navHeight: NAV_HEIGHT });

  useDocumentHead({
    title: study?.title ?? 'Case study not found',
    description: study?.summary,
    path: study ? `/work/${study.slug}` : undefined,
  });

  if (!study) {
    return <NotFoundPage />;
  }

  const isBlue = study.accent === 'blue';

  return (
    <article className={styles.page}>
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
            <span className="kicker">Contents</span>
            <ul className={styles.sidebarList}>
              {study.sections.map((section) => {
                const isActive = section.id === activeId;
                return (
                  <li key={section.id}>
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
                );
              })}
            </ul>
          </nav>

          <div className={styles.content}>
            {study.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className={styles.section}
                aria-labelledby={`${section.id}-heading`}
              >
                <span className="kicker">{section.label}</span>
                <h2 id={`${section.id}-heading`} className={styles.sectionHeading}>
                  {section.heading}
                </h2>
                {section.body.map((block, index) => (
                  <Block block={block} key={index} />
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
