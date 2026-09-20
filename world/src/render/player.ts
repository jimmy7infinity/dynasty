import * as THREE from "three/webgpu";

export function createPlayer(): THREE.Mesh {
  const geo = new THREE.CapsuleGeometry(0.22, 0.55, 3, 6);
  const mat = new THREE.MeshStandardNodeMaterial({ color: 0xc45c38, roughness: 0.58 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

export function createMarker(): THREE.Mesh {
  const geo = new THREE.RingGeometry(0.35, 0.48, 16);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicNodeMaterial({ color: 0xffe08a, transparent: true, opacity: 0.85 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.visible = false;
  return mesh;
}
