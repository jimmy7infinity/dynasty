export type HudStats = {
  backend: string;
  fps: number;
  frameMs: number;
  drawCalls: number;
  triangles: number;
  instances: number;
  chunks: number;
  generated: number;
  genMs: number;
  streamMs: number;
  vegMs: number;
  pos: string;
  chunk: string;
  cameraM: number;
  seed: number;
  memoryMb: number | null;
  matMs: number;
  vegPending: boolean;
};

export function mountHud(): (stats: HudStats) => void {
  const el = document.getElementById("hud");
  if (!(el instanceof HTMLElement)) {
    return () => undefined;
  }
  return (stats) => {
    const mem = stats.memoryMb === null ? "n/a" : `${stats.memoryMb.toFixed(0)} MB`;
    el.textContent = [
      `Dynasty valley  ·  WebGPU production client`,
      `backend ${stats.backend}  seed ${stats.seed}`,
      `${stats.fps.toFixed(0)} fps  ${stats.frameMs.toFixed(2)} ms`,
      `meshes ~${stats.drawCalls}  tris ${stats.triangles.toLocaleString()}`,
      `webgpu draw-stat: unreliable (accumulates)`,
      `instances ${stats.instances.toLocaleString()}  worker-fill ${stats.vegMs.toFixed(0)} ms  ${stats.vegPending ? "generating" : "ready"}`,
      `regions ${stats.chunks}  built ${stats.generated}  mat ${stats.matMs.toFixed(1)} ms  stream ${stats.streamMs.toFixed(1)} ms`,
      `pos ${stats.pos}  chunk ${stats.chunk}  cam ${stats.cameraM.toFixed(0)} m`,
      `js heap ${mem}  gpu timing n/a`,
      `1–5 density   [ ] seeds   wheel zoom   WASD pan   QE yaw   RMB move`,
    ].join("\n");
  };
}
