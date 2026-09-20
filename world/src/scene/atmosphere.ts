import * as THREE from "three";
import type { GeneratedWorld } from "../worldgen.ts";

export function createAtmosphere(scene: THREE.Scene, world: GeneratedWorld): {
  sun: THREE.DirectionalLight;
  rain: THREE.Points | null;
} {
  scene.background = new THREE.Color(world.weather.raining ? 0x6b7c88 : 0xc9d4dc);
  scene.fog = new THREE.FogExp2(world.weather.raining ? 0x8a97a0 : 0xc2cfd6, world.weather.fogDensity);

  const hemi = new THREE.HemisphereLight(
    world.weather.raining ? 0x9aa8b4 : 0xffe6c4,
    0x6a5a40,
    world.weather.raining ? 0.55 : 0.72,
  );
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(world.weather.raining ? 0xdde4ea : 0xffe0b0, world.weather.raining ? 0.85 : 1.35);
  sun.position.set(-180, 220, 90);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 700;
  sun.shadow.camera.left = -220;
  sun.shadow.camera.right = 220;
  sun.shadow.camera.top = 220;
  sun.shadow.camera.bottom = -220;
  sun.shadow.bias = -0.00025;
  scene.add(sun);
  scene.add(sun.target);

  const amb = new THREE.AmbientLight(0x6e7c88, 0.18);
  scene.add(amb);

  let rain: THREE.Points | null = null;
  if (world.weather.raining) {
    const count = 9000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 220;
      positions[i * 3 + 1] = Math.random() * 70;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 220;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    rain = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xb8c8d4,
        size: 0.18,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    );
    scene.add(rain);
  }

  return { sun, rain };
}

export function createClouds(seed: number): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0xf4f0e8,
    transparent: true,
    opacity: 0.42,
    roughness: 1,
    depthWrite: false,
  });
  for (let i = 0; i < 16; i++) {
    const cloud = new THREE.Group();
    const n = 3 + (i % 3);
    for (let p = 0; p < n; p++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(18 + (p + i) % 10, 8, 6), mat);
      puff.scale.set(1.6 + (p % 2) * 0.4, 0.38, 1.1);
      puff.position.set(p * 16 - 12, (p % 3) * 2, (p - 1) * 8);
      cloud.add(puff);
    }
    const t = (i + 1) * 47.2 + seed * 0.01;
    cloud.position.set(Math.sin(t) * 420, 118 + (i % 5) * 8, Math.cos(t * 0.7) * 420);
    group.add(cloud);
  }
  return group;
}

export function stepRain(rain: THREE.Points, origin: THREE.Vector3, dt: number): void {
  rain.position.x = origin.x;
  rain.position.z = origin.z;
  const pos = rain.geometry.getAttribute("position");
  for (let i = 0; i < pos.count; i++) {
    let y = pos.getY(i) - dt * 28;
    if (y < 0) {
      y = 70;
    }
    pos.setY(i, y);
  }
  pos.needsUpdate = true;
}
