import { groundColor, sampleSite } from "./ecology.ts";
import { sampleHeightMeters, type WorldIdentity } from "./world.ts";

export type PatchData = {
  positions: Float32Array;
  colors: Float32Array;
  normals: Float32Array;
  indices: Uint32Array;
  originX: number;
  originZ: number;
  size: number;
  verts: number;
};

export function buildPatchData(
  id: WorldIdentity,
  originX: number,
  originZ: number,
  size: number,
  verts: number,
): PatchData {
  const spacing = size / (verts - 1);
  const positions = new Float32Array(verts * verts * 3);
  const colors = new Float32Array(verts * verts * 3);
  const normals = new Float32Array(verts * verts * 3);
  let i = 0;
  for (let z = 0; z < verts; z += 1) {
    for (let x = 0; x < verts; x += 1) {
      const xm = originX + x * spacing;
      const zm = originZ + z * spacing;
      const h = sampleHeightMeters(id, xm, zm);
      positions[i * 3] = xm;
      positions[i * 3 + 1] = h;
      positions[i * 3 + 2] = zm;
      const site = sampleSite(id, xm, zm);
      const c = groundColor(site);
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
      i += 1;
    }
  }
  const indices = new Uint32Array((verts - 1) * (verts - 1) * 6);
  let t = 0;
  for (let z = 0; z < verts - 1; z += 1) {
    for (let x = 0; x < verts - 1; x += 1) {
      const i00 = z * verts + x;
      const i10 = i00 + 1;
      const i01 = i00 + verts;
      const i11 = i01 + 1;
      indices[t] = i00;
      indices[t + 1] = i01;
      indices[t + 2] = i10;
      indices[t + 3] = i10;
      indices[t + 4] = i01;
      indices[t + 5] = i11;
      t += 6;
    }
  }
  computeNormals(positions, indices, normals);
  return { positions, colors, normals, indices, originX, originZ, size, verts };
}

function computeNormals(positions: Float32Array, indices: Uint32Array, normals: Float32Array): void {
  normals.fill(0);
  for (let t = 0; t < indices.length; t += 3) {
    const a = indices[t] * 3;
    const b = indices[t + 1] * 3;
    const c = indices[t + 2] * 3;
    const ax = positions[a];
    const ay = positions[a + 1];
    const az = positions[a + 2];
    const bx = positions[b];
    const by = positions[b + 1];
    const bz = positions[b + 2];
    const cx = positions[c];
    const cy = positions[c + 1];
    const cz = positions[c + 2];
    const ux = bx - ax;
    const uy = by - ay;
    const uz = bz - az;
    const vx = cx - ax;
    const vy = cy - ay;
    const vz = cz - az;
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    normals[a] += nx;
    normals[a + 1] += ny;
    normals[a + 2] += nz;
    normals[b] += nx;
    normals[b + 1] += ny;
    normals[b + 2] += nz;
    normals[c] += nx;
    normals[c + 1] += ny;
    normals[c + 2] += nz;
  }
  for (let i = 0; i < normals.length; i += 3) {
    const nx = normals[i];
    const ny = normals[i + 1];
    const nz = normals[i + 2];
    const len = Math.hypot(nx, ny, nz) || 1;
    normals[i] = nx / len;
    normals[i + 1] = ny / len;
    normals[i + 2] = nz / len;
  }
}
