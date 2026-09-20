import * as THREE from "three/webgpu";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { type TreeFamily } from "./fields.ts";
import { hash01, type LobeRange, lobeNormals, paint, paintVertical } from "./toon.ts";

/**
 * Crowns in the reference are irregular lumpy multi-lobed masses with scalloped
 * silhouettes, 3-6 sub-lobes each, and the hue varies crown to crown (some
 * blue-green, some olive-yellow) not just the value. So each family gets a few
 * baked variants and every variant becomes its own instanced batch.
 *
 * Measured crown period is ~14 m in closed forest, so crown diameter lands near
 * 10-12 m.
 *
 * Normals are computed per lobe rather than per crown, so each lobe has its own
 * light-to-dark run with a crease between it and its neighbours. The reference has
 * no outline stroke on crowns at all; what reads as one is that crease contrast plus
 * a cool shadow against a warm lit cap.
 */

export type TreePart = { trunk: THREE.BufferGeometry | null; canopy: THREE.BufferGeometry };

export const VARIANTS: Record<TreeFamily, number> = {
  broadleaf: 3,
  conifer: 2,
  riparian: 2,
  savanna: 2,
  scrub: 2,
};

/**
 * Lit -> shadow albedo pairs. Lit values are the measured highlight colours. The
 * shadow ends are deliberately bluer than the lit ends, not just darker: in the
 * reference a crown runs from a warm yellow-green cap down to a cool blue-green
 * base, and that hue swing is most of what makes the canopy read as painted.
 */
const TONES: Record<TreeFamily, { lit: number; dark: number }[]> = {
  broadleaf: [
    { lit: 0x9aa74c, dark: 0x28483a },
    { lit: 0x829a48, dark: 0x24433c },
    { lit: 0x6d9a5c, dark: 0x254a44 },
  ],
  conifer: [
    { lit: 0x67833d, dark: 0x1f3d32 },
    { lit: 0x587845, dark: 0x1c3936 },
  ],
  riparian: [
    { lit: 0xaab84f, dark: 0x315540 },
    { lit: 0x9ab04c, dark: 0x2d5044 },
  ],
  savanna: [
    { lit: 0x8f9848, dark: 0x404e2c },
    { lit: 0x9a9c4a, dark: 0x47502e },
  ],
  scrub: [
    { lit: 0x838942, dark: 0x3e4426 },
    { lit: 0x737f3e, dark: 0x374026 },
  ],
};

type Lobe = { x: number; y: number; z: number; r: number; squash: number };

type Cluster = { geo: THREE.BufferGeometry; lobes: LobeRange[] };

function lobeCluster(lobes: Lobe[]): Cluster {
  const parts = lobes.map((l) => {
    const g = new THREE.IcosahedronGeometry(l.r, 0);
    g.scale(1, l.squash, 1);
    g.translate(l.x, l.y, l.z);
    return g;
  });
  const ranges: LobeRange[] = [];
  let start = 0;
  for (let i = 0; i < parts.length; i += 1) {
    const count = parts[i].getAttribute("position").count;
    ranges.push({ cx: lobes[i].x, cy: lobes[i].y, cz: lobes[i].z, start, count });
    start += count;
  }
  const merged = mergeGeometries(parts, false);
  for (const p of parts) {
    p.dispose();
  }
  if (!merged) {
    throw new Error("lobe merge failed");
  }
  return { geo: merged, lobes: ranges };
}

function ring(seed: number, count: number, radius: number, y: number, r: number, squash: number): Lobe[] {
  const out: Lobe[] = [];
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * Math.PI * 2 + hash01(seed + i) * 1.5;
    const rad = radius * (0.68 + hash01(seed + i + 40) * 0.5);
    out.push({
      x: Math.cos(a) * rad,
      y: y + (hash01(seed + i + 80) - 0.4) * r * 0.75,
      z: Math.sin(a) * rad,
      r: r * (0.72 + hash01(seed + i + 120) * 0.55),
      squash,
    });
  }
  return out;
}

function trunkGeo(height: number, top: number, bottom: number, hex: number, seed: number): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(top, bottom, height, 5, 1);
  g.translate(0, height * 0.5, 0);
  paint(g, hex, 0.05, seed);
  g.computeVertexNormals();
  return g;
}

/** Shared finish: per-lobe normals then the vertical tint. */
function finish(
  cluster: Cluster,
  tone: { lit: number; dark: number },
  variance: number,
  seed: number,
  flatten: number,
): { canopy: THREE.BufferGeometry } {
  const { geo, lobes } = cluster;
  lobeNormals(geo, lobes, flatten);
  paintVertical(geo, tone.dark, tone.lit, variance, seed, 1.25);
  return { canopy: geo };
}

function broadleaf(seed: number, tone: { lit: number; dark: number }, scale: number): TreePart {
  // Crown diameter ~13 m against an 8 m candidate grid, which is what gets closed
  // canopy to the measured ~90% cover instead of reading as separated blobs.
  const r = 6.6 * scale;
  const trunkH = 2.6 * scale;
  const lobes: Lobe[] = [
    { x: 0, y: trunkH + r * 0.62, z: 0, r: r * 0.7, squash: 0.84 },
    ...ring(seed, 4 + Math.floor(hash01(seed) * 2), r * 0.66, trunkH + r * 0.48, r * 0.58, 0.8),
  ];
  return {
    trunk: trunkGeo(trunkH + r * 0.35, 0.16 * scale, 0.34 * scale, 0x7a5f42, seed + 9),
    ...finish(lobeCluster(lobes), tone, 0.16, seed + 5, 0.55),
  };
}

function riparian(seed: number, tone: { lit: number; dark: number }): TreePart {
  const r = 5.6;
  const trunkH = 2.2;
  const cluster = lobeCluster([
    { x: 0, y: trunkH + r * 0.7, z: 0, r: r * 0.66, squash: 0.9 },
    ...ring(seed + 3, 4, r * 0.62, trunkH + r * 0.52, r * 0.52, 0.86),
  ]);
  return { trunk: trunkGeo(trunkH + 1.4, 0.14, 0.3, 0x82694a, seed + 13), ...finish(cluster, tone, 0.18, seed + 11, 0.55) };
}

/**
 * Dark spires that break the broadleaf mass near water and along edges. Built from
 * stacked squashed lobes rather than cones: the reference's conifers taper to a
 * rounded, slightly ragged tip, and cones read as hard pointy spikes from above.
 */
function conifer(seed: number, tone: { lit: number; dark: number }): TreePart {
  const h = 14 + hash01(seed) * 4.5;
  const r = 3.2;
  const lobes: Lobe[] = [];
  const tiers = 5;
  for (let i = 0; i < tiers; i += 1) {
    const t = i / (tiers - 1);
    const lr = r * (1 - t * 0.68) * (0.84 + hash01(seed + i) * 0.3);
    lobes.push({
      x: (hash01(seed + i + 20) - 0.5) * r * 0.34,
      y: h * 0.28 + t * h * 0.6,
      z: (hash01(seed + i + 30) - 0.5) * r * 0.34,
      r: lr,
      squash: 0.82,
    });
  }
  const cluster = lobeCluster(lobes);
  return { trunk: trunkGeo(h * 0.34, 0.13, 0.28, 0x6a5038, seed + 19), ...finish(cluster, tone, 0.13, seed + 17, 0.5) };
}

/** The tall bare-trunked family standing along the arid edge of the transition. */
function savanna(seed: number, tone: { lit: number; dark: number }): TreePart {
  const trunkH = 6.4 + hash01(seed) * 2.6;
  const r = 5.6;
  const cluster = lobeCluster([
    { x: 0, y: trunkH + r * 0.34, z: 0, r: r * 0.6, squash: 0.5 },
    ...ring(seed + 7, 4, r * 0.66, trunkH + r * 0.3, r * 0.48, 0.46),
  ]);
  // Pale grey-brown trunk, clearly visible against gold.
  return { trunk: trunkGeo(trunkH + 1.2, 0.15, 0.36, 0xa08a6c, seed + 29), ...finish(cluster, tone, 0.15, seed + 23, 0.42) };
}

function scrub(seed: number, tone: { lit: number; dark: number }): TreePart {
  const r = 1.15 + hash01(seed) * 0.55;
  const cluster = lobeCluster([
    { x: 0, y: r * 0.7, z: 0, r: r * 0.78, squash: 0.7 },
    ...ring(seed + 11, 3, r * 0.6, r * 0.55, r * 0.52, 0.66),
  ]);
  return { trunk: null, ...finish(cluster, tone, 0.2, seed + 31, 0.6) };
}

export function makeTree(family: TreeFamily, variant: number): TreePart {
  const tones = TONES[family];
  const tone = tones[variant % tones.length];
  const seed = 700 + variant * 97 + family.length * 13;
  switch (family) {
    case "broadleaf":
      return broadleaf(seed, tone, 0.9 + variant * 0.12);
    case "conifer":
      return conifer(seed, tone);
    case "riparian":
      return riparian(seed, tone);
    case "savanna":
      return savanna(seed, tone);
    case "scrub":
      return scrub(seed, tone);
    default: {
      const _never: never = family;
      return _never;
    }
  }
}
