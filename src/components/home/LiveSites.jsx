import cardStyles from './CaseStudyCard.module.css';
import styles from './Works.module.css';

// Interim replacement for <Works />: just the two live sites, linking out
// to the real thing until the full case studies are written up.
const liveSites = [
  {
    title: '6th Mobile Studies Congress',
    href: 'https://www.6thmobilestudiescongress.org/',
    accent: 'blue',
  },
  {
    title: 'Prof. Deepak John Mathew Portfolio Site',
    href: 'https://djn.vercel.app/',
    accent: 'red',
  },
  {
    title: 'Ganesh Kumar Malthurkar Portfolio Site',
    href: 'https://ganeshmalthurkar.com/',
    accent: 'blue',
    inProgress: true,
  },
  {
    title: 'DIC · IITH — Design Innovation Centre Website',
    href: 'https://dic-site.vercel.app/',
    accent: 'red',
    inProgress: true,
  },
];

export default function LiveSites() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-heading">
      <div className="section-container">
        <div className={styles.header}>
          <span className="kicker">Selected work</span>
          <h2 id="work-heading" className={styles.heading}>
            Live projects
          </h2>
        </div>

        <ul className={styles.grid}>
          {liveSites.map((site) => {
            const isBlue = site.accent === 'blue';
            return (
              <li key={site.href}>
                <article
                  className={`${cardStyles.card} ${isBlue ? cardStyles.cardBlue : cardStyles.cardRed}`}
                >
                  {site.inProgress && (
                    <span
                      className={`${cardStyles.tag} ${isBlue ? cardStyles.tagBlue : cardStyles.tagRed}`}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      IN PROGRESS
                    </span>
                  )}
                  <h3 className={cardStyles.title}>
                    <a
                      className={cardStyles.stretchedLink}
                      href={site.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {site.title}
                    </a>
                  </h3>
                  <span
                    className={`${cardStyles.link} ${isBlue ? cardStyles.linkBlue : cardStyles.linkRed}`}
                    aria-hidden="true"
                  >
                    Visit site ↗
                  </span>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
