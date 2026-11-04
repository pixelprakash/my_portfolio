import { useState } from 'react';
import { Link } from 'react-router-dom';
import { featuredProjects, projects } from '../../data/projects';
import { EmbedDialog, ProjectCard } from './ProjectCard';
import Reveal from '../common/Reveal';
import sectionStyles from './Works.module.css';
import styles from './ProjectShowcase.module.css';

// Larger cards than the full list: two across on anything wider than a phone.
const FEATURED_SIZES = '(min-width: 1280px) 600px, (min-width: 700px) 46vw, 92vw';
// The lead card spans the full width, with its cover in the left 55%.
const LEAD_SIZES = '(min-width: 900px) 55vw, 92vw';

// The home page's work section: the projects picked to be looked at first, the
// first one as a wide lead card. Everything else is one click away on the
// all-projects page.
export default function FeaturedWork() {
  const [playing, setPlaying] = useState(null);

  return (
    <section id="work" className={sectionStyles.section} aria-labelledby="work-heading">
      <div className="section-container">
        <div className={styles.sectionTop}>
          <Reveal className={sectionStyles.header}>
            {/* the section's heading is just its label: small, but a real <h2> */}
            <h2 id="work-heading" className="kicker">
              Selected work
            </h2>
          </Reveal>

          <Link to="/work" className={styles.topLink}>
            All {projects.length} projects
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className={`${styles.grid} ${styles.gridFeatured}`}>
          {featuredProjects.map((project, index) => {
            const lead = index === 0;
            return (
              <Reveal
                as="li"
                key={project.id}
                // the cards after the lead pair up; stagger the right-hand one
                delay={lead ? 0 : ((index - 1) % 2) * 110}
                className={`${styles.item} ${lead ? styles.itemLead : ''}`}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  lead={lead}
                  sizes={lead ? LEAD_SIZES : FEATURED_SIZES}
                  onOpen={setPlaying}
                />
              </Reveal>
            );
          })}
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
