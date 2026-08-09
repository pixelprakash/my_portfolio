import { caseStudies } from '../../data/caseStudies';
import CaseStudyCard from './CaseStudyCard';
import styles from './Works.module.css';

export default function Works() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-heading">
      <div className="section-container">
        <div className={styles.header}>
          <span className="kicker">Selected work</span>
          <h2 id="work-heading" className={styles.heading}>
            Case studies from both sides of the pill
          </h2>
          <p className={styles.description}>
            A mix of design and engineering projects — from user research to
            shipped code.
          </p>
        </div>

        <ul className={styles.grid}>
          {caseStudies.map((study) => (
            <li key={study.slug}>
              <CaseStudyCard study={study} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
