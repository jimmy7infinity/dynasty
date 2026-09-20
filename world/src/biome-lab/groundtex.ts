import * as THREE from "three/webgpu";
import { clamp01, fbm, mixSeed, valueNoise } from "../domain/noise.ts";
import { type WorldIdentity } from "../domain/world.ts";
import { riverX, sampleLabHeight } from "./fields.ts";

/**
 * Desert floor, three tiers. Vertex colours carry the bright gold and the 50-130 m
 * swales. This map carries the 21% cluster: 2-4 m dark dendritic gullies (measured
 * 2-4 px on the 1536-wide reference at ~1 m/px). The 400×400 terrain grid is 5 m
 * and cannot draw them. Baked at ~2 m/texel over the 2000 m patch.
 *
 * Only darkens. Base albedos in `fields.ts` are the brightest measured values.
 */

const GRID = 129;

type Coarse = { grid: Float32Array; x0: number; z0: number; step: number };

function coarseHeights(id: WorldIdentity, cx: number, cz: number, size: number): Coarse {
  const step = size / (GRID - 1);
  const x0 = cx - size / 2;
  const z0 = cz - size / 2;
  const grid = new Float32Array(GRID * GRID);
  for (let j = 0; j < GRID; j += 1) {
    for (let i = 0; i < GRID; i += 1) {
      grid[j * GRID + i] = sampleLabHeight(id, x0 + i * step, z0 + j * step);
    }
  }
  return { grid, x0, z0, step };
}

function heightAt(c: Coarse, x: number, z: number): number {
  const fi = THREE.MathUtils.clamp((x - c.x0) / c.step, 0, GRID - 1);
  const fj = THREE.MathUtils.clamp((z - c.z0) / c.step, 0, GRID - 1);
  const i = Math.min(GRID - 2, Math.floor(fi));
  const j = Math.min(GRID - 2, Math.floor(fj));
  const tx = fi - i;
  const tz = fj - j;
  const a = c.grid[j * GRID + i] + (c.grid[j * GRID + i + 1] - c.grid[j * GRID + i]) * tx;
  const b = c.grid[(j + 1) * GRID + i] + (c.grid[(j + 1) * GRID + i + 1] - c.grid[(j + 1) * GRID + i]) * tx;
  return a + (b - a) * tz;
}

/**
 * Constant-width isoline of fbm=0.5. `ridge(fbm)` paints every plateau near 0.5
 * as a blotch (the giraffe cracks); dividing |n-0.5| by |∇n| and skipping flat
 * regions keeps only the actual 2-4 m crossing.
 */
function isoline(stream: number, x: number, z: number, freq: number, halfW: number): number {
  const n = fbm(stream, x * freq, z * freq, 3);
  const e = 2.5;
  const nx = (fbm(stream, (x + e) * freq, z * freq, 3) - fbm(stream, (x - e) * freq, z * freq, 3)) / (2 * e);
  const nz = (fbm(stream, x * freq, (z + e) * freq, 3) - fbm(stream, x * freq, (z - e) * freq, 3)) / (2 * e);
  const g = Math.hypot(nx, nz);
  if (g < 0.002) {
    return 0;
  }
  return clamp01(1 - Math.abs(n - 0.5) / g / halfW);
}

export type GroundDetail = { texture: THREE.DataTexture; size: number; cx: number; cz: number };

export function bakeGroundDetail(
  id: WorldIdentity,
  cx: number,
  cz: number,
  size: number,
  res = 1024,
): GroundDetail {
  const coarse = coarseHeights(id, cx, cz, size);
  const strokeStream = mixSeed(id.seed, 211, id.generationVersion, 0);
  const mottleStream = mixSeed(id.seed, 212, id.generationVersion, 0);
  const data = new Uint8Array(res * res * 4);
  const texel = size / res;
  const x0 = cx - size / 2;
  const z0 = cz - size / 2;

  for (let j = 0; j < res; j += 1) {
    const z = z0 + (j + 0.5) * texel;
    for (let i = 0; i < res; i += 1) {
      const x = x0 + (i + 0.5) * texel;
      // Sharpened 2-4 m isolines. Soft falloff mixed with gold into a 19% mid
      // cluster instead of the measured 21% #6b5f3e; the step restores ink.
      // Dropping the lowest quarter of a companion fbm breaks closed loops
      // into branching strokes without thinning the rest.
      const ink = isoline(strokeStream, x, z, 0.022, 1.25);
      const twig = isoline(strokeStream + 4, x, z, 0.038, 1.05);
      const gap = fbm(strokeStream + 9, x * 0.012, z * 0.012, 2);
      const raw = gap < 0.22 ? 0 : Math.max(ink, twig * 0.78);
      const line = clamp01((raw - 0.28) * 2.6);

      const side = x - riverX(id, z);
      const aridness = clamp01((-side + 120) / 320);

      const mottle = fbm(mottleStream, x * 0.055, z * 0.055, 2);
      const grain = valueNoise(mottleStream + 17, x * 0.6, z * 0.6);

      const h = heightAt(coarse, x, z);
      const submerged = h < 0.2 ? 1 : 0;

      let v = 1;
      v -= (mottle - 0.5) * 0.04;
      v -= (grain - 0.5) * 0.02;
      v = submerged ? 1 - (1 - v) * 0.25 : v;

      // sRGB #6b5f3e / #dca34e = (0.49, 0.58, 0.79). Stored in sRGB so the
      // sampler's conversion lands the linear multiply on that pair.
      const gully = line * aridness;
      const p = (j * res + i) * 4;
      data[p] = Math.round(THREE.MathUtils.clamp(v * (1 - gully * 0.55), 0.4, 1) * 255);
      data[p + 1] = Math.round(THREE.MathUtils.clamp(v * (1 - gully * 0.46) + 0.008 * (1 - aridness), 0.4, 1) * 255);
      data[p + 2] = Math.round(THREE.MathUtils.clamp(v * (1 - gully * 0.24) + 0.027 * (1 - aridness), 0.4, 1) * 255);
      data[p + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, res, res, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return { texture, size, cx, cz };
}
