import { useState } from 'react';
import { Link } from 'react-router-dom';
import { featuredProjects, projects } from '../../data/projects';
import { EmbedDialog, ProjectCard } from './ProjectCard';
import sectionStyles from './Works.module.css';
import styles from './ProjectShowcase.module.css';

// Larger cards than the full list: two across on anything wider than a phone.
const FEATURED_SIZES = '(min-width: 1280px) 600px, (min-width: 700px) 46vw, 92vw';

// The home page's work section: four projects, picked to be looked at first.
// Everything else is one click away on the all-projects page.
export default function FeaturedWork() {
  const [playing, setPlaying] = useState(null);

  return (
    <section id="work" className={sectionStyles.section} aria-labelledby="work-heading">
      <div className="section-container">
        <div className={sectionStyles.header}>
          <span className="kicker">Selected work</span>
          <h2 id="work-heading" className={sectionStyles.heading}>
            Four projects to start with
          </h2>
          <p className={sectionStyles.description}>
            The ones I&apos;d show first. Everything else, from branding to film, is on the
            all-projects page.
          </p>
        </div>

        <ul className={`${styles.grid} ${styles.gridFeatured}`}>
          {featuredProjects.map((project, index) => (
            <li key={project.id} className={styles.item}>
              <ProjectCard
                project={project}
                index={index}
                sizes={FEATURED_SIZES}
                onOpen={setPlaying}
              />
            </li>
          ))}
        </ul>

        <div className={styles.allRow}>
          <Link to="/work" className={styles.allLink}>
            View all {projects.length} projects
            <span aria-hidden="true">→</span>
          </Link>
          <p className={styles.allNote}>Websites, UX, branding, visual design, film and photography.</p>
        </div>
      </div>

      <EmbedDialog video={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}
