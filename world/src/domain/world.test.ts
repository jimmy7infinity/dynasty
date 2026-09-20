import { describe, expect, it } from "vitest";
import { ART_SEEDS, GENERATION_VERSION, findLandSpawn, sampleHeightMeters, type WorldIdentity } from "./world.ts";
import { sampleSite } from "./ecology.ts";
import { fillInstances } from "./instances.ts";
import { buildPatchData } from "./patch.ts";

const id: WorldIdentity = { seed: ART_SEEDS[0], generationVersion: GENERATION_VERSION };

describe("valley world", () => {
  it("is deterministic", () => {
    const a = sampleHeightMeters(id, 80, -120);
    expect(sampleHeightMeters({ ...id }, 80, -120)).toBe(a);
    expect(sampleHeightMeters({ seed: 12, generationVersion: GENERATION_VERSION }, 80, -120)).not.toBe(a);
  });

  it("spawns on land above water", () => {
    const s = findLandSpawn(id);
    expect(s.y).toBeGreaterThan(3);
  });

  it("keeps patch seams", () => {
    const left = buildPatchData(id, 0, 0, 128, 9);
    const right = buildPatchData(id, 128, 0, 128, 9);
    const i = 8;
    expect(left.positions[(i * 9 + 8) * 3]).toBeCloseTo(right.positions[i * 9 * 3], 5);
    expect(left.positions[(i * 9 + 8) * 3 + 1]).toBeCloseTo(right.positions[i * 9 * 3 + 1], 5);
  });

  it("fills instances without Three", () => {
    const fill = fillInstances(id, 0, 0, 2000, 180);
    const total = fill.counts.reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThan(20);
    expect(fill.buffers[0].length % 16).toBe(0);
  });

  it("classifies sites stably", () => {
    const a = sampleSite(id, 40, 10);
    const b = sampleSite(id, 40, 10);
    expect(a.community).toBe(b.community);
    expect(a.y).toBe(b.y);
  });
});
