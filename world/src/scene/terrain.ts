import * as THREE from "three";
import { Biome, type GeneratedWorld } from "../worldgen.ts";

function biomeColor(biome: BiomeId, moisture: number, slope: number, height: number, sea: number): THREE.Color {
  const c = new THREE.Color();
  switch (biome) {
    case Biome.Ocean:
      c.setRGB(0.12, 0.22, 0.28);
      break;
    case Biome.Beach:
      c.setRGB(0.76, 0.68, 0.48);
      break;
    case Biome.Grass:
      c.setRGB(0.38 + moisture * 0.08, 0.48 + moisture * 0.12, 0.24);
      break;
    case Biome.Forest:
      c.setRGB(0.18, 0.32 + moisture * 0.08, 0.16);
      break;
    case Biome.Desert:
      c.setRGB(0.72, 0.58, 0.34);
      break;
    case Biome.Mountain:
      c.setRGB(0.42 + height * 0.002, 0.4, 0.36);
      break;
    case Biome.Wetland:
      c.setRGB(0.22, 0.34, 0.22);
      break;
    default: {
      const _exhaustive: never = biome as never;
      void _exhaustive;
      c.setRGB(0.3, 0.3, 0.3);
    }
  }
  if (slope > 0.45 && height > sea + 3) {
    c.lerp(new THREE.Color(0.36, 0.33, 0.3), Math.min(0.75, (slope - 0.45) * 1.4));
  }
  if (height > 70) {
    c.lerp(new THREE.Color(0.82, 0.84, 0.86), Math.min(0.7, (height - 70) / 25));
  }
  return c;
}

export function createTerrain(world: GeneratedWorld): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(world.size, world.size, world.grid - 1, world.grid - 1);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  if (!(pos instanceof THREE.BufferAttribute)) {
    throw new Error("terrain position buffer missing");
  }
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const ix = i % world.grid;
    const iz = Math.floor(i / world.grid);
    const h = world.heights[iz * world.grid + ix] ?? world.seaLevel;
    pos.setY(i, h);
    const hx =
      ix > 0 && ix < world.grid - 1
        ? ((world.heights[iz * world.grid + ix + 1] ?? h) - (world.heights[iz * world.grid + ix - 1] ?? h)) /
          (2 * (world.size / (world.grid - 1)))
        : 0;
    const hz =
      iz > 0 && iz < world.grid - 1
        ? ((world.heights[(iz + 1) * world.grid + ix] ?? h) - (world.heights[(iz - 1) * world.grid + ix] ?? h)) /
          (2 * (world.size / (world.grid - 1)))
        : 0;
    const slope = Math.hypot(hx, hz);
    const color = biomeColor(
      (world.biomes[iz * world.grid + ix] ?? Biome.Grass) as BiomeId,
      world.moisture[iz * world.grid + ix] ?? 0.3,
      slope,
      h,
      world.seaLevel,
    );
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    void x;
    void z;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: world.weather.raining ? 0.42 : 0.78,
    metalness: world.weather.raining ? 0.08 : 0.02,
    flatShading: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.castShadow = false;
  mesh.name = "terrain";
  return mesh;
}
