import { fillInstances } from "../domain/instances.ts";
import { buildPatchData, type PatchData } from "../domain/patch.ts";
import type { WorldIdentity } from "../domain/world.ts";

export type VegResult = {
  kind: "veg";
  requestId: number;
  counts: number[];
  buffers: Float32Array[];
  ms: number;
};

export type PatchResult = PatchData & {
  kind: "patch";
  requestId: number;
  key: string;
};

type Job =
  | {
      kind: "veg";
      id: WorldIdentity;
      px: number;
      pz: number;
      target: number;
      radius: number;
      requestId: number;
    }
  | {
      kind: "patch";
      id: WorldIdentity;
      originX: number;
      originZ: number;
      size: number;
      verts: number;
      key: string;
      requestId: number;
    };

export class WorldJobs {
  private worker: Worker | null = null;
  private nextId = 1;
  private readonly queue: Job[] = [];
  private busy = false;
  private vegHandler: ((r: VegResult) => void) | null = null;
  private patchHandler: ((r: PatchResult) => void) | null = null;

  constructor() {
    try {
      this.worker = new Worker(new URL("../workers/world.worker.ts", import.meta.url), { type: "module" });
      this.worker.onmessage = (event: MessageEvent<VegResult | PatchResult>) => {
        this.busy = false;
        const data = event.data;
        if (data.kind === "veg") {
          this.vegHandler?.(data);
        } else {
          this.patchHandler?.(data);
        }
        this.pump();
      };
      this.worker.onerror = () => {
        this.busy = false;
        this.worker = null;
        this.pump();
      };
    } catch {
      this.worker = null;
    }
  }

  onVeg(handler: (r: VegResult) => void): void {
    this.vegHandler = handler;
  }

  onPatch(handler: (r: PatchResult) => void): void {
    this.patchHandler = handler;
  }

  requestVeg(id: WorldIdentity, px: number, pz: number, target: number, radius: number): number {
    const requestId = this.nextId;
    this.nextId += 1;
    this.queue.push({ kind: "veg", id, px, pz, target, radius, requestId });
    this.pump();
    return requestId;
  }

  requestPatch(
    id: WorldIdentity,
    key: string,
    originX: number,
    originZ: number,
    size: number,
    verts: number,
  ): number {
    const requestId = this.nextId;
    this.nextId += 1;
    this.queue.push({ kind: "patch", id, originX, originZ, size, verts, key, requestId });
    this.pump();
    return requestId;
  }

  private pump(): void {
    if (this.busy || this.queue.length === 0) {
      return;
    }
    const job = this.queue.shift();
    if (!job) {
      return;
    }
    this.busy = true;
    if (this.worker) {
      this.worker.postMessage(job);
      return;
    }
    this.runLocal(job);
  }

  private runLocal(job: Job): void {
    if (job.kind === "veg") {
      const fill = fillInstances(job.id, job.px, job.pz, job.target, job.radius);
      queueMicrotask(() => {
        this.busy = false;
        this.vegHandler?.({ kind: "veg", requestId: job.requestId, counts: fill.counts, buffers: fill.buffers, ms: fill.ms });
        this.pump();
      });
      return;
    }
    const patch = buildPatchData(job.id, job.originX, job.originZ, job.size, job.verts);
    queueMicrotask(() => {
      this.busy = false;
      this.patchHandler?.({ kind: "patch", requestId: job.requestId, key: job.key, ...patch });
      this.pump();
    });
  }
}
