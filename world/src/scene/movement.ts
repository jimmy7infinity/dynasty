import * as THREE from "three";
import { Biome, sampleHeight, sampleSlope, type GeneratedWorld } from "../worldgen.ts";

export function walkable(world: GeneratedWorld, x: number, z: number): boolean {
  const y = sampleHeight(world, x, z);
  const slope = sampleSlope(world, x, z);
  if (y < world.seaLevel - 0.15) {
    return false;
  }
  if (slope > 0.92) {
    return false;
  }
  const half = world.size / 2 - 8;
  return Math.abs(x) < half && Math.abs(z) < half;
}

export function moveToward(
  world: GeneratedWorld,
  pos: THREE.Vector3,
  dest: THREE.Vector3,
  dt: number,
): void {
  const to = dest.clone().sub(pos);
  to.y = 0;
  const dist = to.length();
  if (dist < 0.35) {
    pos.y = sampleHeight(world, pos.x, pos.z);
    return;
  }
  to.multiplyScalar(1 / dist);
  const slope = sampleSlope(world, pos.x, pos.z);
  const y = sampleHeight(world, pos.x, pos.z);
  let speed = 4.15;
  if (y < world.seaLevel + 0.8) {
    speed *= 0.55;
  }
  if (slope > 0.35) {
    speed *= Math.max(0.35, 1 - (slope - 0.35));
  }
  const step = Math.min(dist, speed * dt);
  const nx = pos.x + to.x * step;
  const nz = pos.z + to.z * step;
  if (walkable(world, nx, nz)) {
    pos.x = nx;
    pos.z = nz;
  } else {
    if (walkable(world, nx, pos.z)) {
      pos.x = nx;
    } else if (walkable(world, pos.x, nz)) {
      pos.z = nz;
    }
  }
  pos.y = sampleHeight(world, pos.x, pos.z);
}

export function biomeAt(world: GeneratedWorld, x: number, z: number): number {
  const half = world.size / 2;
  const gx = Math.round((x + half) / (world.size / (world.grid - 1)));
  const gz = Math.round((z + half) / (world.size / (world.grid - 1)));
  const ix = Math.min(world.grid - 1, Math.max(0, gx));
  const iz = Math.min(world.grid - 1, Math.max(0, gz));
  return world.biomes[iz * world.grid + ix] ?? Biome.Grass;
}
