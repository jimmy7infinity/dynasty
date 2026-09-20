import { clamp01, fbm, hash01, mixSeed, ridge } from "./noise.ts";

export const DEFAULT_SEED = 739184;
export const GENERATION_VERSION = 2;
export const EXTENT_METERS = 8192;
export const CHUNK_METERS = 128;
export const SEA_LEVEL = 0;

export const ART_SEEDS = [739184, 12, 88, 401, 1204, 2718, 7777, 90901] as const;

export type WorldIdentity = {
  seed: number;
  generationVersion: number;
};

export type ChunkCoord = {
  x: number;
  z: number;
};

export const Stream = {
  Height: 1,
  Moisture: 2,
  Vegetation: 3,
  Structure: 4,
  Meander: 5,
} as const;

export function chunkAt(xMeters: number, zMeters: number): ChunkCoord {
  const half = EXTENT_METERS * 0.5;
  return {
    x: Math.floor((xMeters + half) / CHUNK_METERS),
    z: Math.floor((zMeters + half) / CHUNK_METERS),
  };
}

export function chunkOrigin(index: number): number {
  return -EXTENT_METERS * 0.5 + index * CHUNK_METERS;
}

export function chunkCount(): number {
  return Math.floor(EXTENT_METERS / CHUNK_METERS);
}

export function meanderX(id: WorldIdentity, z: number): number {
  const stream = mixSeed(id.seed, Stream.Meander, id.generationVersion, 0);
  const phase = hash01(stream) * 6.28;
  const amp = 120 + hash01(stream ^ 3) * 90;
  return Math.sin(z * 0.00052 + phase) * amp + (fbm(stream + 8, 0.02, z * 0.00038, 3) - 0.5) * 70;
}

export function lakeCenter(id: WorldIdentity): { x: number; z: number; r: number } {
  const stream = mixSeed(id.seed, Stream.Meander, id.generationVersion, 11);
  const z = -1650 + (hash01(stream) - 0.5) * 900;
  return { x: meanderX(id, z), z, r: 280 + hash01(stream ^ 9) * 160 };
}

export function sampleHeightMeters(id: WorldIdentity, x: number, z: number): number {
  return valleyHeight(id, x, z) - riverCarve(id, x, z);
}

export function sampleMoisture(id: WorldIdentity, x: number, z: number): number {
  const stream = mixSeed(id.seed, Stream.Moisture, id.generationVersion, 0);
  const base = fbm(stream, x * 0.00085, z * 0.00085, 4);
  const water = Math.exp(-waterDistance(id, x, z) / 90);
  return clamp01(base * 0.55 + water * 0.55);
}

export function waterDistance(id: WorldIdentity, x: number, z: number): number {
  const mx = meanderX(id, z);
  const river = Math.abs(x - mx);
  const lake = lakeCenter(id);
  const toLake = Math.hypot(x - lake.x, z - lake.z) - lake.r * 0.72;
  return Math.max(0, Math.min(river, toLake));
}

export function sampleSlope(id: WorldIdentity, x: number, z: number): number {
  const e = 3.5;
  const dx = sampleHeightMeters(id, x + e, z) - sampleHeightMeters(id, x - e, z);
  const dz = sampleHeightMeters(id, x, z + e) - sampleHeightMeters(id, x, z - e);
  return Math.hypot(dx, dz) / (2 * e);
}

function valleyHeight(id: WorldIdentity, x: number, z: number): number {
  const stream = mixSeed(id.seed, Stream.Height, id.generationVersion, 0);
  const mx = meanderX(id, z);
  const valleyT = clamp01(Math.abs(x - mx) / 2050);
  const floor = 16 + (fbm(stream + 17, x * 0.00105, z * 0.00105, 4) - 0.5) * 16;
  const walls = Math.pow(valleyT, 1.28) * (200 + ridge(stream + 91, x * 0.0005, z * 0.0005, 4) * 360);
  const spurs = ridge(stream + 40, x * 0.00095, z * 0.00135, 3) * valleyT * 85;
  let h = floor + walls + spurs;
  const lake = lakeCenter(id);
  const ld = Math.hypot(x - lake.x, z - lake.z);
  if (ld < lake.r) {
    const t = 1 - ld / lake.r;
    h = h * (1 - t * 0.9) - t * 10;
  }
  return h;
}

function riverCarve(id: WorldIdentity, x: number, z: number): number {
  const mx = meanderX(id, z);
  const dist = Math.abs(x - mx);
  const width = 14 + fbm(mixSeed(id.seed, Stream.Height, 3, 0), z * 0.002, 0.1, 2) * 10;
  let carve = 0;
  if (dist < width) {
    const t = 1 - dist / width;
    carve = t * t * (12 + (1 - Math.min(1, Math.abs(z) / 3500)) * 6);
  }
  const lake = lakeCenter(id);
  const ld = Math.hypot(x - lake.x, z - lake.z);
  if (ld < lake.r * 0.98) {
    carve = Math.max(carve, 12);
  }
  return carve;
}

export function findLandSpawn(id: WorldIdentity): { x: number; y: number; z: number } {
  for (let i = 0; i < 120; i += 1) {
    const z = -400 + (i % 24) * 55;
    const x = meanderX(id, z) + ((i % 2) * 2 - 1) * (48 + (i % 7) * 8);
    const y = sampleHeightMeters(id, x, z);
    if (y >= 4 && y < 48 && sampleSlope(id, x, z) < 0.4 && waterDistance(id, x, z) > 22 && waterDistance(id, x, z) < 160) {
      return { x, y: y + 0.9, z };
    }
  }
  const z = 0;
  const x = meanderX(id, z) + 70;
  const y = sampleHeightMeters(id, x, z);
  return { x, y: y + 0.9, z };
}
