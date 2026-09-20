import * as THREE from "three";

export function createPlayer(): THREE.Group {
  const g = new THREE.Group();
  g.name = "player";
  const cloak = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.22, 0.72, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0x3a2a22, roughness: 0.78 }),
  );
  cloak.position.y = 0.72;
  cloak.castShadow = true;
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xc4a07a, roughness: 0.7 }),
  );
  head.position.y = 1.28;
  const pack = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.28, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.9 }),
  );
  pack.position.set(0, 0.85, -0.18);
  g.add(cloak, head, pack);
  return g;
}

export function createMarker(): THREE.Mesh {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.35, 0.5, 20),
    new THREE.MeshBasicMaterial({ color: 0xf0d9a0, transparent: true, opacity: 0.0, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.name = "marker";
  return ring;
}
