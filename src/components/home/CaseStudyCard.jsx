import { Link } from 'react-router-dom';
import styles from './CaseStudyCard.module.css';

export default function CaseStudyCard({ study }) {
  const isBlue = study.accent === 'blue';

  return (
    <article className={`${styles.card} ${isBlue ? styles.cardBlue : styles.cardRed}`}>
      <div className={styles.top}>
        <span className={`${styles.tag} ${isBlue ? styles.tagBlue : styles.tagRed}`}>
          {study.tag}
        </span>
        <span className={styles.meta}>{study.timelineShort ?? study.timeline}</span>
      </div>

      <h3 className={styles.title}>
        <Link className={styles.stretchedLink} to={`/work/${study.slug}`}>
          {study.title}
        </Link>
      </h3>

      <p className={styles.summary}>{study.summary}</p>

      <span
        className={`${styles.link} ${isBlue ? styles.linkBlue : styles.linkRed}`}
        aria-hidden="true"
      >
        View case study →
      </span>
    </article>
  );
}
