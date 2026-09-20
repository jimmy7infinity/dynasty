import * as THREE from "three/webgpu";
import { type WorldIdentity } from "../domain/world.ts";
import {
  familyWeights,
  reefDensity,
  rockDensity,
  sampleField,
  scrubDensity,
  treeDensity,
  type FieldSample,
  type TreeFamily,
} from "./fields.ts";
import { makeRock, ROCK_VARIANTS, type RockKind } from "./props.ts";
import { hash01, toonMaterial } from "./toon.ts";
import { makeTree, VARIANTS } from "./trees.ts";

export type LabStats = { instances: number; batches: number; triangles: number };

type Spot = { x: number; y: number; z: number; yaw: number; scale: number; tint?: THREE.Color };

/**
 * Crown-to-crown value and hue variety, which the reference has a lot of: a closed
 * canopy there runs from near-lime sunlit crowns down to almost-black masses, and
 * that spread is per-crown, not per-vertex. Exposed crowns go warm and bright,
 * crowns buried in dense canopy go cool and dark, and a small fraction are picked
 * out as highlights.
 */
function crownTint(cover: number, roll: number, warm: number): THREE.Color {
  const buried = 0.78 + (1 - cover) * 0.22;
  if (roll > 0.9) {
    return new THREE.Color(1.2 * buried, 1.14 * buried, 0.86 * buried);
  }
  if (roll < 0.26) {
    return new THREE.Color(0.8 * buried, 0.88 * buried, 0.95 * buried);
  }
  const t = 0.92 + warm * 0.2;
  return new THREE.Color(t * buried, (0.95 + warm * 0.14) * buried, (0.95 - warm * 0.12) * buried);
}

function instance(
  group: THREE.Group,
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  spots: Spot[],
  cast: boolean,
  receive = false,
): LabStats {
  if (spots.length === 0) {
    return { instances: 0, batches: 0, triangles: 0 };
  }
  const mesh = new THREE.InstancedMesh(geo, mat, spots.length);
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  mesh.frustumCulled = false;
  const dummy = new THREE.Object3D();
  for (let i = 0; i < spots.length; i += 1) {
    const p = spots[i];
    dummy.position.set(p.x, p.y, p.z);
    dummy.rotation.set(0, p.yaw, 0);
    dummy.scale.setScalar(p.scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    if (p.tint) {
      mesh.setColorAt(i, p.tint);
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }
  group.add(mesh);
  const idx = geo.index;
  const tris = (idx ? idx.count / 3 : geo.getAttribute("position").count / 3) * spots.length;
  return { instances: spots.length, batches: 1, triangles: tris };
}

function pickFamily(field: FieldSample, roll: number): TreeFamily {
  const w = familyWeights(field);
  const total = w.broadleaf + w.conifer + w.riparian + w.savanna + w.scrub;
  let acc = roll * total;
  const order: TreeFamily[] = ["broadleaf", "conifer", "riparian", "savanna", "scrub"];
  for (const family of order) {
    acc -= w[family];
    if (acc <= 0) {
      return family;
    }
  }
  return "broadleaf";
}

type Bucket = { family: TreeFamily; variant: number; spots: Spot[] };
type RockBucket = { kind: RockKind; variant: number; spots: Spot[] };

export function populateLab(group: THREE.Group, identity: WorldIdentity, ox: number, oz: number): LabStats {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }

  const trees: Bucket[] = [];
  const treeIndex = new Map<string, Bucket>();
  for (const family of Object.keys(VARIANTS) as TreeFamily[]) {
    for (let v = 0; v < VARIANTS[family]; v += 1) {
      const bucket: Bucket = { family, variant: v, spots: [] };
      trees.push(bucket);
      treeIndex.set(`${family}:${v}`, bucket);
    }
  }
  const rocks: RockBucket[] = [];
  const rockIndex = new Map<string, RockBucket>();
  for (const kind of Object.keys(ROCK_VARIANTS) as RockKind[]) {
    for (let v = 0; v < ROCK_VARIANTS[kind]; v += 1) {
      const bucket: RockBucket = { kind, variant: v, spots: [] };
      rocks.push(bucket);
      rockIndex.set(`${kind}:${v}`, bucket);
    }
  }

  // 8 m candidates against a 13 m crown give the measured ~14 m crown period and
  // ~90% cover where density saturates, while thinner regimes thin out on their own.
  const spacing = 8;
  const half = 900;
  let n = 0;
  for (let z = oz - half; z <= oz + half; z += spacing) {
    for (let x = ox - half; x <= ox + half; x += spacing) {
      n += 1;
      const jx = x + (hash01(n * 1.7 + 3) - 0.5) * spacing * 1.35;
      const jz = z + (hash01(n * 2.3 + 5) - 0.5) * spacing * 1.35;
      const field = sampleField(identity, jx, jz);

      const dens = treeDensity(field);
      if (dens > 0.02 && hash01(n * 3.1 + 9) < dens) {
        const family = pickFamily(field, hash01(n * 4.3 + 11));
        const variant = Math.floor(hash01(n * 5.7 + 13) * VARIANTS[family]) % VARIANTS[family];
        // Closed canopy grows full size; isolated crowns in the fringe stay smaller.
        const vigour = 0.62 + 0.5 * field.forest + 0.28 * field.riparian;
        trees
          .find((b) => b.family === family && b.variant === variant)
          ?.spots.push({
            x: jx,
            y: field.height - 0.15,
            z: jz,
            yaw: hash01(n * 6.1 + 15) * 6.28,
            scale: vigour * (0.82 + hash01(n * 7.3 + 17) * 0.5),
            tint: crownTint(dens, hash01(n * 20.3 + 43), hash01(n * 21.7 + 45)),
          });
      } else if (hash01(n * 8.9 + 19) < scrubDensity(field)) {
        const variant = Math.floor(hash01(n * 9.7 + 21) * VARIANTS.scrub) % VARIANTS.scrub;
        treeIndex.get(`scrub:${variant}`)?.spots.push({
          x: jx,
          y: field.height - 0.08,
          z: jz,
          yaw: hash01(n * 10.3 + 23) * 6.28,
          scale: 0.7 + hash01(n * 11.1 + 25) * 0.85,
        });
      }

      const rockRoll = hash01(n * 12.7 + 27);
      if (rockRoll < rockDensity(field)) {
        // Fins on slope and in clusters, flat pebbles as the loose scatter.
        const wantFin = field.slope > 0.35 || field.rockClump > 0.66;
        const kind: RockKind = wantFin ? "fin" : "pebble";
        const variant = Math.floor(hash01(n * 13.3 + 29) * ROCK_VARIANTS[kind]) % ROCK_VARIANTS[kind];
        rockIndex.get(`${kind}:${variant}`)?.spots.push({
          x: jx,
          y: field.height - 0.12,
          z: jz,
          yaw: hash01(n * 14.9 + 31) * 6.28,
          scale: wantFin ? 0.7 + hash01(n * 15.1 + 33) * 1.5 : 0.8 + hash01(n * 15.1 + 33) * 2.2,
        });
      }

      if (hash01(n * 16.7 + 35) < reefDensity(identity, jx, jz)) {
        const variant = Math.floor(hash01(n * 17.3 + 37) * ROCK_VARIANTS.stack) % ROCK_VARIANTS.stack;
        rockIndex.get(`stack:${variant}`)?.spots.push({
          x: jx,
          y: Math.max(-3.4, field.height) - 0.4,
          z: jz,
          yaw: hash01(n * 18.1 + 39) * 6.28,
          scale: 0.55 + hash01(n * 19.7 + 41) * 1.15,
        });
      }
    }
  }

  // Mesas are rare landmarks, so they get placed by search rather than by density.
  const mesaSpots: Spot[] = [];
  for (let i = 0; i < 900 && mesaSpots.length < 5; i += 1) {
    const jx = ox + (hash01(i * 2.9 + 51) - 0.5) * 1500;
    const jz = oz + (hash01(i * 3.7 + 53) - 0.5) * 1500;
    const field = sampleField(identity, jx, jz);
    if (field.arid < 0.65 || field.rockClump < 0.62 || field.slope > 0.5 || field.height < 12) {
      continue;
    }
    if (mesaSpots.some((s) => Math.hypot(s.x - jx, s.z - jz) < 330)) {
      continue;
    }
    mesaSpots.push({
      x: jx,
      y: field.height - 1.2,
      z: jz,
      yaw: hash01(i * 4.1 + 55) * 6.28,
      scale: 0.85 + hash01(i * 5.3 + 57) * 0.9,
    });
  }
  if (mesaSpots.length > 0) {
    const variant = 0;
    rockIndex.get(`mesa:${variant}`)?.spots.push(...mesaSpots);
  }

  let instances = 0;
  let batches = 0;
  let triangles = 0;
  const add = (s: LabStats): void => {
    instances += s.instances;
    batches += s.batches;
    triangles += s.triangles;
  };
  const canopyMat = toonMaterial("canopy");
  const trunkMat = toonMaterial("trunk");
  const rockMat = toonMaterial("rock");

  for (const bucket of trees) {
    if (bucket.spots.length === 0) {
      continue;
    }
    const part = makeTree(bucket.family, bucket.variant);
    // Crowns receive as well as cast. Over half the reference forest is deep shadow
    // and that darkness is crowns shading each other, not a darker albedo.
    add(instance(group, part.canopy, canopyMat, bucket.spots, true, bucket.family !== "scrub"));
    if (part.trunk) {
      add(instance(group, part.trunk, trunkMat, bucket.spots, false));
    }
  }
  for (const bucket of rocks) {
    if (bucket.spots.length === 0) {
      continue;
    }
    add(instance(group, makeRock(bucket.kind, bucket.variant), rockMat, bucket.spots, true));
  }
  return { instances, batches, triangles };
}
