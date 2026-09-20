import * as THREE from "three/webgpu";
import type { WorldIdentity } from "../domain/world.ts";
import type { VegResult, WorldJobs } from "./jobs.ts";
import {
  VOCAB_COLORS,
  birchGeometry,
  cottageGeometry,
  flowerGeometry,
  grassGeometry,
  logGeometry,
  oakGeometry,
  pineGeometry,
  rockGeometry,
  shrubGeometry,
} from "./vocab.ts";

export const DENSITY_STEPS = [10_000, 50_000, 100_000, 250_000, 500_000] as const;

const GEOS = [
  oakGeometry,
  pineGeometry,
  birchGeometry,
  shrubGeometry,
  grassGeometry,
  flowerGeometry,
  rockGeometry,
  logGeometry,
  cottageGeometry,
];

export class VegetationSystem {
  readonly group = new THREE.Group();
  readonly meshes: THREE.InstancedMesh[];
  fillMs = 0;
  pending = false;
  private readonly identity: WorldIdentity;
  private readonly jobs: WorldJobs;
  private liveId = 0;
  private lastX = Number.POSITIVE_INFINITY;
  private lastZ = Number.POSITIVE_INFINITY;
  private lastTarget = -1;

  constructor(identity: WorldIdentity, jobs: WorldJobs) {
    this.identity = identity;
    this.jobs = jobs;
    this.meshes = GEOS.map((geo, i) => makeInstanced(geo(), VOCAB_COLORS[i], capFor(i)));
    for (const mesh of this.meshes) {
      this.group.add(mesh);
    }
    this.jobs.onVeg((result) => this.apply(result));
  }

  visibleInstances(): number {
    return this.meshes.reduce((n, m) => n + m.count, 0);
  }

  requestIfNeeded(px: number, pz: number, target: number, force: boolean): void {
    if (this.pending) {
      return;
    }
    const dx = px - this.lastX;
    const dz = pz - this.lastZ;
    if (!force && this.lastTarget === target && dx * dx + dz * dz < 280 * 280) {
      return;
    }
    this.lastX = px;
    this.lastZ = pz;
    this.lastTarget = target;
    this.pending = true;
    this.liveId = this.jobs.requestVeg(this.identity, px, pz, target, 1400);
  }

  private apply(result: VegResult): void {
    if (result.requestId < this.liveId) {
      return;
    }
    for (let i = 0; i < this.meshes.length; i += 1) {
      const mesh = this.meshes[i];
      const src = result.buffers[i];
      const count = result.counts[i];
      const dst = mesh.instanceMatrix.array as Float32Array;
      dst.set(src.subarray(0, Math.min(src.length, dst.length)));
      mesh.count = Math.min(count, dst.length / 16);
      mesh.instanceMatrix.needsUpdate = true;
    }
    this.fillMs = result.ms;
    this.pending = false;
  }
}

function capFor(i: number): number {
  const caps = [40_000, 28_000, 22_000, 60_000, 180_000, 40_000, 18_000, 8_000, 24];
  return caps[i];
}

function makeInstanced(geo: THREE.BufferGeometry, color: number, count: number): THREE.InstancedMesh {
  const mat = new THREE.MeshStandardNodeMaterial({
    color: 0xffffff,
    roughness: 0.82,
    metalness: 0,
    vertexColors: true,
  });
  if (color === 0x6a9a3c || color === 0xd48a9a) {
    mat.side = THREE.DoubleSide;
  }
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  mesh.count = 0;
  return mesh;
}
