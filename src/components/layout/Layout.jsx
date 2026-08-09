import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SkipLink from './SkipLink';
import Navbar from './Navbar';
import Footer from './Footer';
import { NAV_HEIGHT } from '../../constants';

export default function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        return;
      }
    }

    window.scrollTo({ top: 0 });
    const heading = document.querySelector('#main h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }, [pathname, hash]);

  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
