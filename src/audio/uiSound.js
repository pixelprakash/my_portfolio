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
let ambient = null; // the quiet cues (hover, scroll ticks) share a bus so they can be ducked
let bus = null; // where the cue being scheduled right now sends its dry signal
let reverb = null;
let echo = null;
let noiseBuffer = null;
let hiddenSuspend = false;
let activeVoices = 0;
let hoverStep = 0;
let hoverAt = 0;
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
  compressor.threshold.value = -14;
  compressor.knee.value = 12;
  compressor.ratio.value = 6;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.18;

  // a brick-wall ceiling after the compressor, so stacked cues can't clip
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -4;
  limiter.knee.value = 0;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.001;
  limiter.release.value = 0.08;
  compressor.connect(limiter);

  // ...and a gentle tanh soft-clip as the last stage: whatever lands on the
  // same instant, the output can never exceed full scale. (The shaper sees
  // -1..1, so the signal is halved going in and the curve is tanh over -2..2:
  // transparent for small signals, rounding off only the peaks.)
  const preClip = ctx.createGain();
  preClip.gain.value = 0.5;
  const clipper = ctx.createWaveShaper();
  const curve = new Float32Array(2048);
  for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh((i / (curve.length - 1)) * 4 - 2);
  clipper.curve = curve;
  clipper.oversample = '2x';
  limiter.connect(preClip);
  preClip.connect(clipper);
  clipper.connect(ctx.destination);

  master = ctx.createGain();
  master.gain.value = 4.5; // cue peaks below are written small; this sets the level
  master.connect(compressor);

  ambient = ctx.createGain();
  ambient.connect(master);
  bus = master;

  // a short, bright room, so the blips feel like they're inside a machine
  wetBus = ctx.createGain();
  wetBus.gain.value = 0.7;
  wetBus.connect(compressor);

  const length = Math.floor(ctx.sampleRate * 1.3);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = impulse.getChannelData(c);
    for (let i = 0; i < length; i++) {
      // fade the first ~12ms in: an impulse that starts at full level turns
      // every note attack into a sharp early reflection
      const onset = Math.min(1, i / (ctx.sampleRate * 0.012));
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3.2) * onset;
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
  tail.connect(bus);
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
  // A fresh GainNode sits at 1 until its first scheduled event; without this,
  // the first few samples of every voice leak through as a click.
  param.value = 0.0001;
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

// An FM bell / pluck: a sine carrier whose frequency is shaken by a second
// oscillator, with the shaking dying away faster than the note. That gives
// the bright metallic strike of a glass or tine instrument that a plain
// oscillator can't: `ratio` picks the colour (2 = warm bell, 3.5 = glassy,
// 1 = hollow), `index` how hard the strike is.
function fm({
  f,
  ratio = 2,
  index = 2,
  t = 0,
  dur = 0.25,
  peak = 0.05,
  attack = 0.002,
  ...routing
}) {
  const start = ctx.currentTime + t;
  const carrier = ctx.createOscillator();
  carrier.frequency.value = f;
  const modulator = ctx.createOscillator();
  modulator.frequency.value = f * ratio;

  const depth = ctx.createGain();
  depth.gain.setValueAtTime(f * index, start);
  depth.gain.exponentialRampToValueAtTime(Math.max(1, f * index * 0.01), start + dur * 0.45);
  modulator.connect(depth);
  depth.connect(carrier.frequency);

  const gain = ctx.createGain();
  envelope(gain.gain, start, dur, peak, attack);
  carrier.connect(gain);
  connectOut(gain, { ...routing, t: start, dur });

  carrier.start(start);
  modulator.start(start);
  track(carrier, start + dur + 0.05, start);
  track(modulator, start + dur + 0.05, start);
}

// ── The sci-fi palette ──
// Ring modulation (carrier x modulator at an inharmonic ratio) is the classic
// "robot" timbre: metallic sidebands with no natural harmonic series.
function ring({
  f,
  ratio = 1.41,
  t = 0,
  dur = 0.12,
  peak = 0.05,
  attack = 0.004,
  glide = 0,
  ...routing
}) {
  const start = ctx.currentTime + t;
  const carrier = ctx.createOscillator();
  carrier.frequency.setValueAtTime(f * (1 + glide), start);
  if (glide) carrier.frequency.exponentialRampToValueAtTime(f, start + Math.min(dur, 0.05));
  const modulator = ctx.createOscillator();
  modulator.frequency.value = f * ratio;

  // the modulator drives the gain of a node whose own gain is 0: a ring mod
  const product = ctx.createGain();
  product.gain.value = 0;
  modulator.connect(product.gain);
  carrier.connect(product);

  const gain = ctx.createGain();
  envelope(gain.gain, start, dur, peak, attack);
  product.connect(gain);
  connectOut(gain, { ...routing, t: start, dur });

  carrier.start(start);
  modulator.start(start);
  track(carrier, start + dur + 0.05, start);
  track(modulator, start + dur + 0.05, start);
}

// A sonar ping: a clean sine strike with a metallic inharmonic partial, long
// decay, thrown into the echo and the room.
function ping({ f, t = 0, dur = 0.9, peak = 0.06, ...routing }) {
  tone({ f0: f * 1.012, f1: f, t, dur, peak, attack: 0.003, wet: 0.5, echoSend: 0.4, ...routing });
  fm({ f: f * 2.01, ratio: 2.76, index: 0.7, t, dur: dur * 0.4, peak: peak * 0.35, wet: 0.5, ...routing });
}

// A servo / actuator: a low sawtooth through a narrow resonant filter that
// sweeps, the "whirr" of something small and precise moving.
function servo({
  f0 = 900,
  f1 = 2400,
  q = 8,
  pitch = 100,
  t = 0,
  dur = 0.1,
  peak = 0.03,
  attack = 0.012,
  ...routing
}) {
  const start = ctx.currentTime + t;
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = pitch;
  const biquad = ctx.createBiquadFilter();
  biquad.type = 'bandpass';
  biquad.Q.value = q;
  biquad.frequency.setValueAtTime(f0, start);
  biquad.frequency.exponentialRampToValueAtTime(f1, start + dur);
  const gain = ctx.createGain();
  envelope(gain.gain, start, dur, peak * 6, attack); // the narrow filter eats level
  osc.connect(biquad);
  biquad.connect(gain);
  connectOut(gain, { ...routing, t: start, dur });
  osc.start(start);
  track(osc, start + dur + 0.05, start);
}

// A synthetic voice syllable: a buzzing "glottal" sawtooth through two
// formant filters that glide between vowels. Not words, just the sense of
// something intelligent acknowledging you.
const VOWELS = {
  ah: [800, 1150],
  ee: [290, 2250],
  oo: [320, 800],
  oh: [520, 900],
  eh: [530, 1840],
};
function vowel({
  pitch = 110,
  from = 'ah',
  to = from,
  t = 0,
  dur = 0.25,
  peak = 0.04,
  attack = 0.03,
  ...routing
}) {
  const start = ctx.currentTime + t;
  const source = ctx.createOscillator();
  source.type = 'sawtooth';
  source.frequency.setValueAtTime(pitch, start);
  source.frequency.linearRampToValueAtTime(pitch * 0.96, start + dur);

  const mix = ctx.createGain();
  mix.gain.value = 5; // bandpassed saw is quiet; make it up here
  [0, 1].forEach((k) => {
    const formant = ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.Q.value = k ? 9 : 6;
    formant.frequency.setValueAtTime(VOWELS[from][k], start);
    formant.frequency.linearRampToValueAtTime(VOWELS[to][k], start + dur * 0.8);
    const level = ctx.createGain();
    level.gain.value = k ? 0.7 : 1;
    source.connect(formant);
    formant.connect(level);
    level.connect(mix);
  });

  const gain = ctx.createGain();
  envelope(gain.gain, start, dur, peak, attack);
  mix.connect(gain);
  connectOut(gain, { ...routing, t: start, dur });
  source.start(start);
  track(source, start + dur + 0.05, start);
}

// A burst of fast, quantised data blips, rising or falling through the
// pentatonic scale, sweeping across the stereo field: "computing".
const DATA_NOTES = [76, 79, 81, 84, 86, 88, 91, 93, 96];
function flutter({ count = 9, step = 0.024, t = 0, dir = 1, peak = 0.02, from = -0.7, to = 0.7 }) {
  for (let i = 0; i < count; i++) {
    const k = dir >= 0 ? i / (count - 1) : 1 - i / (count - 1);
    const index = Math.min(
      DATA_NOTES.length - 1,
      Math.max(0, Math.round(k * (DATA_NOTES.length - 1)) + Math.floor(rand(-1, 2)))
    );
    tone({
      type: 'square',
      f0: midi(DATA_NOTES[index]),
      t: t + i * step,
      dur: 0.035,
      peak,
      attack: 0.004,
      filter: { f0: 3800, q: 0.6 },
      pan: from + ((to - from) * i) / (count - 1),
      echoSend: 0.3,
    });
  }
}

// ── The cues ──
// Pitch pools, A minor pentatonic. Blue (design) sits high and glassy, red
// (development) lower and heavier; unlabelled things sit between.
const POOLS = {
  blue: [81, 84, 86, 88, 91, 93, 96, 98],
  red: [57, 60, 62, 64, 67, 69, 72, 74],
  neutral: [74, 76, 79, 81, 84, 86, 88, 91],
};

const CUES = {
  // A sensor ping. Sweeping across several items plays a rising then
  // falling pentatonic run (it restarts after a pause), so moving the pointer
  // feels like playing an instrument; the pan follows the pointer. Each ping
  // has a ring-modulated robot overtone and a tiny servo whirr: blue is high
  // and bright, red low and heavy.
  hover({ tone: persona, pan = 0 }) {
    const now = performance.now();
    hoverStep = now - hoverAt > 1100 ? 0 : hoverStep + 1;
    hoverAt = now;

    const pool = POOLS[persona] ?? POOLS.neutral;
    const cycle = pool.length * 2 - 2;
    const k = hoverStep % cycle;
    const f = midi(pool[k < pool.length ? k : cycle - k]);
    const red = persona === 'red';
    const blue = persona === 'blue';

    tone({ f0: f * 1.02, f1: f, dur: 0.15, peak: 0.2, attack: 0.003, pan, wet: 0.35, echoSend: 0.12 });
    ring({ f: f * 2, ratio: 1.5, dur: 0.08, peak: 0.085, glide: 0.03, pan, wet: 0.25 });
    servo({
      f0: blue ? 1500 : red ? 600 : 1000,
      f1: blue ? 3400 : red ? 1400 : 2200,
      pitch: red ? 70 : 110,
      dur: 0.07,
      peak: 0.032,
      pan: -pan * 0.5,
    });
    hiss({ type: 'highpass', f0: 8500, dur: 0.012, peak: 0.03, attack: 0.003, pan });
  },

  // a confirm: a robotic two-tone acknowledgement over a tactile thump
  click() {
    tone({ f0: 150, f1: 55, dur: 0.1, peak: 0.12, attack: 0.004 });
    ring({ f: midi(88), ratio: 1.5, dur: 0.06, peak: 0.04, glide: 0.04 });
    ring({ f: midi(95), ratio: 1.5, t: 0.06, dur: 0.09, peak: 0.04, glide: 0.04, wet: 0.25, echoSend: 0.3 });
  },

  // a new page: a rising stereo sweep, a synthetic "ooh-ah", and a chord of
  // sonar pings
  page() {
    hiss({ f0: 280, f1: 4200, q: 1.1, dur: 0.55, peak: 0.05, attack: 0.12, pan: -0.7, panEnd: 0.7, wet: 0.3 });
    tone({ f0: 110, f1: 220, dur: 0.42, peak: 0.07, attack: 0.04 });
    vowel({ pitch: 82, from: 'oo', to: 'ah', t: 0.05, dur: 0.4, peak: 0.05, wet: 0.35 });
    [69, 76, 81].forEach((note, i) => ping({ f: midi(note), t: 0.22 + i * 0.1, dur: 0.8, peak: 0.04 }));
  },

  // an in-page jump: a brief servo glide and a soft ping. (The section scan
  // lands separately when the scroll arrives, so this stays small.)
  jump() {
    servo({ f0: 500, f1: 2600, pitch: 90, dur: 0.16, peak: 0.024, pan: -0.3 });
    ping({ f: midi(88), t: 0.1, dur: 0.35, peak: 0.028, pan: 0.2 });
  },

  // the hamburger menu: a data burst up / down, landing on a ping
  menuOpen() {
    flutter({ count: 8, dir: 1, peak: 0.02 });
    ping({ f: midi(88), t: 0.2, dur: 0.5, peak: 0.045 });
  },
  menuClose() {
    flutter({ count: 7, dir: -1, peak: 0.016, from: 0.5, to: -0.5 });
    tone({ f0: 120, f1: 60, t: 0.16, dur: 0.14, peak: 0.05, attack: 0.01 });
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

  // The AI locks onto a new section. A burst of data blips sweeps through the
  // stereo field (left to right as you scroll down, back again as you scroll
  // up) while a synthetic voice syllable rises "ah-ee" or falls "ee-ah" with
  // it; then a sonar ping lands and two robotic tones acknowledge it. Each
  // section has its own key. `index` is the section (0 = top of the page),
  // `dir` is +1 / -1.
  section({ index = 0, dir = 1 }) {
    const chords = [
      [64, 71, 76], // top of the page
      [69, 76, 81], // work
      [74, 81, 86], // testimonials
      [76, 83, 88], // contact
    ];
    const chord = chords[index] ?? chords[1];
    const down = dir >= 0;
    const lock = 0.3;

    flutter({
      count: 10,
      dir,
      peak: 0.016,
      from: down ? -0.7 : 0.7,
      to: down ? 0.7 : -0.7,
    });
    vowel({
      pitch: midi(chord[0] - 24),
      from: down ? 'ah' : 'ee',
      to: down ? 'ee' : 'ah',
      t: 0.06,
      dur: 0.26,
      peak: 0.03,
      pan: down ? -0.2 : 0.2,
      wet: 0.3,
    });

    ping({ f: midi(chord[2]), t: lock, dur: 1.1, peak: 0.03 });
    ring({ f: midi(chord[0] + 12), ratio: 1.5, t: lock, dur: 0.1, peak: 0.02, glide: 0.04, wet: 0.3 });
    ring({
      f: midi(chord[1] + 12),
      ratio: 1.5,
      t: lock + 0.11,
      dur: 0.14,
      peak: 0.02,
      glide: 0.04,
      wet: 0.4,
      echoSend: 0.3,
    });
    tone({ f0: 55, f1: 46, t: lock, dur: 0.22, peak: 0.025, attack: 0.012 });
  },

  // a mechanical detent every so often while scrolling; the pitch climbs
  // through the page like a scan position
  detent({ progress = 0 }) {
    const pool = [81, 84, 86, 88, 91, 93, 96];
    const note = pool[Math.min(pool.length - 1, Math.floor(progress * pool.length))];
    tone({ type: 'triangle', f0: midi(note), dur: 0.035, peak: 0.14, attack: 0.003, pan: rand(-0.2, 0.2) });
    hiss({ type: 'highpass', f0: 7000, dur: 0.012, peak: 0.07, attack: 0.003 });
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

// ── The director ──
// Several cues firing at once is what makes interface sound annoying, so
// nothing plays without the director's say-so. Cues come in four kinds:
//   ambient     hover, scroll ticks, read-out scans: the quiet texture. Dropped
//               whenever something bigger is sounding, and ducked if already on.
//   feedback    a direct answer to the visitor's action (click, menu, lightbox,
//               toggles). Always plays, and quiets the ambient layer.
//   transition  a new page. Same as feedback, but longer.
//   event       the section scan, which fires on its own as you scroll. It
//               yields to a feedback cue that has only just played.
const KIND = { hover: 'ambient', detent: 'ambient', scan: 'ambient', section: 'event', page: 'transition' };

// How long each cue keeps the ambient layer quiet after it starts (ms).
const QUIET = {
  page: 1100,
  section: 1200,
  open: 600,
  close: 500,
  menuOpen: 500,
  menuClose: 400,
  click: 300,
  back: 300,
  jump: 1100, // the smooth scroll that follows takes about this long
  toggle: 250,
  on: 800,
  off: 700,
};

// Minimum gap between two plays of the same cue, in ms.
const MIN_GAP = { hover: 150, detent: 450, section: 900, scan: 400, click: 60, page: 400 };
const MAX_VOICES = 48; // a runaway guard only: one section scan alone uses ~20
const HOVER_BURST = { window: 1600, max: 3 }; // at most 3 hover pings per 1.6s

let quietUntil = 0;
let lastFeedbackAt = -Infinity;
let hoverTimes = [];

// Pull the ambient layer down under a bigger cue, and bring it back after.
function duck(holdMs) {
  if (!ambient) return;
  const now = ctx.currentTime;
  ambient.gain.cancelScheduledValues(now);
  ambient.gain.setTargetAtTime(0.12, now, 0.02);
  ambient.gain.setTargetAtTime(1, now + holdMs / 1000, 0.2);
}

export function playSound(name, options = {}) {
  if (state !== 'on' && !options.force) return;
  const cue = CUES[name];
  if (!cue) return;

  const now = performance.now();
  if (now - (lastPlayed[name] ?? -Infinity) < (MIN_GAP[name] ?? 40)) return;

  const kind = KIND[name] ?? 'feedback';
  if (kind === 'ambient' && now < quietUntil) return;
  if (kind === 'event' && now - lastFeedbackAt < 500) return;
  if (name === 'hover') {
    hoverTimes = hoverTimes.filter((at) => now - at < HOVER_BURST.window);
    // sweeping across a row of items shouldn't machine-gun
    if (hoverTimes.length >= HOVER_BURST.max) return;
  }

  const context = ensureContext();
  if (!context || activeVoices > MAX_VOICES) return;

  const run = () => {
    const at = performance.now();
    lastPlayed[name] = at;
    if (name === 'hover') hoverTimes.push(at);
    if (kind !== 'ambient') {
      const hold = QUIET[name] ?? 300;
      quietUntil = Math.max(quietUntil, at + hold);
      if (kind !== 'event') lastFeedbackAt = at;
      duck(hold);
    }
    bus = kind === 'ambient' ? ambient : master;
    try {
      cue(options);
    } catch {
      // audio is decoration: never let it break an interaction
    }
    bus = master;
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
