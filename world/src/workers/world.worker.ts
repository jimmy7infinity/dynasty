import { fillInstances } from "../domain/instances.ts";
import { buildPatchData } from "../domain/patch.ts";
import type { WorldIdentity } from "../domain/world.ts";

type VegJob = {
  kind: "veg";
  id: WorldIdentity;
  px: number;
  pz: number;
  target: number;
  radius: number;
  requestId: number;
};

type PatchJob = {
  kind: "patch";
  id: WorldIdentity;
  originX: number;
  originZ: number;
  size: number;
  verts: number;
  key: string;
  requestId: number;
};

self.onmessage = (event: MessageEvent<VegJob | PatchJob>) => {
  const job = event.data;
  if (job.kind === "veg") {
    const fill = fillInstances(job.id, job.px, job.pz, job.target, job.radius);
    const transfers = fill.buffers.map((b) => b.buffer);
    self.postMessage(
      {
        kind: "veg",
        requestId: job.requestId,
        counts: fill.counts,
        buffers: fill.buffers,
        ms: fill.ms,
      },
      transfers,
    );
    return;
  }
  if (job.kind === "patch") {
    const patch = buildPatchData(job.id, job.originX, job.originZ, job.size, job.verts);
    self.postMessage(
      {
        kind: "patch",
        requestId: job.requestId,
        key: job.key,
        originX: patch.originX,
        originZ: patch.originZ,
        size: patch.size,
        verts: patch.verts,
        positions: patch.positions,
        colors: patch.colors,
        normals: patch.normals,
        indices: patch.indices,
      },
      [patch.positions.buffer, patch.colors.buffer, patch.normals.buffer, patch.indices.buffer],
    );
    return;
  }
  const _never: never = job;
  return _never;
};
