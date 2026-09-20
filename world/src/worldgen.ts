import { fbm, hash2, ridge, smoothstep } from "./noise.ts";

export const DEFAULT_SEED = 739184;
export const WORLD_METERS = 1400;
export const GRID = 224;
export const CELL = WORLD_METERS / (GRID - 1);

export const Biome = {
  Ocean: 0,
  Beach: 1,
  Grass: 2,
  Forest: 3,
  Desert: 4,
  Mountain: 5,
  Wetland: 6,
} as const;

export type BiomeId = (typeof Biome)[keyof typeof Biome];

export type Vec3 = { x: number; y: number; z: number };

export type PropInstance = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  scale: number;
  kind: number;
};

export type StructureInstance = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  kind: "ruin" | "hut" | "tower" | "pier";
};

export type RiverPath = {
  points: Vec3[];
  width: number;
};

export type GeneratedWorld = {
  seed: number;
  size: number;
  grid: number;
  seaLevel: number;
  heights: Float32Array;
  moisture: Float32Array;
  accumulation: Float32Array;
  biomes: Uint8Array;
  rivers: RiverPath[];
  lakes: Vec3[];
  trees: PropInstance[];
  shrubs: PropInstance[];
  rocks: PropInstance[];
  resources: PropInstance[];
  structures: StructureInstance[];
  spawn: Vec3;
  weather: { raining: boolean; fogDensity: number };
};

const DIRS: readonly [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

function idx(x: number, z: number): number {
  return z * GRID + x;
}

function inBounds(x: number, z: number): boolean {
  return x >= 0 && z >= 0 && x < GRID && z < GRID;
}

function worldX(ix: number): number {
  return ix * CELL - WORLD_METERS / 2;
}

function worldZ(iz: number): number {
  return iz * CELL - WORLD_METERS / 2;
}

export function sampleHeight(world: GeneratedWorld, x: number, z: number): number {
  const half = world.size / 2;
  const gx = ((x + half) / CELL);
  const gz = ((z + half) / CELL);
  const x0 = Math.floor(gx);
  const z0 = Math.floor(gz);
  const x1 = Math.min(world.grid - 1, x0 + 1);
  const z1 = Math.min(world.grid - 1, z0 + 1);
  const tx = gx - x0;
  const tz = gz - z0;
  const clampX0 = Math.min(world.grid - 1, Math.max(0, x0));
  const clampZ0 = Math.min(world.grid - 1, Math.max(0, z0));
  const h00 = world.heights[clampZ0 * world.grid + clampX0] ?? 0;
  const h10 = world.heights[clampZ0 * world.grid + x1] ?? 0;
  const h01 = world.heights[z1 * world.grid + clampX0] ?? 0;
  const h11 = world.heights[z1 * world.grid + x1] ?? 0;
  return h00 * (1 - tx) * (1 - tz) + h10 * tx * (1 - tz) + h01 * (1 - tx) * tz + h11 * tx * tz;
}

export function sampleSlope(world: GeneratedWorld, x: number, z: number): number {
  const d = 2;
  const dx = sampleHeight(world, x + d, z) - sampleHeight(world, x - d, z);
  const dz = sampleHeight(world, x, z + d) - sampleHeight(world, x, z - d);
  return Math.hypot(dx, dz) / (2 * d);
}

function biomeAtHeightMoisture(
  height: number,
  moisture: number,
  slope: number,
  seaLevel: number,
  river: boolean,
): BiomeId {
  if (height < seaLevel - 0.35) {
    return Biome.Ocean;
  }
  if (height < seaLevel + 2.4) {
    return Biome.Beach;
  }
  if (river && height < seaLevel + 14 && moisture > 0.34) {
    return Biome.Wetland;
  }
  if (height > 58 || (height > 46 && slope > 0.55)) {
    return Biome.Mountain;
  }
  if (moisture < 0.22 && height < 50) {
    return Biome.Desert;
  }
  if (moisture > 0.42 && height < 52 && slope < 0.45) {
    return Biome.Forest;
  }
  if (moisture > 0.55 && slope < 0.22) {
    return Biome.Wetland;
  }
  return Biome.Grass;
}

export function generateWorld(seed: number): GeneratedWorld {
  const heights = new Float32Array(GRID * GRID);
  const moisture = new Float32Array(GRID * GRID);
  const accumulation = new Float32Array(GRID * GRID);
  const biomes = new Uint8Array(GRID * GRID);
  const seaLevel = 16.5;

  for (let iz = 0; iz < GRID; iz++) {
    for (let ix = 0; ix < GRID; ix++) {
      const nx = ix / (GRID - 1);
      const nz = iz / (GRID - 1);
      const inland = smoothstep(0.18, 0.48, nz);
      const eastFall = smoothstep(0.82, 1.0, nx) * 10;
      const westShelf = (1 - nx) * 4 * inland;
      const detail = fbm(ix * 0.035, iz * 0.035, seed, 5);
      const broad = fbm(ix * 0.012, iz * 0.012, seed + 3, 4);
      const ridgeBand = Math.exp(-(((nx - 0.62) / 0.09) ** 2));
      const ridgeNoise = ridge(ix * 0.02, iz * 0.028, seed + 11, 4);
      const mountains = ridgeBand * inland * (0.45 + ridgeNoise) * 78;
      const foothills = inland * broad * 16;
      let h = 7.5 + inland * 14 + westShelf + foothills + mountains + (detail - 0.5) * 12 * inland;
      h -= eastFall;
      h -= (1 - inland) * 9;
      const bowl = Math.hypot(nx - 0.38, nz - 0.62);
      if (bowl < 0.12) {
        h -= (0.12 - bowl) * 40;
      }
      heights[idx(ix, iz)] = h;
    }
  }

  for (let iz = 0; iz < GRID; iz++) {
    let vapor = 0.78;
    for (let ix = 0; ix < GRID; ix++) {
      const h = heights[idx(ix, iz)] ?? 0;
      const west = ix === 0 ? h : (heights[idx(ix - 1, iz)] ?? h);
      const lift = Math.max(0, h - west);
      const rain = vapor * (0.045 + lift * 0.085);
      const local = 0.12 + 0.22 * fbm(ix * 0.04, iz * 0.04, seed + 29, 3);
      moisture[idx(ix, iz)] = Math.min(1, rain * 1.6 + local * (0.4 + (1 - ix / (GRID - 1)) * 0.35));
      vapor = Math.min(1.1, Math.max(0.08, vapor - rain * 0.72 + 0.012));
      if (h < seaLevel + 1) {
        vapor = Math.min(1.1, vapor + 0.04);
      }
    }
  }

  const flowX = new Int8Array(GRID * GRID);
  const flowZ = new Int8Array(GRID * GRID);
  for (let iz = 0; iz < GRID; iz++) {
    for (let ix = 0; ix < GRID; ix++) {
      let best = heights[idx(ix, iz)] ?? 0;
      let bx = 0;
      let bz = 0;
      for (const [dx, dz] of DIRS) {
        const nx = ix + dx;
        const nz = iz + dz;
        if (!inBounds(nx, nz)) {
          continue;
        }
        const nh = heights[idx(nx, nz)] ?? best;
        if (nh < best) {
          best = nh;
          bx = dx;
          bz = dz;
        }
      }
      flowX[idx(ix, iz)] = bx;
      flowZ[idx(ix, iz)] = bz;
    }
  }

  const order: number[] = [];
  for (let i = 0; i < GRID * GRID; i++) {
    order.push(i);
  }
  order.sort((a, b) => (heights[b] ?? 0) - (heights[a] ?? 0));
  for (const i of order) {
    accumulation[i] = (accumulation[i] ?? 0) + 1;
    const x = i % GRID;
    const z = Math.floor(i / GRID);
    const fx = flowX[i] ?? 0;
    const fz = flowZ[i] ?? 0;
    if (fx === 0 && fz === 0) {
      continue;
    }
    const ni = idx(x + fx, z + fz);
    accumulation[ni] = (accumulation[ni] ?? 0) + (accumulation[i] ?? 0);
  }

  const riverMask = new Uint8Array(GRID * GRID);
  const riverThreshold = 42;
  for (let i = 0; i < GRID * GRID; i++) {
    const h = heights[i] ?? 0;
    if ((accumulation[i] ?? 0) > riverThreshold && h > seaLevel - 0.5) {
      riverMask[i] = 1;
      heights[i] = h - Math.min(3.2, 0.9 + Math.log2(1 + (accumulation[i] ?? 0)) * 0.28);
    }
  }

  const rivers: RiverPath[] = [];
  const used = new Uint8Array(GRID * GRID);
  for (const i of order) {
    if (riverMask[i] !== 1 || used[i] === 1) {
      continue;
    }
    const x0 = i % GRID;
    const z0 = Math.floor(i / GRID);
    const upstream =
      (accumulation[i] ?? 0) < 90 ||
      !DIRS.some(([dx, dz]) => {
        const nx = x0 + dx;
        const nz = z0 + dz;
        return inBounds(nx, nz) && riverMask[idx(nx, nz)] === 1 && (accumulation[idx(nx, nz)] ?? 0) > (accumulation[i] ?? 0);
      });
    if (!upstream && (accumulation[i] ?? 0) > 80) {
      continue;
    }
    const points: Vec3[] = [];
    let x = x0;
    let z = z0;
    let guard = 0;
    while (inBounds(x, z) && guard++ < GRID * 2) {
      const iCell = idx(x, z);
      if (used[iCell] === 1 && points.length > 4) {
        break;
      }
      used[iCell] = 1;
      const h = heights[iCell] ?? 0;
      points.push({ x: worldX(x), y: Math.max(seaLevel + 0.12, h + 0.18), z: worldZ(z) });
      if (h < seaLevel + 0.4) {
        break;
      }
      const fx = flowX[iCell] ?? 0;
      const fz = flowZ[iCell] ?? 0;
      if (fx === 0 && fz === 0) {
        break;
      }
      x += fx;
      z += fz;
    }
    if (points.length > 8) {
      rivers.push({ points, width: 5.5 + Math.min(8, points.length * 0.04) });
    }
  }
  rivers.sort((a, b) => b.points.length - a.points.length);
  const keptRivers = rivers.slice(0, 7);

  const lakes: Vec3[] = [];
  for (let iz = 4; iz < GRID - 4; iz += 2) {
    for (let ix = 4; ix < GRID - 4; ix += 2) {
      const i = idx(ix, iz);
      const fx = flowX[i] ?? 0;
      const fz = flowZ[i] ?? 0;
      const h = heights[i] ?? 0;
      if (fx === 0 && fz === 0 && h > seaLevel + 1.5 && (accumulation[i] ?? 0) > 55) {
        lakes.push({ x: worldX(ix), y: h + 0.2, z: worldZ(iz) });
        for (let dz = -2; dz <= 2; dz++) {
          for (let dx = -2; dx <= 2; dx++) {
            const ni = idx(ix + dx, iz + dz);
            heights[ni] = Math.min(heights[ni] ?? h, h - 0.8);
          }
        }
      }
    }
  }

  for (let iz = 1; iz < GRID - 1; iz++) {
    for (let ix = 1; ix < GRID - 1; ix++) {
      const i = idx(ix, iz);
      const h = heights[i] ?? 0;
      const hx = ((heights[idx(ix + 1, iz)] ?? h) - (heights[idx(ix - 1, iz)] ?? h)) / (2 * CELL);
      const hz = ((heights[idx(ix, iz + 1)] ?? h) - (heights[idx(ix, iz - 1)] ?? h)) / (2 * CELL);
      const slope = Math.hypot(hx, hz);
      biomes[i] = biomeAtHeightMoisture(
        h,
        moisture[i] ?? 0,
        slope,
        seaLevel,
        riverMask[i] === 1,
      );
    }
  }

  const trees: PropInstance[] = [];
  const shrubs: PropInstance[] = [];
  const rocks: PropInstance[] = [];
  const resources: PropInstance[] = [];

  for (let iz = 2; iz < GRID - 2; iz++) {
    for (let ix = 2; ix < GRID - 2; ix++) {
      const i = idx(ix, iz);
      const biome = biomes[i] ?? Biome.Grass;
      const h = heights[i] ?? 0;
      const jitter = hash2(ix, iz, seed + 41);
      const jx = (hash2(ix, iz, seed + 42) - 0.5) * CELL * 0.85;
      const jz = (hash2(ix, iz, seed + 43) - 0.5) * CELL * 0.85;
      const x = worldX(ix) + jx;
      const z = worldZ(iz) + jz;
      const yaw = hash2(ix, iz, seed + 44) * Math.PI * 2;

      if (biome === Biome.Forest && jitter < 0.38) {
        trees.push({ x, y: h, z, yaw, scale: 0.85 + hash2(ix, iz, seed + 45) * 0.7, kind: 0 });
      } else if (biome === Biome.Grass && jitter < 0.045) {
        trees.push({ x, y: h, z, yaw, scale: 0.7 + hash2(ix, iz, seed + 45) * 0.4, kind: 1 });
      } else if (biome === Biome.Mountain && jitter < 0.04 && h < 72) {
        trees.push({ x, y: h, z, yaw, scale: 0.55 + hash2(ix, iz, seed + 45) * 0.3, kind: 0 });
      }

      if (biome === Biome.Desert && jitter < 0.07) {
        shrubs.push({ x, y: h, z, yaw, scale: 0.5 + hash2(ix, iz, seed + 46) * 0.5, kind: 0 });
      } else if (biome === Biome.Grass && jitter > 0.92) {
        shrubs.push({ x, y: h, z, yaw, scale: 0.4 + hash2(ix, iz, seed + 46) * 0.4, kind: 1 });
      } else if (biome === Biome.Wetland && jitter < 0.12) {
        shrubs.push({ x, y: h, z, yaw, scale: 0.6, kind: 2 });
      }

      if ((biome === Biome.Mountain || biome === Biome.Desert) && hash2(ix, iz, seed + 50) < 0.03) {
        rocks.push({ x, y: h, z, yaw, scale: 0.6 + hash2(ix, iz, seed + 51) * 1.4, kind: 0 });
      }

      if (biome === Biome.Mountain && hash2(ix, iz, seed + 60) < 0.012) {
        resources.push({ x, y: h, z, yaw, scale: 0.7, kind: 0 });
      } else if (riverMask[i] === 1 && hash2(ix, iz, seed + 61) < 0.02) {
        resources.push({ x, y: h, z, yaw, scale: 0.55, kind: 1 });
      } else if (biome === Biome.Forest && hash2(ix, iz, seed + 62) < 0.008) {
        resources.push({ x, y: h, z, yaw, scale: 0.8, kind: 2 });
      }
    }
  }

  const structures: StructureInstance[] = [];
  const tryPlace = (kind: StructureInstance["kind"], predicate: (b: BiomeId, h: number, ix: number, iz: number) => boolean, count: number, salt: number) => {
    let placed = 0;
    for (let k = 0; k < 800 && placed < count; k++) {
      const ix = 8 + Math.floor(hash2(k, salt, seed + 90) * (GRID - 16));
      const iz = 8 + Math.floor(hash2(k, salt + 1, seed + 91) * (GRID - 16));
      const i = idx(ix, iz);
      const b = biomes[i] ?? Biome.Ocean;
      const h = heights[i] ?? 0;
      if (!predicate(b, h, ix, iz)) {
        continue;
      }
      if (structures.some((s) => Math.hypot(s.x - worldX(ix), s.z - worldZ(iz)) < 48)) {
        continue;
      }
      structures.push({ x: worldX(ix), y: h, z: worldZ(iz), yaw: hash2(ix, iz, seed + 99) * Math.PI * 2, kind });
      placed += 1;
    }
  };

  tryPlace("ruin", (b, h) => (b === Biome.Mountain || b === Biome.Grass) && h > 28 && h < 62, 4, 2);
  tryPlace("hut", (b) => b === Biome.Grass || b === Biome.Forest, 3, 5);
  tryPlace("tower", (b, h) => b === Biome.Mountain && h > 40, 1, 8);
  tryPlace("pier", (b, h) => b === Biome.Beach && h < seaLevel + 2.2, 1, 11);

  let spawn: Vec3 = { x: 0, y: seaLevel + 4, z: 0 };
  let found = false;
  for (let iz = Math.floor(GRID * 0.42); iz < GRID - 10 && !found; iz++) {
    for (let ix = 12; ix < Math.floor(GRID * 0.45) && !found; ix++) {
      const i = idx(ix, iz);
      const b = biomes[i] ?? Biome.Ocean;
      const h = heights[i] ?? 0;
      if ((b === Biome.Grass || b === Biome.Forest) && h > seaLevel + 3) {
        spawn = { x: worldX(ix), y: h, z: worldZ(iz) };
        found = true;
      }
    }
  }

  const raining = hash2(3, 7, seed) > 0.62;
  const fogDensity = raining ? 0.00155 : 0.00105;

  return {
    seed,
    size: WORLD_METERS,
    grid: GRID,
    seaLevel,
    heights,
    moisture,
    accumulation,
    biomes,
    rivers: keptRivers,
    lakes: lakes.slice(0, 5),
    trees,
    shrubs,
    rocks,
    resources,
    structures,
    spawn,
    weather: { raining, fogDensity },
  };
}

export function fingerprint(world: GeneratedWorld): string {
  let h = world.seed >>> 0;
  for (let i = 0; i < world.heights.length; i += 17) {
    h = Math.imul(h ^ Math.floor((world.heights[i] ?? 0) * 1000), 16777619) >>> 0;
  }
  h = Math.imul(h ^ world.trees.length, 2246822519) >>> 0;
  h = Math.imul(h ^ world.structures.length, 3266489917) >>> 0;
  h = Math.imul(h ^ world.rivers.length, 668265263) >>> 0;
  return h.toString(16);
}
