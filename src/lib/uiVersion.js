// Which visual design is on screen: v1 (the live site) or v2 (the redesign).
//
// v2 is a private preview. Visitors only ever see v1, unless they open a link
// carrying ?preview=v2 (or ?preview=v1). That turns the preview on for their
// browser: a v1 / v2 switch appears and the choice is remembered, until they
// close the switch or open ?preview=off.
//
// "Private" means unadvertised, not protected: anyone who has the link can use it.
//
// v2 has two heroes to compare: 1, the light-and-glass portrait, and 2,
// "choose your pill". The switch offers both, and ?hero=2 picks one in a link.
//
// v2 is a layer on top of v1: a stylesheet scoped to html[data-ui='v2'] plus
// its own hero. Both are downloaded only when v2 is asked for.
import { useSyncExternalStore } from 'react';

const KEY = 'sp-ui-preview';
const HERO_KEY = 'sp-ui-hero';
const VERSIONS = ['v1', 'v2'];
const HEROES = ['1', '2'];
const HERO_FILES = {
  1: () => import('../v2/HeroV2'),
  2: () => import('../v2/HeroPills'),
};
const V2_FONTS =
  'https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&display=swap';

let preview = null; // null = not previewing (every normal visitor)
let hero = '1';
let latestHeroRequest = 0;
let latestRequest = 0;
let v2Assets = null;
const listeners = new Set();

function read(key, allowed) {
  try {
    const stored = window.localStorage.getItem(key);
    return allowed.includes(stored) ? stored : null;
  } catch {
    return null;
  }
}

function save(key, value) {
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    // storage blocked: the choice lasts until the page is reloaded
  }
}

function loadV2() {
  if (!v2Assets) {
    const fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = V2_FONTS;
    document.head.appendChild(fonts);

    v2Assets = Promise.all([import('../v2/theme.css'), HERO_FILES[hero]()]).catch((error) => {
      v2Assets = null; // let a later attempt try again
      throw error;
    });
  }
  return v2Assets;
}

function paint(version) {
  if (version === 'v2') document.documentElement.dataset.ui = 'v2';
  else delete document.documentElement.dataset.ui;
}

function commit(next) {
  preview = next;
  save(KEY, next);
  paint(next);
  notifyAll();
}

function notifyAll() {
  listeners.forEach((notify) => notify());
}

// Switches v2's hero between option '1' and option '2'.
export async function setHeroOption(next) {
  const request = ++latestHeroRequest;
  try {
    await HERO_FILES[next](); // fetched first, so the swap has no blank gap
  } catch {
    return;
  }
  if (request !== latestHeroRequest) return;
  hero = next;
  save(HERO_KEY, next);
  notifyAll();
}

// Switches version, or leaves the preview altogether with null.
export async function setUiPreview(next) {
  const request = ++latestRequest;
  if (next === 'v2') {
    try {
      await loadV2();
    } catch {
      return; // the files didn't arrive: stay on what is showing
    }
  }
  if (request === latestRequest) commit(next);
}

// Runs once, before the first render, so a v2 preview never flashes v1.
export async function initUiVersion() {
  preview = read(KEY, VERSIONS);
  hero = read(HERO_KEY, HEROES) ?? '1';

  const url = new URL(window.location.href);
  const asked = url.searchParams.get('preview');
  const askedHero = url.searchParams.get('hero');
  if (HEROES.includes(askedHero)) {
    hero = askedHero;
    save(HERO_KEY, hero);
  }
  if (asked !== null) {
    if (VERSIONS.includes(asked)) preview = asked;
    else if (asked === 'off') preview = null;
    save(KEY, preview);
  }
  if (asked !== null || askedHero !== null) {
    // taken out of the address bar, or a reload would undo the switch
    url.searchParams.delete('preview');
    url.searchParams.delete('hero');
    window.history.replaceState(window.history.state, '', url);
  }

  if (preview !== 'v2') return;
  try {
    await loadV2();
    paint('v2');
  } catch {
    preview = 'v1';
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getPreview = () => preview;

export const getUiVersion = () => preview ?? 'v1';

export function useUiPreview() {
  return useSyncExternalStore(subscribe, getPreview);
}

export function useUiVersion() {
  return useUiPreview() ?? 'v1';
}

const getHero = () => hero;

export function useHeroOption() {
  return useSyncExternalStore(subscribe, getHero);
}
