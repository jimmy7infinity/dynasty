import { hash01, mixSeed } from "./noise.ts";
import { Prop, rollCottage, rollProp, sampleSite, type PropId } from "./ecology.ts";
import { Stream, type WorldIdentity } from "./world.ts";

export const PROP_COUNT = 9;

export type InstanceFill = {
  buffers: Float32Array[];
  counts: number[];
  ms: number;
};

function writeMatrix(out: Float32Array, i: number, x: number, y: number, z: number, yaw: number, sx: number, sy: number, sz: number): void {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const o = i * 16;
  out[o] = c * sx;
  out[o + 1] = 0;
  out[o + 2] = -s * sx;
  out[o + 3] = 0;
  out[o + 4] = 0;
  out[o + 5] = sy;
  out[o + 6] = 0;
  out[o + 7] = 0;
  out[o + 8] = s * sz;
  out[o + 9] = 0;
  out[o + 10] = c * sz;
  out[o + 11] = 0;
  out[o + 12] = x;
  out[o + 13] = y;
  out[o + 14] = z;
  out[o + 15] = 1;
}

const CAPS: number[] = [40_000, 28_000, 22_000, 60_000, 180_000, 40_000, 18_000, 8_000, 24];

export function fillInstances(
  id: WorldIdentity,
  px: number,
  pz: number,
  target: number,
  radius: number,
): InstanceFill {
  const t0 = performance.now();
  const buffers = CAPS.map((cap) => new Float32Array(cap * 16));
  const counts = new Array<number>(PROP_COUNT).fill(0);
  const area = Math.PI * radius * radius;
  const spacing = Math.max(2.2, Math.sqrt(area / Math.max(target * 2.1, 1)));
  let placed = 0;
  const r2 = radius * radius;
  fill: for (let z = pz - radius; z <= pz + radius; z += spacing) {
    for (let x = px - radius; x <= px + radius; x += spacing) {
      const dx = x - px;
      const dz = z - pz;
      const d2 = dx * dx + dz * dz;
      if (d2 > r2) {
        continue;
      }
      if (placed >= target) {
        break fill;
      }
      const dist = Math.sqrt(d2);
      if (hash01(mixSeed(id.seed, Stream.Vegetation, Math.floor(x * 0.18), Math.floor(z * 0.18))) > 0.88) {
        continue;
      }
      const site = sampleSite(id, x, z);
      const roll = rollProp(id, site);
      if (!roll) {
        continue;
      }
      if (!lodOk(roll.prop, dist)) {
        continue;
      }
      const cap = CAPS[roll.prop];
      if (counts[roll.prop] >= cap) {
        continue;
      }
      const yOff = yOffset(roll.prop, roll.sy);
      writeMatrix(buffers[roll.prop], counts[roll.prop], x, site.y + yOff, z, roll.yaw, roll.sx, roll.sy, roll.sz);
      counts[roll.prop] += 1;
      placed += 1;
    }
  }
  const cell = 180;
  for (let z = pz - 900; z <= pz + 900; z += cell) {
    for (let x = px - 900; x <= px + 900; x += cell) {
      const site = sampleSite(id, x, z);
      const c = rollCottage(id, x, z, site);
      if (!c || counts[Prop.Cottage] >= CAPS[Prop.Cottage]) {
        continue;
      }
      writeMatrix(buffers[Prop.Cottage], counts[Prop.Cottage], x, site.y, z, c.yaw, c.sx, c.sy, c.sz);
      counts[Prop.Cottage] += 1;
    }
  }
  const trimmed = buffers.map((buf, i) => buf.subarray(0, counts[i] * 16));
  return { buffers: trimmed, counts, ms: performance.now() - t0 };
}

function lodOk(prop: PropId, dist: number): boolean {
  switch (prop) {
    case Prop.Grass:
      return dist < 640;
    case Prop.Flower:
      return dist < 520;
    case Prop.Shrub:
      return dist < 980;
    case Prop.Log:
      return dist < 520;
    case Prop.Oak:
    case Prop.Pine:
    case Prop.Birch:
      return dist < 1750;
    case Prop.Rock:
      return dist < 1600;
    case Prop.Cottage:
      return dist < 2200;
    default: {
      const _never: never = prop;
      return _never;
    }
  }
}

function yOffset(prop: PropId, sy: number): number {
  switch (prop) {
    case Prop.Oak:
      return 0;
    case Prop.Pine:
      return 0;
    case Prop.Birch:
      return 0;
    case Prop.Shrub:
      return 0.15 * sy;
    case Prop.Grass:
      return 0.22 * sy;
    case Prop.Flower:
      return 0.12 * sy;
    case Prop.Rock:
      return 0.15 * sy;
    case Prop.Log:
      return 0.18 * sy;
    case Prop.Cottage:
      return 0;
    default: {
      const _never: never = prop;
      return _never;
    }
  }
}
