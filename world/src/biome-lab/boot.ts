import * as THREE from "three/webgpu";
import { DEFAULT_SEED, GENERATION_VERSION, type WorldIdentity } from "../domain/world.ts";
import { createIntent, setIntent, stepToward } from "../play/movement.ts";
import { CameraRig } from "../render/camera.ts";
import { createMarker, createPlayer } from "../render/player.ts";
import { findLabSpawn, sampleLabHeight } from "./fields.ts";
import { createLabClouds, createLabOcean, createLabRivers, createLabTerrain } from "./ground.ts";
import { populateLab } from "./populate.ts";
import { SKYLIGHT, SUN_DIR, SUN_DISTANCE, SUNLIGHT } from "./toon.ts";

export async function bootBiomeLab(canvas: HTMLCanvasElement): Promise<void> {
  const identity: WorldIdentity = { seed: DEFAULT_SEED, generationVersion: GENERATION_VERSION };
  const renderer = new THREE.WebGPURenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(1.4, window.devicePixelRatio));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1;
  await renderer.init();
  const backend = (renderer as { backend?: { isWebGPUBackend?: boolean } }).backend?.isWebGPUBackend
    ? "webgpu"
    : "webgl-fallback";

  const scene = new THREE.Scene();
  // Reference shows almost no sky and a warm distance haze, not a blue one.
  scene.background = new THREE.Color(0xb2bec0);
  scene.fog = new THREE.Fog(new THREE.Color(0xc6bfae), 1800, 5200);

  // Shadow/light ratios measured off the reference solve to a blue skylight plus
  // a warm sun; the warm hemisphere floor supplies the bounce that keeps cloud
  // and canopy undersides from going cold. See toon.ts.
  // Intensities are PI because three runs both direct and indirect light through
  // BRDF_Lambert, which divides by PI. At intensity 1 the solved irradiance of 1.0
  // arrives as 0.318, i.e. 0.60 after the sRGB curve, and the whole frame rendered
  // ~40% too dark with half the reference's contrast.
  scene.add(new THREE.HemisphereLight(SKYLIGHT, 0x7a6a52, Math.PI));
  const sun = new THREE.DirectionalLight(SUNLIGHT, Math.PI);
  sun.castShadow = true;
  // Cast shadows are load-bearing here: the big soft blob under the mesa and the
  // dark patch under every crown are most of the reference's tonal variety.
  // 0.92: full occlusion crushed umbrae darker than the measured grass ratio.
  sun.shadow.intensity = 0.92;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.camera.near = 8;
  sun.shadow.camera.far = 4000;
  sun.shadow.camera.left = -900;
  sun.shadow.camera.right = 900;
  sun.shadow.camera.top = 900;
  sun.shadow.camera.bottom = -900;
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.5;
  scene.add(sun);
  scene.add(sun.target);

  const spawn = findLabSpawn(identity);
  const terrain = createLabTerrain(identity, spawn.x, spawn.z);
  scene.add(terrain);
  scene.add(createLabRivers(identity, spawn.z));
  scene.add(createLabOcean(identity, spawn.x, spawn.z));
  scene.add(createLabClouds(identity, spawn.x, spawn.z));

  const flora = new THREE.Group();
  scene.add(flora);

  const player = createPlayer();
  const marker = createMarker();
  player.position.set(spawn.x, spawn.y, spawn.z);
  scene.add(player, marker);

  const stats = populateLab(flora, identity, spawn.x, spawn.z);

  const rig = new CameraRig(window.innerWidth / window.innerHeight);
  // Reference frame is ~1000-1150 m wide with the camera ~55 deg below horizontal
  // and no visible sky. The lab was at 29 deg, which showed a horizon instead.
  rig.distance = 780;
  rig.yaw = 0.18;
  rig.pitchLocked = true;
  rig.pitch = -0.95;
  rig.camera.fov = 42;
  rig.camera.updateProjectionMatrix();
  const intent = createIntent();
  const keys = new Set<string>();
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hud = document.getElementById("hud");
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
      rig.distance = 18;
      rig.pitchLocked = false;
    }
    if (e.code === "Digit2") {
      rig.distance = 36;
      rig.pitchLocked = false;
    }
    if (e.code === "Digit3") {
      rig.distance = 780;
      rig.pitchLocked = true;
      rig.pitch = -0.95;
    }
    if (e.code === "Digit4") {
      rig.distance = 1500;
      rig.pitchLocked = true;
      rig.pitch = -1;
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
    const hits = raycaster.intersectObject(terrain, true);
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
    const y = sampleLabHeight(identity, next.x, next.z) + 0.55;
    player.position.set(next.x, y, next.z);
    if (intent.active) {
      const dx = intent.x - next.x;
      const dz = intent.z - next.z;
      if (dx * dx + dz * dz > 0.2) {
        player.rotation.y = Math.atan2(dx, dz);
      }
    }
    sun.position.copy(player.position).addScaledVector(SUN_DIR, SUN_DISTANCE);
    sun.target.position.copy(player.position);
    sun.target.updateMatrixWorld();
    rig.follow(player.position.x, player.position.y, player.position.z);
    renderer.render(scene, rig.camera);
    if (hud) {
      hud.textContent = [
        `BIOME LAB  arid gold  /  humid forest  (climate fields)`,
        `${backend}  ${fps.toFixed(0)} fps  cam ${rig.distance.toFixed(0)} m`,
        `instances ${stats.instances}  batches ${stats.batches}  tris ~${Math.round(stats.triangles).toLocaleString()}`,
        `1 close  2 36m  3 regional 780m  4 far 1500m  RMB walk  WASD pan  QE yaw`,
      ].join("\n");
    }
  });
}

const canvas = document.getElementById("view");
if (canvas instanceof HTMLCanvasElement) {
  void bootBiomeLab(canvas).catch((err: unknown) => {
    const hud = document.getElementById("hud");
    if (hud) {
      hud.textContent = `biome-lab boot failed: ${err instanceof Error ? err.message : String(err)}`;
    }
    console.error(err);
  });
}
