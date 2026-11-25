// The v2 hero's picture, drawn in one WebGL pass:
//   1. spectrum light streaming out of the sunglasses, and slit-scan columns
//      rising from the floor;
//   2. the portrait in front of it, seen through ribbed (fluted) glass, with a
//      cobalt rim light on one side and coral on the other;
//   3. a round "clear patch" in the glass that shows the untouched photo.
// The photo file is never changed. It is cropped to chest height here, which
// leaves the v1 pills out of the picture.
import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl';

// How much of the photo's height is shown (the hands start just below this).
export const CROP = 0.7;
// Where the sunglasses sit, as fractions of the cropped frame.
const EYES = { x: 0.506, y: 0.307 };

const vertex = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uPhoto;
  uniform vec2 uRes;       // canvas size, CSS px
  uniform vec4 uFrame;     // portrait box: x, y, width, height (CSS px)
  uniform vec3 uLens;      // x, y, strength (0..1)
  uniform float uClean;    // 1 = the whole photo, no glass
  uniform float uTime;
  uniform float uIntro;    // 0 -> 1 as the picture resolves
  varying vec2 vUv;

  const float CROP = ${CROP.toFixed(3)};
  const vec2 EYES = vec2(${EYES.x.toFixed(3)}, ${EYES.y.toFixed(3)});

  const vec3 INK     = vec3(0.016, 0.016, 0.024);
  const vec3 COBALT  = vec3(0.09, 0.22, 1.0);
  const vec3 CYAN    = vec3(0.16, 0.74, 1.0);
  const vec3 ICE     = vec3(0.93, 0.97, 1.0);
  const vec3 AMBER   = vec3(1.0, 0.66, 0.22);
  const vec3 CORAL   = vec3(1.0, 0.27, 0.16);
  const vec3 MAGENTA = vec3(0.84, 0.12, 0.55);

  float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
  }

  // t in -1..1 across a beam: coral, amber, a white core, cyan, cobalt
  vec3 spectrum(float t) {
    vec3 c = mix(MAGENTA, CORAL, smoothstep(-1.0, -0.72, t));
    c = mix(c, AMBER, smoothstep(-0.66, -0.34, t));
    c = mix(c, ICE, smoothstep(-0.3, -0.02, t));
    c = mix(c, CYAN, smoothstep(0.08, 0.46, t));
    c = mix(c, COBALT, smoothstep(0.5, 0.92, t));
    return c;
  }

  vec3 backdrop(vec2 p) {
    vec3 col = INK;
    vec2 eye = uFrame.xy + EYES * uFrame.zw;
    float h = uFrame.w;

    // soft cobalt air behind the head
    vec2 q = (p - eye) / vec2(h * 0.62, h * 0.5);
    col += COBALT * 0.2 * exp(-dot(q, q) * 1.5);

    // the beams: they leave the lenses narrow, then spread and sag
    float dx = p.x - eye.x;
    float reach = max(eye.x, uRes.x - eye.x);
    float d = abs(dx) / reach;
    float side = dx < 0.0 ? 0.0 : 1.0;
    float wave = sin(d * 4.2 - uTime * 0.35 + side * 2.4) * h * 0.012 * d;
    float centre = eye.y + pow(d, 1.9) * h * (side < 0.5 ? 0.1 : 0.14) + wave;
    float spread = h * (0.026 + 0.12 * pow(d, 1.25));
    float t = (p.y - centre) / spread;

    float lane = floor((t + 3.0) * 11.0);
    float flow = noise(d * 7.0 - uTime * (0.5 + hash(lane) * 0.5) + hash(lane + side * 31.0) * 40.0);
    float strands = 0.5 + 0.5 * pow(0.5 + 0.5 * sin((t + 3.0) * 34.5), 2.0);
    float body = exp(-pow(abs(t), 3.0) * 1.35);
    float grown = smoothstep(0.0, 0.3, uIntro * 1.45 - d);
    float beam = body * strands * (0.62 + 0.62 * flow) * grown;
    beam *= 1.0 - 0.34 * smoothstep(0.55, 1.0, d);
    col += spectrum(clamp(t, -1.0, 1.0)) * beam * 0.92;
    col += spectrum(clamp(t * 0.55, -1.0, 1.0)) * exp(-t * t * 0.28) * 0.13 * grown; // bloom

    // slit-scan columns standing on the floor
    float colW = max(5.0, uRes.x / 190.0);
    float id = floor(p.x / colW);
    float height = uRes.y * (0.07 + 0.3 * pow(noise(id * 0.17 + uTime * 0.07), 2.0)) * uIntro;
    float up = (uRes.y - p.y) / max(height, 1.0);
    float column = (1.0 - smoothstep(0.0, 1.0, up)) * (0.55 + 0.45 * hash(id));
    float across = p.x / uRes.x;
    vec3 floorCol = mix(COBALT, CORAL, smoothstep(0.34, 0.72, across));
    col += mix(floorCol, ICE, pow(max(1.0 - up, 0.0), 6.0) * 0.35) * column * 0.3;

    return col;
  }

  // The photo at a point given in frame coordinates (0..1, top-left origin).
  vec4 photo(vec2 f) {
    if (f.x < 0.0 || f.x > 1.0 || f.y < 0.0 || f.y > 1.0) return vec4(0.0);
    return texture2D(uPhoto, vec2(f.x, 1.0 - f.y * CROP));
  }

  float lensShape(vec2 f, vec2 c, vec2 r) {
    vec2 q = (f - c) / r;
    return 1.0 - smoothstep(0.55, 1.05, dot(q * q, q * q) + 0.25 * dot(q, q));
  }

  void main() {
    vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uRes;
    vec3 col = backdrop(p);

    vec2 f = (p - uFrame.xy) / uFrame.zw;
    float settle = 1.0 - uIntro;

    // ribbed glass: each rib is a thin cylinder lens
    float rib = clamp(uFrame.z / 64.0, 6.0, 15.0);
    float local = fract(p.x / rib + 0.02 * sin(uTime * 0.4)) - 0.5;
    // gentle over the face so it still reads; stronger further out
    float away = smoothstep(0.1, 0.46, length((f - vec2(0.506, 0.33)) * vec2(1.0, 0.86)));
    float strength = mix(0.34, 1.35, away) + settle * settle * 7.0;
    float shift = local * rib * strength / uFrame.z;

    vec4 g = photo(f + vec2(shift, 0.0));
    vec4 r = photo(f + vec2(shift * 1.28 + 0.0012, 0.0));
    vec4 b = photo(f + vec2(shift * 0.72 - 0.0012, 0.0));
    float alpha = max(g.a, max(r.a, b.a));
    vec3 glass = vec3(r.r * r.a, g.g * g.a, b.b * b.a) / max(alpha, 0.001);

    // rim light: bright edges of the photo take colour, cobalt left, coral right
    float lum = dot(glass, vec3(0.299, 0.587, 0.114));
    vec3 key = mix(CYAN * vec3(0.6, 0.75, 1.0), CORAL, smoothstep(0.4, 0.62, f.x));
    float edge = smoothstep(0.07, 0.36, abs(f.x - 0.506));
    vec3 treated = mix(vec3(lum) * vec3(0.97, 0.99, 1.04), key * lum * 1.75, edge * 0.82);
    treated += key * edge * smoothstep(0.35, 0.95, lum) * 0.22;
    treated *= 0.94 + 0.12 * (1.0 - abs(local) * 2.0);
    treated += pow(abs(local) * 2.0, 9.0) * 0.07 * (0.35 + lum);

    // the light is reflected in the sunglasses
    float lenses = max(
      lensShape(f, vec2(0.436, 0.3085), vec2(0.052, 0.034)),
      lensShape(f, vec2(0.573, 0.3045), vec2(0.052, 0.034))
    );
    float tilt = (f.y - 0.307) / 0.03 + (f.x - 0.506) * 2.2 + sin(uTime * 0.5) * 0.12;
    vec3 glint = spectrum(clamp(tilt, -1.0, 1.0)) * exp(-tilt * tilt * 1.4);
    treated += glint * lenses * 0.85 * smoothstep(0.45, 1.0, uIntro);

    // the clear patch: the original photo, untouched
    vec4 original = photo(f);
    float radius = clamp(uFrame.z * 0.17, 64.0, 150.0);
    float dist = length(p - uLens.xy);
    float patch = (1.0 - smoothstep(radius - 2.0, radius, dist)) * uLens.z;
    float clean = max(patch, uClean);

    vec3 subject = mix(treated, original.rgb, clean);
    float cover = mix(alpha, original.a, clean);
    // dissolve before the crop line, so there is never a hard edge
    cover *= 1.0 - smoothstep(0.76, 0.995, f.y);
    col = mix(col, subject, cover);

    // the rim of the clear patch
    float ring = (1.0 - smoothstep(0.0, 1.6, abs(dist - radius))) * uLens.z * (1.0 - uClean);
    col += mix(ICE, spectrum(sin(atan(p.y - uLens.y, p.x - uLens.x) + uTime * 0.6)), 0.65) * ring * 0.8;

    col += (hash2(p + fract(uTime) * 61.7) - 0.5) * 0.028; // film grain
    gl_FragColor = vec4(col, 1.0);
  }
`;

const INTRO_MS = 1700;

// Starts drawing into a canvas it adds to `host`. Returns null when WebGL
// isn't available, so the caller can leave the plain <img> showing.
export function createLightStage({ host, frame, image, onReady, onLost }) {
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

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uPhoto: { value: texture },
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

  let frameId = 0;
  let last = 0;
  let started = 0;
  let time = reduce ? 8 : 0;
  let onScreen = true;
  let ready = false;

  function draw() {
    program.uniforms.uTime.value = time;
    program.uniforms.uLens.value = [lens.x, lens.y, lens.on];
    program.uniforms.uClean.value = clean;
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
