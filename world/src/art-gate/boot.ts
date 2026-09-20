import * as THREE from "three/webgpu";
import {
  DEFAULT_SEED,
  GENERATION_VERSION,
  findLandSpawn,
  sampleHeightMeters,
  type WorldIdentity,
} from "../domain/world.ts";
import { createIntent, setIntent, stepToward } from "../play/movement.ts";
import { createAtmosphere } from "../render/atmosphere.ts";
import { CameraRig } from "../render/camera.ts";
import { WorldJobs } from "../render/jobs.ts";
import { createMarker, createPlayer } from "../render/player.ts";
import { TerrainStreamer, createWater } from "../render/terrain.ts";
import { CAM_PRESETS, parseCam, parsePack, type CamPreset } from "./catalog.ts";
import { composeValley } from "./compose.ts";
import { loadCizzyPrototypes, placeInstances, type GateStats } from "./ingest.ts";

export async function bootArtGate(canvas: HTMLCanvasElement): Promise<void> {
  let pack = parsePack();
  let cam: CamPreset = parseCam();
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
  const marker = createMarker();
  scene.add(player, marker);

  const spawn = findLandSpawn(identity);
  player.position.set(spawn.x, spawn.y, spawn.z);

  const rig = new CameraRig(window.innerWidth / window.innerHeight);
  rig.distance = CAM_PRESETS[cam];

  const hud = document.getElementById("hud");
  if (hud) {
    hud.textContent = "ART GATE  loading Cizzy7 FBX…";
  }

  const prototypes = pack === "fs" ? [] : await loadCizzyPrototypes();
  let stats: GateStats = { prototypes: 0, instances: 0, batches: 0, triangles: 0 };
  if (prototypes.length > 0) {
    stats = placeInstances(assets, prototypes, composeValley(identity, prototypes, spawn.x, spawn.z));
  }

  const intent = createIntent();
  const keys = new Set<string>();
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let frames = 0;
  let fps = 0;
  let fpsAccum = 0;

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    rig.resize(window.innerWidth / window.innerHeight);
  });
  window.addEventListener("keydown", (e) => {
    keys.add(e.code);
    if (e.code === "Digit1") {
      cam = "gameplay";
      rig.distance = CAM_PRESETS.gameplay;
    }
    if (e.code === "Digit2") {
      cam = "regional";
      rig.distance = CAM_PRESETS.regional;
    }
    if (e.code === "Digit3") {
      cam = "distant";
      rig.distance = CAM_PRESETS.distant;
    }
    if (e.code === "Digit4") {
      cam = "explore";
      rig.distance = CAM_PRESETS.explore;
    }
    if (e.code === "KeyP") {
      const order = ["cizzy", "fs", "combined"] as const;
      pack = order[(order.indexOf(pack) + 1) % order.length];
      const url = new URL(window.location.href);
      url.searchParams.set("pack", pack);
      window.location.href = url.toString();
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
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== 2) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, rig.camera);
    const hits = raycaster.intersectObject(terrain.group, true);
    if (hits[0]) {
      setIntent(intent, hits[0].point.x, hits[0].point.z);
      marker.position.set(hits[0].point.x, hits[0].point.y + 0.05, hits[0].point.z);
      marker.visible = true;
    }
  });

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
    const next = stepToward(player.position.x, player.position.z, intent, 2.85, dt);
    const y = sampleHeightMeters(identity, next.x, next.z) + 0.55;
    player.position.set(next.x, y, next.z);
    if (intent.active) {
      const dx = intent.x - next.x;
      const dz = intent.z - next.z;
      if (dx * dx + dz * dz > 0.2) {
        player.rotation.y = Math.atan2(dx, dz);
      }
    }
    terrain.sync(player.position.x, player.position.z);
    terrain.materialize(4);
    sun.position.set(player.position.x + 620, 980, player.position.z + 280);
    sun.target.position.copy(player.position);
    sun.target.updateMatrixWorld();
    rig.follow(player.position.x, player.position.y, player.position.z);
    renderer.render(scene, rig.camera);
    const mem = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
    const heights = Object.fromEntries(prototypes.map((p) => [p.entry.id, Number(p.height.toFixed(2))]));
    const payload = {
      backend,
      pack,
      cam,
      cameraM: rig.distance,
      fps,
      frameMs: dt * 1000,
      instances: stats.instances,
      batches: stats.batches,
      triangles: Math.round(stats.triangles),
      heights,
      memoryMb: mem ? mem.usedJSHeapSize / (1024 * 1024) : null,
      pos: { x: player.position.x, y: player.position.y, z: player.position.z },
      fsAcquired: false,
    };
    if (hud) {
      const fsNote =
        pack === "fs"
          ? "FreeStylized NOT ACQUIRED (Patreon). Empty terrain — Test B cannot be judged."
          : pack === "combined"
            ? "Combined requested; FreeStylized missing. Showing Cizzy7 only — Test C cannot be judged."
            : "Cizzy7 dominant";
      hud.textContent = [
        `ART GATE 500m  pack ${pack}  ${fsNote}`,
        `cam ${cam} (${rig.distance.toFixed(0)} m)  ${backend}  ${fps.toFixed(0)} fps  ${payload.frameMs.toFixed(1)} ms`,
        `instances ${stats.instances}  batches ${stats.batches}  tris ~${payload.triangles.toLocaleString()}`,
        `heap ${payload.memoryMb === null ? "n/a" : `${payload.memoryMb.toFixed(0)} MB`}`,
        `1 gameplay  2 regional  3 distant  4 explore  P pack  RMB walk  WASD pan`,
      ].join("\n");
    }
    (window as unknown as { __dynastyArtGate: typeof payload }).__dynastyArtGate = payload;
  });

  (window as unknown as {
    __dynastyArtControl: {
      setCam: (d: number) => void;
      setPos: (x: number, z: number) => void;
      setYaw: (y: number) => void;
    };
  }).__dynastyArtControl = {
    setCam: (d) => {
      rig.distance = d;
    },
    setPos: (x, z) => {
      const hy = sampleHeightMeters(identity, x, z) + 0.55;
      player.position.set(x, hy, z);
    },
    setYaw: (y) => {
      rig.yaw = y;
    },
  };
}

const canvas = document.getElementById("view");
if (canvas instanceof HTMLCanvasElement) {
  void bootArtGate(canvas).catch((err: unknown) => {
    const hud = document.getElementById("hud");
    if (hud) {
      hud.textContent = `art-gate boot failed: ${err instanceof Error ? err.message : String(err)}`;
    }
    console.error(err);
  });
}
