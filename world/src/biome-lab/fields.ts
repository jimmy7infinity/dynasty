import { clamp01, fbm, mixSeed, ridge } from "../domain/noise.ts";
import { meanderX, type WorldIdentity } from "../domain/world.ts";

const Lab = {
  River: 101,
  Height: 102,
  Moisture: 103,
  Canopy: 104,
  Rock: 105,
  Tributary: 106,
  Wash: 107,
  Reef: 108,
  Clump: 109,
} as const;

export const SEA_LEVEL = 0;

function smoother(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function riverX(id: WorldIdentity, z: number): number {
  const stream = mixSeed(id.seed, Lab.River, id.generationVersion, 0);
  const phase = fbm(stream, 0.17, 0.31, 2) * 6.28;
  return (
    meanderX(id, z) +
    Math.sin(z * 0.0072 + phase) * 78 +
    Math.sin(z * 0.018 + phase * 0.4) * 22 +
    (fbm(stream + 3, z * 0.0034, 0.22, 3) - 0.5) * 36 +
    // Shorter-wavelength wander: two sines alone give an obviously periodic snake,
    // while the reference changes direction irregularly between bends.
    (fbm(stream + 5, z * 0.011, 0.7, 3) - 0.5) * 30
  );
}

/**
 * Measured across the reference trunk: 8 px narrowest to 65 px widest, mean 28.6,
 * against a ~1.15 px/m scale. So the channel runs ~7 m in the riffles to ~55 m in
 * the pools, an 8x swing, and the wide reaches recur about every 175 m. A near
 * constant 25 m width is most of why the lab river read as a drawn line: rivers are
 * legible because they pinch and pool, not because they are wide.
 */
export function riverHalfWidth(id: WorldIdentity, z: number): number {
  const stream = mixSeed(id.seed, Lab.River, id.generationVersion, 1);
  const phase = fbm(stream, 0.11, 0.73, 2) * 6.28;
  // The reference holds a width for 60-100 m before changing, so this wants plateaus
  // rather than an oscillation. A plain sine produced a string of beads: every pool
  // the same size, every pinch nearly closing the channel.
  const along =
    Math.sin(z * 0.036 + phase) * 0.45 +
    Math.sin(z * 0.018 + phase * 1.3) * 0.4 +
    Math.sin(z * 0.055 + phase * 0.5) * 0.15 +
    (fbm(stream + 4, z * 0.0062, 0.41, 3) - 0.5) * 0.4;
  const pool = smoother(-0.3, 0.3, along);
  return 7.5 + pool * 19;
}

/** Where the west tributary meets the trunk. Rivers in the reference fork. */
export function confluenceZ(id: WorldIdentity): number {
  const stream = mixSeed(id.seed, Lab.Tributary, id.generationVersion, 0);
  return -150 + (fbm(stream, 0.63, 0.17, 2) - 0.5) * 220;
}

export function tributaryX(id: WorldIdentity, z: number): number {
  const stream = mixSeed(id.seed, Lab.Tributary, id.generationVersion, 1);
  const zc = confluenceZ(id);
  const run = zc - z;
  return (
    riverX(id, zc) -
    run * (0.78 + fbm(stream, 0.3, 0.9, 2) * 0.5) +
    Math.sin(z * 0.016 + 1.4) * 26 +
    (fbm(stream + 2, z * 0.0048, 0.55, 3) - 0.5) * 44
  );
}

/** Tributary only exists upstream of the confluence, and fades in at its head. */
export function tributaryStrength(id: WorldIdentity, z: number): number {
  const zc = confluenceZ(id);
  const run = zc - z;
  return smoother(0, 90, run) * (1 - smoother(620, 900, run));
}

export function waterDist(id: WorldIdentity, x: number, z: number): number {
  const trunk = Math.abs(x - riverX(id, z));
  const strength = tributaryStrength(id, z);
  if (strength <= 0) {
    return trunk;
  }
  const branch = Math.abs(x - tributaryX(id, z)) / Math.max(0.25, strength);
  return Math.min(trunk, branch);
}

/**
 * Which way the channel leans, from the curvature of its own centreline. A pool that
 * widens evenly to both sides reads as a bead on a string; the reference widens on
 * the outside of each bend and leaves a bar on the inside, which is also what a real
 * channel does. Positive means the +x side is the outside.
 */
export function riverSkew(id: WorldIdentity, z: number): number {
  const c = riverX(id, z);
  const curv = riverX(id, z + 45) - 2 * c + riverX(id, z - 45);
  return Math.max(-0.42, Math.min(0.42, -curv * 0.024));
}

/**
 * Symmetric channel half-width for carving and distance checks. Bend skew is kept
 * out of this path: riverSkew calls riverX three times per sample and sampleLabHeight
 * runs on every lattice point, which pushed the census loops past the test timeout.
 */
export function channelHalfWidth(id: WorldIdentity, x: number, z: number): number {
  const trunkW = riverHalfWidth(id, z);
  const strength = tributaryStrength(id, z);
  if (strength <= 0) {
    return trunkW;
  }
  const trunk = Math.abs(x - riverX(id, z));
  const branch = Math.abs(x - tributaryX(id, z)) / Math.max(0.25, strength);
  return branch < trunk ? trunkW * 0.62 : trunkW;
}

/** Bank width follows bend skew so pools widen on the outside and leave a bar inside. */
export function bankChannelHalfWidth(id: WorldIdentity, x: number, z: number): number {
  const side = x - riverX(id, z);
  const skew = riverSkew(id, z);
  const trunkW = riverHalfWidth(id, z) * (1 + (side >= 0 ? skew : -skew));
  const strength = tributaryStrength(id, z);
  if (strength <= 0) {
    return trunkW;
  }
  const trunk = Math.abs(side);
  const branch = Math.abs(x - tributaryX(id, z)) / Math.max(0.25, strength);
  return branch < trunk ? trunkW * 0.62 : trunkW;
}

/**
 * The reference ocean sits only in the north-east corner and recedes going south,
 * so the shoreline is a diagonal rather than a band at fixed distance from the
 * river. Shared by the height field and the biome weights so the sand strip lands
 * on the actual waterline.
 */
export function shoreDist(id: WorldIdentity, z: number): number {
  const stream = mixSeed(id.seed, Lab.River, id.generationVersion, 2);
  return 900 + z * 0.6 + (fbm(stream, z * 0.0031, 0.44, 3) - 0.5) * 210;
}

export function coastT(id: WorldIdentity, x: number, z: number): number {
  const side = x - riverX(id, z);
  const s = shoreDist(id, z);
  return smoother(s - 70, s + 230, side);
}

/**
 * Massifs are conical envelopes multiplied by ridged noise, which is what breaks
 * the flanks into the radiating spurs and gullies the reference shows. A single
 * smooth cone reads as a gold ramp.
 */
function massif(stream: number, side: number, z: number, cx: number, cz: number, radius: number, peak: number): number {
  const d = Math.hypot(side - cx, (z - cz) * 0.85);
  if (d > radius) {
    return 0;
  }
  const cone = (1 - d / radius) ** 1.65;
  const spurs = ridge(stream, side * 0.0042, z * 0.0042, 4);
  const coarse = ridge(stream + 7, side * 0.0016, z * 0.0016, 3);
  return cone * peak * (0.42 + coarse * 0.44 + spurs * 0.34);
}

export const CHANNEL_DEPTH = 3.4;

/**
 * Terrain before the river is cut into it. Kept separate so the water surface can
 * be placed relative to the un-notched valley: deriving it from the notched height
 * left the ribbon 4 m below its own banks, which is what made the river render as
 * a dashed line in a slot.
 */
export function terrainBase(id: WorldIdentity, x: number, z: number): number {
  const stream = mixSeed(id.seed, Lab.Height, id.generationVersion, 0);
  const side = x - riverX(id, z);

  let h = 8 + (fbm(stream + 8, x * 0.0028, z * 0.0028, 4) - 0.5) * 7;

  // West: a broad gently rising plain, not a mountain belt. Reference desert is a
  // plain with isolated formations; the belt made 24% of the patch alpine.
  const westT = smoother(-20, -640, side);
  h += westT * (28 + (fbm(stream + 5, x * 0.0012, z * 0.0012, 4) - 0.5) * 34);
  // Broad low swells only. The reference's sharp desert formations are objects
  // sitting on a gentle plain, so they belong to the rock instances, not here.
  h += smoother(-30, -280, side) * Math.max(0, ridge(stream + 6, x * 0.0022, z * 0.002, 3) - 0.58) * 2 * 22;

  // Two compact massifs west of the water: one near the confluence latitude, one
  // upstream, so the range reads as a corner feature rather than a wall. They have
  // to stand well clear of the river: in the reference a wide gold plain separates
  // the water from the range, and massifs reaching to the bank both swallow that
  // plain and put a snowfield where the reference has gold.
  const zc = confluenceZ(id);
  h +=
    massif(stream + 11, side, z, -560, zc + 20, 215, 250) +
    massif(stream + 12, side, z, -840, zc - 330, 195, 185);

  // East: rolling forested hills out to the shoreline.
  const east = Math.max(0, side);
  h += smoother(40, 210, east) * (fbm(stream + 9, x * 0.0033, z * 0.0033, 4) - 0.32) * 54;

  const t = coastT(id, x, z);
  return h * (1 - t) - 30 * t * t;
}

export function sampleLabHeight(id: WorldIdentity, x: number, z: number): number {
  const base = terrainBase(id, x, z);
  const w = waterDist(id, x, z);
  const half = channelHalfWidth(id, x, z);
  const outer = half * 2.7;
  if (w >= outer) {
    return base;
  }
  // Flat bed out to the waterline, then up to the bank over the same again.
  const bed = base - CHANNEL_DEPTH;
  if (w <= half) {
    return bed;
  }
  const t = (w - half) / (outer - half);
  return bed + (base - bed) * (t * t * (3 - 2 * t));
}

/** Water surface: below the bank top, above the bed. */
export function waterLevel(id: WorldIdentity, z: number, centerX: number): number {
  return terrainBase(id, centerX, z) - CHANNEL_DEPTH * 0.42;
}

export function sampleMoisture(id: WorldIdentity, x: number, z: number): number {
  const stream = mixSeed(id.seed, Lab.Moisture, id.generationVersion, 0);
  const side = x - riverX(id, z);
  const riverM = Math.exp(-waterDist(id, x, z) / 85);
  // Onshore air is humid well before the shoreline, so this has to saturate close
  // to the river. Ramping it over 320 m left the near-east bank at 0.15 moisture
  // and therefore treeless.
  const coastM = smoother(20, 260, side);
  const shadow = smoother(40, 260, -side);
  const n = fbm(stream, x * 0.0026, z * 0.0026, 4);
  return clamp01(riverM * 0.34 + coastM * 0.62 - shadow * 0.6 + (n - 0.45) * 0.22);
}

export type Grad = { dx: number; dz: number; slope: number };

export function sampleGrad(id: WorldIdentity, x: number, z: number, e = 5): Grad {
  const dx = (sampleLabHeight(id, x + e, z) - sampleLabHeight(id, x - e, z)) / (2 * e);
  const dz = (sampleLabHeight(id, x, z + e) - sampleLabHeight(id, x, z - e)) / (2 * e);
  return { dx, dz, slope: Math.hypot(dx, dz) };
}

export function sampleSlope(id: WorldIdentity, x: number, z: number): number {
  return sampleGrad(id, x, z).slope;
}

/**
 * Sun sits west and slightly south, so slopes whose height rises with x face it.
 * Used for snow streaks, which the reference puts on sunlit spines rather than in
 * a clean elevation band.
 */
export function sunFacing(grad: Grad): number {
  return clamp01(0.5 + grad.dx * 1.1 - grad.dz * 0.35);
}

export type FieldSample = {
  height: number;
  moisture: number;
  slope: number;
  dx: number;
  dz: number;
  water: number;
  side: number;
  arid: number;
  forest: number;
  riparian: number;
  alpine: number;
  coast: number;
  bank: number;
  snow: number;
  canopyClump: number;
  clearing: number;
  rockClump: number;
  wash: number;
};

/**
 * `grad` and `height` can be supplied by callers that already have them on a
 * lattice, which avoids four extra height samples per point.
 */
export function sampleField(
  id: WorldIdentity,
  x: number,
  z: number,
  grad?: Grad,
  knownHeight?: number,
): FieldSample {
  const height = knownHeight ?? sampleLabHeight(id, x, z);
  const moisture = sampleMoisture(id, x, z);
  const g = grad ?? sampleGrad(id, x, z);
  const water = waterDist(id, x, z);
  const side = x - riverX(id, z);

  const canopyStream = mixSeed(id.seed, Lab.Canopy, id.generationVersion, 0);
  const clumpStream = mixSeed(id.seed, Lab.Clump, id.generationVersion, 0);
  // Measured 25-70 m crown groups in the reference transition crop: dominant wavelength
  // ~40-90 m, so two octaves at ~71 m and ~45 m land clumps and gaps in range.
  const canopyClump =
    fbm(clumpStream, x * 0.014, z * 0.014, 4) * 0.55 + fbm(clumpStream + 11, x * 0.022, z * 0.022, 3) * 0.45;
  // A second, tighter scale punches the amoeba clearings inside closed canopy.
  const clearing = fbm(canopyStream + 31, x * 0.0125, z * 0.0125, 3);
  const rockClump = fbm(mixSeed(id.seed, Lab.Rock, id.generationVersion, 0), x * 0.0065, z * 0.0065, 3);
  // Braided dry channels, used for scrub placement. Gully *colour* is the 2-4 m
  // strokes in groundtex.ts; vertex spacing cannot draw them.
  const washStream = mixSeed(id.seed, Lab.Wash, id.generationVersion, 0);
  const wash = Math.max(0, ridge(washStream, x * 0.0042, z * 0.0011, 4) - 0.52) * 2.1;

  const alpine = smoother(120, 178, height);
  const coast = coastT(id, x, z);
  const halfW = bankChannelHalfWidth(id, x, z);
  // Bank width scales with the channel, so pools get broad ochre bars and riffles a
  // thin rim. This used to be gated on height below 22 m, which silently removed the
  // bank everywhere the river crosses the 50-80 m desert plain, i.e. most of its run.
  const bank = smoother(halfW * 3.4, halfW * 1.02, water);
  // Snow only on the top of the tallest massif. At a 150 m snowline it spread across
  // the whole range as a flat pale wedge; the reference caps one peak and no more.
  const snow = smoother(206, 252, height) * smoother(0.3, 0.7, ridge(canopyStream + 5, x * 0.006, z * 0.006, 3));

  const riparian =
    smoother(120, 26, water) * (1 - alpine) * smoother(1.1, 3.5, height) * (1 - smoother(0.55, 0.95, g.slope));
  const land = (1 - riparian) * (1 - alpine) * (1 - coast);
  const rainShadow = smoother(55, 160, -side);
  const forest =
    land *
    (1 - rainShadow) *
    smoother(5, 135, side) *
    (1 - smoother(0.75, 1.2, g.slope)) *
    (0.4 + 0.6 * smoother(0.16, 0.42, moisture));
  const arid = land * Math.max(1 - smoother(0.22, 0.46, moisture), rainShadow);

  return {
    height,
    moisture,
    slope: g.slope,
    dx: g.dx,
    dz: g.dz,
    water,
    side,
    arid,
    forest,
    riparian,
    alpine,
    coast,
    bank,
    snow,
    canopyClump,
    clearing,
    rockClump,
    wash,
  };
}

// Measured albedos. Every value is the *lit* colour, because the toon bands only
// darken; hue never comes from the gradient map.
const GOLD_LIT: RGB = [0.906, 0.671, 0.333]; // #e7ab55, renders near #dca34e after toon (54% cluster)
const GOLD_SWALE: RGB = [0.643, 0.51, 0.259]; // #a48242, 23%: soft 50-130 m dune/swale lobes
const DESERT_ROCK: RGB = [0.412, 0.404, 0.361]; // #69675c, steep rock only
const GRASS_DRY: RGB = [0.553, 0.616, 0.241]; // #8d9d3d, measured open grass in transition crop
const GRASS_LUSH: RGB = [0.604, 0.631, 0.235]; // #9aa13c, measured lit open grass
const GRASS_OPEN: RGB = [0.561, 0.639, 0.247]; // #8fa33f, fringe grass between clumps
const FOREST_FLOOR: RGB = [0.325, 0.435, 0.216]; // #536f37
const CANOPY_FLOOR: RGB = [0.114, 0.196, 0.161]; // #1d3229, deep cool shade under closed canopy
const BANK_SAND: RGB = [0.82, 0.604, 0.322]; // #d19a52
const BANK_SILT: RGB = [0.514, 0.467, 0.267]; // #837744
const SHOAL_SAND: RGB = [0.847, 0.761, 0.565]; // #d8c290
const MTN_WARM: RGB = [0.569, 0.529, 0.302]; // #91874d
const MTN_COOL: RGB = [0.463, 0.478, 0.412]; // #767a69
const SNOW: RGB = [0.922, 0.843, 0.745]; // #ebd7be

type RGB = [number, number, number];

export function groundColor(field: FieldSample): RGB {
  const c: RGB = [...GRASS_DRY];
  const cover = treeDensity(field);

  // Arid side, three tiers from the 8× desert crop: bright gold base, soft swales,
  // thin gully lines. Gullies are 2-4 m and live in the baked detail map, not here.
  lerpIn(c, GOLD_LIT, field.arid);
  // rockClump is fbm at 0.0065 (~150 m). Gate high so only ~1/4 of the gold is
  // swale, then mix almost all the way to #a48242 — a 0.42 mix produced a 37%
  // halfway cluster (#bc8f45) instead of the measured 23% #a48242.
  lerpIn(c, GOLD_SWALE, field.arid * smoother(0.6, 0.78, field.rockClump) * 0.9);
  lerpIn(c, DESERT_ROCK, field.arid * smoother(0.55, 1.05, field.slope));

  // Humid side. Forest floor only under actual canopy; gaps read as bright grass.
  lerpIn(c, FOREST_FLOOR, field.forest * smoother(0.35, 0.72, cover));
  lerpIn(
    c,
    GRASS_OPEN,
    field.forest * (1 - smoother(0.22, 0.58, cover)) * (1 - field.coast * 0.4) * (1 - smoother(0.45, 0.85, cover) * 0.35),
  );
  lerpIn(c, GRASS_LUSH, field.riparian);

  // Coast: a narrow bright strip, then sand, then shoal.
  lerpIn(c, GRASS_LUSH, field.coast * smoother(0.55, 0.1, field.coast));
  lerpIn(c, SHOAL_SAND, smoother(0.55, 0.95, field.coast));

  // Alpine, then snow only on sunlit spines.
  const alpineMix = field.alpine * (1 - field.forest * 0.5);
  lerpIn(c, MTN_COOL, alpineMix * 0.85);
  lerpIn(c, MTN_WARM, alpineMix * sunFacing(field) * 0.9);
  lerpIn(c, SNOW, field.snow * (0.35 + 0.65 * sunFacing(field)));

  // River bank last so it always survives. Measured as a mottled bar rather than a
  // flat strip: light ochre #d19a52 alternating with silt #837744 out to ~35 m.
  const bankMottle = smoother(0.32, 0.7, field.rockClump);
  lerpIn(c, BANK_SAND, field.bank * 0.9 * (0.4 + 0.6 * bankMottle));
  lerpIn(c, BANK_SILT, field.bank * 0.62 * (1 - bankMottle));

  // Canopy occlusion. Under closed forest the reference floor is nearly black and
  // cool, and it is the single largest dark area in the humid half: 53% of forest
  // pixels sit at its darkest cluster. Cast shadows alone leave far too much lit
  // ground showing through the gaps between crowns. Shade follows actual cover so
  // open grass gaps stay bright.
  const shade = smoother(0.28, 0.72, cover) * (1 - field.coast);
  if (shade > 0) {
    lerpIn(c, CANOPY_FLOOR, shade);
  }
  return c;
}

function lerpIn(c: RGB, b: RGB, t: number): void {
  const k = clamp01(t);
  c[0] += (b[0] - c[0]) * k;
  c[1] += (b[1] - c[1]) * k;
  c[2] += (b[2] - c[2]) * k;
}

export type TreeFamily = "broadleaf" | "conifer" | "riparian" | "savanna" | "scrub";

/**
 * Coverage targets straight off the reference: 91% green in the forest core with
 * 22% deep shadow, 71% green in the transition with only 2% deep shadow, and 18%
 * green in the desert. So the transition has to be an isolated-crown regime, not
 * a thinned version of closed canopy.
 */
export function treeDensity(field: FieldSample): number {
  if (field.height < 1.3 || field.water < 11 || field.snow > 0.35) {
    return 0;
  }
  const slopeKeep = 1 - smoother(0.62, 1.2, field.slope);
  // Clumping carves real gaps at 25-70 m scale; low values are open grass, not thin canopy.
  const clump = smoother(0.18, 0.62, field.canopyClump);
  const gap = 1 - smoother(0.6, 0.8, field.canopyClump) * 0.96;
  const glade = 1 - smoother(0.55, 0.8, field.clearing) * 0.95;
  // Peak ~75% in the densest core; the gap term keeps bright grass patches between clumps.
  const closed = field.forest * clump * gap * glade * slopeKeep * 0.78;
  const gallery = field.riparian * 0.45 * smoother(0.35, 0.75, field.canopyClump);
  const fringe = field.arid * 0.03 * smoother(0.6, 0.86, field.canopyClump) * slopeKeep;
  // Timber climbs the moist flank and stops in a ragged line.
  const montane =
    field.alpine * (1 - smoother(0.3, 0.62, field.snow)) * smoother(0.22, 0.5, field.moisture) * 0.5 * slopeKeep;
  return clamp01(closed + gallery + fringe + montane);
}

export function familyWeights(field: FieldSample): Record<TreeFamily, number> {
  const nearWater = smoother(150, 40, field.water);
  const edge = smoother(0.55, 0.82, field.clearing);
  return {
    // Conifers favour water margins, clearing edges and altitude. The base stays low
    // because in the reference the closed forest is broadleaf; spires are accents at
    // margins, not an even sprinkle through the canopy.
    conifer: 0.08 + nearWater * 0.3 + edge * 0.35 + field.alpine * 0.8,
    broadleaf: 1.15 * field.forest + 0.25,
    riparian: field.riparian * 1.6 + nearWater * 0.5,
    // Bare-trunked trees only in the band where arid and forest overlap.
    savanna: Math.min(field.arid, field.forest + 0.28) * 2.4 + field.arid * 0.5,
    scrub: field.arid * 1.5 + field.alpine * 0.6 + 0.12,
  };
}

export function scrubDensity(field: FieldSample): number {
  if (field.height < 1.6 || field.water < 9 || field.snow > 0.4) {
    return 0;
  }
  // Measured desert speck density is ~1 per 1000 m2, so ~0.06 per candidate cell.
  const cluster = smoother(0.44, 0.78, field.rockClump);
  const alongWash = smoother(0.15, 0.6, field.wash);
  return clamp01(field.arid * (0.012 + 0.085 * cluster + 0.06 * alongWash) + field.alpine * 0.035 * cluster);
}

export function rockDensity(field: FieldSample): number {
  if (field.height < 2.5 || field.water < 14) {
    return 0;
  }
  const cluster = smoother(0.5, 0.79, field.rockClump);
  const steep = smoother(0.25, 0.8, field.slope);
  return clamp01(
    field.arid * (0.018 + 0.11 * steep) * cluster +
      field.alpine * 0.09 * cluster +
      field.bank * 0.05 * smoother(0.4, 0.75, field.rockClump),
  );
}

/** Offshore reef and stack chains, dense near the shore and thinning outward. */
export function reefDensity(id: WorldIdentity, x: number, z: number): number {
  const stream = mixSeed(id.seed, Lab.Reef, id.generationVersion, 0);
  const depth = -sampleLabHeight(id, x, z);
  if (depth < 0.4 || depth > 12) {
    return 0;
  }
  const chain = Math.max(0, ridge(stream, x * 0.0052, z * 0.0034, 3) - 0.48) * 1.9;
  return clamp01(chain * (1 - smoother(1.5, 11, depth)) * 0.55);
}

export function findLabSpawn(id: WorldIdentity): { x: number; y: number; z: number } {
  for (let i = 0; i < 160; i += 1) {
    const z = -280 + (i % 28) * 22;
    const x = riverX(id, z) + 52 + (i % 5) * 9;
    const f = sampleField(id, x, z);
    if (f.riparian > 0.3 && f.slope < 0.32 && f.height > 4 && f.height < 28) {
      return { x, y: f.height + 0.9, z };
    }
  }
  const z = 0;
  const x = riverX(id, z) + 55;
  return { x, y: sampleLabHeight(id, x, z) + 0.9, z };
}
