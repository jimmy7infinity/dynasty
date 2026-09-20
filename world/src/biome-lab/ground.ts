import * as THREE from "three/webgpu";
import { clamp01, fbm, mixSeed, valueNoise } from "../domain/noise.ts";
import { type WorldIdentity } from "../domain/world.ts";
import {
  groundColor,
  riverHalfWidth,
  riverSkew,
  riverX,
  sampleField,
  sampleLabHeight,
  SEA_LEVEL,
  tributaryStrength,
  tributaryX,
  waterLevel,
} from "./fields.ts";
import { bakeGroundDetail } from "./groundtex.ts";
import { hash01, IVORY, puffNormals, toonMaterial } from "./toon.ts";

export const PATCH_SIZE = 2000;

export function createLabTerrain(identity: WorldIdentity, cx: number, cz: number): THREE.Mesh {
  const segs = 400;
  const side = segs + 1;
  const geo = new THREE.PlaneGeometry(PATCH_SIZE, PATCH_SIZE, segs, segs);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.getAttribute("position");
  const uv = geo.getAttribute("uv");
  const colors = new Float32Array(pos.count * 3);
  const x0 = cx - PATCH_SIZE / 2;
  const z0 = cz - PATCH_SIZE / 2;
  const step = PATCH_SIZE / segs;

  // One height sample per vertex; slope comes from lattice neighbours rather than
  // four extra samples each, which is a 5x saving on the dominant cost here.
  const heights = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i += 1) {
    heights[i] = sampleLabHeight(identity, pos.getX(i) + cx, pos.getZ(i) + cz);
  }

  // groundColor returns the measured sRGB palette, but vertex colours are read as
  // linear. Without this every terrain colour renders pale and desaturated.
  const tint = new THREE.Color();

  for (let j = 0; j < side; j += 1) {
    for (let k = 0; k < side; k += 1) {
      const i = j * side + k;
      const x = pos.getX(i) + cx;
      const z = pos.getZ(i) + cz;
      pos.setXYZ(i, x, heights[i], z);
      // Written explicitly so the baked detail map lines up with world space.
      uv.setXY(i, (x - x0) / PATCH_SIZE, (z - z0) / PATCH_SIZE);

      const kl = Math.max(0, k - 1);
      const kr = Math.min(side - 1, k + 1);
      const jt = Math.max(0, j - 1);
      const jb = Math.min(side - 1, j + 1);
      const dx = (heights[j * side + kr] - heights[j * side + kl]) / ((kr - kl) * step);
      // Plane rows run along -Z after the rotation, so flip the sign.
      const dz = -(heights[jb * side + k] - heights[jt * side + k]) / ((jb - jt) * step);

      const field = sampleField(identity, x, z, { dx, dz, slope: Math.hypot(dx, dz) }, heights[i]);
      const c = groundColor(field);
      tint.setRGB(c[0], c[1], c[2], THREE.SRGBColorSpace);
      colors[i * 3] = tint.r;
      colors[i * 3 + 1] = tint.g;
      colors[i * 3 + 2] = tint.b;
    }
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = toonMaterial("ground");
  mat.map = bakeGroundDetail(identity, cx, cz, PATCH_SIZE).texture;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  return mesh;
}

// Measured across the reference trunk: mid-channel #26807c to #31808d, brightening
// to #40ab92 in the shallows, with a pale mint #99c9af line right at the waterline.
// The old ramp was blue (#246d81); the reference water is decisively teal.
const RIVER_DEEP = new THREE.Color(0x186366);
const RIVER_MID = new THREE.Color(0x1e6e6c);
const RIVER_EDGE = new THREE.Color(0x328a7c);
const FOAM = new THREE.Color(0xa8dcc2);

function ribbon(
  identity: WorldIdentity,
  cz: number,
  centerAt: (z: number) => number,
  halfAt: (z: number) => number,
  liveAt: (z: number) => number,
  skewAt: (z: number) => number,
): THREE.Mesh | null {
  const length = PATCH_SIZE;
  const rows = 360;
  const cols = 8;
  const positions: number[] = [];
  const colors: number[] = [];
  const index: number[] = [];
  const rowOf: number[] = [];
  let live = 0;

  for (let r = 0; r <= rows; r += 1) {
    const z = cz - length / 2 + (r / rows) * length;
    if (liveAt(z) <= 0.02) {
      rowOf.push(-1);
      continue;
    }
    const mx = centerAt(z);
    const half = halfAt(z);
    const skew = skewAt(z);
    const level = waterLevel(identity, z, mx);
    // Bed drop over a short run drives where the water breaks white.
    const drop = Math.abs(waterLevel(identity, z + 14, centerAt(z + 14)) - level);
    const rapid = clamp01((drop - 0.55) * 1.2);
    rowOf.push(live);
    live += 1;
    for (let c = 0; c <= cols; c += 1) {
      const t = (c / cols) * 2 - 1;
      // Slightly wider than the flat bed so the edges tuck under the bank, and leaning
      // to the outside of the bend so the inside carries a bar.
      const lx = (t + skew * Math.abs(t)) * half * 1.06;
      const y = Math.max(SEA_LEVEL + 0.14, level);
      positions.push(mx + lx, y, z);
      const edge = Math.abs(t);
      // The reference carries a pale mint line along the whole waterline, not only
      // where the bed drops, so shore foam is unconditional and rapids add to it.
      const shore = Math.max(0, edge - 0.74) / 0.26;
      const col = RIVER_DEEP.clone()
        .lerp(RIVER_MID, edge * 0.75)
        .lerp(RIVER_EDGE, Math.max(0, edge - 0.42) * 1.7)
        .lerp(FOAM, Math.min(0.9, shore * shore * 0.6 + rapid * (0.3 + edge * 0.6)));
      colors.push(col.r, col.g, col.b);
    }
  }
  if (live < 2) {
    return null;
  }
  for (let r = 0; r < rows; r += 1) {
    const a = rowOf[r];
    const b = rowOf[r + 1];
    if (a < 0 || b < 0) {
      continue;
    }
    for (let c = 0; c < cols; c += 1) {
      const i0 = a * (cols + 1) + c;
      const i1 = i0 + 1;
      const j0 = b * (cols + 1) + c;
      const j1 = j0 + 1;
      index.push(i0, j0, i1, i1, j0, j1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(index);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, toonMaterial("water"));
  mesh.frustumCulled = false;
  return mesh;
}

export function createLabRivers(identity: WorldIdentity, cz: number): THREE.Group {
  const group = new THREE.Group();
  const trunk = ribbon(
    identity,
    cz,
    (z) => riverX(identity, z),
    (z) => riverHalfWidth(identity, z),
    () => 1,
    (z) => riverSkew(identity, z),
  );
  if (trunk) {
    group.add(trunk);
  }
  const branch = ribbon(
    identity,
    cz,
    (z) => tributaryX(identity, z),
    (z) => riverHalfWidth(identity, z) * 0.6 * (0.4 + 0.6 * tributaryStrength(identity, z)),
    (z) => tributaryStrength(identity, z),
    () => 0,
  );
  if (branch) {
    group.add(branch);
  }
  return group;
}

// Measured ocean ramp: deep #1e5e7d, shelf #266483, mid #2d6983, shallow #4b9f92.
const OCEAN_DEEP = new THREE.Color(0x184e68);
const OCEAN_SHELF = new THREE.Color(0x225c78);
const OCEAN_MID = new THREE.Color(0x246e7e);
const OCEAN_SHOAL = new THREE.Color(0x3e8a82);

/** Short horizontal dashes: the ripple lines all over the reference water. */
function rippleTexture(): THREE.DataTexture {
  const res = 256;
  const data = new Uint8Array(res * res * 4);
  for (let j = 0; j < res; j += 1) {
    for (let i = 0; i < res; i += 1) {
      // Stretched far more across i than j, so each feature is a short dash.
      const streak = valueNoise(9001, i * 0.09, j * 1.35);
      const mask = valueNoise(9002, i * 0.021, j * 0.021);
      const light = streak > 0.78 && mask > 0.52 ? 1 : 0;
      const dark = streak < 0.24 && mask > 0.46 ? 1 : 0;
      const v = 0.9 + light * 0.1 - dark * 0.14;
      const q = Math.round(THREE.MathUtils.clamp(v, 0, 1) * 255);
      const p = (j * res + i) * 4;
      data[p] = q;
      data[p + 1] = q;
      data[p + 2] = q;
      data[p + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, res, res, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(26, 26);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

export function createLabOcean(identity: WorldIdentity, cx: number, cz: number): THREE.Mesh {
  // Spans the whole patch and is simply hidden wherever land rises above it. The
  // shoreline is a diagonal, so a plane bolted to one edge left gaps.
  const span = 2600;
  const geo = new THREE.PlaneGeometry(span, span, 150, 150);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.getAttribute("position");
  const colors = new Float32Array(pos.count * 3);
  const stream = mixSeed(identity.seed, 231, identity.generationVersion, 0);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i) + cx;
    const z = pos.getZ(i) + cz;
    pos.setXYZ(i, x, SEA_LEVEL + 0.12, z);
    const depth = Math.max(0, SEA_LEVEL - sampleLabHeight(identity, x, z));
    // Noise-warped thresholds so the depth bands stay blotchy, not gradient.
    const warp = (fbm(stream, x * 0.0022, z * 0.0022, 3) - 0.5) * 5.5;
    const dw = depth + warp;
    c.copy(OCEAN_SHOAL)
      .lerp(OCEAN_MID, clamp01((dw - 1.2) / 3.2))
      .lerp(OCEAN_SHELF, clamp01((dw - 4.5) / 5))
      .lerp(OCEAN_DEEP, clamp01((dw - 10) / 9));
    // Broken foam line where the shoal meets land.
    const foam = clamp01(1 - Math.abs(dw - 0.5) / 0.85) * clamp01(fbm(stream + 5, x * 0.05, z * 0.05, 2) * 2.1 - 0.55);
    c.lerp(FOAM, foam * 0.8);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mat = toonMaterial("water");
  mat.map = rippleTexture();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return mesh;
}

/**
 * Flat-bottomed cumulus with lumpy scalloped tops, sitting low enough to occlude
 * terrain. Brightest cloud pixel in the reference is #dfd2b6, so nothing is white.
 */
export function createLabClouds(identity: WorldIdentity, ox: number, oz: number): THREE.Group {
  const group = new THREE.Group();
  const mat = toonMaterial("cloud");
  mat.color.set(IVORY);
  const lobe = new THREE.SphereGeometry(1, 12, 8);
  puffNormals(lobe, 0.45);
  const stream = mixSeed(identity.seed, 241, identity.generationVersion, 0);

  for (let i = 0; i < 30; i += 1) {
    const gx = ox + (hash01(i * 3.7 + 1) - 0.5) * 2200;
    const gz = oz + (hash01(i * 5.1 + 2) - 0.5) * 2400;
    if (fbm(stream, gx * 0.0016, gz * 0.0016, 2) < 0.46) {
      continue;
    }
    const cloud = new THREE.Group();
    const spread = 40 + hash01(i + 61) * 56;
    const base = 10 + hash01(i + 71) * 7;
    const n = 6 + Math.floor(hash01(i + 21) * 6);
    for (let k = 0; k < n; k += 1) {
      const r = base * (0.55 + hash01(i * 17 + k) * 0.7);
      const squash = 0.5 + hash01(i * 19 + k) * 0.28;
      const mesh = new THREE.Mesh(lobe, mat);
      mesh.scale.set(r, r * squash, r * (0.8 + hash01(i * 23 + k) * 0.45));
      // Bottoms aligned to a shared plane gives the flat cloud base.
      mesh.position.set(
        (hash01(i * 11 + k) - 0.5) * spread,
        r * squash * 0.82,
        (hash01(i * 13 + k) - 0.5) * spread * 0.6,
      );
      cloud.add(mesh);
    }
    // Relative to the ground beneath, or they sink into the high desert plain.
    const ground = Math.max(SEA_LEVEL, sampleLabHeight(identity, gx, gz));
    cloud.position.set(gx, ground + 135 + hash01(i + 31) * 95, gz);
    group.add(cloud);
  }
  return group;
}
