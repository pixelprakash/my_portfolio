import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SoundToggle from '../common/SoundToggle';
import { siteConfig } from '../../data/siteConfig';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { NAV_HEIGHT } from '../../constants';
import styles from './Navbar.module.css';

// Stable references: the spy hook re-subscribes whenever the array changes.
const HOME_SECTIONS = ['work', 'testimonials', 'contact'];
const NO_SECTIONS = [];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const { pathname } = useLocation();

  // On the home page, mark the nav item for the section being read ("Home"
  // while still above the first one). Other pages have no in-page sections.
  const onHome = pathname === '/';
  const activeSection = useScrollSpy(onHome ? HOME_SECTIONS : NO_SECTIONS, {
    offset: NAV_HEIGHT,
  });
  const isActive = (item) => {
    if (!onHome) return false;
    const id = item.href.split('#')[1] ?? null;
    return id === activeSection;
  };

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
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive(item) ? 'true' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.navActions}>
            <SoundToggle />
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
            <Link
              key={item.href}
              to={item.href}
              aria-current={isActive(item) ? 'true' : undefined}
              onClick={() => setIsOpen(false)}
            >
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
