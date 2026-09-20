import * as THREE from "three/webgpu";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { hash01, paintVertical, puffNormals } from "./toon.ts";

/**
 * Reference rock is jagged and vertically fractured: clustered fins and shards
 * with sharp tips, plus one stratified mesa with horizontal strata and spires on
 * top. It is brown-grey (`#4b3e38` to `#a58f6a`), not gold, and it is nowhere
 * near a rounded boulder. The same family reappears as offshore stacks.
 */

export type RockKind = "fin" | "mesa" | "pebble" | "stack";

export const ROCK_VARIANTS: Record<RockKind, number> = { fin: 3, mesa: 2, pebble: 2, stack: 2 };

const DESERT = { lit: 0xa58f6a, dark: 0x4b3e38 };
const ALPINE = { lit: 0x8f8a72, dark: 0x3c423b };

function merge(parts: THREE.BufferGeometry[], label: string): THREE.BufferGeometry {
  const merged = mergeGeometries(parts, false);
  for (const p of parts) {
    p.dispose();
  }
  if (!merged) {
    throw new Error(`${label} merge failed`);
  }
  return merged;
}

function seatOnGround(geo: THREE.BufferGeometry): void {
  geo.computeBoundingBox();
  const minY = geo.boundingBox?.min.y ?? 0;
  geo.translate(0, -minY, 0);
}

/** A tapered, few-sided prism reads as a fractured shard rather than a rock. */
function shard(seed: number, radius: number, height: number, sides: number): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(radius * (0.14 + hash01(seed) * 0.22), radius, height, sides, 1);
  g.translate(0, height * 0.5, 0);
  g.rotateY(hash01(seed + 1) * Math.PI * 2);
  g.rotateZ((hash01(seed + 2) - 0.5) * 0.42);
  g.rotateX((hash01(seed + 3) - 0.5) * 0.42);
  return g;
}

function fin(seed: number): THREE.BufferGeometry {
  const n = 4 + Math.floor(hash01(seed) * 3);
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < n; i += 1) {
    const s = seed + i * 13;
    const r = 0.85 + hash01(s) * 1.15;
    const h = 2.6 + hash01(s + 5) * 6.2;
    const g = shard(s, r, h, 4 + (i % 2));
    const a = (i / n) * Math.PI * 2 + hash01(s + 7) * 1.2;
    const rad = hash01(s + 9) * 1.9;
    g.translate(Math.cos(a) * rad, -hash01(s + 11) * 0.7, Math.sin(a) * rad);
    parts.push(g);
  }
  const merged = merge(parts, "fin");
  seatOnGround(merged);
  paintVertical(merged, DESERT.dark, DESERT.lit, 0.14, seed + 21);
  puffNormals(merged, 0.92);
  return merged;
}

/** Stacked offset slabs give the horizontal strata; cones give the summit spires. */
function mesa(seed: number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  let y = 0;
  let w = 9.5 + hash01(seed) * 3;
  const tiers = 4;
  for (let i = 0; i < tiers; i += 1) {
    const th = 1.5 + hash01(seed + i) * 1.9;
    const box = new THREE.BoxGeometry(w, th, w * (0.78 + hash01(seed + i + 30) * 0.4));
    box.rotateY(hash01(seed + i + 60) * 0.7);
    box.translate((hash01(seed + i + 90) - 0.5) * w * 0.16, y + th * 0.5, (hash01(seed + i + 120) - 0.5) * w * 0.16);
    parts.push(box);
    y += th;
    w *= 0.8 + hash01(seed + i + 150) * 0.08;
  }
  const spires = 2 + Math.floor(hash01(seed + 3) * 2);
  for (let i = 0; i < spires; i += 1) {
    const s = seed + 200 + i * 17;
    const h = 3.4 + hash01(s) * 4.4;
    const cone = new THREE.ConeGeometry(0.8 + hash01(s + 1) * 0.9, h, 5, 1);
    const a = hash01(s + 2) * Math.PI * 2;
    const rad = hash01(s + 3) * w * 0.42;
    cone.translate(Math.cos(a) * rad, y + h * 0.42, Math.sin(a) * rad);
    cone.rotateZ((hash01(s + 4) - 0.5) * 0.16);
    parts.push(cone);
  }
  const merged = merge(parts, "mesa");
  seatOnGround(merged);
  paintVertical(merged, DESERT.dark, DESERT.lit, 0.1, seed + 41);
  puffNormals(merged, 0.95);
  return merged;
}

/** Flat elongated pebbles: the small dark specks scattered across the gold. */
function pebble(seed: number): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(0.72 + hash01(seed) * 0.5, 0);
  g.scale(1.25 + hash01(seed + 1) * 0.7, 0.34 + hash01(seed + 2) * 0.3, 0.85 + hash01(seed + 3) * 0.5);
  g.rotateY(hash01(seed + 4) * Math.PI);
  seatOnGround(g);
  paintVertical(g, DESERT.dark, DESERT.lit, 0.18, seed + 51);
  puffNormals(g, 0.85);
  return g;
}

/** Offshore stacks: same fractured family, wider footed so they sit in the shoal. */
function stack(seed: number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const n = 2 + Math.floor(hash01(seed) * 2);
  for (let i = 0; i < n; i += 1) {
    const s = seed + i * 19;
    const h = 2.2 + hash01(s) * 4.6;
    const g = new THREE.CylinderGeometry(0.5 + hash01(s + 1) * 0.7, 1.5 + hash01(s + 2) * 1.1, h, 5, 1);
    g.translate(0, h * 0.5, 0);
    g.rotateZ((hash01(s + 3) - 0.5) * 0.3);
    const a = hash01(s + 4) * Math.PI * 2;
    g.translate(Math.cos(a) * hash01(s + 5) * 1.7, 0, Math.sin(a) * hash01(s + 6) * 1.7);
    parts.push(g);
  }
  const merged = merge(parts, "stack");
  seatOnGround(merged);
  paintVertical(merged, ALPINE.dark, DESERT.lit, 0.14, seed + 61);
  puffNormals(merged, 0.9);
  return merged;
}

export function makeRock(kind: RockKind, variant: number): THREE.BufferGeometry {
  const seed = 900 + variant * 131 + kind.length * 7;
  switch (kind) {
    case "fin":
      return fin(seed);
    case "mesa":
      return mesa(seed);
    case "pebble":
      return pebble(seed);
    case "stack":
      return stack(seed);
    default: {
      const _never: never = kind;
      return _never;
    }
  }
}
