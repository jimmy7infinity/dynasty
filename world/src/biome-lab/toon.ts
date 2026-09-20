import * as THREE from "three/webgpu";

export function hash01(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Reference shadow/light ratios are ~(0.41, 0.50, 0.71) in sRGB for every opaque
 * material: shadows are cool, light is warm. Solving `b0 + (1-b0)*ambient` for
 * those ratios in linear space gives a blue skylight plus a warm sun, which means
 * the gradient maps carry pure value and no hue. Hue lives in albedo only.
 */
export const SKYLIGHT = 0x476bad;
export const SUNLIGHT = 0xf8edc8;
export const BOUNCE = 0xc8a06a;

/**
 * Broadleaf main lobe at scale 1: r_ball = 6.6*0.7 = 4.62 m, centre
 * h = trunkH + 6.6*0.62 = 6.69 m, D = 9.24 m. Instance scale cancels in h/r.
 * Visibility (offset > r_ball): tan(θ) < h/r = 1.45 → θ < 55°. The old 56°
 * sun gave offset 4.5 m < 4.62 m, so the umbra sat under the crown.
 * Compact oval (elongation 1/sin(θ) ≤ 1.6): θ ≥ 38.7°.
 * Offset 0.8–1.2×D: θ ∈ [31°, 42°]. Intersection is 38.7–42°.
 * 40°: offset = 6.69/tan(40°) = 7.98 m = 0.86×D, elongation = 1.56.
 * Azimuth stays west-and-slightly-south so `sunFacing` still matches.
 */
export const SUN_DISTANCE = 1800;
export const SUN_DIR = new THREE.Vector3(-0.663, 0.643, 0.383).normalize();

/** Brightest pixel anywhere in the reference is #dfd2b6. Nothing is white. */
export const IVORY = 0xdfd2b6;

function bandTexture(levels: number[]): THREE.DataTexture {
  const data = new Uint8Array(levels.length * 4);
  for (let i = 0; i < levels.length; i += 1) {
    const v = Math.round(THREE.MathUtils.clamp(levels[i], 0, 1) * 255);
    data[i * 4] = v;
    data[i * 4 + 1] = v;
    data[i * 4 + 2] = v;
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, levels.length, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// Canopy carries 36% deep shadow vs 22% lit in the reference, so its dark bands
// are wide. Ground is mostly up-facing and never gets that dark on its own.
const BANDS = {
  ground: bandTexture([0.3, 0.52, 0.78, 1]),
  canopy: bandTexture([0.07, 0.22, 0.52, 0.92]),
  trunk: bandTexture([0.1, 0.3, 0.64, 1]),
  rock: bandTexture([0.09, 0.28, 0.62, 1]),
  water: bandTexture([0.45, 0.66, 0.85, 1]),
  cloud: bandTexture([0.55, 0.72, 0.88, 1]),
} as const;

export type ToonKind = keyof typeof BANDS;

export function toonMaterial(kind: ToonKind, doubleSide = false): THREE.MeshToonNodeMaterial {
  const mat = new THREE.MeshToonNodeMaterial();
  mat.gradientMap = BANDS[kind];
  switch (kind) {
    case "ground":
    case "canopy":
    case "trunk":
    case "rock":
    case "water":
      mat.vertexColors = true;
      break;
    case "cloud":
      mat.vertexColors = false;
      break;
    default: {
      const _never: never = kind;
      return _never;
    }
  }
  mat.color.set(0xffffff);
  mat.side = doubleSide ? THREE.DoubleSide : THREE.FrontSide;
  return mat;
}

/** Paints a geometry a single albedo with a little per-vertex hue/value jitter. */
export function paint(geo: THREE.BufferGeometry, hex: number, variance: number, seed: number): void {
  const pos = geo.getAttribute("position");
  const color = new THREE.Color(hex);
  const arr = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i += 1) {
    const t = (hash01(seed + i) - 0.5) * variance;
    const c = color.clone().offsetHSL(t * 0.03, t * 0.08, t * 0.06);
    arr[i * 3] = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
}

/**
 * Tints by height through the geometry so a crown's underside carries the deep
 * band even where its normal happens to face the sun. `curve` above 1 keeps more
 * of the crown near the lit tone; a hard square pushed almost everything dark.
 */
export function paintVertical(
  geo: THREE.BufferGeometry,
  lowHex: number,
  highHex: number,
  variance: number,
  seed: number,
  curve = 1.25,
): void {
  geo.computeBoundingBox();
  const box = geo.boundingBox;
  const pos = geo.getAttribute("position");
  const lo = new THREE.Color(lowHex);
  const hi = new THREE.Color(highHex);
  const minY = box?.min.y ?? 0;
  const maxY = box?.max.y ?? 1;
  const span = Math.max(1e-3, maxY - minY);
  const arr = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i += 1) {
    const t = (pos.getY(i) - minY) / span;
    c.copy(lo).lerp(hi, Math.pow(t, curve));
    const j = (hash01(seed + i) - 0.5) * variance;
    c.offsetHSL(j * 0.04, j * 0.1, j * 0.07);
    arr[i * 3] = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
}

export type LobeRange = { cx: number; cy: number; cz: number; start: number; count: number };

/**
 * Normals pointing out of each lobe's own centre rather than the whole crown's.
 * This is what gives a crown its internal light-to-dark lobe division and the
 * creases between lobes; a single crown-wide puff shades it as one smooth ball.
 */
export function lobeNormals(geo: THREE.BufferGeometry, lobes: LobeRange[], flatten = 0.55): void {
  const pos = geo.getAttribute("position");
  const nrm = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  for (const lobe of lobes) {
    for (let i = lobe.start; i < lobe.start + lobe.count; i += 1) {
      v.set(pos.getX(i) - lobe.cx, (pos.getY(i) - lobe.cy) * flatten, pos.getZ(i) - lobe.cz);
      if (v.lengthSq() < 1e-8) {
        v.set(0, 1, 0);
      } else {
        v.normalize();
      }
      // Bias upward so the toon bands read as a painted top light. Keep the bias
      // modest: too much of it turns every lobe sun-facing and the crown loses the
      // bright-cap-to-dark-base run that carries the reference's contrast.
      v.y = v.y * 0.78 + 0.2;
      v.normalize();
      nrm[i * 3] = v.x;
      nrm[i * 3 + 1] = v.y;
      nrm[i * 3 + 2] = v.z;
    }
  }
  geo.setAttribute("normal", new THREE.BufferAttribute(nrm, 3));
}

/**
 * Flattens normals toward the crown's outward hemisphere so a lobed mass lights
 * as painted bands rather than per-facet noise.
 */
export function puffNormals(geo: THREE.BufferGeometry, flatten = 0.4): void {
  geo.computeBoundingBox();
  const box = geo.boundingBox;
  if (!box) {
    return;
  }
  const center = new THREE.Vector3();
  box.getCenter(center);
  const pos = geo.getAttribute("position");
  const nrm = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i).sub(center);
    v.y *= flatten;
    if (v.lengthSq() < 1e-8) {
      v.set(0, 1, 0);
    } else {
      v.normalize();
    }
    v.x *= 0.72;
    v.z *= 0.72;
    v.y = v.y * 0.55 + 0.45;
    v.normalize();
    nrm[i * 3] = v.x;
    nrm[i * 3 + 1] = v.y;
    nrm[i * 3 + 2] = v.z;
  }
  geo.setAttribute("normal", new THREE.BufferAttribute(nrm, 3));
}
