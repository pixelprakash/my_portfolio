import { useCallback, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Loader from './components/layout/Loader';
import HomePage from './pages/HomePage';
import CaseStudyPage from './pages/CaseStudyPage';
import NotFoundPage from './pages/NotFoundPage';

const SEEN_KEY = 'sp-intro-seen';

// The opening sequence plays once per browser session, and only when someone
// lands on the plain home page: a shared link to a project or a #section
// should get its content immediately. It's skipped entirely for visitors who
// ask for reduced motion. Add ?intro to the URL to replay it on demand.
function shouldShowIntro() {
  try {
    const { pathname, hash, search } = window.location;
    if (pathname !== '/') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (new URLSearchParams(search).has('intro')) return true;
    if (hash) return false;
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    return false;
  }
}

export default function App() {
  const [introVisible, setIntroVisible] = useState(shouldShowIntro);

  const handleIntroDone = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // storage unavailable (private mode etc.): it just replays next visit
    }
    setIntroVisible(false);
    // The page was inert behind the loader, so route-change focus didn't
    // land; put it at the top of the content now.
    requestAnimationFrame(() => {
      document.querySelector('#main h1')?.focus({ preventScroll: true });
    });
  }, []);

  return (
    <>
      {/* display: contents keeps this wrapper out of layout (the navbar's
          sticky positioning still sees the document as its container). */}
      <div style={{ display: 'contents' }} inert={introVisible}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="work/:slug" element={<CaseStudyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>

      {introVisible && <Loader onDone={handleIntroDone} />}
    </>
  );
}
