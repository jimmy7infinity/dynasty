# MegaKit Asset Gate

**Date:** 2026-09-15  
**Renderer:** Three.js WebGPU (`world/asset-gate.html`)  
**Camera:** existing `CameraRig` (not an asset-viewer camera)  
**Reference still:** high-angle painterly valley (warm earth, green canopy, tiny figures)

## Verdict: **YELLOW**

The pack is technically compatible with Dynasty’s renderer and scale (tiny player vs 7–17 m trees). It is **not** a visual match for the painterly World still. Standard MegaKit reads as a coherent **Quaternius game-forest kit** with baked **red deciduous leaves**, chunky leaf cards, and almost no readable geology. It can be a **starting vocabulary** only if we retarget leaf color, author ground/cliffs/water, and treat most Standard rocks/plants as inadequate at gameplay distance.

This is not GREEN. It is not RED: silhouettes, instancing, and CC0 ingestion work.

---

## Acquisition / license

| Field | Value |
| --- | --- |
| Pack | Stylized Nature MegaKit **Standard** (68 / 116 models) |
| Creator | Quaternius |
| Source URL | https://quaternius.com/packs/stylizednaturemegakit.html |
| Acquisition | Official Standard zip via OpenGameArt mirror (`stylized_nature_megakitstandard.zip`, 99.2 MB), 2026-09-15 |
| File license | `License_Standard.txt` in the zip: **CC0 1.0 Universal** |
| Commercial | Yes |
| Attribution | Not required (creator asks Patreon support) |
| Redistribution of pack | Not done. Selected glTF lives in gitignored `world/public/asset-gate/` for local test only |
| Text copy | `docs/research/asset-scout/megakit-License_Standard.txt` |

Source/Pro tiers were **not** purchased. Standard glTF bakes **one** leaf texture per tree. The advertised “7 leaf varieties” are a Source-tier feature and were **not** in this ingest.

---

## Selected assets (not first-N)

Heights are measured AABBs after glTF world transform (meters).

### Trees (12)

| id | file | h (m) | Why picked | Gate note |
| --- | --- | --- | --- | --- |
| CommonTree_1 | CommonTree_1.gltf | 7.26 | round deciduous | **Weak** — red card canopy |
| CommonTree_3 | CommonTree_3.gltf | 9.43 | taller deciduous | Same red family |
| CommonTree_5 | CommonTree_5.gltf | 7.01 | smaller deciduous | Same |
| Pine_1 | Pine_1.gltf | 7.32 | spire conifer | **Strongest** green silhouette |
| Pine_3 | Pine_3.gltf | 7.39 | fuller pine | Strong |
| Pine_5 | Pine_5.gltf | 8.72 | different pine mass | Strong |
| TwistedTree_1 | TwistedTree_1.gltf | 16.73 | gnarled / tall | Strong trunk; red leaves |
| TwistedTree_3 | TwistedTree_3.gltf | 16.07 | twisted variant | Same |
| TwistedTree_5 | TwistedTree_5.gltf | 15.66 | heaviest twist | Same |
| DeadTree_1 | DeadTree_1.gltf | 9.50 | bare snag | **Strong** silhouette, no leaf problem |
| DeadTree_3 | DeadTree_3.gltf | 13.28 | asymmetric dead | Strong |
| DeadTree_5 | DeadTree_5.gltf | 16.44 | tall dead | Strong; can look like a pile up close |

### Rocks (8)

Standard has **no large outcrops**. Path-rocks in the zip are ~0.11 m tiles (tried, discarded). Gate used medium boulders + pebbles.

| id | file | h (m) | Gate note |
| --- | --- | --- | --- |
| Rock_Medium_1 | Rock_Medium_1.gltf | 2.26 | Readable grey blob; not painterly |
| Rock_Medium_2 | Rock_Medium_2.gltf | 1.90 | Similar |
| Rock_Medium_3 | Rock_Medium_3.gltf | 2.32 | Slightly blockier |
| Pebble_Round_1–5 | Pebble_Round_*.gltf | ~0.10 | **Invisible** at 36 m camera |

### Plants (8)

| id | file | h (m) | Gate note |
| --- | --- | --- | --- |
| Bush_Common | Bush_Common.gltf | 1.58 | Weak at gameplay |
| Bush_Common_Flowers | Bush_Common_Flowers.gltf | 1.58 | Tiny color speck |
| Fern_1 | Fern_1.gltf | 0.84 | Only at close |
| Grass_Common_Tall | Grass_Common_Tall.gltf | 1.87 | Weak |
| Grass_Wispy_Short | Grass_Wispy_Short.gltf | 1.07 | Weak |
| Flower_3_Group | Flower_3_Group.gltf | 2.05 | Weak |
| Flower_4_Group | Flower_4_Group.gltf | 2.49 | Weak |
| Plant_1_Big | Plant_1_Big.gltf | 2.35 | Reads as a succulent, not meadow grass |

---

## Camera distances (this `CameraRig`)

| Preset | `rig.distance` | Key |
| --- | --- | --- |
| close | **10 m** | 1 |
| gameplay | **36 m** (current World default) | 2 |
| regional | **220 m** | 3 |
| distant | **900 m** | 4 |

Pitch still lerps with distance (`-0.78` → `-1.22`). Same as production World.

---

## How to run the test

```
cd world && npm run dev
# http://localhost:5174/asset-gate.html?test=cluster&mat=source&cam=gameplay
```

`T` cycles isolated / cluster / forest / mixed. `M` cycles source / controlled / toon.

Domain `world.ts` is unchanged. Gate boot is `src/asset-gate/boot.ts` only.

---

## Asset quality

**Strongest:** Pines (green, readable spire); DeadTree snags; TwistedTree trunks (scale vs player).

**Weakest trees:** CommonTree / TwistedTree **leaf cards** — Standard albedo is saturated red. Against the reference’s living green canopy this is a hard miss.

**Rocks:** Medium rocks are generic grey low-poly. Pebbles do not participate at Dynasty gameplay distance. **No cliff vocabulary.**

**Plants:** Family-consistent but **scale-fail** at 36 m. Ground cover cannot make a meadow; our vertex-color terrain stays empty olive.

---

## Style vs Dynasty / reference still

The reference is illustrated: painted biomes, layered canopy, warm cliffs, tiny figures.

MegaKit in-engine is: **stylized low/mid-poly, alpha-tested leaf clusters, autumn-red deciduous, olive unpainted terrain.**

They belong in the same *catalog family* as each other. They do **not** currently belong next to that still without a serious material/palette pass (and better ground).

Marketing “Ghibli-inspired” oversold what Standard glTF actually ships.

---

## Coherence

Yes — one creator, shared bark/leaf/rock atlases. Cluster/forest never look like mixed stores.

That family is **red + pine green + grey rock**, not the reference’s ochre/green valley.

---

## Camera

| Distance | Result |
| --- | --- |
| Close (10 m) | Trunks/rocks readable; leaf cards cheap; plants slightly useful; player-scale works |
| Gameplay (36 m) | Canopy dominates; plants/pebbles gone; red mass is the identity |
| Regional (220 m) | A planted patch of red blobs, not a World |
| Distant (900 m) | Postage-stamp. Assets do not make geography; terrain LOD already does |

---

## Repetition

Visible **immediately** in forest: same red card, same pine, same dead-branch. Rotation/scale (0.82–1.27) does not hide the leaf atlas. ~96 trees is already a clone army.

---

## Materials (gameplay cluster)

| Treatment | Result |
| --- | --- |
| **A source** | Best of the three. Albedo is the art. |
| **B controlled PBR** | Roughness/warm grade: **nearly identical**. Does not fix red leaves. |
| **C toon/gradient** | Slightly harsher posterization. Does not move toward the reference. |

MeshBasic was not used as the default. None of A/B/C produce painterly lighting. **Leaf texture (and our terrain shader) matter more than lighting model.**

---

## Technical

Forest patch (measured HUD):

| Metric | Value |
| --- | --- |
| Instances | 166 |
| InstancedMesh batches | 39 |
| Triangles (sum of instance × geo) | ~635k |
| FPS | 60 |
| Frame | ~15–17 ms |
| Heap | ~33–53 MB |
| Backend | webgpu |

Isolated: 28 instances, 40 batches, ~79k tris, 60 fps.

**Compatible.** Do not ship 500k unique trees from this test; instancing is the right path.

No LOD in Standard glTF. Alpha-test leaves will cost overdraw in a real forest.

---

## Missing vocabulary

- Temperate **green** deciduous (unless Source leaf swap or we recolor)
- Cliffs / mountainsides (terrain must paint them)
- Riverbank specialists, reeds that read at 36 m
- Beaches
- Landmark tree
- Architecture from the reference still
- Ground that isn’t empty olive
- Canopy that holds at regional/distant (impostors / terrain color)

---

## Evidence (from this Three.js test, not store pages)

All under `docs/research/asset-scout/gate/`:

- `gate-isolated-source-gameplay.png`
- `gate-isolated-source-close.png`
- `gate-cluster-source-gameplay.png`
- `gate-cluster-controlled-gameplay.png`
- `gate-cluster-toon-gameplay.png`
- `gate-forest-source-close.png`
- `gate-forest-source-gameplay.png`
- `gate-forest-source-regional.png`
- `gate-forest-source-distant.png`
- `gate-mixed-source-gameplay.png`
- `gate-mixed-source-regional.png`

---

## Stop

No biome generator, no extra packs, no villages, no Unreal. Waiting on human/CTO.
