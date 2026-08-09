import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';
import styles from './Footer.module.css';

const contactRows = [
  { label: 'Mail', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { label: 'LinkedIn', value: 'View profile', href: siteConfig.social.linkedin },
  { label: 'GitHub', value: 'View profile', href: siteConfig.social.github },
  { label: 'Resume', value: 'Download PDF', href: siteConfig.resumeUrl },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className={styles.footer}>
      <div className="section-container">
        <h2 className={styles.heading}>Contact</h2>

        <div className={styles.rows}>
          {contactRows.map((row) => {
            const isExternal = row.href.startsWith('http');
            return (
              <div className={styles.row} key={row.label}>
                <span className={styles.label}>{row.label.toUpperCase()}</span>
                <a
                  className={styles.value}
                  href={row.href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {row.value}
                  <span className={styles.icon} aria-hidden="true">
                    ↗
                  </span>
                  {isExternal && <span className="visually-hidden"> (opens in a new tab)</span>}
                </a>
              </div>
            );
          })}
        </div>

        <div className={styles.bottom}>
          <nav className={styles.quickLinks} aria-label="Footer">
            {siteConfig.footerLinks.map((link) =>
              link.href.startsWith('http') ? (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              ) : (
                <Link key={link.label} to={link.href}>
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <p className={styles.meta}>
            <span>© {year} {siteConfig.name}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
