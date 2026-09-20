import * as THREE from "three/webgpu";
import { DEFAULT_SEED, GENERATION_VERSION, sampleHeightMeters, type WorldIdentity } from "../domain/world.ts";
import { CameraRig } from "../render/camera.ts";
import { createAtmosphere } from "../render/atmosphere.ts";
import { TerrainStreamer, createWater } from "../render/terrain.ts";
import { WorldJobs } from "../render/jobs.ts";
import { createPlayer } from "../render/player.ts";
import {
  CAM_PRESETS,
  CATALOG,
  PLANT_IDS,
  ROCK_IDS,
  TREE_IDS,
  parseCam,
  parseMat,
  parseTest,
  type CamPreset,
  type MatId,
  type TestId,
} from "./catalog.ts";
import { hash01, loadPrototypes, placeInstances, type Prototype } from "./ingest.ts";

function layout(
  test: TestId,
  prototypes: Prototype[],
  ox: number,
  oz: number,
  identity: WorldIdentity,
): { id: string; x: number; y: number; z: number; yaw: number; scale: number }[] {
  const byId = new Map(prototypes.map((p) => [p.entry.id, p]));
  const put = (
    id: string,
    x: number,
    z: number,
    yaw: number,
    scale: number,
  ): { id: string; x: number; y: number; z: number; yaw: number; scale: number } => {
    const proto = byId.get(id);
    const y = sampleHeightMeters(identity, x, z);
    const sink = proto && proto.entry.kind === "rock" ? 0.05 * scale : 0;
    return { id, x, y: y - sink, z, yaw, scale };
  };

  switch (test) {
    case "isolated": {
      const out = [];
      const cols = 7;
      for (let i = 0; i < CATALOG.length; i += 1) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        out.push(put(CATALOG[i].id, ox + (col - 3) * 14, oz + (row - 1.5) * 16, 0.2 * i, 1));
      }
      return out;
    }
    case "cluster": {
      const out = [];
      const trees = ["CommonTree_1", "Pine_1", "TwistedTree_3", "CommonTree_5", "Pine_5", "DeadTree_1", "TwistedTree_1", "CommonTree_3"];
      for (let i = 0; i < trees.length; i += 1) {
        const a = (i / trees.length) * Math.PI * 2;
        out.push(put(trees[i], ox + Math.cos(a) * 9, oz + Math.sin(a) * 9, a, 0.9 + hash01(i + 2) * 0.25));
      }
      for (let i = 0; i < 6; i += 1) {
        const a = hash01(i + 40) * Math.PI * 2;
        const r = 3 + hash01(i + 41) * 7;
        out.push(put(ROCK_IDS[i % ROCK_IDS.length], ox + Math.cos(a) * r, oz + Math.sin(a) * r, a, 0.8 + hash01(i + 9) * 0.5));
      }
      for (let i = 0; i < 14; i += 1) {
        const a = hash01(i + 80) * Math.PI * 2;
        const r = 1.5 + hash01(i + 81) * 10;
        out.push(put(PLANT_IDS[i % PLANT_IDS.length], ox + Math.cos(a) * r, oz + Math.sin(a) * r, a, 0.85 + hash01(i + 11) * 0.4));
      }
      return out;
    }
    case "forest": {
      const out = [];
      for (let i = 0; i < 96; i += 1) {
        const id = TREE_IDS[Math.floor(hash01(i + 3) * TREE_IDS.length)];
        const x = ox + (hash01(i + 4) - 0.5) * 90;
        const z = oz + (hash01(i + 5) - 0.5) * 90;
        out.push(put(id, x, z, hash01(i + 6) * Math.PI * 2, 0.82 + hash01(i + 7) * 0.45));
      }
      for (let i = 0; i < 48; i += 1) {
        const id = PLANT_IDS[Math.floor(hash01(i + 20) * PLANT_IDS.length)];
        out.push(
          put(
            id,
            ox + (hash01(i + 21) - 0.5) * 88,
            oz + (hash01(i + 22) - 0.5) * 88,
            hash01(i + 23) * 6.28,
            0.8 + hash01(i + 24) * 0.5,
          ),
        );
      }
      for (let i = 0; i < 22; i += 1) {
        const id = ROCK_IDS[Math.floor(hash01(i + 30) * ROCK_IDS.length)];
        out.push(
          put(
            id,
            ox + (hash01(i + 31) - 0.5) * 80,
            oz + (hash01(i + 32) - 0.5) * 80,
            hash01(i + 33) * 6.28,
            0.7 + hash01(i + 34) * 0.7,
          ),
        );
      }
      return out;
    }
    case "mixed": {
      const out = [];
      for (let i = 0; i < 40; i += 1) {
        const t = i / 39;
        const x = ox + (t - 0.5) * 140 + (hash01(i) - 0.5) * 18;
        const z = oz + Math.sin(t * 4.2) * 28 + (hash01(i + 1) - 0.5) * 16;
        const id = TREE_IDS[Math.floor(hash01(i + 8) * TREE_IDS.length)];
        out.push(put(id, x, z, hash01(i + 9) * 6.28, 0.85 + hash01(i + 10) * 0.4));
      }
      for (let i = 0; i < 28; i += 1) {
        out.push(
          put(
            PLANT_IDS[i % PLANT_IDS.length],
            ox + (hash01(i + 50) - 0.5) * 130,
            oz + (hash01(i + 51) - 0.5) * 50,
            hash01(i + 52) * 6.28,
            0.9 + hash01(i + 53) * 0.3,
          ),
        );
      }
      for (let i = 0; i < 16; i += 1) {
        out.push(
          put(
            ROCK_IDS[i % ROCK_IDS.length],
            ox + (hash01(i + 60) - 0.5) * 120,
            oz + (hash01(i + 61) - 0.5) * 40,
            hash01(i + 62) * 6.28,
            0.75 + hash01(i + 63) * 0.6,
          ),
        );
      }
      return out;
    }
    default: {
      const _never: never = test;
      return _never;
    }
  }
}

export async function bootGate(canvas: HTMLCanvasElement): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  let test = parseTest(params.get("test"));
  let mat = parseMat(params.get("mat"));
  let cam = parseCam(params.get("cam"));

  const identity: WorldIdentity = { seed: DEFAULT_SEED, generationVersion: GENERATION_VERSION };
  const renderer = new THREE.WebGPURenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(1.4, window.devicePixelRatio));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  await renderer.init();
  const backend = (renderer as { backend?: { isWebGPUBackend?: boolean } }).backend?.isWebGPUBackend
    ? "webgpu"
    : "webgl-fallback";

  const scene = new THREE.Scene();
  const { sun } = createAtmosphere(scene);
  const jobs = new WorldJobs();
  const terrain = new TerrainStreamer(identity, jobs);
  scene.add(terrain.group);
  scene.add(createWater());

  const assets = new THREE.Group();
  scene.add(assets);

  const player = createPlayer();
  scene.add(player);

  const rig = new CameraRig(window.innerWidth / window.innerHeight);
  rig.distance = CAM_PRESETS[cam];

  const origin = { x: 120, z: -80 };
  const hy = sampleHeightMeters(identity, origin.x, origin.z);
  player.position.set(origin.x, hy + 0.55, origin.z);

  const prototypes = await loadPrototypes();
  let stats = placeInstances(assets, prototypes, mat, layout(test, prototypes, origin.x, origin.z, identity));

  const relayout = (): void => {
    stats = placeInstances(assets, prototypes, mat, layout(test, prototypes, origin.x, origin.z, identity));
  };

  const hud = document.getElementById("hud");
  const clock = new THREE.Clock();
  let frames = 0;
  let fps = 0;
  let fpsAccum = 0;
  const keys = new Set<string>();

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    rig.resize(window.innerWidth / window.innerHeight);
  });
  window.addEventListener("keydown", (e) => {
    keys.add(e.code);
    if (e.code === "KeyT") {
      const order: TestId[] = ["isolated", "cluster", "forest", "mixed"];
      test = order[(order.indexOf(test) + 1) % order.length];
      relayout();
    }
    if (e.code === "KeyM") {
      const order: MatId[] = ["source", "controlled", "toon"];
      mat = order[(order.indexOf(mat) + 1) % order.length];
      relayout();
    }
    if (e.code === "Digit1") {
      cam = "close";
      rig.distance = CAM_PRESETS.close;
    }
    if (e.code === "Digit2") {
      cam = "gameplay";
      rig.distance = CAM_PRESETS.gameplay;
    }
    if (e.code === "Digit3") {
      cam = "regional";
      rig.distance = CAM_PRESETS.regional;
    }
    if (e.code === "Digit4") {
      cam = "distant";
      rig.distance = CAM_PRESETS.distant;
    }
  });
  window.addEventListener("keyup", (e) => keys.delete(e.code));
  canvas.addEventListener(
    "wheel",
    (ev) => {
      ev.preventDefault();
      rig.addZoom(ev.deltaY * 0.0014);
    },
    { passive: false },
  );

  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    fpsAccum += dt;
    frames += 1;
    if (fpsAccum >= 0.5) {
      fps = frames / fpsAccum;
      frames = 0;
      fpsAccum = 0;
    }
    const pan = 42 * rig.distance * 0.012;
    if (keys.has("KeyW") || keys.has("ArrowUp")) {
      rig.addPan(0, -pan * dt);
    }
    if (keys.has("KeyS") || keys.has("ArrowDown")) {
      rig.addPan(0, pan * dt);
    }
    if (keys.has("KeyA") || keys.has("ArrowLeft")) {
      rig.addPan(-pan * dt, 0);
    }
    if (keys.has("KeyD") || keys.has("ArrowRight")) {
      rig.addPan(pan * dt, 0);
    }
    if (keys.has("KeyQ")) {
      rig.addYaw(-0.7 * dt);
    }
    if (keys.has("KeyE")) {
      rig.addYaw(0.7 * dt);
    }
    terrain.sync(player.position.x, player.position.z);
    terrain.materialize(4);
    sun.position.set(player.position.x + 620, 980, player.position.z + 280);
    sun.target.position.copy(player.position);
    sun.target.updateMatrixWorld();
    rig.follow(player.position.x, player.position.y, player.position.z);
    renderer.render(scene, rig.camera);
    const mem = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
    const payload = {
      backend,
      test,
      mat,
      cam,
      cameraM: rig.distance,
      fps,
      frameMs: dt * 1000,
      instances: stats.instances,
      batches: stats.batches,
      triangles: Math.round(stats.triangles),
      heights: Object.fromEntries(prototypes.map((p) => [p.entry.id, Number(p.height.toFixed(2))])),
      memoryMb: mem ? mem.usedJSHeapSize / (1024 * 1024) : null,
    };
    if (hud) {
      hud.textContent = [
        `ASSET GATE  MegaKit Standard  CC0`,
        `test ${test}  mat ${mat}  cam ${cam} (${rig.distance.toFixed(0)} m)`,
        `${backend}  ${fps.toFixed(0)} fps  ${payload.frameMs.toFixed(1)} ms`,
        `instances ${stats.instances}  batches ${stats.batches}  tris ~${payload.triangles.toLocaleString()}`,
        `heap ${payload.memoryMb === null ? "n/a" : `${payload.memoryMb.toFixed(0)} MB`}`,
        `T test  M material  1 close 2 gameplay 3 regional 4 distant  WASD pan`,
      ].join("\n");
    }
    (window as unknown as { __dynastyGate: typeof payload }).__dynastyGate = payload;
  });
}

const canvas = document.getElementById("view");
if (canvas instanceof HTMLCanvasElement) {
  void bootGate(canvas).catch((err: unknown) => {
    const hud = document.getElementById("hud");
    if (hud) {
      hud.textContent = `asset-gate boot failed: ${err instanceof Error ? err.message : String(err)}`;
    }
    console.error(err);
  });
}
