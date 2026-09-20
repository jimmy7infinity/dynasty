import * as THREE from "three/webgpu";

export type MatId = "source" | "controlled" | "toon";

let gradient: THREE.DataTexture | null = null;

function toonGradient(): THREE.DataTexture {
  if (gradient) {
    return gradient;
  }
  const data = new Uint8Array([
    62, 48, 32, 255, 98, 86, 52, 255, 142, 128, 72, 255, 196, 178, 110, 255, 232, 214, 160, 255,
  ]);
  const tex = new THREE.DataTexture(data, 5, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  gradient = tex;
  return tex;
}

function copyMaps(
  dst: THREE.MeshStandardNodeMaterial | THREE.MeshToonNodeMaterial,
  src: THREE.MeshStandardMaterial,
): void {
  dst.map = src.map;
  dst.color.copy(src.color);
  dst.transparent = src.transparent;
  dst.opacity = src.opacity;
  dst.alphaTest = src.alphaTest > 0 ? src.alphaTest : 0.2;
  dst.side = src.side;
  dst.vertexColors = Boolean(src.vertexColors);
}

export function stylizeMaterial(source: THREE.Material, treatment: MatId): THREE.Material {
  const src = source as THREE.MeshStandardMaterial;
  switch (treatment) {
    case "source": {
      const mat = new THREE.MeshStandardNodeMaterial();
      copyMaps(mat, src);
      mat.normalMap = src.normalMap;
      mat.roughness = src.roughness;
      mat.metalness = src.metalness;
      return mat;
    }
    case "controlled": {
      const mat = new THREE.MeshStandardNodeMaterial();
      copyMaps(mat, src);
      mat.normalMap = src.normalMap;
      mat.color.multiplyScalar(1.04);
      mat.color.offsetHSL(0.02, 0.04, -0.02);
      mat.roughness = 0.78;
      mat.metalness = 0;
      return mat;
    }
    case "toon": {
      const mat = new THREE.MeshToonNodeMaterial();
      copyMaps(mat, src);
      mat.gradientMap = toonGradient();
      return mat;
    }
    default: {
      const _never: never = treatment;
      return _never;
    }
  }
}
