import * as THREE from "three/webgpu";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { CIZZY, type CatalogEntry } from "./catalog.ts";

export type Prototype = {
  entry: CatalogEntry;
  height: number;
  radius: number;
  parts: { geometry: THREE.BufferGeometry; material: THREE.Material }[];
};

export type GateStats = {
  prototypes: number;
  instances: number;
  batches: number;
  triangles: number;
};

const TEX = "/art-gate/cizzy7/tex/";
const FBX = "/art-gate/cizzy7/fbx/";

const textures = new Map<string, THREE.Texture>();

function loadTexture(name: string, cutout: boolean): THREE.Texture {
  const key = `${cutout ? "cut:" : ""}${name}`;
  const hit = textures.get(key);
  if (hit) {
    return hit;
  }
  const tex = new THREE.Texture();
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    if (!cutout) {
      tex.image = img;
      tex.needsUpdate = true;
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      tex.image = img;
      tex.needsUpdate = true;
      return;
    }
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;
    for (let i = 0; i < px.length; i += 4) {
      const luma = (px[i] + px[i + 1] + px[i + 2]) / 3;
      if (px[i + 3] > 10 && luma > 18) {
        continue;
      }
      if (luma < 22) {
        px[i + 3] = 0;
      } else if (px[i + 3] < 8) {
        px[i + 3] = luma;
      }
    }
    ctx.putImageData(data, 0, 0);
    tex.image = canvas;
    tex.needsUpdate = true;
  };
  img.src = `${TEX}${encodeURIComponent(name)}`;
  textures.set(key, tex);
  return tex;
}

function isFoliageName(name: string): boolean {
  const n = name.toLowerCase();
  return (
    n.includes("leaf") ||
    n.includes("clump") ||
    n.includes("foliage") ||
    n.includes("billboard") ||
    n.includes("grass") ||
    n.includes("weed") ||
    n.includes("flower") ||
    n.includes("ivy") ||
    n.includes("bush")
  );
}

function targetHeight(entry: CatalogEntry): number {
  switch (entry.id) {
    case "Tree1_Hero":
      return 14;
    case "Oak_Hero":
      return 12;
    case "Tree1_Mid":
    case "Tree2_Mid":
      return 11;
    case "Oak_Mid":
      return 9.5;
    case "Birch_Mid":
      return 8;
    case "LargeBush":
      return 2.2;
    case "Bush":
      return 1.5;
    case "Ivy":
      return 1.1;
    case "Grass":
      return 0.55;
    case "Weed":
      return 0.7;
    case "WhiteFlower":
    case "YellowFlower":
    case "BlueFlower":
      return 0.42;
    case "Rock1":
      return 1.6;
    case "Rock2":
      return 2.4;
    case "Rock3":
      return 1.8;
    case "Rock4":
      return 2.8;
    case "Pebble":
      return 0.28;
    case "Bridge":
      return 3.2;
    default: {
      const _never: never = entry.id as never;
      void _never;
      return 2;
    }
  }
}

function isBarkName(name: string): boolean {
  const n = name.toLowerCase();
  return n.includes("bark") || n.includes("trunk") || n.includes("wood") || n.includes("stem");
}

function nodeMaterial(entry: CatalogEntry, meshName: string, source: THREE.Material): THREE.MeshStandardNodeMaterial {
  const mat = new THREE.MeshStandardNodeMaterial();
  const src = source as THREE.MeshStandardMaterial;
  if (src.color) {
    mat.color.copy(src.color);
  }
  mat.metalness = 0;
  if (entry.kind === "tree" && isBarkName(meshName) && entry.bark) {
    mat.map = loadTexture(entry.bark, false);
    mat.roughness = 0.88;
    mat.side = THREE.FrontSide;
    mat.color.set(0xc4a882);
    return mat;
  }
  if (entry.leaf) {
    mat.map = loadTexture(entry.albedo, true);
    mat.transparent = true;
    mat.alphaTest = 0.28;
    mat.side = THREE.DoubleSide;
    mat.roughness = 0.72;
    if (entry.kind === "tree" || entry.kind === "bush" || entry.kind === "ivy") {
      mat.color.set(0x6f8f3d);
    } else if (entry.kind === "grass") {
      mat.color.set(0x7ea04a);
    } else {
      mat.color.set(0xe8dcc8);
    }
    return mat;
  }
  mat.map = loadTexture(entry.albedo, false);
  mat.roughness = 0.82;
  mat.metalness = 0.02;
  return mat;
}

export async function loadCizzyPrototypes(): Promise<Prototype[]> {
  const manager = new THREE.LoadingManager();
  manager.setURLModifier((url) => {
    const name = url.replace(/\\/g, "/").split("/").pop() ?? url;
    if (name.toLowerCase().endsWith(".fbx")) {
      return url;
    }
    return `${TEX}${name}`;
  });
  const loader = new FBXLoader(manager);
  const out: Prototype[] = [];
  for (const entry of CIZZY) {
    const root = await loader.loadAsync(`${FBX}${entry.file}`);
    root.updateMatrixWorld(true);
    const parts: Prototype["parts"] = [];
    const box = new THREE.Box3();
    root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh) || !obj.geometry) {
        return;
      }
      const geo = obj.geometry.clone();
      geo.applyMatrix4(obj.matrixWorld);
      geo.computeBoundingBox();
      geo.computeBoundingSphere();
      if (geo.boundingBox) {
        box.union(geo.boundingBox);
      }
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      parts.push({
        geometry: geo,
        material: nodeMaterial(entry, obj.name, mats[0] ?? new THREE.MeshStandardMaterial()),
      });
    });
    const size = new THREE.Vector3();
    box.getSize(size);
    let height = size.y || 1;
    const target = targetHeight(entry);
    const scaleFix = height > 0.0001 ? target / height : 1;
    const m = new THREE.Matrix4().makeScale(scaleFix, scaleFix, scaleFix);
    for (const part of parts) {
      part.geometry.applyMatrix4(m);
      part.geometry.computeBoundingBox();
    }
    height *= scaleFix;
    size.multiplyScalar(scaleFix);
    const grown = new THREE.Box3();
    for (const part of parts) {
      part.geometry.computeBoundingBox();
      if (part.geometry.boundingBox) {
        grown.union(part.geometry.boundingBox);
      }
    }
    const liftY = grown.min.y;
    const lift = new THREE.Matrix4().makeTranslation(0, -liftY, 0);
    for (const part of parts) {
      part.geometry.applyMatrix4(lift);
      part.geometry.computeBoundingBox();
      part.geometry.computeBoundingSphere();
    }
    height = size.y;
    out.push({
      entry,
      height,
      radius: Math.max(size.x, size.z) * 0.5,
      parts,
    });
  }
  return out;
}

export function placeInstances(
  group: THREE.Group,
  prototypes: Prototype[],
  placements: { id: string; x: number; y: number; z: number; yaw: number; scale: number }[],
): GateStats {
  while (group.children.length > 0) {
    const child = group.children[0];
    group.remove(child);
    if (child instanceof THREE.InstancedMesh) {
      child.geometry.dispose();
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
      const mesh = new THREE.InstancedMesh(part.geometry, part.material, list.length);
      mesh.castShadow = proto.entry.kind === "tree" || proto.entry.kind === "rock" || proto.entry.kind === "prop";
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
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
