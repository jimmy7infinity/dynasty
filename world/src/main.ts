import * as THREE from "three/webgpu";
import {
  ART_SEEDS,
  DEFAULT_SEED,
  GENERATION_VERSION,
  chunkAt,
  findLandSpawn,
  sampleHeightMeters,
  type WorldIdentity,
} from "./domain/world.ts";
import { createIntent, setIntent, stepToward } from "./play/movement.ts";
import { createAtmosphere } from "./render/atmosphere.ts";
import { CameraRig } from "./render/camera.ts";
import { mountHud } from "./render/hud.ts";
import { WorldJobs } from "./render/jobs.ts";
import { createMarker, createPlayer } from "./render/player.ts";
import { TerrainStreamer, createWater } from "./render/terrain.ts";
import { DENSITY_STEPS, VegetationSystem } from "./render/vegetation.ts";

function parseSeed(): number {
  const raw = new URLSearchParams(window.location.search).get("seed");
  if (!raw) {
    return DEFAULT_SEED;
  }
  const n = Number(raw);
  return Number.isFinite(n) ? Math.floor(n) : DEFAULT_SEED;
}

function parseDensityIndex(): number {
  const raw = new URLSearchParams(window.location.search).get("veg");
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    return 2;
  }
  return Math.max(0, Math.min(DENSITY_STEPS.length - 1, Math.floor(n)));
}

export async function boot(canvas: HTMLCanvasElement): Promise<void> {
  const identity: WorldIdentity = { seed: parseSeed(), generationVersion: GENERATION_VERSION };
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
  const veg = new VegetationSystem(identity, jobs);
  scene.add(terrain.group);
  scene.add(veg.group);
  scene.add(createWater());

  const player = createPlayer();
  const marker = createMarker();
  const spawn = findLandSpawn(identity);
  player.position.set(spawn.x, spawn.y, spawn.z);
  scene.add(player, marker);

  const rig = new CameraRig(window.innerWidth / window.innerHeight);
  rig.distance = 36;
  const camRaw = Number(new URLSearchParams(window.location.search).get("cam"));
  if (Number.isFinite(camRaw) && camRaw > 0) {
    rig.distance = camRaw;
  }
  rig.follow(spawn.x, spawn.y, spawn.z);

  const intent = createIntent();
  let densityIndex = parseDensityIndex();
  let vegForce = true;
  const keys = new Set<string>();
  const clock = new THREE.Clock();
  const hud = mountHud();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let frames = 0;
  let fps = 0;
  let fpsAccum = 0;

  terrain.sync(player.position.x, player.position.z);
  veg.requestIfNeeded(player.position.x, player.position.z, DENSITY_STEPS[densityIndex], true);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    rig.resize(window.innerWidth / window.innerHeight);
  });
  window.addEventListener("keydown", (e) => {
    keys.add(e.code);
    const digit = e.code.match(/^Digit([1-5])$/);
    if (digit) {
      densityIndex = Number(digit[1]) - 1;
      vegForce = true;
    }
    if (e.code === "BracketLeft" || e.code === "BracketRight") {
      const i = ART_SEEDS.indexOf(identity.seed as (typeof ART_SEEDS)[number]);
      const next = e.code === "BracketRight" ? (i + 1 + ART_SEEDS.length) % ART_SEEDS.length : (i - 1 + ART_SEEDS.length) % ART_SEEDS.length;
      const seed = ART_SEEDS[Math.max(0, next)];
      const url = new URL(window.location.href);
      url.searchParams.set("seed", String(seed));
      window.location.href = url.toString();
    }
  });
  window.addEventListener("keyup", (e) => keys.delete(e.code));
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      rig.addZoom(e.deltaY * 0.0014);
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
    renderer.info.reset();
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
    terrain.materialize(3);
    veg.requestIfNeeded(player.position.x, player.position.z, DENSITY_STEPS[densityIndex], vegForce);
    vegForce = false;
    sun.position.set(player.position.x + 620, 980, player.position.z + 280);
    sun.target.position.copy(player.position);
    sun.target.updateMatrixWorld();
    rig.follow(player.position.x, player.position.y, player.position.z);
    renderer.render(scene, rig.camera);
    const mem = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
    const t = terrain.stats();
    const stats = {
      backend,
      fps,
      frameMs: dt * 1000,
      drawCalls: terrain.meshCount() + veg.meshes.length + 3,
      triangles: renderer.info.render.triangles,
      instances: veg.visibleInstances(),
      chunks: t.loaded,
      generated: t.generated,
      genMs: t.genMs,
      streamMs: t.streamMs,
      vegMs: veg.fillMs,
      pos: `${player.position.x.toFixed(1)}, ${player.position.z.toFixed(1)} m  z ${player.position.y.toFixed(1)}`,
      chunk: `${chunkAt(player.position.x, player.position.z).x}, ${chunkAt(player.position.x, player.position.z).z}`,
      cameraM: rig.distance,
      seed: identity.seed,
      memoryMb: mem ? mem.usedJSHeapSize / (1024 * 1024) : null,
      matMs: t.matMs,
      vegPending: veg.pending,
    };
    hud(stats);
    (window as unknown as { __dynasty: typeof stats }).__dynasty = stats;
  });

  (window as unknown as {
    __dynastyControl: {
      setMove: (x: number, z: number) => void;
      setCam: (d: number) => void;
      setDensity: (i: number) => void;
      setPos: (x: number, z: number) => void;
    };
  }).__dynastyControl = {
    setMove: (x, z) => {
      setIntent(intent, x, z);
    },
    setCam: (d) => {
      rig.distance = d;
    },
    setPos: (x, z) => {
      const hy = sampleHeightMeters(identity, x, z) + 0.55;
      player.position.set(x, hy, z);
      vegForce = true;
    },
    setDensity: (i) => {
      densityIndex = Math.max(0, Math.min(DENSITY_STEPS.length - 1, i));
      vegForce = true;
    },
  };
}

const canvas = document.getElementById("view");
if (canvas instanceof HTMLCanvasElement) {
  void boot(canvas).catch((err: unknown) => {
    const hud = document.getElementById("hud");
    if (hud) {
      hud.textContent = `boot failed: ${err instanceof Error ? err.message : String(err)}`;
    }
    console.error(err);
  });
}
