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
let bakedOut = null; // where pre-rendered cues enter the live chain
let bakedAmbient = null; // ...and the quiet ones, so they can be ducked too
let levelScale = 1; // multiplies every voice's peak while a cue is scheduled
let counting = true; // false while a cue is scheduled for offline rendering
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
// The same chain is built twice: once on the live context, and once on each
// offline context used to pre-render a cue (see "Pre-rendered cues" below), so
// a pre-rendered cue has exactly the level and character of a live one.
const impulseCache = new Map(); // sample rate -> reverb impulse
const noiseCache = new Map(); // sample rate -> white noise
let clipCurve = null;

function impulseFor(context) {
  const rate = context.sampleRate;
  if (!impulseCache.has(rate)) {
    const length = Math.floor(rate * 1.3);
    const impulse = context.createBuffer(2, length, rate);
    for (let c = 0; c < 2; c++) {
      const data = impulse.getChannelData(c);
      for (let i = 0; i < length; i++) {
        // fade the first ~12ms in: an impulse that starts at full level turns
        // every note attack into a sharp early reflection
        const onset = Math.min(1, i / (rate * 0.012));
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3.2) * onset;
      }
    }
    impulseCache.set(rate, impulse);
  }
  return impulseCache.get(rate);
}

function noiseFor(context) {
  const rate = context.sampleRate;
  if (!noiseCache.has(rate)) {
    const noise = context.createBuffer(1, rate, rate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < rate; i++) data[i] = Math.random() * 2 - 1;
    noiseCache.set(rate, noise);
  }
  return noiseCache.get(rate);
}

function createGraph(context) {
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -14;
  compressor.knee.value = 12;
  compressor.ratio.value = 6;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.18;

  // a brick-wall ceiling after the compressor, so stacked cues can't clip
  const limiter = context.createDynamicsCompressor();
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
  const entry = context.createGain(); // the clipper's input; pre-rendered cues join here
  entry.gain.value = 0.5;
  const clipper = context.createWaveShaper();
  if (!clipCurve) {
    clipCurve = new Float32Array(2048);
    for (let i = 0; i < clipCurve.length; i++) {
      clipCurve[i] = Math.tanh((i / (clipCurve.length - 1)) * 4 - 2);
    }
  }
  clipper.curve = clipCurve;
  clipper.oversample = '2x';
  limiter.connect(entry);
  entry.connect(clipper);
  clipper.connect(context.destination);

  const masterGain = context.createGain();
  masterGain.gain.value = 4.5; // cue peaks below are written small; this sets the level
  masterGain.connect(compressor);

  const ambientGain = context.createGain();
  ambientGain.connect(masterGain);

  // a short, bright room, so the blips feel like they're inside a machine
  const wet = context.createGain();
  wet.gain.value = 0.7;
  wet.connect(compressor);

  const room = context.createConvolver();
  room.buffer = impulseFor(context);
  room.connect(wet);

  const delay = context.createDelay(1);
  delay.delayTime.value = 0.17;
  const feedback = context.createGain();
  feedback.gain.value = 0.32;
  const delayTone = context.createBiquadFilter();
  delayTone.type = 'lowpass';
  delayTone.frequency.value = 2400;
  delay.connect(delayTone);
  delayTone.connect(feedback);
  feedback.connect(delay);
  delayTone.connect(wet);

  return {
    master: masterGain,
    ambient: ambientGain,
    wetBus: wet,
    reverb: room,
    echo: delay,
    noise: noiseFor(context),
    entry,
  };
}

function buildGraph() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;

  ctx = new AudioContextClass({ latencyHint: 'interactive' });
  const graph = createGraph(ctx);
  master = graph.master;
  ambient = graph.ambient;
  wetBus = graph.wetBus;
  reverb = graph.reverb;
  echo = graph.echo;
  noiseBuffer = graph.noise;
  bus = master;

  // the entrance for pre-rendered cues: they skip the compressors (already
  // applied when rendered) and join just before the soft clip
  bakedOut = ctx.createGain();
  bakedOut.connect(graph.entry);
  bakedAmbient = ctx.createGain();
  bakedAmbient.connect(bakedOut);

  return true;
}

// iOS keeps audio locked until something has been played inside a touch
// gesture: a one-sample silent buffer is enough to open it for good.
function openOutput() {
  try {
    const source = ctx.createBufferSource();
    source.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // not worth failing over
  }
}

function ensureContext() {
  if (!ctx) {
    if (!buildGraph()) return null;
    openOutput();
  }
  // 'interrupted' is iOS's word for "something else took the audio"
  if (ctx.state !== 'running' && !hiddenSuspend) ctx.resume().catch(() => {});
  return ctx;
}

// Call from a user gesture (the global listener in <SoundFX /> does): it
// creates / wakes the audio context if the visitor has sound switched on.
export function unlockSound() {
  if (state !== 'on') return;
  ensureContext();
  warmUpSound();
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
  param.exponentialRampToValueAtTime(Math.max(0.0002, peak * levelScale), t + attack);
  param.exponentialRampToValueAtTime(0.0001, t + dur);
}

function track(source, stopAt, t) {
  source.stop(stopAt);
  // offline renders aren't "live voices": they must not count toward the cap
  if (counting) {
    activeVoices += 1;
    source.onended = () => {
      activeVoices -= 1;
    };
  }
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
  // A sensor ping. `idx` picks the note from the persona's pentatonic pool
  // (playSound walks it up and down as the pointer sweeps across items, so
  // moving the mouse feels like playing an instrument); the pan follows the
  // pointer. Each ping has a ring-modulated robot overtone and a tiny servo
  // whirr: blue is high and bright, red low and heavy.
  hover({ tone: persona, pan = 0, idx = 0 }) {
    const pool = POOLS[persona] ?? POOLS.neutral;
    const f = midi(pool[idx % pool.length]);
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
  // sonar pings. The biggest cue, but it only plays when the page itself
  // changes, so it's kept well below a shout.
  page() {
    hiss({ f0: 280, f1: 4200, q: 1.1, dur: 0.5, peak: 0.032, attack: 0.12, pan: -0.7, panEnd: 0.7, wet: 0.3 });
    tone({ f0: 110, f1: 220, dur: 0.4, peak: 0.045, attack: 0.04 });
    vowel({ pitch: 82, from: 'oo', to: 'ah', t: 0.05, dur: 0.36, peak: 0.03, wet: 0.35 });
    [69, 76, 81].forEach((note, i) => ping({ f: midi(note), t: 0.2 + i * 0.09, dur: 0.65, peak: 0.028 }));
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

  // The AI settles on a new section. A short burst of data blips sweeps the
  // stereo field (left to right as you scroll down, back as you scroll up),
  // then a sonar ping lands with two soft robotic tones. Each section has its
  // own key. Kept short and light on purpose: it plays every time you move
  // into a new section, so it must never wear on you. `index` is the section
  // (0 = top of the page), `dir` is +1 / -1.
  section({ index = 0, dir = 1 }) {
    const chords = [
      [64, 71, 76], // top of the page
      [69, 76, 81], // work
      [72, 79, 84], // about
      [74, 81, 86], // testimonials
      [76, 83, 88], // contact
    ];
    const chord = chords[index] ?? chords[1];
    const down = dir >= 0;
    const lock = 0.2;

    hiss({
      f0: down ? 400 : 4200,
      f1: down ? 4200 : 400,
      q: 1.4,
      dur: 0.22,
      peak: 0.024,
      attack: 0.08,
      pan: down ? -0.5 : 0.5,
      panEnd: down ? 0.5 : -0.5,
      wet: 0.2,
    });

    flutter({
      count: 5,
      step: 0.032,
      dir,
      peak: 0.012,
      from: down ? -0.5 : 0.5,
      to: down ? 0.5 : -0.5,
    });

    ping({ f: midi(chord[2]), t: lock, dur: 0.8, peak: 0.026 });
    ring({ f: midi(chord[0] + 12), ratio: 1.5, t: lock, dur: 0.09, peak: 0.018, glide: 0.04, wet: 0.3 });
    ring({
      f: midi(chord[1] + 12),
      ratio: 1.5,
      t: lock + 0.1,
      dur: 0.12,
      peak: 0.018,
      glide: 0.04,
      wet: 0.4,
      echoSend: 0.3,
    });
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
const KIND = { hover: 'ambient', scan: 'ambient', section: 'event', page: 'transition' };

// How long each cue keeps the ambient layer quiet after it starts (ms).
const QUIET = {
  page: 1100,
  section: 900,
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
// (section is spaced well apart: it should mark a move to a new part of the page, not chatter)
const MIN_GAP = { hover: 150, section: 2200, scan: 400, click: 60, page: 400 };
const MAX_VOICES = 48; // a runaway guard only: one section scan alone uses ~20
const HOVER_BURST = { window: 1600, max: 3 }; // at most 3 hover pings per 1.6s

let quietUntil = 0;
let lastFeedbackAt = -Infinity;
let hoverTimes = [];

// Pull the ambient layer down under a bigger cue, and bring it back after.
function duck(holdMs) {
  if (!ctx) return;
  const now = ctx.currentTime;
  for (const layer of [ambient, bakedAmbient]) {
    if (!layer) continue;
    layer.gain.cancelScheduledValues(now);
    layer.gain.setTargetAtTime(0.12, now, 0.02);
    layer.gain.setTargetAtTime(1, now + holdMs / 1000, 0.2);
  }
}

// ── Pre-rendered cues ──
// Synthesising a cue live means building 5 to 20 audio nodes the instant you
// hover or tap, plus a reverb and an echo running on the audio thread. On a
// phone that is what makes sound hesitate (the cue arrives late) and crackle.
// So each cue is rendered once, offline, into a buffer, and playing it is a
// single buffer source. A cue that isn't rendered yet simply plays live as
// before, so nothing is ever missing, only slower.
const BAKE_RATE = 32000;
const baked = new Map(); // key -> AudioBuffer

function bakeKey(name, o = {}) {
  switch (name) {
    case 'hover':
      return `hover:${o.tone ?? 'neutral'}:${o.idx ?? 0}`;
    case 'scan':
      return `scan:${o.tone ?? 'neutral'}`;
    case 'section':
      return `section:${o.index ?? 0}:${(o.dir ?? 1) >= 0 ? 1 : -1}`;
    default:
      return name;
  }
}

// Schedule one cue on a fresh offline context (with the same graph as the
// live one) and render it. The cue functions are synchronous, so swapping the
// module's graph variables around the call is safe.
function renderCue(name, options, seconds, channels) {
  const offline = new OfflineAudioContext(channels, Math.ceil(seconds * BAKE_RATE), BAKE_RATE);
  const graph = createGraph(offline);
  const saved = { ctx, master, ambient, wetBus, reverb, echo, noiseBuffer, bus, counting, levelScale };
  ctx = offline;
  master = graph.master;
  ambient = graph.ambient;
  wetBus = graph.wetBus;
  reverb = graph.reverb;
  echo = graph.echo;
  noiseBuffer = graph.noise;
  bus = graph.master;
  counting = false;
  levelScale = 1;
  try {
    CUES[name](options);
  } finally {
    ({ ctx, master, ambient, wetBus, reverb, echo, noiseBuffer, bus, counting, levelScale } = saved);
  }
  return offline.startRendering();
}

// What to pre-render, most-used first: [cue, options, seconds, channels].
// Cues that sweep across the stereo field are stereo; the rest are mono
// (hover gets its left/right position from a panner at play time).
function bakeJobs(touch) {
  const jobs = [
    ['click', {}, 0.8, 1],
    ['page', {}, 1.5, 2],
    ['menuOpen', {}, 1.1, 2],
    ['menuClose', {}, 0.8, 2],
    ['toggle', {}, 0.3, 1],
    ['open', {}, 0.8, 1],
    ['close', {}, 0.6, 1],
    ['jump', {}, 0.9, 2],
    ['back', {}, 0.4, 1],
  ];
  for (const index of [1, 2, 3, 4, 0]) {
    jobs.push(['section', { index, dir: 1 }, 1.2, 2], ['section', { index, dir: -1 }, 1.2, 2]);
  }
  jobs.push(['on', {}, 1.3, 1], ['off', {}, 1.0, 1]);
  // a touch screen has no hover: don't spend memory on those
  if (!touch) {
    for (const tone of ['neutral', 'blue', 'red']) {
      for (let idx = 0; idx < 8; idx++) jobs.push(['hover', { tone, idx }, 0.8, 1]);
    }
    jobs.push(['scan', { tone: 'blue' }, 0.7, 1], ['scan', { tone: 'red' }, 0.7, 1]);
  }
  return jobs;
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let warming = false;

// Renders the cues in the background, one at a time. Starts once the opening
// sequence is over, so it never competes with it.
export function warmUpSound() {
  if (warming || state !== 'on' || typeof OfflineAudioContext === 'undefined') return;
  warming = true;
  (async () => {
    const touch = window.matchMedia('(pointer: coarse)').matches;
    const root = document.documentElement;
    while (root.classList.contains('intro-playing') || root.classList.contains('intro-reveal')) {
      await pause(400);
    }
    await pause(900);
    for (const [name, options, seconds, channels] of bakeJobs(touch)) {
      if (state !== 'on') break;
      const key = bakeKey(name, options);
      if (baked.has(key)) continue;
      // a short, fixed breather between renders. (requestIdleCallback would
      // wait for the animated page to go quiet, which it rarely does; each
      // job costs the main thread only a few ms, the rendering is off-thread.)
      await pause(25);
      try {
        baked.set(key, await renderCue(name, options, seconds, channels));
      } catch {
        // a cue that fails to render just keeps playing live
      }
    }
  })().finally(() => {
    warming = false;
  });
}

// Play a pre-rendered cue: one buffer source (plus a gain and a panner only
// when this play needs them). Returns false if it isn't rendered yet.
function playBaked(name, options, level, kind) {
  const buffer = baked.get(bakeKey(name, options));
  if (!buffer || !bakedOut) return false;
  try {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    // a hair of pitch variation, so the same note never sounds machine-identical
    if (name === 'hover') source.playbackRate.value = 1 + (Math.random() - 0.5) * 0.05;
    let tail = source;
    if (level !== 1) {
      const gain = ctx.createGain();
      gain.gain.value = level;
      tail.connect(gain);
      tail = gain;
    }
    if (options.pan && buffer.numberOfChannels === 1 && ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.value = options.pan;
      tail.connect(panner);
      tail = panner;
    }
    tail.connect(kind === 'ambient' ? bakedAmbient : bakedOut);
    source.start();
    return true;
  } catch {
    return false;
  }
}

// Walks the pentatonic pool up and down as the pointer sweeps across items
// (it restarts after a pause), and softens each hover in a quick streak so a
// long sweep doesn't pile up.
let hoverStreak = 0;
function nextHover(tone, at) {
  hoverStep = at - hoverAt > 1100 ? 0 : hoverStep + 1;
  hoverStreak = at - hoverAt > 1400 ? 0 : hoverStreak + 1;
  hoverAt = at;
  const pool = POOLS[tone] ?? POOLS.neutral;
  const cycle = pool.length * 2 - 2;
  const k = hoverStep % cycle;
  return { idx: k < pool.length ? k : cycle - k, level: Math.max(0.4, 1 - hoverStreak * 0.2) };
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

    let cueOptions = options;
    let level = 1;
    if (name === 'hover') {
      const pick = nextHover(options.tone, at);
      cueOptions = { ...options, idx: pick.idx };
      level = pick.level;
    }

    if (playBaked(name, cueOptions, level, kind)) return;

    // not rendered yet: synthesise it live
    bus = kind === 'ambient' ? ambient : master;
    levelScale = level;
    try {
      cue(cueOptions);
    } catch {
      // audio is decoration: never let it break an interaction
    }
    bus = master;
    levelScale = 1;
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
    // During the opening sequence (announce: false) the audio graph isn't
    // built yet: the intro has its own sound and the site's engine is created
    // on the first gesture after it, so nothing extra is set up at that moment.
    if (announce) ensureContext();
    emit();
    warmUpSound();
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
