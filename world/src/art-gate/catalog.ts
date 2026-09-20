export type PackId = "cizzy" | "fs" | "combined";
export type CamPreset = "gameplay" | "regional" | "distant" | "explore";
export type Kind = "tree" | "bush" | "grass" | "flower" | "rock" | "ivy" | "prop";

export type CatalogEntry = {
  id: string;
  pack: "cizzy7";
  category: string;
  file: string;
  kind: Kind;
  leaf: boolean;
  albedo: string;
  bark?: string;
  intended: string;
};

export const CAM_PRESETS: Record<CamPreset, number> = {
  gameplay: 36,
  regional: 220,
  distant: 900,
  explore: 36,
};

export const CIZZY: CatalogEntry[] = [
  {
    id: "Tree1_Mid",
    pack: "cizzy7",
    category: "large trees",
    file: "Tree1_MidBlend.fbx",
    kind: "tree",
    leaf: true,
    albedo: "LeafClump1.png",
    bark: "Bark1_Albedo.png",
    intended: "deciduous canopy mass",
  },
  {
    id: "Tree2_Mid",
    pack: "cizzy7",
    category: "large trees",
    file: "Tree2_MidBlend.fbx",
    kind: "tree",
    leaf: true,
    albedo: "LeafClump1.png",
    bark: "Bark1_Albedo.png",
    intended: "second deciduous silhouette",
  },
  {
    id: "Oak_Mid",
    pack: "cizzy7",
    category: "large trees",
    file: "OakTree2_MidBlend.fbx",
    kind: "tree",
    leaf: true,
    albedo: "LeafClump1.png",
    bark: "Bark2_Albedo.png",
    intended: "oak-like hero mass (mid)",
  },
  {
    id: "Birch_Mid",
    pack: "cizzy7",
    category: "small trees",
    file: "Tree4_MidBlend.fbx",
    kind: "tree",
    leaf: true,
    albedo: "BirchClump.png",
    bark: "Bark1_Albedo.png",
    intended: "birch / pale canopy",
  },
  {
    id: "Tree1_Hero",
    pack: "cizzy7",
    category: "large trees",
    file: "Tree1_High.fbx",
    kind: "tree",
    leaf: true,
    albedo: "LeafClump1.png",
    bark: "Bark1_Albedo.png",
    intended: "hero deciduous",
  },
  {
    id: "Oak_Hero",
    pack: "cizzy7",
    category: "large trees",
    file: "OakTree2_High.fbx",
    kind: "tree",
    leaf: true,
    albedo: "LeafClump1.png",
    bark: "Bark2_Albedo.png",
    intended: "hero oak",
  },
  {
    id: "Bush",
    pack: "cizzy7",
    category: "bushes",
    file: "Bush1.fbx",
    kind: "bush",
    leaf: true,
    albedo: "Leaf pattern Bush.png",
    intended: "forest-edge shrub",
  },
  {
    id: "LargeBush",
    pack: "cizzy7",
    category: "shrubs",
    file: "LargeBush_HighNew.fbx",
    kind: "bush",
    leaf: true,
    albedo: "Leaf pattern Bush.png",
    intended: "large understory",
  },
  {
    id: "Ivy",
    pack: "cizzy7",
    category: "ground plants",
    file: "LargeClump1.fbx",
    kind: "ivy",
    leaf: true,
    albedo: "Ivy.png",
    intended: "riverbank / rock drape",
  },
  {
    id: "Grass",
    pack: "cizzy7",
    category: "grass",
    file: "Grass1.fbx",
    kind: "grass",
    leaf: true,
    albedo: "GrassMask1.png",
    intended: "meadow / bank grass",
  },
  {
    id: "Weed",
    pack: "cizzy7",
    category: "ground plants",
    file: "Weed1V2.fbx",
    kind: "grass",
    leaf: true,
    albedo: "Weed1.png",
    intended: "tall weeds at water",
  },
  {
    id: "WhiteFlower",
    pack: "cizzy7",
    category: "flowers",
    file: "WhiteLarge_High.fbx",
    kind: "flower",
    leaf: true,
    albedo: "Flowers_Albedo.png",
    intended: "meadow accent",
  },
  {
    id: "YellowFlower",
    pack: "cizzy7",
    category: "flowers",
    file: "Yellow_High.fbx",
    kind: "flower",
    leaf: true,
    albedo: "Flowers_Albedo.png",
    intended: "meadow accent",
  },
  {
    id: "BlueFlower",
    pack: "cizzy7",
    category: "flowers",
    file: "BlueFlower_High.fbx",
    kind: "flower",
    leaf: true,
    albedo: "Flowers_Albedo.png",
    intended: "clearing accent",
  },
  {
    id: "Rock1",
    pack: "cizzy7",
    category: "rocks",
    file: "Rock1_High.fbx",
    kind: "rock",
    leaf: false,
    albedo: "Rock1_High_Rock test_BaseColor.png",
    intended: "bank / slope stone",
  },
  {
    id: "Rock2",
    pack: "cizzy7",
    category: "boulders",
    file: "Rock2_High.fbx",
    kind: "rock",
    leaf: false,
    albedo: "Rock2_High_DefaultMaterial_BaseColor.png",
    intended: "boulder",
  },
  {
    id: "Rock3",
    pack: "cizzy7",
    category: "rocks",
    file: "Rocks3_High.fbx",
    kind: "rock",
    leaf: false,
    albedo: "Rocks3_High_UVgrid_BaseColor.png",
    intended: "cluster rock",
  },
  {
    id: "Rock4",
    pack: "cizzy7",
    category: "boulders",
    file: "Rock4_High.fbx",
    kind: "rock",
    leaf: false,
    albedo: "Rock4_High_Rock test.001_BaseColor.png",
    intended: "exposed geology",
  },
  {
    id: "Pebble",
    pack: "cizzy7",
    category: "rocks",
    file: "pebal1.fbx",
    kind: "rock",
    leaf: false,
    albedo: "pebble1_omgogmgom_BaseColor.png",
    intended: "shore grit (close only)",
  },
  {
    id: "Bridge",
    pack: "cizzy7",
    category: "other environmental pieces",
    file: "Bridge.fbx",
    kind: "prop",
    leaf: false,
    albedo: "BridgeScaled_Material_BaseColor.png",
    intended: "river crossing landmark",
  },
];

export function parsePack(): PackId {
  const raw = new URLSearchParams(window.location.search).get("pack");
  if (raw === "fs" || raw === "combined" || raw === "cizzy") {
    return raw;
  }
  return "cizzy";
}

export function parseCam(): CamPreset {
  const raw = new URLSearchParams(window.location.search).get("cam");
  if (raw === "regional" || raw === "distant" || raw === "explore" || raw === "gameplay") {
    return raw;
  }
  return "gameplay";
}
