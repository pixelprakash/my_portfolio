import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { playSound, unlockSound } from '../../audio/uiSound';

// Wires the interface sounds to the whole site from one place, using event
// delegation, so no component has to know about audio. Per-element control:
//   data-sound="none"        silence this element
//   data-sound="<cue>"       use a specific cue when it's clicked
//   data-sound-hover="<cue>" use a specific cue on hover (works on any element)
//   data-sound-tone="blue|red" pitch persona for hover cues
// and anything inside [data-sound-mute] (the opening screen) is ignored.
// This file decides *when* something is worth a sound (dwell, scrolling,
// scrolling); the director in uiSound.js decides what may overlap. Renders
// nothing.

const INTERACTIVE =
  'a[href], button:not([disabled]), [role="button"], summary, [data-sound-hover]';
// A hover only counts once the pointer has rested on something this long, so
// flying across the page doesn't ping every item on the way.
const HOVER_DWELL = 45;
// Content slides under a stationary pointer while scrolling: that isn't a hover.
const SCROLL_QUIET = 320;

function interactiveOf(target) {
  if (!(target instanceof Element)) return null;
  const el = target.closest(INTERACTIVE);
  if (!el || el.closest('[data-sound-mute]') || el.dataset.sound === 'none') return null;
  return el;
}

// Which cue a click on `el` should make (null for none).
function clickCue(el) {
  if (el.dataset.sound) return el.dataset.sound;
  if (el.hasAttribute('aria-expanded')) {
    return el.getAttribute('aria-expanded') === 'true' ? 'menuClose' : 'menuOpen';
  }
  if (el.hasAttribute('aria-pressed')) return 'toggle';
  if (el.tagName === 'A') {
    try {
      const url = new URL(el.href, window.location.href);
      if (url.origin === window.location.origin) {
        if (url.pathname === window.location.pathname) return 'click';
        // a link to another page: the page-change sound answers it, so a
        // click on top of that would just be two sounds for one action
        return null;
      }
    } catch {
      // fall through to a plain click
    }
  }
  return 'click';
}

export default function SoundFX() {
  const { pathname } = useLocation();
  const lastScrollAt = useRef(0);

  // Pointer, keyboard focus, click and dialog-close sounds.
  useEffect(() => {
    let lastHover = null;
    let hoverTimer = 0;

    const cancelHover = () => {
      clearTimeout(hoverTimer);
      hoverTimer = 0;
    };

    function onPointerOver(event) {
      if (event.pointerType === 'touch') return;
      const el = interactiveOf(event.target);
      if (el === lastHover) return;
      lastHover = el;
      cancelHover();
      if (!el) return;

      const cue = el.dataset.soundHover ?? 'hover';
      if (cue === 'none') return;
      const x = event.clientX;
      hoverTimer = setTimeout(() => {
        if (performance.now() - lastScrollAt.current < SCROLL_QUIET) return;
        // pan with the pointer: left of the screen sounds left, right sounds right
        const pan = Math.max(-1, Math.min(1, (x / window.innerWidth) * 2 - 1)) * 0.6;
        playSound(cue, { tone: el.dataset.soundTone, pan });
      }, HOVER_DWELL);
    }

    function onFocusIn(event) {
      const el = interactiveOf(event.target);
      if (el?.matches(':focus-visible')) {
        playSound('hover', { tone: el.dataset.soundTone });
      }
    }

    function onClick(event) {
      cancelHover();
      const el = interactiveOf(event.target);
      const cue = el && clickCue(el);
      if (cue) playSound(cue);
    }

    // `close` doesn't bubble; capture it to hear every dialog (the lightboxes)
    // close, whether by button, backdrop or Escape.
    function onDialogClose(event) {
      if (event.target instanceof HTMLDialogElement) playSound('close');
    }

    // Browsers only allow audio after a gesture: wake it on the first one.
    function onPointerDown() {
      cancelHover(); // a click is coming; it gets the sound, not the hover
      unlockSound();
    }

    // iOS Safari only treats touchend and click as unlocking audio (not
    // pointerdown), so all of them wake the engine; it's idempotent.
    function onUnlock() {
      unlockSound();
    }

    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('click', onClick, true);
    document.addEventListener('close', onDialogClose, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onUnlock, true);
    document.addEventListener('touchend', onUnlock, true);
    document.addEventListener('click', onUnlock, true);
    return () => {
      cancelHover();
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('close', onDialogClose, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onUnlock, true);
      document.removeEventListener('touchend', onUnlock, true);
      document.removeEventListener('click', onUnlock, true);
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

  // Note that the page is moving, so the pointer "hovering" things as they
  // slide past stays quiet. (There are no scroll ticks: they were the part of
  // the soundscape that wore on people most.)
  useEffect(() => {
    function onScroll() {
      lastScrollAt.current = performance.now();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
