import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    const firstLink = menuRef.current?.querySelector('a');
    firstLink?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <header className={styles.navbar}>
        <div className={`section-container ${styles.inner}`}>
          <Link to="/" className={styles.logo} onClick={() => setIsOpen(false)}>
            {siteConfig.shortName}
            <span className={styles.logoSub}>{siteConfig.role}</span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Primary">
            {siteConfig.navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.navActions}>
            <a className={styles.cta} href={`mailto:${siteConfig.email}`}>
              Let's talk
            </a>
            <button
              ref={toggleRef}
              type="button"
              className={styles.menuToggle}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsOpen((open) => !open)}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        // Rendered as a sibling of <header>, not a child: the navbar's
        // backdrop-filter creates a containing block for fixed-position
        // descendants in Chromium, which would collapse this menu's height.
        <nav
          id="mobile-menu"
          ref={menuRef}
          className={styles.mobileMenu}
          aria-label="Mobile"
        >
          {siteConfig.navItems.map((item) => (
            <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a
            className={styles.mobileCta}
            href={`mailto:${siteConfig.email}`}
            onClick={() => setIsOpen(false)}
          >
            Let's talk
          </a>
        </nav>
      )}
    </>
  );
}
