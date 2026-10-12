// Site-wide interface sound: a tiny procedural synth that gives every
// interaction a short, quiet "machine" cue (hover ticks, confirm blips,
// page sweeps, section scans...). Nothing is a sample; everything is built
// from oscillators and filtered noise so it adds no bytes to the page.
//
// It is strictly opt-in. The opening screen's "red pill" turns it on; the
// navbar toggle changes it any time; the choice is remembered. Browsers won't
// let a page make noise before a user gesture, so after a reload the engine
// wakes up on the first click / key press.
//
// All cues are tuned to A minor pentatonic so whatever is playing stays in key
// with the intro score, and kept far below it in level (each voice peaks at
// 0.02-0.17 before the master compressor).

const STORAGE_KEY = 'sp-sound';

// state: 'unset' (never chosen: silent, the toggle invites a click), 'on', 'off'
let state = readStored();
const listeners = new Set();

let ctx = null;
let master = null;
let wetBus = null; // reverb + echo return
let reverb = null;
let echo = null;
let noiseBuffer = null;
let hiddenSuspend = false;
let activeVoices = 0;
let hoverStep = 0;
const lastPlayed = {};

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'on' || value === 'off' ? value : 'unset';
  } catch {
    return 'unset';
  }
}

function persist(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // storage unavailable (private mode): the choice just won't be remembered
  }
}

const midi = (note) => 440 * Math.pow(2, (note - 69) / 12);
const rand = (a, b) => a + Math.random() * (b - a);

// ── Store (for React's useSyncExternalStore) ──
export function subscribeSound(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export const getSoundState = () => state;
export const isSoundEnabled = () => state === 'on';

function emit() {
  listeners.forEach((listener) => listener());
}

// ── Audio graph ──
function buildGraph() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;

  ctx = new AudioContextClass({ latencyHint: 'interactive' });

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -16;
  compressor.knee.value = 12;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.18;
  compressor.connect(ctx.destination);

  master = ctx.createGain();
  master.gain.value = 4.5; // cue peaks below are written small; this sets the level
  master.connect(compressor);

  // a short, bright room, so the blips feel like they're inside a machine
  wetBus = ctx.createGain();
  wetBus.gain.value = 0.7;
  wetBus.connect(compressor);

  const length = Math.floor(ctx.sampleRate * 1.3);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = impulse.getChannelData(c);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3.2);
    }
  }
  reverb = ctx.createConvolver();
  reverb.buffer = impulse;
  reverb.connect(wetBus);

  echo = ctx.createDelay(1);
  echo.delayTime.value = 0.17;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  const echoTone = ctx.createBiquadFilter();
  echoTone.type = 'lowpass';
  echoTone.frequency.value = 2400;
  echo.connect(echoTone);
  echoTone.connect(feedback);
  feedback.connect(echo);
  echoTone.connect(wetBus);

  const noiseLength = ctx.sampleRate;
  noiseBuffer = ctx.createBuffer(1, noiseLength, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseLength; i++) noiseData[i] = Math.random() * 2 - 1;

  return true;
}

function ensureContext() {
  if (!ctx && !buildGraph()) return null;
  if (ctx.state === 'suspended' && !hiddenSuspend) ctx.resume().catch(() => {});
  return ctx;
}

// Call from a user gesture (the global listener in <SoundFX /> does): it
// creates / wakes the audio context if the visitor has sound switched on.
export function unlockSound() {
  if (state === 'on') ensureContext();
}

if (typeof document !== 'undefined') {
  // No point burning CPU (or making noise) in a background tab.
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) {
      hiddenSuspend = true;
      ctx.suspend().catch(() => {});
    } else {
      hiddenSuspend = false;
      if (state === 'on') ctx.resume().catch(() => {});
    }
  });
}

// ── Voices ──
function connectOut(node, { pan = 0, panEnd = pan, t, dur, wet = 0, echoSend = 0 }) {
  let tail = node;
  if (ctx.createStereoPanner && (pan || panEnd)) {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(pan, t);
    panner.pan.linearRampToValueAtTime(panEnd, t + dur);
    tail.connect(panner);
    tail = panner;
  }
  tail.connect(master);
  if (wet > 0) {
    const send = ctx.createGain();
    send.gain.value = wet;
    tail.connect(send);
    send.connect(reverb);
  }
  if (echoSend > 0) {
    const send = ctx.createGain();
    send.gain.value = echoSend;
    tail.connect(send);
    send.connect(echo);
  }
}

function envelope(param, t, dur, peak, attack) {
  param.setValueAtTime(0.0001, t);
  param.exponentialRampToValueAtTime(peak, t + attack);
  param.exponentialRampToValueAtTime(0.0001, t + dur);
}

function track(source, stopAt, t) {
  activeVoices += 1;
  source.stop(stopAt);
  source.onended = () => {
    activeVoices -= 1;
  };
  return t;
}

// A pitched voice: oscillator → (filter) → envelope → out.
function tone({
  type = 'sine',
  f0,
  f1 = f0,
  t = 0,
  dur = 0.1,
  peak = 0.05,
  attack = 0.002,
  filter,
  detune = 0,
  ...routing
}) {
  const start = ctx.currentTime + t;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.detune.value = detune;
  osc.frequency.setValueAtTime(f0, start);
  if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(f1, start + dur);

  const gain = ctx.createGain();
  envelope(gain.gain, start, dur, peak, attack);

  let head = osc;
  if (filter) {
    const biquad = ctx.createBiquadFilter();
    biquad.type = filter.type ?? 'lowpass';
    biquad.Q.value = filter.q ?? 0.7;
    biquad.frequency.setValueAtTime(filter.f0, start);
    if (filter.f1) biquad.frequency.exponentialRampToValueAtTime(filter.f1, start + dur);
    head.connect(biquad);
    head = biquad;
  }
  head.connect(gain);
  connectOut(gain, { ...routing, t: start, dur });

  osc.start(start);
  track(osc, start + dur + 0.05, start);
}

// Filtered noise: a click, a whoosh or a breath.
function hiss({
  type = 'bandpass',
  f0,
  f1 = f0,
  q = 1,
  t = 0,
  dur = 0.1,
  peak = 0.05,
  attack = 0.004,
  ...routing
}) {
  const start = ctx.currentTime + t;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;

  const biquad = ctx.createBiquadFilter();
  biquad.type = type;
  biquad.Q.value = q;
  biquad.frequency.setValueAtTime(f0, start);
  if (f1 !== f0) biquad.frequency.exponentialRampToValueAtTime(f1, start + dur);

  const gain = ctx.createGain();
  envelope(gain.gain, start, dur, peak, attack);

  source.connect(biquad);
  biquad.connect(gain);
  connectOut(gain, { ...routing, t: start, dur });

  source.start(start, Math.random() * 0.5);
  track(source, start + dur + 0.05, start);
}

// ── The cues ──
// Pitch pools, A minor pentatonic. Blue (design) sits high and glassy, red
// (development) lower and heavier; unlabelled things sit between.
const POOLS = {
  blue: [88, 91, 93, 96, 100],
  red: [69, 72, 74, 76, 79],
  neutral: [81, 84, 86, 88, 91],
};

const CUES = {
  // the faintest "keycap" tick under a pointer or keyboard focus
  hover({ tone: persona }) {
    const pool = POOLS[persona] ?? POOLS.neutral;
    hoverStep = (hoverStep + 1 + Math.floor(Math.random() * 2)) % pool.length;
    const note = pool[hoverStep];
    tone({
      type: 'square',
      f0: midi(note),
      dur: 0.05,
      peak: 0.06,
      filter: { f0: 3200, q: 0.5 },
      pan: rand(-0.25, 0.25),
    });
    tone({ f0: midi(note + 12), dur: 0.09, peak: 0.025, wet: 0.35 });
    hiss({ type: 'highpass', f0: 6500, dur: 0.012, peak: 0.035 });
  },

  // a confirm: tactile thump plus a rising two-note chirp
  click() {
    tone({ f0: 150, f1: 55, dur: 0.1, peak: 0.15, attack: 0.001 });
    tone({ type: 'square', f0: midi(88), dur: 0.05, peak: 0.036, filter: { f0: 3600 } });
    tone({
      type: 'square',
      f0: midi(93),
      t: 0.055,
      dur: 0.07,
      peak: 0.036,
      filter: { f0: 3600 },
      wet: 0.2,
      echoSend: 0.3,
    });
  },

  // a new page: a sweep across the stereo field that resolves in a chord
  page() {
    hiss({ f0: 280, f1: 4200, q: 1.1, dur: 0.55, peak: 0.08, attack: 0.12, pan: -0.7, panEnd: 0.7, wet: 0.3 });
    tone({ f0: 110, f1: 220, dur: 0.42, peak: 0.09, attack: 0.04 });
    [69, 76, 81].forEach((note, i) =>
      tone({
        type: 'triangle',
        f0: midi(note),
        t: 0.2 + i * 0.1,
        dur: 0.55,
        peak: 0.04,
        wet: 0.5,
        echoSend: 0.25,
      })
    );
  },

  // an in-page jump (anchor links, the contents list)
  jump() {
    hiss({ f0: 600, f1: 2600, q: 1, dur: 0.24, peak: 0.05, attack: 0.05, pan: -0.3, panEnd: 0.3 });
    tone({ f0: 880, f1: 1320, dur: 0.18, peak: 0.036, wet: 0.3 });
  },

  // the hamburger menu: a quick four-note run up / down
  menuOpen() {
    [69, 76, 81, 88].forEach((note, i) =>
      tone({ type: 'triangle', f0: midi(note), t: i * 0.045, dur: 0.14, peak: 0.04, wet: 0.3 })
    );
    hiss({ f0: 500, f1: 3200, dur: 0.24, peak: 0.032, attack: 0.06 });
  },
  menuClose() {
    [88, 81, 76, 69].forEach((note, i) =>
      tone({ type: 'triangle', f0: midi(note), t: i * 0.04, dur: 0.12, peak: 0.032, wet: 0.25 })
    );
    hiss({ f0: 3000, f1: 400, dur: 0.2, peak: 0.026, attack: 0.03 });
  },

  // a window powering up / down (lightbox)
  open() {
    tone({ f0: 110, f1: 880, dur: 0.32, peak: 0.07, attack: 0.02, wet: 0.35 });
    [57, 64, 69].forEach((note) =>
      tone({
        type: 'sawtooth',
        f0: midi(note),
        dur: 0.55,
        attack: 0.1,
        peak: 0.016,
        filter: { f0: 400, f1: 2600, q: 1 },
        wet: 0.5,
      })
    );
    hiss({ f0: 400, f1: 3600, dur: 0.3, peak: 0.04, attack: 0.08 });
  },
  close() {
    tone({ f0: 880, f1: 110, dur: 0.28, peak: 0.06, attack: 0.01, wet: 0.3 });
    hiss({ f0: 3600, f1: 300, dur: 0.26, peak: 0.034, attack: 0.02 });
  },

  // the reader moves into a new section: a soft scanner lock
  section() {
    tone({ f0: 740, f1: 1480, dur: 0.22, peak: 0.034, attack: 0.04, wet: 0.5 });
    tone({ type: 'square', f0: midi(96), t: 0.2, dur: 0.03, peak: 0.018, filter: { f0: 4000 } });
  },

  // a mechanical detent every so often while scrolling; the pitch climbs
  // through the page like a scan position
  detent({ progress = 0 }) {
    const pool = [81, 84, 86, 88, 91, 93, 96];
    const note = pool[Math.min(pool.length - 1, Math.floor(progress * pool.length))];
    tone({ type: 'triangle', f0: midi(note), dur: 0.035, peak: 0.04, pan: rand(-0.2, 0.2) });
    hiss({ type: 'highpass', f0: 7000, dur: 0.01, peak: 0.025 });
  },

  // going back
  back() {
    tone({ f0: 100, f1: 50, dur: 0.1, peak: 0.1, attack: 0.001 });
    tone({ type: 'square', f0: midi(88), dur: 0.05, peak: 0.03, filter: { f0: 3200 } });
    tone({ type: 'square', f0: midi(81), t: 0.055, dur: 0.07, peak: 0.03, filter: { f0: 3200 }, wet: 0.2 });
  },

  // a pressed/unpressed control (the filter chips)
  toggle() {
    tone({ type: 'square', f0: midi(91), dur: 0.035, peak: 0.028, filter: { f0: 3600 } });
    tone({ type: 'square', f0: midi(96), t: 0.04, dur: 0.05, peak: 0.024, filter: { f0: 3600 }, wet: 0.2 });
  },

  // hero read-outs: a sensor sweep, rising for blue and falling for red
  scan({ tone: persona }) {
    const blue = persona === 'blue';
    hiss({
      f0: blue ? 800 : 3600,
      f1: blue ? 3600 : 800,
      q: 1.4,
      dur: 0.3,
      peak: 0.04,
      attack: 0.08,
      wet: 0.3,
    });
    tone({ f0: midi(blue ? 93 : 69), dur: 0.24, peak: 0.028, attack: 0.04, wet: 0.5 });
  },

  // sound switched on / off from the toggle
  on() {
    tone({ f0: 80, f1: 40, dur: 0.32, peak: 0.1, attack: 0.002 });
    [57, 64, 69, 76, 81].forEach((note, i) => {
      tone({ type: 'triangle', f0: midi(note), t: 0.05 + i * 0.07, dur: 0.4, peak: 0.045, wet: 0.5, echoSend: 0.3 });
      tone({
        type: 'square',
        f0: midi(note + 12),
        t: 0.05 + i * 0.07,
        dur: 0.08,
        peak: 0.014,
        filter: { f0: 3000 },
      });
    });
  },
  off() {
    [81, 76, 69, 64].forEach((note, i) =>
      tone({ type: 'triangle', f0: midi(note), t: i * 0.06, dur: 0.24, peak: 0.04, wet: 0.35 })
    );
    tone({ f0: 220, f1: 40, t: 0.12, dur: 0.38, peak: 0.05, attack: 0.01 });
  },
};

// Minimum gap between two plays of the same cue, in ms.
const MIN_GAP = { hover: 60, detent: 90, section: 450, scan: 250, click: 40, page: 300 };
const MAX_VOICES = 16;

export function playSound(name, options = {}) {
  if (state !== 'on' && !options.force) return;
  const cue = CUES[name];
  if (!cue) return;

  const now = performance.now();
  if (now - (lastPlayed[name] ?? -Infinity) < (MIN_GAP[name] ?? 40)) return;

  const context = ensureContext();
  if (!context || activeVoices > MAX_VOICES) return;

  const run = () => {
    lastPlayed[name] = performance.now();
    try {
      cue(options);
    } catch {
      // audio is decoration: never let it break an interaction
    }
  };

  if (context.state === 'running') {
    run();
  } else if (!hiddenSuspend) {
    // Just switched on, or just woken by a gesture: the context is still
    // resuming. Play the cue once it is, but not if that takes a while (a
    // hover from before the visitor's first click shouldn't play late).
    context
      .resume()
      .then(() => {
        if (context.state === 'running' && performance.now() - now < 250) run();
      })
      .catch(() => {});
  }
}

// The one place the preference changes. `announce: false` is for the opening
// screen, which already has its own score playing.
export function setSoundEnabled(on, { announce = true } = {}) {
  const next = on ? 'on' : 'off';
  if (next === state) return;

  if (on) {
    state = 'on';
    persist('on');
    ensureContext();
    emit();
    if (announce) playSound('on');
  } else {
    if (announce) playSound('off');
    state = 'off';
    persist('off');
    emit();
    // let the switch-off cue ring out, then stop the audio thread
    setTimeout(() => {
      if (state !== 'on' && ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
    }, 900);
  }
}
