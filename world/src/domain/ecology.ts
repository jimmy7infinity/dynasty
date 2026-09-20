import { clamp01, fbm, hash01, mixSeed } from "./noise.ts";
import {
  SEA_LEVEL,
  Stream,
  sampleHeightMeters,
  sampleMoisture,
  sampleSlope,
  waterDistance,
  type WorldIdentity,
} from "./world.ts";

export const Community = {
  Water: 0,
  Shore: 1,
  Riparian: 2,
  Meadow: 3,
  Forest: 4,
  SlopeWood: 5,
  Rock: 6,
  Alpine: 7,
} as const;

export type CommunityId = (typeof Community)[keyof typeof Community];

export type Site = {
  x: number;
  z: number;
  y: number;
  slope: number;
  moisture: number;
  water: number;
  canopy: number;
  community: CommunityId;
};

export function sampleCanopy(id: WorldIdentity, x: number, z: number): number {
  const stream = mixSeed(id.seed, Stream.Vegetation, 19, 0);
  return fbm(stream, x * 0.00055, z * 0.00055, 4);
}

export function sampleSite(id: WorldIdentity, x: number, z: number): Site {
    const y = sampleHeightMeters(id, x, z);
  const y2 = sampleHeightMeters(id, x + 4, z);
  const slope = Math.abs(y2 - y) / 4;
  const moisture = sampleMoisture(id, x, z);
  const water = waterDistance(id, x, z);
  const canopy = sampleCanopy(id, x, z);
  const community = classifyCommunity(y, slope, moisture, water, canopy);
  return { x, z, y, slope, moisture, water, canopy, community };
}

export function classifyCommunity(
  y: number,
  slope: number,
  moisture: number,
  water: number,
  canopy: number,
): CommunityId {
  if (y < SEA_LEVEL + 0.15) {
    return Community.Water;
  }
  if (y < 2.2 && water < 40) {
    return Community.Shore;
  }
  if (y > 255 || (y > 190 && slope > 0.55)) {
    return Community.Alpine;
  }
  if (slope > 0.85 || (y > 140 && slope > 0.62)) {
    return Community.Rock;
  }
  if (water < 38 && moisture > 0.42 && slope < 0.45) {
    return Community.Riparian;
  }
  if (slope > 0.38 && y > 55 && canopy > 0.42) {
    return Community.SlopeWood;
  }
  if (canopy > 0.52 && moisture > 0.32 && slope < 0.5 && y < 160) {
    return Community.Forest;
  }
  return Community.Meadow;
}

export function groundColor(site: Site): [number, number, number] {
  const mix = (a: readonly [number, number, number], b: readonly [number, number, number], t: number) => {
    const k = clamp01(t);
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k] as [number, number, number];
  };
  const wet: [number, number, number] = [0.18, 0.22, 0.14];
  switch (site.community) {
    case Community.Water:
      return [0.12, 0.22, 0.28];
    case Community.Shore:
      return mix([0.28, 0.26, 0.18], wet, 0.55);
    case Community.Riparian:
      return mix([0.2, 0.32, 0.12], wet, site.moisture);
    case Community.Meadow:
      return mix([0.45, 0.52, 0.22], [0.22, 0.38, 0.14], site.moisture);
    case Community.Forest:
      return mix([0.16, 0.28, 0.1], [0.12, 0.2, 0.08], site.moisture);
    case Community.SlopeWood:
      return [0.28, 0.3, 0.16];
    case Community.Rock:
      return mix([0.42, 0.38, 0.32], [0.55, 0.52, 0.48], clamp01((site.y - 80) / 180));
    case Community.Alpine:
      return mix([0.55, 0.52, 0.48], [0.86, 0.88, 0.9], clamp01((site.y - 200) / 80));
    default: {
      const _never: never = site.community;
      return _never;
    }
  }
}

export const Prop = {
  Oak: 0,
  Pine: 1,
  Birch: 2,
  Shrub: 3,
  Grass: 4,
  Flower: 5,
  Rock: 6,
  Log: 7,
  Cottage: 8,
} as const;

export type PropId = (typeof Prop)[keyof typeof Prop];

export type PropRoll = {
  prop: PropId;
  yaw: number;
  sx: number;
  sy: number;
  sz: number;
};

export function rollProp(id: WorldIdentity, site: Site): PropRoll | null {
  if (site.community === Community.Water || site.y < 0.35) {
    return null;
  }
  const h = mixSeed(id.seed, Stream.Vegetation, Math.floor(site.x * 0.35), Math.floor(site.z * 0.35));
  const n = hash01(h);
  const yaw = hash01(h ^ 11) * 6.283185;
  switch (site.community) {
    case Community.Shore:
      if (n < 0.08) {
        return scaleRoll(Prop.Rock, yaw, 0.6 + hash01(h ^ 2) * 1.4, 0.7);
      }
      if (n < 0.16) {
        return scaleRoll(Prop.Grass, yaw, 0.7 + hash01(h ^ 4) * 0.5, 1);
      }
      return null;
    case Community.Riparian:
      if (n < 0.07) {
        return scaleRoll(Prop.Birch, yaw, 0.85 + hash01(h ^ 2) * 0.5, 1);
      }
      if (n < 0.12) {
        return scaleRoll(Prop.Oak, yaw, 0.7 + hash01(h ^ 3) * 0.4, 1);
      }
      if (n < 0.28) {
        return scaleRoll(Prop.Shrub, yaw, 0.8 + hash01(h ^ 5) * 0.6, 1);
      }
      if (n < 0.55) {
        return scaleRoll(Prop.Grass, yaw, 0.8 + hash01(h ^ 6) * 0.7, 1);
      }
      if (n < 0.68) {
        return scaleRoll(Prop.Flower, yaw, 0.7 + hash01(h ^ 7) * 0.8, 1);
      }
      if (n < 0.74) {
        return scaleRoll(Prop.Rock, yaw, 0.4 + hash01(h ^ 8) * 0.8, 0.8);
      }
      return null;
    case Community.Meadow:
      if (n < 0.035 && site.water > 40 && site.slope < 0.22) {
        return scaleRoll(Prop.Oak, yaw, 0.55 + hash01(h ^ 2) * 0.45, 1);
      }
      if (n < 0.12) {
        return scaleRoll(Prop.Shrub, yaw, 0.55 + hash01(h ^ 3) * 0.5, 1);
      }
      if (n < 0.62) {
        return scaleRoll(Prop.Grass, yaw, 0.7 + hash01(h ^ 4) * 0.9, 1);
      }
      if (n < 0.78) {
        return scaleRoll(Prop.Flower, yaw, 0.65 + hash01(h ^ 5) * 0.9, 1);
      }
      if (n < 0.82) {
        return scaleRoll(Prop.Rock, yaw, 0.35 + hash01(h ^ 6) * 0.7, 0.85);
      }
      return null;
    case Community.Forest:
      if (n < 0.28) {
        return scaleRoll(Prop.Oak, yaw, 0.9 + hash01(h ^ 2) * 0.7, 1);
      }
      if (n < 0.36) {
        return scaleRoll(Prop.Birch, yaw, 0.8 + hash01(h ^ 3) * 0.5, 1);
      }
      if (n < 0.42) {
        return scaleRoll(Prop.Pine, yaw, 0.75 + hash01(h ^ 4) * 0.45, 1);
      }
      if (n < 0.58) {
        return scaleRoll(Prop.Shrub, yaw, 0.7 + hash01(h ^ 5) * 0.5, 1);
      }
      if (n < 0.78) {
        return scaleRoll(Prop.Grass, yaw, 0.5 + hash01(h ^ 6) * 0.5, 1);
      }
      if (n < 0.84) {
        return scaleRoll(Prop.Log, yaw, 0.8 + hash01(h ^ 7) * 0.6, 1);
      }
      if (n < 0.9) {
        return scaleRoll(Prop.Rock, yaw, 0.4 + hash01(h ^ 8) * 0.7, 0.8);
      }
      return null;
    case Community.SlopeWood:
      if (n < 0.22) {
        return scaleRoll(Prop.Pine, yaw, 0.7 + hash01(h ^ 2) * 0.55, 1);
      }
      if (n < 0.3) {
        return scaleRoll(Prop.Oak, yaw, 0.55 + hash01(h ^ 3) * 0.35, 1);
      }
      if (n < 0.48) {
        return scaleRoll(Prop.Shrub, yaw, 0.6 + hash01(h ^ 4) * 0.45, 1);
      }
      if (n < 0.58) {
        return scaleRoll(Prop.Rock, yaw, 0.7 + hash01(h ^ 5) * 1.2, 0.75);
      }
      if (n < 0.7) {
        return scaleRoll(Prop.Grass, yaw, 0.5 + hash01(h ^ 6) * 0.4, 1);
      }
      return null;
    case Community.Rock:
      if (n < 0.22) {
        return scaleRoll(Prop.Rock, yaw, 0.8 + hash01(h ^ 2) * 1.8, 0.7);
      }
      if (n < 0.3) {
        return scaleRoll(Prop.Shrub, yaw, 0.4 + hash01(h ^ 3) * 0.35, 1);
      }
      if (n < 0.34) {
        return scaleRoll(Prop.Pine, yaw, 0.45 + hash01(h ^ 4) * 0.3, 1);
      }
      return null;
    case Community.Alpine:
      if (n < 0.12) {
        return scaleRoll(Prop.Rock, yaw, 0.5 + hash01(h ^ 2) * 1.1, 0.8);
      }
      if (n < 0.18) {
        return scaleRoll(Prop.Shrub, yaw, 0.35 + hash01(h ^ 3) * 0.25, 1);
      }
      return null;
    default: {
      const _never: never = site.community;
      return _never;
    }
  }
}

function scaleRoll(prop: PropId, yaw: number, s: number, squash: number): PropRoll {
  return { prop, yaw, sx: s, sy: s * squash, sz: s };
}

export function rollCottage(id: WorldIdentity, x: number, z: number, site: Site): PropRoll | null {
  if (site.community !== Community.Meadow && site.community !== Community.Riparian) {
    return null;
  }
  if (site.water < 30 || site.water > 140 || site.slope > 0.22 || site.y < 6 || site.y > 40) {
    return null;
  }
  const h = mixSeed(id.seed, Stream.Structure, Math.floor(x / 220), Math.floor(z / 220));
  if (hash01(h) > 0.018) {
    return null;
  }
  return {
    prop: Prop.Cottage,
    yaw: hash01(h ^ 21) * 6.283185,
    sx: 1.1 + hash01(h ^ 27) * 0.35,
    sy: 1,
    sz: 1.1 + hash01(h ^ 31) * 0.25,
  };
}
