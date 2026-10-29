import { about } from '../../data/about';
import { siteConfig } from '../../data/siteConfig';
import Reveal from '../common/Reveal';
import styles from './About.module.css';

// "**bold**" markers in the config labels, rendered as <strong>.
function Emphasis({ text }) {
  return text
    .split('**')
    .map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

function PersonaCard({ accent, title, years, label, now, tools }) {
  return (
    <div className={`${styles.persona} ${accent === 'blue' ? styles.personaBlue : styles.personaRed}`}>
      <div className={styles.personaTop}>
        <h3 className={styles.personaTitle}>{title}</h3>
        <p className={styles.years}>
          <span className={styles.yearsNum}>{years}</span>
          <span className={styles.yearsUnit}>yrs</span>
        </p>
      </div>
      <p className={styles.personaLabel}>
        <Emphasis text={label} />
      </p>
      {now && (
        <p className={styles.now}>
          <span className={styles.nowTag}>Now</span>
          <span>
            <strong>{now.role}</strong> · {now.at}
          </span>
        </p>
      )}
      <ul className={styles.tools} aria-label={`${title} tools`}>
        {tools.map((tool) => (
          <li key={tool}>{tool}</li>
        ))}
      </ul>
    </div>
  );
}

export default function About() {
  const { design, development } = siteConfig.experience;

  return (
    <section id="about" className={styles.section} aria-labelledby="about-heading">
      <div className="section-container">
        <Reveal className={styles.header}>
          <span className="kicker">About</span>
          <h2 id="about-heading" className={styles.heading}>
            {about.heading} <span className="text-gradient">{about.headingAccent}</span>
          </h2>
        </Reveal>

        <div className={styles.layout}>
          <div className={styles.story}>
            <Reveal className={styles.intro}>
              {about.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>

            <Reveal delay={90}>
              <ol className={styles.principles}>
                {about.principles.map((principle, index) => (
                  <li key={principle.title} className={styles.principle}>
                    <span className={styles.number} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className={styles.principleTitle}>{principle.title}</h3>
                      <p className={styles.principleText}>{principle.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={150} className={styles.actions}>
              {about.resumeHref && (
                <a className={styles.primary} href={about.resumeHref} download>
                  Download resume
                </a>
              )}
              <a className={styles.secondary} href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
              <a className={styles.secondary} href={siteConfig.social.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            </Reveal>
          </div>

          <div className={styles.personas}>
            <Reveal delay={60}>
              <PersonaCard
                accent="blue"
                title="Design"
                years={design.years}
                label={design.label}
                now={design.now}
                tools={about.tools.design}
              />
            </Reveal>
            <Reveal delay={140}>
              <PersonaCard
                accent="red"
                title="Development"
                years={development.years}
                label={development.label}
                tools={about.tools.development}
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
