import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isSoundEnabled, playSound, unlockSound } from '../../audio/uiSound';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { NAV_HEIGHT } from '../../constants';

// Wires the interface sounds to the whole site from one place, using event
// delegation, so no component has to know about audio. Per-element control:
//   data-sound="none"        silence this element
//   data-sound="<cue>"       use a specific cue when it's clicked
//   data-sound-hover="<cue>" use a specific cue on hover (works on any element)
//   data-sound-tone="blue|red" pitch persona for hover cues
// and anything inside [data-sound-mute] (the opening screen) is ignored.
// Renders nothing.

const INTERACTIVE =
  'a[href], button:not([disabled]), [role="button"], summary, [data-sound-hover]';
const HOME_SECTIONS = ['work', 'testimonials', 'contact'];
const NO_SECTIONS = [];
const DETENT_PX = 520;

function interactiveOf(target) {
  if (!(target instanceof Element)) return null;
  const el = target.closest(INTERACTIVE);
  if (!el || el.closest('[data-sound-mute]') || el.dataset.sound === 'none') return null;
  return el;
}

// Which cue a click on `el` should make.
function clickCue(el) {
  if (el.dataset.sound) return el.dataset.sound;
  if (el.hasAttribute('aria-expanded')) {
    return el.getAttribute('aria-expanded') === 'true' ? 'menuClose' : 'menuOpen';
  }
  if (el.hasAttribute('aria-pressed')) return 'toggle';
  if (el.tagName === 'A') {
    try {
      const url = new URL(el.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname === window.location.pathname) {
        return url.hash ? 'jump' : 'click';
      }
    } catch {
      // fall through to a plain click
    }
  }
  return 'click';
}

export default function SoundFX() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';

  // Pointer, keyboard focus, click and dialog-close sounds.
  useEffect(() => {
    let lastHover = null;

    function onPointerOver(event) {
      if (event.pointerType === 'touch') return;
      const el = interactiveOf(event.target);
      if (el === lastHover) return;
      lastHover = el;
      if (!el) return;
      const cue = el.dataset.soundHover ?? 'hover';
      if (cue !== 'none') playSound(cue, { tone: el.dataset.soundTone });
    }

    function onFocusIn(event) {
      const el = interactiveOf(event.target);
      if (el?.matches(':focus-visible')) {
        playSound('hover', { tone: el.dataset.soundTone });
      }
    }

    function onClick(event) {
      const el = interactiveOf(event.target);
      if (el) playSound(clickCue(el));
    }

    // `close` doesn't bubble; capture it to hear every dialog (the lightboxes)
    // close, whether by button, backdrop or Escape.
    function onDialogClose(event) {
      if (event.target instanceof HTMLDialogElement) playSound('close');
    }

    // Browsers only allow audio after a gesture: wake it on the first one.
    function onGesture() {
      unlockSound();
    }

    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('click', onClick, true);
    document.addEventListener('close', onDialogClose, true);
    document.addEventListener('pointerdown', onGesture, true);
    document.addEventListener('keydown', onGesture, true);
    return () => {
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('close', onDialogClose, true);
      document.removeEventListener('pointerdown', onGesture, true);
      document.removeEventListener('keydown', onGesture, true);
    };
  }, []);

  // A new page.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    playSound('page');
  }, [pathname]);

  // Moving into another section of the home page.
  const activeSection = useScrollSpy(onHome ? HOME_SECTIONS : NO_SECTIONS, {
    offset: NAV_HEIGHT,
  });
  const lastSection = useRef({ id: null, at: 0 });
  useEffect(() => {
    const last = lastSection.current;
    const now = performance.now();
    // `at` is stamped whenever the spy reports "above the first section"
    // (load, or arriving on the page); ignore it settling just after that.
    if (last.at && now - last.at > 1500 && last.id !== activeSection) {
      playSound('section');
    }
    last.id = activeSection;
    if (activeSection === null) last.at = now;
  }, [activeSection]);

  // A detent every so often while scrolling.
  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < DETENT_PX) return;
      lastY = y;
      if (!isSoundEnabled()) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      playSound('detent', { progress: max > 0 ? Math.min(1, y / max) : 0 });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
