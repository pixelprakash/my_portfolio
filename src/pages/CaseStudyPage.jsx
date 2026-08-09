import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import BackButton from '../components/common/BackButton';
import NotFoundPage from './NotFoundPage';
import { getCaseStudyBySlug } from '../data/caseStudies';
import { useActiveSection } from '../hooks/useActiveSection';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { NAV_HEIGHT } from '../constants';
import styles from './CaseStudyPage.module.css';

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
              { label: 'Work', href: '/#work' },
              { label: study.title },
            ]}
          />
          <BackButton fallbackTo="/#work" label="Back to work" />
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
                {section.body.map((block, index) =>
                  block.type === 'list' ? (
                    <ul className={styles.bulletList} key={index}>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.paragraph} key={index}>
                      {block.text}
                    </p>
                  )
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
