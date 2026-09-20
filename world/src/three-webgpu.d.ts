declare module "three/webgpu" {
  export * from "three";
  import { MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial, WebGLRenderer } from "three";
  export class WebGPURenderer extends WebGLRenderer {
    init(): Promise<void>;
    backend?: { isWebGPUBackend?: boolean };
  }
  export class MeshStandardNodeMaterial extends MeshStandardMaterial {}
  export class MeshBasicNodeMaterial extends MeshBasicMaterial {}
  export class MeshToonNodeMaterial extends MeshToonMaterial {}
}
