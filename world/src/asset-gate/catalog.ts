export type AssetKind = "tree" | "rock" | "plant";

export type CatalogEntry = {
  id: string;
  file: string;
  kind: AssetKind;
  reason: string;
};

/** Standard pack (68/116). Picks skip consecutive series indices on purpose. */
export const CATALOG: CatalogEntry[] = [
  { id: "CommonTree_1", file: "CommonTree_1.gltf", kind: "tree", reason: "broad round deciduous canopy" },
  { id: "CommonTree_3", file: "CommonTree_3.gltf", kind: "tree", reason: "mid deciduous, tighter crown" },
  { id: "CommonTree_5", file: "CommonTree_5.gltf", kind: "tree", reason: "smaller/younger deciduous silhouette" },
  { id: "Pine_1", file: "Pine_1.gltf", kind: "tree", reason: "tall conifer, classic spire" },
  { id: "Pine_3", file: "Pine_3.gltf", kind: "tree", reason: "fuller pine mass" },
  { id: "Pine_5", file: "Pine_5.gltf", kind: "tree", reason: "short pine / sapling scale" },
  { id: "TwistedTree_1", file: "TwistedTree_1.gltf", kind: "tree", reason: "gnarled trunk, irregular canopy" },
  { id: "TwistedTree_3", file: "TwistedTree_3.gltf", kind: "tree", reason: "twisted branching variant" },
  { id: "TwistedTree_5", file: "TwistedTree_5.gltf", kind: "tree", reason: "heaviest twisted silhouette" },
  { id: "DeadTree_1", file: "DeadTree_1.gltf", kind: "tree", reason: "bare branching, ridge language" },
  { id: "DeadTree_3", file: "DeadTree_3.gltf", kind: "tree", reason: "asymmetric dead snag" },
  { id: "DeadTree_5", file: "DeadTree_5.gltf", kind: "tree", reason: "compact dead tree" },
  { id: "Rock_Medium_1", file: "Rock_Medium_1.gltf", kind: "rock", reason: "medium boulder A" },
  { id: "Rock_Medium_2", file: "Rock_Medium_2.gltf", kind: "rock", reason: "medium boulder B, different mass" },
  { id: "Rock_Medium_3", file: "Rock_Medium_3.gltf", kind: "rock", reason: "medium boulder C, blockier" },
  { id: "Pebble_Round_1", file: "Pebble_Round_1.gltf", kind: "rock", reason: "pebble scatter A" },
  { id: "Pebble_Round_2", file: "Pebble_Round_2.gltf", kind: "rock", reason: "pebble scatter B" },
  { id: "Pebble_Round_3", file: "Pebble_Round_3.gltf", kind: "rock", reason: "pebble scatter C" },
  { id: "Pebble_Round_4", file: "Pebble_Round_4.gltf", kind: "rock", reason: "pebble scatter D" },
  { id: "Pebble_Round_5", file: "Pebble_Round_5.gltf", kind: "rock", reason: "pebble scatter E" },
  { id: "Bush_Common", file: "Bush_Common.gltf", kind: "plant", reason: "understory shrub" },
  { id: "Bush_Common_Flowers", file: "Bush_Common_Flowers.gltf", kind: "plant", reason: "flowering shrub" },
  { id: "Fern_1", file: "Fern_1.gltf", kind: "plant", reason: "forest-floor fern" },
  { id: "Grass_Common_Tall", file: "Grass_Common_Tall.gltf", kind: "plant", reason: "tall meadow grass" },
  { id: "Grass_Wispy_Short", file: "Grass_Wispy_Short.gltf", kind: "plant", reason: "short wispy grass" },
  { id: "Flower_3_Group", file: "Flower_3_Group.gltf", kind: "plant", reason: "meadow flower clump A" },
  { id: "Flower_4_Group", file: "Flower_4_Group.gltf", kind: "plant", reason: "meadow flower clump B" },
  { id: "Plant_1_Big", file: "Plant_1_Big.gltf", kind: "plant", reason: "broadleaf ground plant" },
];

export const TREE_IDS = CATALOG.filter((e) => e.kind === "tree").map((e) => e.id);
export const ROCK_IDS = CATALOG.filter((e) => e.kind === "rock").map((e) => e.id);
export const PLANT_IDS = CATALOG.filter((e) => e.kind === "plant").map((e) => e.id);

export const CAM_PRESETS = {
  close: 10,
  gameplay: 36,
  regional: 220,
  distant: 900,
} as const;

export type CamPreset = keyof typeof CAM_PRESETS;
export type TestId = "isolated" | "cluster" | "forest" | "mixed";
export type MatId = "source" | "controlled" | "toon";

export function parseTest(raw: string | null): TestId {
  switch (raw) {
    case "isolated":
    case "cluster":
    case "forest":
    case "mixed":
      return raw;
    default:
      return "isolated";
  }
}

export function parseMat(raw: string | null): MatId {
  switch (raw) {
    case "source":
    case "controlled":
    case "toon":
      return raw;
    default:
      return "source";
  }
}

export function parseCam(raw: string | null): CamPreset {
  switch (raw) {
    case "close":
    case "gameplay":
    case "regional":
    case "distant":
      return raw;
    default:
      return "gameplay";
  }
}
