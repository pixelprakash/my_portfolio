import { useState } from 'react';
import { disciplines, projects, projectTypes } from '../../data/projects';
import GalleryDialog from './GalleryDialog';
import { EmbedDialog, ProjectCard } from './ProjectCard';
import styles from './ProjectShowcase.module.css';

const TYPE_ORDER = Object.keys(projectTypes);

// The full list of work, grouped by discipline (design, development, craft)
// with filter chips. Lives on the all-projects page.
export default function AllProjects() {
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
    <div>
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
            <h2 id={`work-group-${group.key}`} className={styles.groupTitle}>
              {group.label}
            </h2>
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

      <EmbedDialog video={playing} onClose={() => setPlaying(null)} />
      <GalleryDialog project={gallery} onClose={() => setGallery(null)} />
    </div>
  );
}
