import * as THREE from "three";
import type { GeneratedWorld, PropInstance } from "../worldgen.ts";

function pineGeometry(): THREE.BufferGeometry {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.2, 5));
  trunk.position.y = 1.1;
  const crown = new THREE.Mesh(new THREE.ConeGeometry(1.35, 4.2, 7));
  crown.position.y = 4.1;
  group.add(trunk, crown);
  return mergeGroup(group);
}

function oakGeometry(): THREE.BufferGeometry {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 2.4, 6));
  trunk.position.y = 1.2;
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 0));
  crown.position.y = 3.3;
  crown.scale.set(1.15, 0.9, 1.15);
  group.add(trunk, crown);
  return mergeGroup(group);
}

function mergeGroup(group: THREE.Group): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  group.updateMatrixWorld(true);
  group.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BufferGeometry) {
      const cloned = child.geometry.clone();
      cloned.applyMatrix4(child.matrixWorld);
      geos.push(cloned);
    }
  });
  const merged = mergeGeometries(geos);
  for (const g of geos) {
    g.dispose();
  }
  return merged;
}

function mergeGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const out = new THREE.BufferGeometry();
  const positions: number[] = [];
  const normals: number[] = [];
  for (const geo of geos) {
    geo.computeVertexNormals();
    const pos = geo.getAttribute("position");
    const nrm = geo.getAttribute("normal");
    for (let i = 0; i < pos.count; i++) {
      positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      if (nrm !== undefined) {
        normals.push(nrm.getX(i), nrm.getY(i), nrm.getZ(i));
      } else {
        normals.push(0, 1, 0);
      }
    }
  }
  out.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  out.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  return out;
}

function plantInstances(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  items: PropInstance[],
  yLift: number,
): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(geometry, material, items.length);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const dummy = new THREE.Object3D();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item === undefined) {
      continue;
    }
    dummy.position.set(item.x, item.y + yLift, item.z);
    dummy.rotation.set(0, item.yaw, 0);
    dummy.scale.setScalar(item.scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

export function createVegetation(world: GeneratedWorld): THREE.Group {
  const group = new THREE.Group();
  const pines = world.trees.filter((t) => t.kind === 0);
  const oaks = world.trees.filter((t) => t.kind === 1);
  const pineMat = new THREE.MeshStandardMaterial({ color: 0x2f4a32, roughness: 0.86 });
  const oakMat = new THREE.MeshStandardMaterial({ color: 0x3d5a30, roughness: 0.82 });
  if (pines.length > 0) {
    group.add(plantInstances(pineGeometry(), pineMat, pines, 0));
  }
  if (oaks.length > 0) {
    group.add(plantInstances(oakGeometry(), oakMat, oaks, 0));
  }

  const shrubGeo = new THREE.SphereGeometry(0.55, 5, 4);
  const shrubMat = new THREE.MeshStandardMaterial({ color: 0x6b7a3a, roughness: 0.9 });
  if (world.shrubs.length > 0) {
    group.add(plantInstances(shrubGeo, shrubMat, world.shrubs, 0.3));
  }

  const rockGeo = new THREE.DodecahedronGeometry(0.7, 0);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x6a635c, roughness: 0.95 });
  if (world.rocks.length > 0) {
    group.add(plantInstances(rockGeo, rockMat, world.rocks, 0.2));
  }

  const resourceMats = [
    new THREE.MeshStandardMaterial({ color: 0x8a4a3a, roughness: 0.45, metalness: 0.35 }),
    new THREE.MeshStandardMaterial({ color: 0xb07a4a, roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: 0.85 }),
  ];
  for (let kind = 0; kind < 3; kind++) {
    const items = world.resources.filter((r) => r.kind === kind);
    const mat = resourceMats[kind];
    if (items.length === 0 || mat === undefined) {
      continue;
    }
    const geo = kind === 2 ? new THREE.CylinderGeometry(0.18, 0.22, 1.1, 5) : new THREE.OctahedronGeometry(0.45, 0);
    group.add(plantInstances(geo, mat, items, 0.25));
  }

  return group;
}

export function createStructures(world: GeneratedWorld): THREE.Group {
  const group = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({ color: 0x7a7368, roughness: 0.92 });
  const timber = new THREE.MeshStandardMaterial({ color: 0x5a4030, roughness: 0.88 });
  const roof = new THREE.MeshStandardMaterial({ color: 0x6a4030, roughness: 0.8 });

  for (const s of world.structures) {
    const local = new THREE.Group();
    local.position.set(s.x, s.y, s.z);
    local.rotation.y = s.yaw;
    switch (s.kind) {
      case "ruin": {
        const a = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.6, 0.55), stone);
        a.position.set(-1.4, 1.3, 0);
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.55, 3.4, 2.4), stone);
        b.position.set(1.6, 1.7, -0.4);
        const c = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 1.1), stone);
        c.position.set(0.2, 0.3, 1.2);
        a.castShadow = true;
        b.castShadow = true;
        local.add(a, b, c);
        break;
      }
      case "hut": {
        const body = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.2, 3.4), timber);
        body.position.y = 1.1;
        const cap = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.8, 4), roof);
        cap.position.y = 2.9;
        cap.rotation.y = Math.PI / 4;
        body.castShadow = true;
        local.add(body, cap);
        break;
      }
      case "tower": {
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.35, 7.5, 6), stone);
        shaft.position.y = 3.75;
        shaft.castShadow = true;
        local.add(shaft);
        break;
      }
      case "pier": {
        const plank = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.22, 9), timber);
        plank.position.set(0, 0.4, 3.5);
        local.add(plank);
        break;
      }
      default: {
        const _exhaustive: never = s.kind;
        void _exhaustive;
      }
    }
    group.add(local);
  }
  return group;
}
