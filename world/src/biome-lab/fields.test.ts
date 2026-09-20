import { describe, expect, it } from "vitest";
import { DEFAULT_SEED, GENERATION_VERSION, type WorldIdentity } from "../domain/world.ts";
import {
  CHANNEL_DEPTH,
  channelHalfWidth,
  confluenceZ,
  groundColor,
  riverHalfWidth,
  riverX,
  sampleField,
  sampleLabHeight,
  sampleMoisture,
  scrubDensity,
  shoreDist,
  terrainBase,
  treeDensity,
  tributaryStrength,
  tributaryX,
  waterLevel,
} from "./fields.ts";

const id: WorldIdentity = { seed: DEFAULT_SEED, generationVersion: GENERATION_VERSION };
const alt: WorldIdentity = { seed: DEFAULT_SEED ^ 0x5bf03635, generationVersion: GENERATION_VERSION };

/** Zone shares over the patch the lab actually builds. */
function census(world: WorldIdentity, cx: number, cz: number): Record<string, number> {
  const counts: Record<string, number> = { desert: 0, valley: 0, forest: 0, coast: 0, alpine: 0 };
  let n = 0;
  for (let z = cz - 900; z <= cz + 900; z += 30) {
    for (let x = cx - 900; x <= cx + 900; x += 30) {
      const f = sampleField(world, x, z);
      n += 1;
      if (f.coast > 0.6) {
        counts.coast += 1;
      } else if (f.height > 120) {
        counts.alpine += 1;
      } else if (f.side < -140) {
        counts.desert += 1;
      } else if (f.side < 70) {
        counts.valley += 1;
      } else {
        counts.forest += 1;
      }
    }
  }
  for (const k of Object.keys(counts)) {
    counts[k] /= n;
  }
  return counts;
}

describe("lab climate fields", () => {
  it("is deterministic", () => {
    const a = sampleField(id, 40, -80);
    const b = sampleField({ ...id }, 40, -80);
    expect(b.height).toBe(a.height);
    expect(b.moisture).toBe(a.moisture);
    expect(b.forest).toBe(a.forest);
    expect(b.arid).toBe(a.arid);
  });

  it("puts rain shadow west of the river and humidity east", () => {
    const z = 0;
    const rx = riverX(id, z);
    const west = sampleMoisture(id, rx - 220, z);
    const east = sampleMoisture(id, rx + 180, z);
    expect(east).toBeGreaterThan(west + 0.12);
  });

  it("grows forest from moisture, not a painted rectangle", () => {
    const z = 40;
    const rx = riverX(id, z);
    const aridSite = sampleField(id, rx - 90, z);
    const forestSite = sampleField(id, rx + 240, z);
    expect(aridSite.arid).toBeGreaterThan(aridSite.forest);
    expect(forestSite.forest).toBeGreaterThan(aridSite.forest);
    expect(treeDensity(forestSite)).toBeGreaterThan(treeDensity(aridSite));
  });

  it("raises compact massifs west of the river without swallowing the patch", () => {
    const zc = confluenceZ(id);
    let summit = -Infinity;
    let summitSide = 0;
    for (let z = zc - 600; z <= zc + 900; z += 25) {
      for (let side = -900; side <= -80; side += 25) {
        const h = sampleLabHeight(id, riverX(id, z) + side, z);
        if (h > summit) {
          summit = h;
          summitSide = side;
        }
      }
    }
    // A real range, west of the water, standing well above the valley floor.
    expect(summit).toBeGreaterThan(150);
    expect(summitSide).toBeLessThan(-150);
    expect(summit).toBeGreaterThan(sampleLabHeight(id, riverX(id, zc) + 40, zc) + 100);

    // But a corner feature, not a belt: a previous belt made 24% of the patch alpine.
    const share = census(id, riverX(id, 0), 0);
    expect(share.alpine).toBeLessThan(0.12);
  });

  it("keeps the arid plain above the valley floor and gently sloped", () => {
    const z = 60;
    const rx = riverX(id, z);
    expect(terrainBase(id, rx - 520, z)).toBeGreaterThan(terrainBase(id, rx + 20, z));
    // Massif flanks are meant to be steep, so measure the plain itself.
    let steep = 0;
    let n = 0;
    for (let zz = -300; zz <= 300; zz += 40) {
      for (let side = -820; side <= -180; side += 20) {
        const f = sampleField(id, riverX(id, zz) + side, zz);
        if (f.height > 90) {
          continue;
        }
        n += 1;
        if (f.slope > 0.7) {
          steep += 1;
        }
      }
    }
    expect(n).toBeGreaterThan(100);
    // Formations are allowed; a wall of gold cliff is not.
    expect(steep / n).toBeLessThan(0.2);
  });

  it("pinches and pools the river instead of running it at one width", () => {
    const widths: number[] = [];
    for (let z = -700; z <= 700; z += 10) {
      widths.push(riverHalfWidth(id, z) * 2);
    }
    const mean = widths.reduce((a, b) => a + b, 0) / widths.length;
    const min = Math.min(...widths);
    const max = Math.max(...widths);
    // Measured on the reference trunk: 7 m in the riffles to 55 m in the pools,
    // mean ~25 m. Narrow reaches run 13-24 m with one 8 px outlier row. A near-
    // uniform channel is what made the water read as a drawn line.
    expect(mean).toBeGreaterThan(17);
    expect(mean).toBeLessThan(34);
    expect(min).toBeLessThan(18);
    expect(max).toBeGreaterThan(44);
    expect(max).toBeLessThan(64);
    // And it has to keep pinching, not just widen once from end to end.
    let reversals = 0;
    for (let i = 2; i < widths.length; i += 1) {
      const a = widths[i - 1] - widths[i - 2];
      const b = widths[i] - widths[i - 1];
      if (a * b < 0) {
        reversals += 1;
      }
    }
    expect(reversals).toBeGreaterThan(6);
  });

  it("floats the water surface between bed and bank", () => {
    for (let z = -500; z <= 500; z += 50) {
      const cx = riverX(id, z);
      const level = waterLevel(id, z, cx);
      const bed = sampleLabHeight(id, cx, z);
      const bank = sampleLabHeight(id, cx + channelHalfWidth(id, cx, z) * 3.2, z);
      expect(level).toBeGreaterThan(bed);
      expect(level).toBeLessThan(bank);
      expect(bed).toBeCloseTo(terrainBase(id, cx, z) - CHANNEL_DEPTH, 5);
    }
  });

  it("joins the tributary to the trunk at the confluence", () => {
    const zc = confluenceZ(id);
    expect(tributaryStrength(id, zc)).toBeLessThan(0.05);
    expect(tributaryStrength(id, zc - 300)).toBeGreaterThan(0.5);
    // Upstream it sits well west of the trunk; at the join it meets it.
    const far = zc - 400;
    expect(riverX(id, far) - tributaryX(id, far)).toBeGreaterThan(150);
    expect(Math.abs(tributaryX(id, zc) - riverX(id, zc))).toBeLessThan(40);
  });

  it("runs the shoreline as a diagonal so the sea stays a corner", () => {
    expect(shoreDist(id, 600)).toBeGreaterThan(shoreDist(id, -600) + 400);
  });

  it("thins canopy from forest to transition to desert", () => {
    const z = -120;
    const rx = riverX(id, z);
    const core = sampleField(id, rx + 320, z);
    const fringe = sampleField(id, rx + 60, z);
    const desert = sampleField(id, rx - 420, z);
    expect(treeDensity(core)).toBeGreaterThan(treeDensity(fringe));
    expect(treeDensity(fringe)).toBeGreaterThan(treeDensity(desert));
    // Scrub runs the other way: it is the desert's ground cover, not the forest's.
    expect(scrubDensity(desert)).toBeGreaterThan(scrubDensity(core));
  });

  it("never paints ground brighter than the reference ivory cap", () => {
    // Brightest pixel anywhere in the reference is #dfd2b6; snow reads #ebd7be.
    for (let z = -700; z <= 700; z += 70) {
      for (let x = -900; x <= 900; x += 70) {
        const c = groundColor(sampleField(id, x, z));
        for (const ch of c) {
          expect(ch).toBeLessThanOrEqual(0.93);
        }
      }
    }
  });

  it("gives a different seed the same world, not the same frame", () => {
    const a = census(id, riverX(id, 0), 0);
    const b = census(alt, riverX(alt, 0), 0);
    // Both frames carry both biomes and a coast in comparable measure.
    for (const zone of ["desert", "forest"] as const) {
      expect(a[zone]).toBeGreaterThan(0.15);
      expect(b[zone]).toBeGreaterThan(0.15);
    }
    expect(b.alpine).toBeLessThan(0.12);
    // And they are genuinely different terrain.
    expect(sampleLabHeight(alt, 120, -60)).not.toBeCloseTo(sampleLabHeight(id, 120, -60), 2);
  });
});
