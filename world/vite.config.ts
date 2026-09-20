import { defineConfig } from "vitest/config";

export default defineConfig({
  root: ".",
  server: { port: 5174 },
  test: {
    include: ["src/domain/**/*.test.ts", "src/biome-lab/**/*.test.ts"],
  },
});
