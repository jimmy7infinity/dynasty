import * as THREE from "three";

export class CameraRig {
  readonly camera: THREE.PerspectiveCamera;
  yaw = 0.42;
  pitch = 0.92;
  distance = 118;
  readonly minDistance = 28;
  readonly maxDistance = 210;
  private readonly look = new THREE.Vector3();
  private dragging = false;
  private lastX = 0;
  private lastY = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.4, 2400);
  }

  attach(canvas: HTMLCanvasElement): void {
    canvas.addEventListener("pointerdown", (e) => {
      if (e.button === 0 || e.button === 1) {
        this.dragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      }
    });
    window.addEventListener("pointerup", () => {
      this.dragging = false;
    });
    window.addEventListener("pointermove", (e) => {
      if (!this.dragging) {
        return;
      }
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.yaw -= dx * 0.005;
      this.pitch = Math.min(1.18, Math.max(0.62, this.pitch + dy * 0.004));
    });
    canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.distance = Math.min(this.maxDistance, Math.max(this.minDistance, this.distance + e.deltaY * 0.08));
      },
      { passive: false },
    );
  }

  snap(target: THREE.Vector3): void {
    this.look.copy(target);
  }

  follow(target: THREE.Vector3, dt: number): void {
    this.look.lerp(target, 1 - Math.exp(-dt * 3.2));
    const x = this.look.x + Math.sin(this.yaw) * Math.cos(this.pitch) * this.distance;
    const y = this.look.y + Math.sin(this.pitch) * this.distance;
    const z = this.look.z + Math.cos(this.yaw) * Math.cos(this.pitch) * this.distance;
    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.look.x, this.look.y + 1.2, this.look.z);
  }
}
