export function mixSeed(seed: number, domain: number, ix: number, iz: number): number {
  let h = pcg(seed ^ 0xa341316c);
  h = pcg(h ^ domain);
  h = pcg(h ^ Math.imul(ix | 0, 0x9e3779b9));
  h = pcg(h ^ Math.imul(iz | 0, 0x85ebca6b));
  return h >>> 0;
}

export function hash01(n: number): number {
  return pcg(n) / 4294967295;
}

function pcg(x: number): number {
  x = x >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function lattice(stream: number, x: number, z: number): number {
  let h = pcg(stream);
  h = pcg(h ^ Math.imul(x | 0, 0x9e3779b9));
  h = pcg(h ^ Math.imul(z | 0, 0x85ebca6b));
  return h;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

export function valueNoise(stream: number, x: number, z: number): number {
  const x0 = Math.floor(x);
  const z0 = Math.floor(z);
  const tx = smooth(x - x0);
  const tz = smooth(z - z0);
  const v00 = hash01(lattice(stream, x0, z0));
  const v10 = hash01(lattice(stream, x0 + 1, z0));
  const v01 = hash01(lattice(stream, x0, z0 + 1));
  const v11 = hash01(lattice(stream, x0 + 1, z0 + 1));
  const a = v00 + (v10 - v00) * tx;
  const b = v01 + (v11 - v01) * tx;
  return a + (b - a) * tz;
}

export function fbm(stream: number, x: number, z: number, octaves: number): number {
  let sum = 0;
  let amp = 1;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    sum += amp * valueNoise(stream + i * 101, x * freq, z * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}

export function ridge(stream: number, x: number, z: number, octaves: number): number {
  const n = fbm(stream, x, z, octaves);
  const r = 1 - Math.abs(n * 2 - 1);
  return r * r;
}

export function clamp01(t: number): number {
  if (t < 0) {
    return 0;
  }
  if (t > 1) {
    return 1;
  }
  return t;
}
