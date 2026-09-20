import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const prototypeDir = dirname(fileURLToPath(import.meta.url));
const repoDir = resolve(prototypeDir, "..");

export default defineConfig({
  root: prototypeDir,
  server: {
    port: 5173,
    fs: { allow: [repoDir] },
  },
});
