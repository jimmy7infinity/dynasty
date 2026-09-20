import * as THREE from "three/webgpu";

export class CameraRig {
  readonly camera: THREE.PerspectiveCamera;
  yaw = 0.35;
  pitch = -0.95;
  pitchLocked = false;
  distance = 32;
  panX = 0;
  panZ = 0;
  private readonly minDist = 6;
  private readonly maxDist = 4200;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(52, aspect, 0.35, 18000);
  }

  resize(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  addZoom(delta: number): void {
    this.distance = THREE.MathUtils.clamp(this.distance * (1 + delta), this.minDist, this.maxDist);
  }

  addPan(dx: number, dz: number): void {
    const c = Math.cos(this.yaw);
    const s = Math.sin(this.yaw);
    this.panX += dx * c + dz * s;
    this.panZ += -dx * s + dz * c;
  }

  addYaw(delta: number): void {
    this.yaw += delta;
  }

  follow(px: number, py: number, pz: number): void {
    if (!this.pitchLocked) {
      const t = THREE.MathUtils.clamp((this.distance - this.minDist) / (this.maxDist - this.minDist), 0, 1);
      this.pitch = THREE.MathUtils.lerp(-0.58, -1.02, Math.pow(t, 0.42));
    }
    const lookX = px + this.panX;
    const lookZ = pz + this.panZ;
    const lookY = py + 1.2;
    const cosP = Math.cos(this.pitch);
    this.camera.position.set(
      lookX + Math.sin(this.yaw) * this.distance * cosP,
      lookY + Math.sin(-this.pitch) * this.distance,
      lookZ + Math.cos(this.yaw) * this.distance * cosP,
    );
    this.camera.lookAt(lookX, lookY, lookZ);
  }
}
