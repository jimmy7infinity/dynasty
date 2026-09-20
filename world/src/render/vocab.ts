import * as THREE from "three/webgpu";

function merge(parts: { geo: THREE.BufferGeometry; color: number }[]): THREE.BufferGeometry {
  const out = new THREE.BufferGeometry();
  let v = 0;
  let t = 0;
  for (const part of parts) {
    const pos = part.geo.getAttribute("position");
    v += pos.count;
    const idx = part.geo.getIndex();
    t += idx ? idx.count : 0;
  }
  const positions = new Float32Array(v * 3);
  const colors = new Float32Array(v * 3);
  const indices = new Uint32Array(t);
  let vo = 0;
  let co = 0;
  let io = 0;
  let base = 0;
  const c = new THREE.Color();
  for (const part of parts) {
    c.setHex(part.color);
    const pos = part.geo.getAttribute("position");
    for (let i = 0; i < pos.count; i += 1) {
      positions[vo] = pos.getX(i);
      positions[vo + 1] = pos.getY(i);
      positions[vo + 2] = pos.getZ(i);
      vo += 3;
      colors[co] = c.r;
      colors[co + 1] = c.g;
      colors[co + 2] = c.b;
      co += 3;
    }
    const idx = part.geo.getIndex();
    if (idx) {
      for (let i = 0; i < idx.count; i += 1) {
        indices[io] = idx.getX(i) + base;
        io += 1;
      }
    }
    base += pos.count;
    part.geo.dispose();
  }
  out.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  out.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  out.setIndex(new THREE.BufferAttribute(indices, 1));
  out.computeVertexNormals();
  return out;
}

function displaceIco(radius: number, seed: number): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(radius, 1);
  const pos = g.getAttribute("position");
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const n = Math.sin(x * 3.1 + seed) * Math.cos(z * 2.7 + seed * 0.4) * 0.22;
    pos.setXYZ(i, x * (1 + n), y * (1 + n * 0.7), z * (1 + n));
  }
  g.computeVertexNormals();
  return g;
}

export function oakGeometry(): THREE.BufferGeometry {
  const trunk = new THREE.CylinderGeometry(0.22, 0.38, 2.4, 6, 1);
  trunk.translate(0, 1.2, 0);
  const crownA = new THREE.SphereGeometry(1.55, 7, 5);
  crownA.translate(0, 3.1, 0);
  const crownB = new THREE.SphereGeometry(1.15, 6, 5);
  crownB.translate(0.55, 2.7, 0.2);
  const crownC = new THREE.SphereGeometry(1.05, 6, 5);
  crownC.translate(-0.45, 2.85, -0.35);
  return merge([
    { geo: trunk, color: 0x5a3a24 },
    { geo: crownA, color: 0x2d5a28 },
    { geo: crownB, color: 0x3a6a30 },
    { geo: crownC, color: 0x275024 },
  ]);
}

export function pineGeometry(): THREE.BufferGeometry {
  const trunk = new THREE.CylinderGeometry(0.14, 0.22, 2.1, 6, 1);
  trunk.translate(0, 1.05, 0);
  const c0 = new THREE.ConeGeometry(1.35, 1.8, 7);
  c0.translate(0, 2.4, 0);
  const c1 = new THREE.ConeGeometry(1.05, 1.5, 7);
  c1.translate(0, 3.3, 0);
  const c2 = new THREE.ConeGeometry(0.7, 1.2, 6);
  c2.translate(0, 4.15, 0);
  return merge([
    { geo: trunk, color: 0x4a3428 },
    { geo: c0, color: 0x1c4530 },
    { geo: c1, color: 0x245238 },
    { geo: c2, color: 0x1a3c2c },
  ]);
}

export function birchGeometry(): THREE.BufferGeometry {
  const trunk = new THREE.CylinderGeometry(0.12, 0.2, 3.2, 6, 1);
  trunk.translate(0, 1.6, 0);
  const crown = new THREE.SphereGeometry(1.05, 6, 5);
  crown.scale(1.15, 0.85, 1.05);
  crown.translate(0.15, 3.55, 0);
  const crown2 = new THREE.SphereGeometry(0.75, 6, 5);
  crown2.translate(-0.35, 3.2, 0.15);
  return merge([
    { geo: trunk, color: 0xd8d0c4 },
    { geo: crown, color: 0x6f8a4a },
    { geo: crown2, color: 0x7a944e },
  ]);
}

export function shrubGeometry(): THREE.BufferGeometry {
  const a = new THREE.SphereGeometry(0.55, 5, 4);
  a.scale(1.2, 0.75, 1.1);
  a.translate(0, 0.4, 0);
  const b = new THREE.SphereGeometry(0.4, 5, 4);
  b.translate(0.28, 0.35, 0.1);
  return merge([
    { geo: a, color: 0x3d5c28 },
    { geo: b, color: 0x4a6a30 },
  ]);
}

export function grassGeometry(): THREE.BufferGeometry {
  const a = new THREE.PlaneGeometry(0.28, 1.05, 1, 2);
  a.rotateY(0.4);
  a.translate(0, 0.52, 0);
  const b = new THREE.PlaneGeometry(0.24, 0.92, 1, 2);
  b.rotateY(-0.8);
  b.translate(0, 0.46, 0);
  return merge([
    { geo: a, color: 0x6a9a3c },
    { geo: b, color: 0x5a8a34 },
  ]);
}

export function flowerGeometry(): THREE.BufferGeometry {
  const stem = new THREE.CylinderGeometry(0.02, 0.03, 0.38, 4, 1);
  stem.translate(0, 0.19, 0);
  const head = new THREE.SphereGeometry(0.08, 5, 4);
  head.translate(0, 0.4, 0);
  return merge([
    { geo: stem, color: 0x3a6a28 },
    { geo: head, color: 0xd48a9a },
  ]);
}

export function rockGeometry(): THREE.BufferGeometry {
  const g = displaceIco(0.7, 1.7);
  g.translate(0, 0.35, 0);
  return merge([{ geo: g, color: 0x6b6358 }]);
}

export function logGeometry(): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(0.14, 0.16, 1.8, 6, 1);
  g.rotateZ(Math.PI / 2);
  g.translate(0, 0.14, 0);
  return merge([{ geo: g, color: 0x5a4030 }]);
}

export function cottageGeometry(): THREE.BufferGeometry {
  const body = new THREE.BoxGeometry(3.2, 2.1, 2.4);
  body.translate(0, 1.05, 0);
  const roof = new THREE.ConeGeometry(2.4, 1.4, 4);
  roof.rotateY(Math.PI / 4);
  roof.translate(0, 2.7, 0);
  const door = new THREE.BoxGeometry(0.55, 1.1, 0.12);
  door.translate(0, 0.55, 1.26);
  return merge([
    { geo: body, color: 0x8a6a4a },
    { geo: roof, color: 0x6a4030 },
    { geo: door, color: 0x3a2818 },
  ]);
}

export const VOCAB_COLORS = [
  0x2f5a28, // oak
  0x1f4a32, // pine
  0x6f8a4a, // birch
  0x4a6a30, // shrub
  0x6a9a3c, // grass
  0xd48a9a, // flower
  0x6b6358, // rock
  0x5a4030, // log
  0x8a6a4a, // cottage
] as const;
