import * as THREE from "three/webgpu";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CATALOG, type CatalogEntry } from "./catalog.ts";
import { stylizeMaterial, type MatId } from "./materials.ts";

export type Prototype = {
  entry: CatalogEntry;
  height: number;
  radius: number;
  parts: { geometry: THREE.BufferGeometry; source: THREE.Material }[];
};

export type GateStats = {
  prototypes: number;
  instances: number;
  batches: number;
  triangles: number;
};

const BASE = "/asset-gate/glTF/";

function sliceIndexed(src: THREE.BufferGeometry, start: number, count: number): THREE.BufferGeometry {
  const index = src.index;
  if (!index) {
    return src.clone();
  }
  const sliced = src.clone();
  const arr = index.array.slice(start, start + count);
  sliced.setIndex(new THREE.BufferAttribute(arr, 1));
  sliced.clearGroups();
  sliced.computeBoundingBox();
  sliced.computeBoundingSphere();
  return sliced;
}

export async function loadPrototypes(): Promise<Prototype[]> {
  const loader = new GLTFLoader();
  const out: Prototype[] = [];
  for (const entry of CATALOG) {
    const gltf = await loader.loadAsync(`${BASE}${entry.file}`);
    const parts: Prototype["parts"] = [];
    const box = new THREE.Box3();
    gltf.scene.updateMatrixWorld(true);
    gltf.scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh) || !obj.geometry) {
        return;
      }
      const geo = obj.geometry.clone();
      geo.applyMatrix4(obj.matrixWorld);
      if (!geo.boundingBox) {
        geo.computeBoundingBox();
      }
      if (geo.boundingBox) {
        box.union(geo.boundingBox);
      }
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      if (geo.groups.length <= 1 && mats.length === 1) {
        parts.push({ geometry: geo, source: mats[0] });
        return;
      }
      for (const group of geo.groups) {
        const sliced = sliceIndexed(geo, group.start, group.count);
        const mat = mats[group.materialIndex ?? 0] ?? mats[0];
        parts.push({ geometry: sliced, source: mat });
      }
    });
    const size = new THREE.Vector3();
    box.getSize(size);
    out.push({
      entry,
      height: size.y || 1,
      radius: Math.max(size.x, size.z) * 0.5,
      parts,
    });
  }
  return out;
}

export function placeInstances(
  group: THREE.Group,
  prototypes: Prototype[],
  treatment: MatId,
  placements: { id: string; x: number; y: number; z: number; yaw: number; scale: number }[],
): GateStats {
  while (group.children.length > 0) {
    const child = group.children[0];
    group.remove(child);
    if (child instanceof THREE.InstancedMesh) {
      child.geometry.dispose();
      const mat = child.material;
      if (Array.isArray(mat)) {
        for (const m of mat) {
          m.dispose();
        }
      } else {
        mat.dispose();
      }
    }
  }

  const byId = new Map(prototypes.map((p) => [p.entry.id, p]));
  const buckets = new Map<string, typeof placements>();
  for (const p of placements) {
    const list = buckets.get(p.id) ?? [];
    list.push(p);
    buckets.set(p.id, list);
  }

  let instances = 0;
  let batches = 0;
  let triangles = 0;
  const dummy = new THREE.Object3D();

  for (const [id, list] of buckets) {
    const proto = byId.get(id);
    if (!proto) {
      continue;
    }
    instances += list.length;
    for (const part of proto.parts) {
      const mat = stylizeMaterial(part.source, treatment);
      const mesh = new THREE.InstancedMesh(part.geometry, mat, list.length);
      mesh.castShadow = proto.entry.kind !== "plant";
      mesh.receiveShadow = true;
      mesh.frustumCulled = true;
      for (let i = 0; i < list.length; i += 1) {
        const p = list[i];
        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(0, p.yaw, 0);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      group.add(mesh);
      batches += 1;
      const idx = part.geometry.index;
      const tris = idx ? idx.count / 3 : part.geometry.getAttribute("position").count / 3;
      triangles += tris * list.length;
    }
  }

  return { prototypes: prototypes.length, instances, batches, triangles };
}

export function hash01(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
