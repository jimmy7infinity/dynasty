import * as THREE from "three";
import type { GeneratedWorld, RiverPath } from "../worldgen.ts";

function ribbonGeometry(path: RiverPath): THREE.BufferGeometry | null {
  if (path.points.length < 2) {
    return null;
  }
  const half = path.width * 0.5;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i < path.points.length; i++) {
    const p = path.points[i];
    const prev = path.points[Math.max(0, i - 1)];
    const next = path.points[Math.min(path.points.length - 1, i + 1)];
    if (p === undefined || prev === undefined || next === undefined) {
      continue;
    }
    const dx = next.x - prev.x;
    const dz = next.z - prev.z;
    const len = Math.hypot(dx, dz) || 1;
    const px = (-dz / len) * half;
    const pz = (dx / len) * half;
    positions.push(p.x + px, p.y, p.z + pz, p.x - px, p.y, p.z - pz);
    normals.push(0, 1, 0, 0, 1, 0);
    uvs.push(0, i * 0.15, 1, i * 0.15);
    if (i > 0) {
      const a = (i - 1) * 2;
      const b = a + 1;
      const c = i * 2;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

export function createWater(world: GeneratedWorld): THREE.Group {
  const group = new THREE.Group();
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: world.weather.raining ? 0x2a4e62 : 0x3a6a7a,
    roughness: 0.12,
    metalness: 0.05,
    transmission: 0.28,
    thickness: 2.4,
    transparent: true,
    opacity: 0.92,
    envMapIntensity: 0.8,
    specularIntensity: 1,
    ior: 1.33,
  });

  const ocean = new THREE.Mesh(
    new THREE.PlaneGeometry(world.size * 1.35, world.size * 1.35, 48, 48),
    waterMat,
  );
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.y = world.seaLevel;
  ocean.receiveShadow = true;
  group.add(ocean);

  const riverMat = waterMat.clone();
  riverMat.color = new THREE.Color(0x2f5d68);
  riverMat.transmission = 0.18;
  for (const river of world.rivers) {
    const geo = ribbonGeometry(river);
    if (geo === null) {
      continue;
    }
    const mesh = new THREE.Mesh(geo, riverMat);
    mesh.renderOrder = 1;
    group.add(mesh);
  }

  for (const lake of world.lakes) {
    const disk = new THREE.Mesh(new THREE.CircleGeometry(14 + (lake.y % 5), 24), riverMat);
    disk.rotation.x = -Math.PI / 2;
    disk.position.set(lake.x, lake.y, lake.z);
    group.add(disk);
  }

  return group;
}
