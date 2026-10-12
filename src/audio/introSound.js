// Procedural score for the opening sequence, synthesised live with the Web
// Audio API: no audio files to ship or license. Works on any BaseAudioContext,
// so it can also be rendered offline (see the check in the project notes).
//
// Shape of the piece (125 BPM, A minor): restrained minimal-techno rather
// than game-y sound design.
//   start()  a soft power-up swell, then a bed that builds: sub drone, a
//            filtered saw arpeggio through an echo (8ths -> 16ths as the
//            filter opens), kick + hats from the second beat, and a noise
//            riser.
//   blip(n)  a small pentatonic pluck for each boot-log line; the last one is
//            a soft chime.
//   exit()   the bed cuts out; a deep sub-drop lands with a short transient,
//            a warm chord blooms, a soft latch releases and a stereo air
//            sweep opens out to left and right with the doors.

const BPM = 125;
const STEP = 60 / BPM / 4; // one 16th note, in seconds

// Tail of the exit piece, in seconds after exit(); the context closes after it.
export const EXIT_TAIL = 3.4;

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

function makeImpulse(ctx, seconds = 2.2, decay = 3.2) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buffer;
}

function makeNoise(ctx, seconds = 2) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export function createIntroSound(ctx) {
  const offline = typeof OfflineAudioContext !== 'undefined' && ctx instanceof OfflineAudioContext;
  const state = { exited: false, stopped: false };

  // ── Graph: voices → (bed bus | out) → compressor → analyser → speakers ──
  const out = ctx.createGain();
  out.gain.value = 0.0001;

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -14;
  compressor.knee.value = 12;
  compressor.ratio.value = 5;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.2;

  // Exposed so the UI can draw the spectrum and pulse to the bass.
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.78;

  out.connect(compressor);
  compressor.connect(analyser);
  analyser.connect(ctx.destination);

  const reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(ctx);
  const reverbIn = ctx.createGain();
  const reverbOut = ctx.createGain();
  reverbOut.gain.value = 0.55;
  reverbIn.connect(reverb);
  reverb.connect(reverbOut);
  reverbOut.connect(out);

  // Everything that belongs to the build-up lives on `bed`, so a single gain
  // move at exit() silences it all at once.
  const bed = ctx.createGain();
  bed.connect(out);
  const bedSend = ctx.createGain();
  bedSend.gain.value = 0.22;
  bed.connect(bedSend);
  bedSend.connect(reverbIn);

  const echo = ctx.createDelay(1);
  echo.delayTime.value = STEP * 1.5;
  const echoFeedback = ctx.createGain();
  echoFeedback.gain.value = 0.36;
  const echoTone = ctx.createBiquadFilter();
  echoTone.type = 'lowpass';
  echoTone.frequency.value = 2600;
  echo.connect(echoTone);
  echoTone.connect(echoFeedback);
  echoFeedback.connect(echo);
  echoTone.connect(bed);

  const noiseBuffer = makeNoise(ctx, 2);

  // ── Voices ──
  function envelope(param, t, { attack, hold, release, peak }) {
    param.cancelScheduledValues(t);
    param.setValueAtTime(0.0001, t);
    param.exponentialRampToValueAtTime(peak, t + attack);
    param.setValueAtTime(peak, t + attack + hold);
    param.exponentialRampToValueAtTime(0.0001, t + attack + hold + release);
  }

  function route(node, { dest = out, wet = 0, echoSend = 0 }) {
    node.connect(dest);
    if (wet > 0) {
      const send = ctx.createGain();
      send.gain.value = wet;
      node.connect(send);
      send.connect(reverbIn);
    }
    if (echoSend > 0) {
      const send = ctx.createGain();
      send.gain.value = echoSend;
      node.connect(send);
      send.connect(echo);
    }
  }

  function tone({
    type = 'sine',
    f0,
    f1,
    t,
    dur,
    peak = 0.2,
    attack = 0.005,
    release,
    detune = 0,
    filter,
    dest,
    wet,
    echoSend,
  }) {
    const rel = Math.min(release ?? dur * 0.5, dur - attack);
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.detune.value = detune;
    osc.frequency.setValueAtTime(f0, t);
    if (f1 != null) osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);

    const gain = ctx.createGain();
    envelope(gain.gain, t, { attack, hold: Math.max(0, dur - attack - rel), release: rel, peak });

    let node = osc;
    if (filter) {
      const biquad = ctx.createBiquadFilter();
      biquad.type = filter.type;
      biquad.Q.value = filter.q ?? 1;
      biquad.frequency.setValueAtTime(filter.f0, t);
      if (filter.f1 != null) biquad.frequency.exponentialRampToValueAtTime(filter.f1, t + dur);
      node.connect(biquad);
      node = biquad;
    }
    node.connect(gain);
    route(gain, { dest, wet, echoSend });

    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  function noise({
    t,
    dur,
    peak = 0.2,
    attack = 0.01,
    release,
    type = 'bandpass',
    f0,
    f1,
    q = 1,
    pan,
    panEnd,
    dest,
    wet,
  }) {
    const rel = Math.min(release ?? dur * 0.6, dur - attack);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const biquad = ctx.createBiquadFilter();
    biquad.type = type;
    biquad.Q.value = q;
    biquad.frequency.setValueAtTime(f0, t);
    if (f1 != null) biquad.frequency.exponentialRampToValueAtTime(f1, t + dur);

    const gain = ctx.createGain();
    envelope(gain.gain, t, { attack, hold: Math.max(0, dur - attack - rel), release: rel, peak });

    source.connect(biquad);
    biquad.connect(gain);

    let tail = gain;
    if (pan != null && ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(pan, t);
      if (panEnd != null) panner.pan.linearRampToValueAtTime(panEnd, t + dur);
      gain.connect(panner);
      tail = panner;
    }
    route(tail, { dest, wet });

    source.start(t);
    source.stop(t + dur + 0.05);
  }

  // ── Drum / synth parts used by the bed ──
  const kick = (t) =>
    tone({ f0: 140, f1: 44, t, dur: 0.26, peak: 0.6, attack: 0.002, release: 0.24, dest: bed });

  const hat = (t) =>
    noise({
      t,
      dur: 0.04,
      peak: 0.06,
      attack: 0.002,
      type: 'highpass',
      f0: 8000,
      q: 0.7,
      dest: bed,
    });

  const arp = (t, note, cutoff) =>
    tone({
      type: 'sawtooth',
      f0: midi(note),
      t,
      dur: 0.14,
      peak: 0.075,
      attack: 0.005,
      release: 0.12,
      filter: { type: 'lowpass', f0: cutoff, f1: cutoff * 0.6, q: 3 },
      dest: bed,
      echoSend: 0.5,
    });

  const ARP_NOTES = [57, 60, 64, 69, 72, 69, 64, 60, 55, 59, 62, 67, 71, 67, 62, 59]; // Am | G

  // ── Public API ──
  function start(delay = 0) {
    const t0 = ctx.currentTime + delay + 0.03;

    out.gain.cancelScheduledValues(t0);
    out.gain.setValueAtTime(0.0001, t0);
    out.gain.exponentialRampToValueAtTime(0.85, t0 + 0.12);
    bed.gain.cancelScheduledValues(t0);
    bed.gain.setValueAtTime(1, t0);

    // power-up: a soft filtered swell and a single clean "online" tone
    tone({
      type: 'sawtooth',
      f0: 80,
      f1: 700,
      t: t0,
      dur: 0.45,
      peak: 0.1,
      filter: { type: 'lowpass', f0: 240, f1: 3200, q: 2 },
      wet: 0.4,
    });
    tone({ f0: 1318.5, t: t0 + 0.38, dur: 0.5, peak: 0.07, release: 0.45, wet: 0.5 });

    // the bed lines up with the progress bar's start
    const b = t0 + 0.2;

    // sub drone that swells in, plus a detuned saw whose filter opens
    tone({ f0: midi(33), t: b, dur: 4.2, peak: 0.5, attack: 1.4, release: 1, dest: bed });
    [-8, 8].forEach((detune) =>
      tone({
        type: 'sawtooth',
        f0: midi(45),
        t: b,
        dur: 3.6,
        peak: 0.05,
        attack: 1.2,
        release: 1,
        detune,
        filter: { type: 'lowpass', f0: 160, f1: 1100, q: 2 },
        dest: bed,
      })
    );

    // riser: bandpassed noise sweeping up, peaking right at 100%
    noise({
      t: b,
      dur: 2.15,
      peak: 0.1,
      attack: 2.0,
      release: 0.1,
      f0: 350,
      f1: 8000,
      q: 3,
      dest: bed,
      wet: 0.2,
    });

    for (let i = 0; i < 30; i++) {
      const t = b + i * STEP;
      if (i % 4 === 0 && i >= 4) kick(t);
      if (i % 2 === 1 && i >= 6) hat(t);
      // 8th notes at first, 16ths once the build is underway
      if (i >= 2 && (i >= 10 || i % 2 === 0)) {
        arp(t, ARP_NOTES[i % ARP_NOTES.length], 420 + i * 110);
      }
    }
  }

  // One soft pluck per boot-log line; the last is a quiet "ready" chime.
  function blip(index, delay = 0) {
    const t = ctx.currentTime + delay + 0.01;
    const pairs = [
      [659.3, 987.8], // E5 B5
      [783.99, 1174.7], // G5 D6
      [880, 1318.5], // A5 E6
    ];
    if (index < pairs.length) {
      const [a, b] = pairs[index];
      tone({ type: 'triangle', f0: a, t, dur: 0.22, peak: 0.07, release: 0.2, wet: 0.35, echoSend: 0.3 });
      tone({ type: 'triangle', f0: b, t: t + 0.08, dur: 0.3, peak: 0.07, release: 0.28, wet: 0.4, echoSend: 0.3 });
    } else {
      [880, 1318.5, 1760].forEach((f, k) =>
        tone({ f0: f, t: t + k * 0.09, dur: 1.4, peak: 0.07, release: 1.2, wet: 0.7 })
      );
    }
  }

  function exit(delay = 0) {
    if (state.exited || state.stopped) return;
    state.exited = true;
    const e = ctx.currentTime + delay + 0.02;

    // the build cuts out: a beat of near-silence before the hit
    bed.gain.cancelScheduledValues(e);
    bed.gain.setValueAtTime(1, e);
    bed.gain.linearRampToValueAtTime(0, e + 0.09);

    // a short, dry transient, then the sub-drop it sits on
    noise({
      t: e + 0.12,
      dur: 0.05,
      peak: 0.22,
      attack: 0.001,
      release: 0.045,
      type: 'bandpass',
      f0: 1800,
      q: 0.8,
    });
    tone({ f0: 78, f1: 30, t: e + 0.12, dur: 1.9, peak: 0.8, attack: 0.006, release: 1.7, wet: 0.15 });
    noise({
      t: e + 0.12,
      dur: 0.9,
      peak: 0.25,
      attack: 0.01,
      release: 0.85,
      type: 'lowpass',
      f0: 500,
      f1: 70,
      q: 0.6,
      wet: 0.4,
    });

    // a warm A-minor-add-9 chord that blooms open and decays long
    [45, 57, 64, 67, 71].forEach((note) =>
      [-6, 6].forEach((detune) =>
        tone({
          type: 'sawtooth',
          f0: midi(note),
          t: e + 0.25,
          dur: 2.8,
          peak: 0.03,
          attack: 0.7,
          release: 2,
          detune,
          filter: { type: 'lowpass', f0: 300, f1: 2400, q: 1 },
          wet: 0.55,
        })
      )
    );

    // the doors: a soft latch, then air opening out to hard left and right
    noise({
      t: e + 0.25,
      dur: 0.03,
      peak: 0.16,
      attack: 0.001,
      release: 0.028,
      type: 'bandpass',
      f0: 2400,
      q: 2,
    });
    tone({ f0: 96, t: e + 0.25, dur: 0.16, peak: 0.28, attack: 0.002, release: 0.15 });
    [-1, 1].forEach((side) =>
      noise({
        t: e + 0.3,
        dur: 1.15,
        peak: 0.2,
        attack: 0.3,
        release: 0.75,
        f0: 260,
        f1: 2200,
        q: 0.9,
        pan: side * 0.1,
        panEnd: side * 1,
        wet: 0.3,
      })
    );

    // one high, quiet note as the page settles
    tone({ f0: 1760, t: e + 1.0, dur: 1.6, peak: 0.035, attack: 0.004, release: 1.5, wet: 0.85 });

    // fade the whole thing out
    out.gain.setValueAtTime(0.85, e + 2.3);
    out.gain.exponentialRampToValueAtTime(0.0001, e + 3.3);

    if (!offline) setTimeout(close, (delay + EXIT_TAIL) * 1000);
  }

  function close() {
    if (offline || typeof ctx.close !== 'function') return;
    ctx.close().catch(() => {});
  }

  // Quick fade + close, for when the loader goes away before exit() ran.
  function stop() {
    if (offline || state.stopped) return;
    state.stopped = true;
    const now = ctx.currentTime;
    out.gain.cancelScheduledValues(now);
    out.gain.setTargetAtTime(0.0001, now, 0.03);
    setTimeout(close, 250);
  }

  // Safe to call on unmount: leaves a running exit() tail alone.
  function release() {
    if (!state.exited) stop();
  }

  return { analyser, start, blip, exit, release, stop };
}
