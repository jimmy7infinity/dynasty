import { describe, expect, it } from "vitest";
import { DEFAULT_SEED, fingerprint, generateWorld } from "./worldgen.ts";

describe("generateWorld", () => {
  it("is deterministic for the same seed", () => {
    const a = generateWorld(DEFAULT_SEED);
    const b = generateWorld(DEFAULT_SEED);
    expect(fingerprint(a)).toBe(fingerprint(b));
    expect(a.trees.length).toBe(b.trees.length);
    expect(a.rivers.length).toBe(b.rivers.length);
    expect(a.spawn).toEqual(b.spawn);
  });

  it("changes when the seed changes", () => {
    const a = generateWorld(DEFAULT_SEED);
    const b = generateWorld(DEFAULT_SEED + 1);
    expect(fingerprint(a)).not.toBe(fingerprint(b));
  });

  it("produces ocean, land, rivers, and more than one biome", () => {
    const world = generateWorld(DEFAULT_SEED);
    const biomeSet = new Set(world.biomes);
    expect(biomeSet.size).toBeGreaterThanOrEqual(4);
    expect(world.rivers.length).toBeGreaterThan(0);
    expect(world.trees.length).toBeGreaterThan(80);
    expect(world.structures.length).toBeGreaterThan(0);
    expect(world.spawn.y).toBeGreaterThan(world.seaLevel);
  });
});
