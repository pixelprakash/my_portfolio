// Runs the v2 hero's picture (see pillShader) on a canvas: sizing, the frame
// loop, the clear patch, and the timing of the two pills.
import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl';
import { fragment, vertex } from './pillShader';

const INTRO_MS = 1700;
// how long a pill's world takes to cover the stage, and to drain back
const SPREAD_MS = 950;
const RETREAT_MS = 620;
const WORLDS = ['blue', 'red'];
// frozen moment shown to people who asked for less motion
const STILL_TIME = 8;

// The characters the code view is built from, drawn once onto an 8 x 8 sheet.
function glyphSheet() {
  const characters =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ0123456789{}[]()<>/=;+*$#&|';
  const size = 32;
  const sheet = document.createElement('canvas');
  sheet.width = size * 8;
  sheet.height = size * 8;
  const ctx = sheet.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, sheet.width, sheet.height);
  ctx.fillStyle = '#fff';
  ctx.font = '700 25px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const list = Array.from(characters);
  for (let i = 0; i < 64; i++) {
    ctx.fillText(list[i % list.length], (i % 8) * size + size / 2, Math.floor(i / 8) * size + size / 2 + 1);
  }
  return sheet;
}

// Starts drawing into a canvas it adds to `host`. Returns null when WebGL
// isn't available, so the caller can leave the plain <img> showing.
export function createPillStage({ host, frame, image, onReady, onLost }) {
  let renderer;
  const canvas = document.createElement('canvas');
  const coarse = window.matchMedia('(pointer: coarse), (max-width: 768px)').matches;
  try {
    renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.6),
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
    });
  } catch {
    return null;
  }
  const { gl } = renderer;
  if (!gl) return null;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frameGap = coarse ? 1000 / 24 : 1000 / 36;

  const texture = new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR });
  texture.image = image;
  const glyphs = new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR });
  glyphs.image = glyphSheet();

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uPhoto: { value: texture },
      uGlyphs: { value: glyphs },
      uWorld: { value: [0, 0] },
      uLift: { value: [0, 0] },
      uTop: { value: 0 },
      uRes: { value: [1, 1] },
      uFrame: { value: [0, 0, 1, 1] },
      uLens: { value: [0, 0, 0] },
      uClean: { value: 0 },
      uTime: { value: 0 },
      uIntro: { value: reduce ? 1 : 0 },
    },
  });
  // a shader that fails to link leaves no attribute locations behind
  if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) return null;

  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  // where the pointer wants the clear patch, and where it is now (eased)
  const target = { x: 0, y: 0, on: 0 };
  const lens = { x: 0, y: 0, on: 0 };
  let cleanTarget = 0;
  let clean = 0;
  // the pill in play (0 blue, 1 red, -1 none), and each world's progress
  let pill = -1;
  const world = [0, 0];
  const lift = [0, 0];

  let frameId = 0;
  let last = 0;
  let started = 0;
  let time = reduce ? STILL_TIME : 0;
  let onScreen = true;
  let ready = false;

  function draw() {
    program.uniforms.uTime.value = time;
    program.uniforms.uLens.value = [lens.x, lens.y, lens.on];
    program.uniforms.uClean.value = clean;
    program.uniforms.uWorld.value = [world[0], world[1]];
    program.uniforms.uLift.value = [lift[0], lift[1]];
    renderer.render({ scene: mesh });
    if (!ready) {
      ready = true;
      onReady?.();
    }
  }

  function step(dt) {
    const ease = reduce ? 1 : 1 - Math.exp(-dt / 90);
    lens.x += (target.x - lens.x) * ease;
    lens.y += (target.y - lens.y) * ease;
    lens.on += (target.on - lens.on) * ease;
    clean += (cleanTarget - clean) * ease;
    stepPills(dt);
  }

  function stepPills(dt) {
    const rise = reduce ? 1 : 1 - Math.exp(-dt / 150);
    for (let i = 0; i < WORLDS.length; i++) {
      const wanted = pill === i;
      lift[i] += ((wanted ? 1 : 0) - lift[i]) * rise;
      if (lift[i] < 0.002) lift[i] = 0;

      if (reduce) {
        world[i] = wanted ? 1 : 0;
      } else if (wanted) {
        world[i] = Math.min(1, world[i] + dt / SPREAD_MS);
      } else if (pill === -1) {
        world[i] = Math.max(0, world[i] - dt / RETREAT_MS);
      } else if (world[pill] >= 1) {
        // the other world has covered it completely: it can go unseen
        world[i] = 0;
      }
    }
  }

  function tick(now) {
    frameId = requestAnimationFrame(tick);
    if (now - last < frameGap) return;
    const dt = Math.min(now - (last || now), 100);
    last = now;
    if (!started) started = now;
    time += dt / 1000;
    const t = Math.min(1, (now - started) / INTRO_MS);
    program.uniforms.uIntro.value = 1 - (1 - t) ** 3;
    step(dt);
    draw();
  }

  // With reduced motion nothing loops: a frame is drawn only when asked.
  function redraw() {
    if (!reduce || frameId) return;
    frameId = requestAnimationFrame(() => {
      frameId = 0;
      step(0);
      draw();
    });
  }

  function sync() {
    if (reduce) return redraw();
    const run = onScreen && !document.hidden;
    if (run && !frameId) {
      last = 0;
      frameId = requestAnimationFrame(tick);
    } else if (!run && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
    return undefined;
  }

  function resize() {
    const box = host.getBoundingClientRect();
    const inner = frame.getBoundingClientRect();
    if (!box.width || !box.height) return;
    renderer.setSize(box.width, box.height);
    program.uniforms.uRes.value = [box.width, box.height];
    program.uniforms.uFrame.value = [inner.left - box.left, inner.top - box.top, inner.width, inner.height];
    if (reduce || !frameId) draw();
  }

  const resizer = new ResizeObserver(resize);
  resizer.observe(host);
  resizer.observe(frame);

  const watcher = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    sync();
  });
  watcher.observe(host);

  document.addEventListener('visibilitychange', sync);

  const lost = (event) => {
    event.preventDefault();
    onLost?.();
  };
  canvas.addEventListener('webglcontextlost', lost);

  resize();
  sync();

  return {
    // x / y are CSS px from the stage's top-left corner
    point(x, y) {
      if (lens.on < 0.02) {
        lens.x = x;
        lens.y = y;
      }
      target.x = x;
      target.y = y;
      target.on = 1;
      redraw();
    },
    release() {
      target.on = 0;
      redraw();
    },
    // 'blue', 'red' or null
    setPill(name) {
      const next = WORLDS.indexOf(name);
      if (next === pill) return;
      pill = next;
      if (next >= 0) program.uniforms.uTop.value = next;
      redraw();
    },
    setClean(value) {
      cleanTarget = value ? 1 : 0;
      redraw();
    },
    destroy() {
      cancelAnimationFrame(frameId);
      resizer.disconnect();
      watcher.disconnect();
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
