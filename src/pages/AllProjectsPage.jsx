import Breadcrumbs from '../components/common/Breadcrumbs';
import BackButton from '../components/common/BackButton';
import AllProjects from '../components/home/AllProjects';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { projects } from '../data/projects';
import { siteConfig } from '../data/siteConfig';
import styles from './AllProjectsPage.module.css';

export default function AllProjectsPage() {
  useDocumentHead({
    title: 'All projects',
    description: `Every project by ${siteConfig.name}: websites, app UX, branding, visual design, film and photography.`,
    path: '/work',
  });

  return (
    <div className={styles.page}>
      <div className="section-container">
        <div className={styles.topRow}>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'All projects' }]} />
          <BackButton fallbackTo="/#work" label="Back to selected work" />
        </div>

        <header className={styles.header}>
          <span className="kicker">Work</span>
          <h1 className={styles.title}>All projects</h1>
          <p className={styles.description}>
            Every project in one place: {projects.length} of them, grouped by discipline. Open any
            card to see it.
          </p>
        </header>

        <AllProjects />
      </div>
    </div>
  );
}
