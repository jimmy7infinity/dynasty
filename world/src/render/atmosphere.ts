import * as THREE from "three/webgpu";

export function createAtmosphere(scene: THREE.Scene): {
  sun: THREE.DirectionalLight;
  fogColor: THREE.Color;
} {
  const fogColor = new THREE.Color(0xc4b496);
  scene.background = new THREE.Color(0x8eabc4);
  scene.fog = new THREE.Fog(fogColor, 520, 9200);
  const hemi = new THREE.HemisphereLight(0xffe6c4, 0x3d4a28, 0.72);
  scene.add(hemi);
  const fill = new THREE.AmbientLight(0x6a7a88, 0.22);
  scene.add(fill);
  const sun = new THREE.DirectionalLight(0xffd7a0, 2.05);
  sun.position.set(620, 980, 280);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 8;
  sun.shadow.camera.far = 2800;
  sun.shadow.camera.left = -420;
  sun.shadow.camera.right = 420;
  sun.shadow.camera.top = 420;
  sun.shadow.camera.bottom = -420;
  sun.shadow.bias = -0.00025;
  scene.add(sun);
  scene.add(sun.target);
  return { sun, fogColor };
}
