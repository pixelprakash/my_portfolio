// The v2 hero's picture, drawn in one WebGL pass. There are three versions of
// the same scene:
//   cinema  the resting state: spectrum light streaming from the sunglasses,
//           the portrait behind ribbed glass;
//   design  the blue pill: a cobalt design canvas, the portrait as a halftone
//           print with its outline drawn as a vector path;
//   code    the red pill: the portrait rebuilt out of falling code, with red
//           lenses.
// A pill's world spreads from that pill as a shockwave. The pill itself leaves
// the palm (the palm is filled in behind it) and hangs in the air as a glossy
// capsule. A round "clear patch" shows the untouched photo through any of them.
import { CROP, PHOTO, PILLS } from './pills';

const n = (value) => value.toFixed(5);
// a point in the photo, as fractions of the cropped frame
const at = (x, y) => `vec2(${n(x / PHOTO.width)}, ${n(y / (PHOTO.height * CROP))})`;

export const vertex = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uPhoto;
  uniform sampler2D uGlyphs; // 8 x 8 sheet of characters
  uniform vec2 uRes;       // canvas size, CSS px
  uniform vec4 uFrame;     // portrait box: x, y, width, height (CSS px)
  uniform vec3 uLens;      // clear patch: x, y, strength (0..1)
  uniform float uClean;    // 1 = the whole photo, no effects
  uniform float uTime;
  uniform float uIntro;    // 0 -> 1 as the picture resolves
  uniform vec2 uWorld;     // how far each pill's world has spread: blue, red
  uniform vec2 uLift;      // how far each pill has left the palm
  uniform float uTop;      // which world is drawn over the other: 0 blue, 1 red
  varying vec2 vUv;

  const float CROP = ${n(CROP)};
  const vec2 EYES = ${at(556.6, 305.5)};
  const vec2 LENS_L = ${at(479.6, 307.1)};
  const vec2 LENS_R = ${at(630.3, 303.1)};
  const vec2 LENS_SIZE = vec2(0.052, ${n((0.034 * 0.7) / CROP)});
  const vec2 FACE = ${at(556.6, 328)};
  const vec2 PILL_B = ${at(PILLS.blue.x, PILLS.blue.y)};
  const vec2 PILL_R = ${at(PILLS.red.x, PILLS.red.y)};

  const vec3 INK     = vec3(0.016, 0.016, 0.024);
  const vec3 COBALT  = vec3(0.09, 0.22, 1.0);
  const vec3 CYAN    = vec3(0.16, 0.74, 1.0);
  const vec3 ICE     = vec3(0.93, 0.97, 1.0);
  const vec3 AMBER   = vec3(1.0, 0.66, 0.22);
  const vec3 CORAL   = vec3(1.0, 0.27, 0.16);
  const vec3 MAGENTA = vec3(0.84, 0.12, 0.55);

  float hash(float x) { return fract(sin(x * 127.1) * 43758.5453); }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
  }
  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
  mat2 turn(float a) { return mat2(cos(a), sin(a), -sin(a), cos(a)); }

  // t in -1..1 across a beam: coral, amber, a white core, cyan, cobalt
  vec3 spectrum(float t) {
    vec3 c = mix(MAGENTA, CORAL, smoothstep(-1.0, -0.72, t));
    c = mix(c, AMBER, smoothstep(-0.66, -0.34, t));
    c = mix(c, ICE, smoothstep(-0.3, -0.02, t));
    c = mix(c, CYAN, smoothstep(0.08, 0.46, t));
    c = mix(c, COBALT, smoothstep(0.5, 0.92, t));
    return c;
  }

  /* ───────────── the beams, shared by all three worlds ───────────── */

  // returns: strength, position across the beam, bloom, strand number
  vec4 beams(vec2 p) {
    vec2 eye = uFrame.xy + EYES * uFrame.zw;
    float unit = uFrame.w * 0.78;
    float dx = p.x - eye.x;
    float reach = max(eye.x, uRes.x - eye.x);
    float d = abs(dx) / reach;
    float side = dx < 0.0 ? 0.0 : 1.0;
    float wave = sin(d * 4.2 - uTime * 0.35 + side * 2.4) * unit * 0.012 * d;
    float centre = eye.y + pow(d, 1.9) * unit * (side < 0.5 ? 0.1 : 0.14) + wave;
    float spread = unit * (0.026 + 0.12 * pow(d, 1.25));
    float t = (p.y - centre) / spread;

    float lane = floor((t + 3.0) * 11.0);
    float flow = noise(d * 7.0 - uTime * (0.5 + hash(lane) * 0.5) + hash(lane + side * 31.0) * 40.0);
    float strands = 0.5 + 0.5 * pow(0.5 + 0.5 * sin((t + 3.0) * 34.5), 2.0);
    float body = exp(-pow(abs(t), 3.0) * 1.35);
    float grown = smoothstep(0.0, 0.3, uIntro * 1.45 - d);
    float beam = body * strands * (0.62 + 0.62 * flow) * grown;
    beam *= 1.0 - 0.34 * smoothstep(0.55, 1.0, d);
    return vec4(beam, t, exp(-t * t * 0.28) * grown, lane + side * 31.0);
  }

  /* ───────────── the photo ───────────── */

  // a point given in frame coordinates (0..1, top-left origin)
  vec4 raw(vec2 f) {
    if (f.x < 0.0 || f.x > 1.0 || f.y < 0.0 || f.y > 1.0) return vec4(0.0);
    return texture2D(uPhoto, vec2(f.x, 1.0 - f.y * CROP));
  }

  float pillArea(vec2 f, vec2 centre) {
    vec2 q = (f - centre - vec2(0.0, 0.0016)) / vec2(0.037, ${n(23 / (PHOTO.height * CROP))});
    return 1.0 - smoothstep(0.72, 1.06, length(q));
  }

  // The photo, with the palm filled in where a pill has been picked up: the
  // skin just above and just below it, blended down the gap.
  vec4 shot(vec2 f) {
    vec4 c = raw(f);
    float bm = pillArea(f, PILL_B) * smoothstep(0.0, 0.12, uLift.x);
    float rm = pillArea(f, PILL_R) * smoothstep(0.0, 0.12, uLift.y);
    float hole = max(bm, rm);
    if (hole > 0.001) {
      float mid = (bm > rm ? PILL_B.y : PILL_R.y) + 0.0016;
      float half_ = ${n(26 / (PHOTO.height * CROP))};
      float k = clamp((f.y - mid + half_) / (2.0 * half_), 0.0, 1.0);
      vec4 above = raw(vec2(f.x, mid - half_));
      vec4 below = raw(vec2(f.x, mid + half_));
      vec4 skin = mix(above, below, smoothstep(0.0, 1.0, k));
      skin.rgb = vec3(luma(skin.rgb)); // no trace of the pill's colour
      c = mix(c, skin, hole);
    }
    return c;
  }

  // the photo dissolves before the crop line, so there is never a hard edge
  float foot(vec2 f) { return 1.0 - smoothstep(0.935, 0.999, f.y); }

  float lensShape(vec2 f, vec2 c) {
    vec2 q = (f - c) / LENS_SIZE;
    return 1.0 - smoothstep(0.55, 1.05, dot(q * q, q * q) + 0.25 * dot(q, q));
  }
  float glasses(vec2 f) { return max(lensShape(f, LENS_L), lensShape(f, LENS_R)); }

  // 1 around each palm, where the glass stays calm so the pills read crisply
  float palms(vec2 f) {
    float b = length((f - PILL_B) * vec2(1.0, 1.2));
    float r = length((f - PILL_R) * vec2(1.0, 1.2));
    return 1.0 - smoothstep(0.1, 0.22, min(b, r));
  }

  // how strongly the outline of the cut-out passes through this point
  float silhouette(vec2 f, float px) {
    vec2 e = vec2(px) / uFrame.zw;
    float gx = shot(f + vec2(e.x, 0.0)).a - shot(f - vec2(e.x, 0.0)).a;
    float gy = shot(f + vec2(0.0, e.y)).a - shot(f - vec2(0.0, e.y)).a;
    return clamp(length(vec2(gx, gy)) * 1.4, 0.0, 1.0) * foot(f);
  }

  /* ───────────── cinema: the resting state ───────────── */

  vec3 cinemaBack(vec2 p) {
    vec3 col = INK;
    vec2 eye = uFrame.xy + EYES * uFrame.zw;
    float unit = uFrame.w * 0.78;

    // soft cobalt air behind the head
    vec2 q = (p - eye) / vec2(unit * 0.62, unit * 0.5);
    col += COBALT * 0.2 * exp(-dot(q, q) * 1.5);

    vec4 b = beams(p);
    col += spectrum(clamp(b.y, -1.0, 1.0)) * b.x * 0.92;
    col += spectrum(clamp(b.y * 0.55, -1.0, 1.0)) * b.z * 0.13; // bloom

    // slit-scan columns standing on the floor
    float colW = max(5.0, uRes.x / 190.0);
    float id = floor(p.x / colW);
    float height = uRes.y * (0.07 + 0.3 * pow(noise(id * 0.17 + uTime * 0.07), 2.0)) * uIntro;
    float up = (uRes.y - p.y) / max(height, 1.0);
    float column = (1.0 - smoothstep(0.0, 1.0, up)) * (0.55 + 0.45 * hash(id));
    vec3 floorCol = mix(COBALT, CORAL, smoothstep(0.34, 0.72, p.x / uRes.x));
    col += mix(floorCol, ICE, pow(max(1.0 - up, 0.0), 6.0) * 0.35) * column * 0.3;
    return col;
  }

  vec4 cinemaFigure(vec2 p, vec2 f) {
    float settle = 1.0 - uIntro;
    float calm = palms(f);

    // ribbed glass: each rib is a thin cylinder lens
    float rib = clamp(uFrame.z / 64.0, 6.0, 15.0);
    float local = fract(p.x / rib + 0.02 * sin(uTime * 0.4)) - 0.5;
    // gentle over the face so it still reads; stronger further out
    float away = smoothstep(0.1, 0.46, length((f - FACE) * vec2(1.0, 1.15)));
    float strength = mix(mix(0.34, 1.35, away), 0.1, calm) + settle * settle * 7.0;
    float shift = local * rib * strength / uFrame.z;
    float fringe = 0.0012 * (1.0 - calm);

    vec4 g = shot(f + vec2(shift, 0.0));
    vec4 r = shot(f + vec2(shift * 1.28 + fringe, 0.0));
    vec4 b = shot(f + vec2(shift * 0.72 - fringe, 0.0));
    float alpha = max(g.a, max(r.a, b.a));
    vec3 glass = vec3(r.r * r.a, g.g * g.a, b.b * b.a) / max(alpha, 0.001);

    // rim light: bright edges of the photo take colour, cobalt left, coral right
    float lum = luma(glass);
    vec3 key = mix(CYAN * vec3(0.6, 0.75, 1.0), CORAL, smoothstep(0.4, 0.62, f.x));
    float edge = smoothstep(0.07, 0.36, abs(f.x - 0.506));
    vec3 treated = mix(vec3(lum) * vec3(0.97, 0.99, 1.04), key * lum * 1.75, edge * 0.82 * (1.0 - calm * 0.55));
    treated += key * edge * smoothstep(0.35, 0.95, lum) * 0.22 * (1.0 - calm);
    treated *= 0.94 + 0.12 * (1.0 - abs(local) * 2.0) * (1.0 - calm);
    treated += pow(abs(local) * 2.0, 9.0) * 0.07 * (0.35 + lum) * (1.0 - calm);

    // the pills keep their own colour while they rest in the palms
    float rest = max(pillArea(f, PILL_B) * (1.0 - uLift.x), pillArea(f, PILL_R) * (1.0 - uLift.y));
    treated = mix(treated, shot(f).rgb, rest);

    // the light is reflected in the sunglasses
    float tilt = (f.y - EYES.y) / ${n((0.03 * 0.7) / CROP)} + (f.x - 0.506) * 2.2 + sin(uTime * 0.5) * 0.12;
    vec3 glint = spectrum(clamp(tilt, -1.0, 1.0)) * exp(-tilt * tilt * 1.4);
    treated += glint * glasses(f) * 0.85 * smoothstep(0.45, 1.0, uIntro);

    float cover = alpha * foot(f);
    return vec4(treated * cover, cover);
  }

  /* ───────────── design: the blue pill ───────────── */

  vec3 designBack(vec2 p) {
    vec2 q = (p - uFrame.xy - uFrame.zw * vec2(0.5, 0.35)) / uRes;
    vec3 col = mix(vec3(0.03, 0.09, 0.4), vec3(0.008, 0.018, 0.11), smoothstep(0.0, 0.75, length(q)));

    // layout columns, then a dot grid
    float colW = uRes.x / 12.0;
    float guide = 1.0 - smoothstep(0.4, 1.4, abs(fract(p.x / colW + 0.5) - 0.5) * colW);
    col += vec3(0.25, 0.5, 1.0) * guide * 0.17;
    float dotAt = length(mod(p, 24.0) - 12.0);
    col += vec3(0.45, 0.68, 1.0) * (1.0 - smoothstep(0.6, 1.7, dotAt)) * 0.3;

    vec4 b = beams(p);
    float core = 1.0 - clamp(abs(b.y), 0.0, 1.0);
    col += mix(vec3(0.1, 0.28, 1.0), vec3(0.65, 0.92, 1.0), core * core) * b.x * 0.55;
    return col;
  }

  vec4 designFigure(vec2 p, vec2 f) {
    // halftone: one dot per cell of a grid set at 15 degrees
    float cell = clamp(uFrame.z / 128.0, 4.2, 7.5);
    vec2 q = turn(0.262) * p;
    vec2 centre = (floor(q / cell) + 0.5) * cell;
    vec2 back = turn(-0.262) * centre;
    vec2 cf = (back - uFrame.xy) / uFrame.zw;
    vec4 s = shot(cf);
    float tone = clamp(pow(luma(s.rgb), 0.82) * 1.06, 0.0, 1.0);
    tone *= 1.0 - 0.22 * palms(cf) * smoothstep(0.4, 0.8, tone);
    float radius = cell * 0.66 * sqrt(0.045 + tone * 0.955);
    float dotMask = 1.0 - smoothstep(radius - 0.7, radius + 0.7, length(q - centre));

    float inside = shot(f).a * foot(f);
    vec3 paint = mix(vec3(0.17, 0.42, 1.0), vec3(0.9, 0.97, 1.0), smoothstep(0.26, 0.92, tone));
    vec3 col = mix(vec3(0.012, 0.03, 0.17), paint, dotMask);

    // lenses printed solid cyan, with one hard highlight
    float lens = glasses(f);
    col = mix(col, mix(vec3(0.1, 0.55, 1.0), vec3(0.75, 0.97, 1.0), dotMask * 0.55), lens * 0.72);

    // the cut-out's edge, drawn as a vector path with anchor points
    float line = silhouette(f, 1.4);
    float anchors = step(abs(fract(p.y / 46.0) - 0.5), 0.065) * step(0.08, silhouette(f, 3.2));
    col = mix(col, vec3(0.56, 0.95, 1.0), line);
    col = mix(col, vec3(1.0), anchors);
    float cover = max(inside, max(line, anchors));
    return vec4(col * cover, cover);
  }

  /* ───────────── code: the red pill ───────────── */

  // x: the character's ink here, y: trail of the falling stream, z: its head
  vec3 codeCell(vec2 p, vec2 size) {
    vec2 id = floor(p / size);
    vec2 local = fract(p / size);
    float rows = uRes.y / size.y + 26.0;
    float speed = 0.35 + hash(id.x) * 0.9;
    float head = fract(uTime * speed * 0.13 + hash(id.x * 7.31)) * rows;
    float behind = head - id.y;
    float trail = behind > 0.0 && behind < 22.0 ? 1.0 - behind / 22.0 : 0.0;
    float lead = behind >= 0.0 && behind < 1.2 ? 1.0 : 0.0;

    float pick = floor(hash2(id + floor(uTime * (0.4 + hash2(id.yx) * 2.6))) * 64.0);
    vec2 sheet = vec2(mod(pick, 8.0), floor(pick / 8.0));
    vec2 uvg = (sheet + local * 0.94 + 0.03) / 8.0;
    float ink = texture2D(uGlyphs, vec2(uvg.x, 1.0 - uvg.y)).r;
    return vec3(ink, trail, lead);
  }

  vec2 codeSize() {
    float w = clamp(uFrame.z / 92.0, 5.6, 9.5);
    return vec2(w, w * 1.32);
  }

  vec3 codeBack(vec2 p) {
    vec3 col = vec3(0.028, 0.004, 0.006);
    vec2 size = codeSize() * 1.45;
    vec3 c = codeCell(p, size);
    col += vec3(0.85, 0.06, 0.05) * c.x * c.y * 0.42;
    col += vec3(1.0, 0.62, 0.52) * c.x * c.z * 0.75;

    // the beams become streams of data
    vec4 b = beams(p);
    float dash = step(0.42, fract(abs(p.x - uRes.x * 0.5) / 46.0 - uTime * 1.6 + hash(b.w) * 9.0));
    vec3 hot = mix(vec3(0.75, 0.02, 0.05), vec3(1.0, 0.55, 0.4), pow(1.0 - clamp(abs(b.y), 0.0, 1.0), 2.0));
    col += hot * b.x * (0.12 + dash * 0.42);

    vec2 eye = uFrame.xy + EYES * uFrame.zw;
    vec2 q = (p - eye) / (uFrame.w * 0.4);
    col += vec3(0.5, 0.02, 0.03) * 0.3 * exp(-dot(q, q));
    return col;
  }

  vec4 codeFigure(vec2 p, vec2 f) {
    vec2 size = codeSize();
    vec3 c = codeCell(p, size);
    vec2 cf = ((floor(p / size) + 0.5) * size - uFrame.xy) / uFrame.zw;
    float cellTone = clamp(pow(luma(shot(cf).rgb), 0.78) * 1.25, 0.0, 1.0);
    vec4 here = shot(f);
    float tone = luma(here.rgb);

    vec3 paint = mix(vec3(0.7, 0.02, 0.05), vec3(1.0, 0.36, 0.24), smoothstep(0.2, 0.72, cellTone));
    paint = mix(paint, vec3(1.0, 0.88, 0.82), smoothstep(0.72, 1.0, cellTone));
    // a faint red print underneath keeps the face recognisable
    vec3 col = vec3(0.03, 0.0, 0.004) + vec3(0.62, 0.07, 0.055) * pow(tone, 0.92);
    col += paint * c.x * (0.07 + cellTone * 1.3 + c.y * 0.28 * step(0.06, cellTone));
    col += vec3(1.0, 0.75, 0.66) * c.x * c.z * 0.45;

    // the red lenses
    float lens = glasses(f);
    float shine = exp(-pow(((f.y - EYES.y) / 0.008) + 1.2 + (f.x - EYES.x) * 22.0 * 0.12, 2.0) * 0.9);
    vec3 redGlass = vec3(0.92, 0.04, 0.04) * (0.78 + 0.4 * c.x) + vec3(1.0, 0.7, 0.6) * shine * 0.55;
    col = mix(col, redGlass, lens * 0.9);

    float line = silhouette(f, 1.3);
    col = mix(col, vec3(1.0, 0.24, 0.18), line * 0.55);
    float cover = max(here.a * foot(f), line * 0.55);
    return vec4(col * cover, cover);
  }

  /* ───────────── the pills in the air ───────────── */

  // a glossy two-part capsule; rgb premultiplied by its own edge
  vec4 capsule(vec2 p, vec2 centre, float halfLen, float rad, float angle, vec3 a, vec3 b) {
    vec2 q = turn(-angle) * (p - centre);
    float straight = halfLen - rad;
    vec2 off = q - vec2(clamp(q.x, -straight, straight), 0.0);
    float dist = length(off);
    float cover = 1.0 - smoothstep(rad - 0.9, rad + 0.4, dist);
    if (cover <= 0.0) return vec4(0.0);

    vec2 side = off / rad;
    vec3 nor = vec3(side, sqrt(max(1.0 - dot(side, side), 0.0)));
    vec3 light = normalize(vec3(-0.45, -0.68, 0.6));
    float diffuse = max(dot(nor, light), 0.0);
    vec3 base = q.x < 0.0 ? a : b;
    vec3 col = base * (0.26 + 0.92 * diffuse);
    col += pow(max(reflect(-light, nor).z, 0.0), 30.0) * 0.8;
    // a long studio reflection, like the one on the pill in the photo
    float strip = exp(-pow((nor.y + 0.56) / 0.085, 2.0)) * (1.0 - smoothstep(0.62, 0.86, abs(q.x) / halfLen));
    col += strip * 0.62;
    // a thin iridescent rim
    col += spectrum(clamp(nor.y * 1.3, -1.0, 1.0)) * pow(1.0 - nor.z, 3.0) * 0.55;
    // where the two halves meet
    col *= 1.0 - 0.45 * (1.0 - smoothstep(0.4, 1.5, abs(q.x)));
    return vec4(col * cover, cover);
  }

  vec3 drawPill(vec3 col, vec2 p, vec2 spot, float lift, float angle, vec3 a, vec3 b, vec3 glow, float phase) {
    float scale = uFrame.z / ${n(PHOTO.width)}; // css px per photo px
    vec2 home = uFrame.xy + spot * uFrame.zw;
    float ready = smoothstep(0.75, 1.0, uIntro);

    // resting: two rings breathe out from the pill, asking to be taken
    if (lift < 0.999) {
      float d = length((p - home) * vec2(1.0, 1.55));
      float ring = 0.0;
      for (int i = 0; i < 2; i++) {
        float k = fract(uTime * 0.42 + phase + float(i) * 0.5);
        ring += (1.0 - smoothstep(0.0, 1.8, abs(d - (34.0 + 66.0 * k) * scale))) * (1.0 - k);
      }
      col += glow * ring * 0.6 * (1.0 - lift) * ready;
      col += glow * exp(-pow(d / (48.0 * scale), 2.0)) * 0.2 * (1.0 - lift) * ready;
    }

    if (lift <= 0.001) return col;

    float rise = lift * 150.0 * scale;
    float bob = sin(uTime * 2.1 + phase * 9.0) * 6.0 * scale * lift;
    vec2 centre = home + vec2(0.0, -rise + bob);
    float grow = 1.0 + 2.1 * lift;
    float halfLen = 29.0 * scale * grow;
    float rad = 12.5 * scale * grow;
    float spin = angle + sin(uTime * 1.35 + phase * 4.0) * 0.42 * lift - 0.32 * lift;

    // coloured light spilt on the palm, and the pill's shadow
    vec2 pool = (p - home) / vec2(120.0 * scale, 52.0 * scale);
    col += glow * exp(-dot(pool, pool)) * 0.42 * lift;
    vec2 shade = (p - home - vec2(0.0, 4.0 * scale)) / vec2(40.0 * scale, 12.0 * scale);
    col *= 1.0 - 0.34 * exp(-dot(shade, shade)) * lift;

    // an orbit of light around the capsule
    vec2 o = turn(-0.35) * (p - centre) / vec2(halfLen * 1.75, rad * 1.85);
    float orbit = exp(-pow((length(o) - 1.0) * 17.0, 2.0));
    float sweep = pow(0.5 + 0.5 * cos(atan(o.y, o.x) - uTime * 3.4 - phase * 6.0), 5.0);
    col += glow * orbit * sweep * 0.95 * lift;

    float halo = max(length(p - centre) - rad, 0.0);
    col += glow * exp(-halo / (rad * 1.35)) * 0.42 * lift;

    vec4 body = capsule(p, centre, halfLen, rad, spin, a, b);
    float solid = smoothstep(0.0, 0.12, lift);
    return col * (1.0 - body.a * solid) + body.rgb * solid;
  }

  /* ───────────── putting it together ───────────── */

  // x: 1 inside the world's circle, y: brightness of its leading edge
  vec2 spreadFrom(vec2 p, vec2 spot, float progress) {
    if (progress <= 0.0) return vec2(0.0);
    vec2 origin = uFrame.xy + spot * uFrame.zw;
    vec2 far = max(origin, uRes - origin);
    float eased = 1.0 - pow(1.0 - progress, 2.4);
    float radius = eased * (length(far) + 40.0);
    float d = length(p - origin);
    float inside = 1.0 - smoothstep(radius - 1.5, radius + 1.5, d);
    float live = smoothstep(0.0, 0.04, progress) * (1.0 - smoothstep(0.82, 1.0, progress));
    float front = exp(-pow((d - radius) / 13.0, 2.0)) * live;
    return vec2(inside, front);
  }

  void main() {
    vec2 p0 = vec2(vUv.x, 1.0 - vUv.y) * uRes;
    vec2 blue = spreadFrom(p0, PILL_B, uWorld.x);
    vec2 red = spreadFrom(p0, PILL_R, uWorld.y);

    // the leading edge bends whatever it passes over
    vec2 originB = uFrame.xy + PILL_B * uFrame.zw;
    vec2 originR = uFrame.xy + PILL_R * uFrame.zw;
    vec2 p = p0;
    p -= normalize(p0 - originB + 0.001) * blue.y * 16.0;
    p -= normalize(p0 - originR + 0.001) * red.y * 16.0;
    vec2 f = (p - uFrame.xy) / uFrame.zw;

    // how much of each version shows at this point
    float wB = blue.x;
    float wR = red.x;
    if (uTop > 0.5) wB *= 1.0 - wR;
    else wR *= 1.0 - wB;
    float wC = max(1.0 - wB - wR, 0.0);

    vec3 backCol = vec3(0.0);
    vec4 figure = vec4(0.0);
    if (wC > 0.001) {
      backCol += cinemaBack(p) * wC;
      figure += cinemaFigure(p, f) * wC;
    }
    if (wB > 0.001) {
      backCol += designBack(p) * wB;
      figure += designFigure(p, f) * wB;
    }
    if (wR > 0.001) {
      backCol += codeBack(p) * wR;
      figure += codeFigure(p, f) * wR;
    }

    // the clear patch: the original photo, untouched
    float radius = clamp(uFrame.z * 0.18, 64.0, 150.0);
    float dist = length(p0 - uLens.xy);
    float patch_ = (1.0 - smoothstep(radius - 2.0, radius, dist)) * uLens.z;
    float clean = max(patch_, uClean);
    if (clean > 0.001) {
      vec4 original = shot(f);
      float cover = original.a * foot(f);
      figure = mix(figure, vec4(original.rgb * cover, cover), clean);
    }

    vec3 col = backCol * (1.0 - figure.a) + figure.rgb;

    col += mix(CYAN, ICE, 0.35) * blue.y * 0.9;
    col += mix(CORAL, AMBER, 0.2) * red.y * 0.9;

    // the rim of the clear patch
    float ring = (1.0 - smoothstep(0.0, 1.6, abs(dist - radius))) * uLens.z * (1.0 - uClean);
    col += mix(ICE, spectrum(sin(atan(p0.y - uLens.y, p0.x - uLens.x) + uTime * 0.6)), 0.65) * ring * 0.8;

    col = drawPill(col, p0, PILL_B, uLift.x, 0.147, vec3(0.0, 0.3, 0.86), vec3(0.0, 0.5, 0.94), vec3(0.1, 0.6, 1.0), 0.0);
    col = drawPill(col, p0, PILL_R, uLift.y, 0.062, vec3(0.96, 0.1, 0.11), vec3(0.7, 0.0, 0.05), vec3(1.0, 0.2, 0.13), 0.5);

    col += (hash2(p0 + fract(uTime) * 61.7) - 0.5) * 0.028; // film grain
    gl_FragColor = vec4(col, 1.0);
  }
`;
