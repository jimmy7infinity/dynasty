import {
  meanderX,
  sampleHeightMeters,
  sampleSlope,
  waterDistance,
  type WorldIdentity,
} from "../domain/world.ts";
import { hash01, type Prototype } from "./ingest.ts";

export type Placement = { id: string; x: number; y: number; z: number; yaw: number; scale: number };

export const GATE_METERS = 500;

function put(
  identity: WorldIdentity,
  byId: Map<string, Prototype>,
  id: string,
  x: number,
  z: number,
  yaw: number,
  scale: number,
): Placement {
  const proto = byId.get(id);
  const y = sampleHeightMeters(identity, x, z);
  const sink = proto && proto.entry.kind === "rock" ? 0.12 * scale : 0;
  return { id, x, y: y - sink, z, yaw, scale };
}

function inGate(ox: number, oz: number, x: number, z: number): boolean {
  const h = GATE_METERS * 0.5;
  return x >= ox - h && x <= ox + h && z >= oz - h && z <= oz + h;
}

function cluster(
  n: number,
  seed: number,
  cx: number,
  cz: number,
  radius: number,
): { x: number; z: number; h: number }[] {
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const a = hash01(seed + i * 3) * Math.PI * 2;
    const r = Math.sqrt(hash01(seed + i * 3 + 1)) * radius;
    out.push({ x: cx + Math.cos(a) * r, z: cz + Math.sin(a) * r, h: hash01(seed + i * 3 + 2) });
  }
  return out;
}

export function composeValley(
  identity: WorldIdentity,
  prototypes: Prototype[],
  ox: number,
  oz: number,
): Placement[] {
  const byId = new Map(prototypes.map((p) => [p.entry.id, p]));
  const out: Placement[] = [];
  const half = GATE_METERS * 0.5;

  const add = (id: string, x: number, z: number, yaw: number, scale: number): void => {
    if (!inGate(ox, oz, x, z)) {
      return;
    }
    if (sampleHeightMeters(identity, x, z) < 1.2) {
      return;
    }
    out.push(put(identity, byId, id, x, z, yaw, scale));
  };

  // Forest interior (east of river): three groves, not a uniform grid.
  const groveNear = cluster(16, 7, ox + 22, oz + 8, 22);
  const groveA = cluster(42, 11, ox + 95, oz - 40, 55);
  const groveB = cluster(36, 21, ox + 130, oz + 70, 48);
  const groveC = cluster(28, 31, ox + 70, oz + 140, 40);
  const forestTrees = ["Tree1_Mid", "Tree2_Mid", "Oak_Mid", "Birch_Mid"] as const;
  for (const pt of [...groveNear, ...groveA, ...groveB, ...groveC]) {
    const wd = waterDistance(identity, pt.x, pt.z);
    if (wd < 18) {
      continue;
    }
    const id = forestTrees[Math.floor(pt.h * forestTrees.length)];
    add(id, pt.x, pt.z, pt.h * 6.28, 0.88 + pt.h * 0.38);
  }

  // Forest edge: denser shrubs, opening toward meadow.
  for (let i = 0; i < 34; i += 1) {
    const z = oz - 90 + (i / 33) * 220 + (hash01(i + 90) - 0.5) * 18;
    const mx = meanderX(identity, z);
    const x = mx + 22 + hash01(i + 91) * 28;
    add(hash01(i) > 0.45 ? "LargeBush" : "Bush", x, z, hash01(i + 92) * 6.28, 0.85 + hash01(i + 93) * 0.4);
    if (hash01(i + 94) > 0.55) {
      add("Birch_Mid", x + 6 + hash01(i + 95) * 10, z + (hash01(i + 96) - 0.5) * 8, hash01(i + 97) * 6.28, 0.75 + hash01(i + 98) * 0.3);
    }
  }

  // Meadow (west): sparse oaks + flowers, negative space.
  for (let i = 0; i < 14; i += 1) {
    const z = oz - 80 + hash01(i + 110) * 200;
    const mx = meanderX(identity, z);
    const x = mx - 40 - hash01(i + 111) * 90;
    add(i % 5 === 0 ? "Oak_Mid" : "Tree2_Mid", x, z, hash01(i + 112) * 6.28, 0.82 + hash01(i + 113) * 0.35);
  }
  for (let i = 0; i < 48; i += 1) {
    const z = oz - 60 + hash01(i + 130) * 160;
    const mx = meanderX(identity, z);
    const x = mx - 28 - hash01(i + 131) * 70;
    const flowers = ["WhiteFlower", "YellowFlower", "BlueFlower"] as const;
    add(flowers[i % 3], x, z, hash01(i + 132) * 6.28, 0.9 + hash01(i + 133) * 0.35);
  }

  // River corridor: grass, weeds, ivy, pebbles, bank rocks.
  for (let i = 0; i < 80; i += 1) {
    const z = oz - half + 20 + (i / 79) * (GATE_METERS - 40);
    const mx = meanderX(identity, z);
    const side = i % 2 === 0 ? 1 : -1;
    const x = mx + side * (8 + hash01(i + 150) * 10);
    add(i % 3 === 0 ? "Weed" : "Grass", x, z, hash01(i + 151) * 6.28, 0.95 + hash01(i + 152) * 0.4);
    if (i % 5 === 0) {
      add("Ivy", mx + side * (11 + hash01(i + 153) * 6), z + (hash01(i + 154) - 0.5) * 4, hash01(i + 155) * 6.28, 1);
    }
    if (i % 7 === 0) {
      add("Pebble", mx + side * (5 + hash01(i + 156) * 4), z, hash01(i + 157) * 6.28, 0.8 + hash01(i + 158) * 0.5);
    }
  }

  // Rocky steep patches: south-east and north-west of origin.
  for (let i = 0; i < 22; i += 1) {
    const x = ox + 60 + hash01(i + 170) * 110;
    const z = oz - 160 + hash01(i + 171) * 70;
    if (sampleSlope(identity, x, z) < 0.18 && hash01(i + 172) < 0.35) {
      continue;
    }
    const rocks = ["Rock1", "Rock2", "Rock3", "Rock4"] as const;
    add(rocks[i % 4], x, z, hash01(i + 173) * 6.28, 0.7 + hash01(i + 174) * 0.9);
  }
  for (let i = 0; i < 16; i += 1) {
    const x = ox - 40 - hash01(i + 190) * 90;
    const z = oz + 90 + hash01(i + 191) * 80;
    add(i % 2 === 0 ? "Rock2" : "Rock4", x, z, hash01(i + 192) * 6.28, 0.85 + hash01(i + 193) * 0.8);
  }

  // Hero trees: readable landmarks near spawn and meadow.
  add("Tree1_Hero", ox + 18, oz + 12, 0.4, 1.08);
  add("Oak_Hero", ox - 55, oz + 28, 1.1, 1.15);
  add("Tree1_Hero", ox + 148, oz - 22, 2.2, 1.05);

  // Bridge: sit on river at spawn z.
  const bx = meanderX(identity, oz);
  add("Bridge", bx, oz, 0, 1);

  // Understory in forest interiors.
  for (let i = 0; i < 40; i += 1) {
    const pt = groveA[i % groveA.length];
    add("Bush", pt.x + (hash01(i + 200) - 0.5) * 10, pt.z + (hash01(i + 201) - 0.5) * 10, hash01(i + 202) * 6.28, 0.8 + hash01(i + 203) * 0.45);
  }

  return out;
}
