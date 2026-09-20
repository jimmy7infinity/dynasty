import * as THREE from "three/webgpu";
import { EXTENT_METERS, SEA_LEVEL, CHUNK_METERS, type WorldIdentity } from "../domain/world.ts";
import type { PatchResult, WorldJobs } from "./jobs.ts";

type TileSpec = { key: string; originX: number; originZ: number; size: number; verts: number };

export class TerrainStreamer {
  readonly group = new THREE.Group();
  private readonly meshes = new Map<string, THREE.Mesh>();
  private readonly identity: WorldIdentity;
  private readonly jobs: WorldJobs;
  private readonly material: THREE.MeshStandardNodeMaterial;
  private readonly requested = new Set<string>();
  private readonly ready: PatchResult[] = [];
  private genMs = 0;
  private generated = 0;
  private streamMs = 0;
  private matMs = 0;
  private needed = new Set<string>();

  constructor(identity: WorldIdentity, jobs: WorldJobs) {
    this.identity = identity;
    this.jobs = jobs;
    this.material = new THREE.MeshStandardNodeMaterial({
      vertexColors: true,
      roughness: 0.9,
      metalness: 0.02,
    });
    this.jobs.onPatch((patch) => {
      this.genMs = 0;
      this.ready.push(patch);
    });
  }

  stats(): { loaded: number; generated: number; genMs: number; streamMs: number; matMs: number } {
    return {
      loaded: this.meshes.size,
      generated: this.generated,
      genMs: this.genMs,
      streamMs: this.streamMs,
      matMs: this.matMs,
    };
  }

  meshCount(): number {
    return this.meshes.size;
  }

  sync(px: number, pz: number): void {
    const t0 = performance.now();
    this.needed = this.collect(px, pz);
    for (const spec of this.listSpecs(px, pz)) {
      if (this.meshes.has(spec.key) || this.requested.has(spec.key)) {
        continue;
      }
      if (this.requested.size - this.meshes.size > 24) {
        break;
      }
      this.requested.add(spec.key);
      this.jobs.requestPatch(this.identity, spec.key, spec.originX, spec.originZ, spec.size, spec.verts);
    }
    this.streamMs = performance.now() - t0;
  }

  materialize(budget: number): void {
    const t0 = performance.now();
    let n = 0;
    while (n < budget && this.ready.length > 0) {
      const patch = this.ready.shift();
      if (!patch) {
        break;
      }
      if (!this.needed.has(patch.key)) {
        this.requested.delete(patch.key);
        continue;
      }
      const existing = this.meshes.get(patch.key);
      if (existing) {
        this.group.remove(existing);
        existing.geometry.dispose();
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(patch.positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(patch.colors, 3));
      geo.setAttribute("normal", new THREE.BufferAttribute(patch.normals, 3));
      geo.setIndex(new THREE.BufferAttribute(patch.indices, 1));
      const mesh = new THREE.Mesh(geo, this.material);
      mesh.receiveShadow = true;
      mesh.castShadow = false;
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      mesh.frustumCulled = true;
      this.meshes.set(patch.key, mesh);
      this.group.add(mesh);
      this.generated += 1;
      n += 1;
    }
    let released = 0;
    for (const [key, mesh] of this.meshes) {
      if (!this.needed.has(key) && released < 4) {
        this.group.remove(mesh);
        mesh.geometry.dispose();
        this.meshes.delete(key);
        this.requested.delete(key);
        released += 1;
      }
    }
    this.matMs = performance.now() - t0;
  }

  private collect(px: number, pz: number): Set<string> {
    return new Set(this.listSpecs(px, pz).map((s) => s.key));
  }

  private listSpecs(px: number, pz: number): TileSpec[] {
    const specs: TileSpec[] = [];
    const half = EXTENT_METERS * 0.5;
    const pushBand = (size: number, verts: number, radius: number, prefix: string) => {
      const count = Math.floor(EXTENT_METERS / size);
      const cx = Math.floor((px + half) / size);
      const cz = Math.floor((pz + half) / size);
      for (let z = cz - radius; z <= cz + radius; z += 1) {
        for (let x = cx - radius; x <= cx + radius; x += 1) {
          if (x < 0 || z < 0 || x >= count || z >= count) {
            continue;
          }
          specs.push({
            key: `${prefix}:${x},${z}`,
            originX: -half + x * size,
            originZ: -half + z * size,
            size,
            verts,
          });
        }
      }
    };
    pushBand(CHUNK_METERS, 21, 3, "n");
    pushBand(512, 13, 4, "r");
    pushBand(2048, 9, 2, "f");
    specs.push({
      key: "vf",
      originX: -half,
      originZ: -half,
      size: EXTENT_METERS,
      verts: 33,
    });
    return specs;
  }
}

export function createWater(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(EXTENT_METERS, EXTENT_METERS, 32, 32);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshStandardNodeMaterial({
    color: 0x3d7c8c,
    roughness: 0.08,
    metalness: 0.12,
    transparent: true,
    opacity: 0.78,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = SEA_LEVEL;
  mesh.receiveShadow = true;
  return mesh;
}
