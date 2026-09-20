# Dynasty Asset Scout Research Report

**Scout, not art direction.** Scores are scouting judgments. Checked **2026-09-15**. No packs were bulk-downloaded. Firecrawl was unavailable; evidence is from official pages, itch metadata, and live previews.

**Hypothesis under test:** Can Dynasty establish a beautiful, coherent procedural World from a relatively small library of existing 3D building blocks?

**Scout verdict: PROBABLY** — if we pick **one** nature family as the foundation (Quaternius Stylized Nature MegaKit), keep settlements/props in the same family, and author terrain, water, atmosphere, cliffs, and a handful of hero pieces ourselves.

A beautiful World is **not** guaranteed by dumping 400 mixed-store assets into a scatterer. Forty coherent assets will beat four hundred mismatched ones.

---

## SECTION 1 — Executive summary

**Best sources for a first temperate mountain/forest valley**

| Role | Source | Why |
| --- | --- | --- |
| **Primary** | Quaternius **Stylized Nature MegaKit** (Source tier) | Only high-count pack that is CC0, glTF, temperate nature-complete (trees/plants/rocks), and visually in the “warm stylized-naturalistic game forest” neighborhood |
| **Primary-adjacent (later)** | Quaternius **Fantasy Props MegaKit** | Same creator, shared-texture optimization, settlement dressing |
| **Secondary / style probe** | Cizzy7 Ghibli-inspired pack | Closest *mood* to illustrated environment; only 28 assets; UE/FBX; comment-license |
| **Secondary / web tech** | threejsassets **free temperate subset** | Best documented GLB + triangle budgets + InstancedMesh intent; style is geometric low-poly, not painterly |
| **Lighting only** | Poly Haven HDRIs (CC0) | Photoreal meshes are the wrong family; skies/lighting can still help |

**Do not make these primary:** Kenney Nature Kit, KayKit Forest, Quaternius Ultimate Nature (2019), Sketchfab anime base collection, Poly Haven photoreal trees, Synty/Megascans-class photoreal or cartoon kits.

**First biome:** MegaKit’s advertised 40 trees / 35 plants / 27 rocks is **enough vocabulary** for meadow, mountain forest, and a rough riparian strip **if** ground, water, and atmosphere are ours.

**Major gaps even if MegaKit is approved:** hero-scale ancient tree; sculpted cliffs/overhangs; willow-like riverbank specialists; beaches; ruins that match the nature family; wind/foliage shading in Three.js (engine shaders will not travel with glTF).

**Honest style note:** MegaKit markets “Ghibli-inspired.” Live marketing still reads as **Quaternius house style** (rounded, saturated, leaf-card trees). That is closer to Dynasty than Kenney/KayKit/TJA city trees, and still not “animated film translated to 3D.” Cizzy7’s trailer thumbnail is closer to the film-illustration target and too small to be a world library.

---

## SECTION 2 — Source catalog

| Source | Creator | Focus | Count | Format | License | Commercial | Style | Dynasty fit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Stylized Nature MegaKit](https://quaternius.com/packs/stylizednaturemegakit.html) | Quaternius | Temperate nature | 116 unique (Std/Pro/Source split) | glTF, FBX, OBJ, Blend (Source) | **CC0 1.0** | Yes | Warm stylized-naturalistic, leaf textures, rounded silhouettes | **Strongest volume candidate** |
| [Ultimate Stylized Nature](https://quaternius.com/packs/ultimatestylizednature.html) | Quaternius | Nature | 63 | FBX, OBJ, glTF, Blend | Commercial-free on page; treat as same family as other Quaternius CC0 packs (confirm file LICENSE on acquire) | Claimed yes | Older stylized | Prefer MegaKit instead |
| [Ultimate Nature](https://quaternius.com/packs/ultimatenature.html) | Quaternius | Nature | 150 | FBX, OBJ, Blend | Same family; confirm LICENSE | Claimed yes | 2019 generic LP | Weak; skip for art target |
| [Fantasy Props MegaKit](https://quaternius.com/packs/fantasypropsmegakit.html) | Quaternius | Props | 211, 4 texture sets | glTF, FBX, OBJ | **CC0 1.0** | Yes | Stylized medieval props | Strong for later settlements |
| [Medieval Village MegaKit](https://quaternius.com/packs/medievalvillagemegakit.html) | Quaternius | Modular village | 304 | glTF, FBX, OBJ | **CC0 1.0** | Yes | Grid European village | Secondary; can look “kit” |
| [Universal Animation Library](https://quaternius.com/packs/universalanimationlibrary.html) | Quaternius | Humanoid anim | 120+ | FBX, engine exports | **CC0 1.0** | Yes | Generic mocap-like | Characters only |
| [Ghibli-inspired pack](https://cizzy7.itch.io/studio-ghibli-inspired-asset-pack) | Callum Andrews (Cizzy7) | Nature + sculptures + UE scene | 28 + 41 textures | FBX, UE4.26 uassets | **Author comment only** (use in games; don’t resell pack) | Claimed in comment | Painterly / illustrated forest | High mood, low coverage, legal+engine risk |
| [Foliage Kit 01](https://freestylized.com/asset_pack/foliage_kit_01/) | FreeStylized | Foliage kit | Kit (page does not list a clean unique-mesh count) | FBX, Unity, UE5.4 | “Royalty free” commercial/non-commercial | Claimed yes | Stylized baked 2K | Possible supplement; redistribution unclear |
| [Nature collection](https://threejsassets.com/assets/nature) | threejsassets (Aron Prins) | Trees, rocks, hedges | 102 (54 free) | GLB | Free/Pack/Lifetime commercial; **no raw redistribution** | Yes | Flat-shaded low-poly, mixed biomes | Strong tech, weak painterly fit |
| [Kenney Nature Kit](https://kenney.nl/assets/nature-kit) | Kenney | Modular nature + terrain | ~330 | Common 3D exports | **CC0** (OGA + historical Kenney terms) | Yes | Toy / square trees | Blockout only |
| [KayKit Forest](https://kaylousberg.itch.io/kaykit-forest) | Kay Lousberg | Forest kit | 100+ free / 200+ extra | FBX, GLTF, OBJ | **CC0 1.0** | Yes | Cartoon isometric | Coherent but wrong family |
| [Anime base models](https://sketchfab.com/DraconianFire/collections/anime-base-models-fde3d0b792d2433992c5fe797cd2d2de) | various on Sketchfab | Character bases | Collection | Mixed | **Per asset** | Unknown / mixed | Anime characters | **Not a World source** |
| itch “free 3D stylized” index | many | Mixed | Huge | Mixed | Mixed | Mixed | Mostly generic LP | Seed index only |

---

## SECTION 3 — Discovered sources (beyond the seed list)

| Source | Why it matters | License snapshot | Scout use |
| --- | --- | --- | --- |
| [KayKit Forest Nature Pack](https://kaylousberg.itch.io/kaykit-forest) | High count, CC0, GLTF, atlas texturing, grass shader-ready unshaded meshes | CC0 | Proof that “lots of CC0 forest” exists; **style is toy**. Keep as negative example. |
| [KayKit Medieval / Hex packs](https://kaylousberg.itch.io/) | Settlement tiles | CC0 | RTS hex language ≠ organic World |
| [Gobkit 41 GLB nature kit](https://gobkit.itch.io/gobkit-free-low-poly-nature-kit-41-cc0-environment-assets-glb) | Three.js-ready separate GLBs | CC0 | Convenient; mesh mountains fight procedural terrain; generic LP |
| [Poly Haven](https://polyhaven.com/license) | HDRI / texture CC0 library | CC0 | Lighting/skies; **not** mesh family |
| [ambientCG](https://ambientcg.com/) | CC0 PBR textures (site fetch was flaky; license historically CC0) | Confirm on acquire | Ground/rock albedo experiments, not trees |
| OpenGameArt mirrors | Same Quaternius/Kenney packs | Follow original LICENSE | Convenience mirrors only |
| Unity/Fab “stylized nature” store | Often the only *hand-painted* mid-poly foliage at film-adjacent quality | Typically store EULA: game use OK, no asset redistribution; engine extraction needs a lawyer pass | **Later**, if MegaKit ceiling is too low |
| Synty POLYGON Nature | Huge, cheap, famous | Commercial | **Avoid** — cartoon kit look |
| Quixel Megascans / photoreal NatureManufacture | Huge, beautiful | Fab/engine-tied, photoreal | **Avoid** for this visual target |
| SpeedTree / Botaniq / Graswald | Authoring tools | Paid, usually photoreal | Custom hero pipeline later, not first biome kit |
| BlenderKit / Poly.pizza aggregators | Discovery | **Per-asset**; Poly.pizza was Cloudflare-blocked | Do not treat as one license |

---

## SECTION 4 — Top candidates by category

Individual mesh names inside MegaKit were **not** enumerated without downloading. Rows below are **selection targets** (what to pull after human approval), plus named threejsassets meshes where the public grid listed them.

### Trees (repeatable canopy)

| Asset / target | Source | Style | Technical | Dynasty | License | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| MegaKit tree set (subset of 40) | Quaternius | Stylized textured leaves | glTF; Source has leaf swap (7 varieties) | High | CC0 | **Core canopy.** Pick ~10, not all 40 |
| Pine / conifer cluster | MegaKit | Same | Same | High | CC0 | Mountain forest |
| Round deciduous | MegaKit | Same | Same | High | CC0 | Valley + meadow edge |
| Dead / sparse | MegaKit if present | Same | Same | High | CC0 | Ridges; confirm in pack |
| Cizzy7 trees | Cizzy7 | Painterly mid-poly + LOD | FBX / UE | High mood | Comment license | Convert only after legal comfort |
| Birch Tree (510 tris) | threejsassets | Vertex-color LP | GLB, instance-friendly | Low–mid | TJA free commercial | Distant LOD only if recolored |
| Lineside Oak (752 tris) | threejsassets | LP | GLB | Low–mid | TJA free | Silhouette OK at high camera |
| Arborvitae Conifer (595 tris) | threejsassets | LP | GLB | Low | TJA free | Too “hedge/garden” |
| Apple / plaza / palm / ficus | threejsassets | LP mixed climate | GLB | Low | mixed free/premium | **Skip** for temperate valley |
| KayKit trees | KayKit | Cartoon blobs | Atlas GLTF | Low | CC0 | Incompatible silhouette |
| Kenney trees | Kenney | Cubes | CC0 | Very low | CC0 | Blockout |

### Shrubs / bushes

| Asset / target | Source | Notes |
| --- | --- | --- |
| MegaKit bushes | Quaternius | Primary understory |
| Heather Shrub (452 tris, free) | TJA | Possible distant heath if recolored |
| Bush Round 01 (360 tris, free) | TJA | Generic sphere bush |
| KayKit bushes | KayKit | Wrong family |

### Plants / grass / ground cover

| Asset / target | Source | Notes |
| --- | --- | --- |
| MegaKit grass + plants | Quaternius | Primary; Source has wind shader **not** in glTF |
| Grass Tuft / Lawn Tuft Scatter | TJA free | Cheap instances; geometric |
| Fern Bracken | TJA (premium on grid) | Forest floor; style mismatch |
| FreeStylized foliage kit | FreeStylized | 2K baked; convert FBX; license incomplete |
| Cizzy7 grass/flowers | Cizzy7 | Devlog exists; tiny set |

### Flowers

| Asset / target | Source | Notes |
| --- | --- | --- |
| MegaKit flowers (part of 35 plants/flowers) | Quaternius | Meadow color |
| Flower Bed / Flowering Tree | TJA | Garden/planter language — skip most |
| Cizzy7 flowers | Cizzy7 | Mood reference |

### Rocks / geology

| Asset / target | Source | Notes |
| --- | --- | --- |
| MegaKit rocks (27) | Quaternius | Primary scatter + outcrops |
| Mossy Boulder (432 tris, free) | TJA | OK if recolored to MegaKit palette |
| Boulder / Field Boulder | TJA | Cheap |
| Cutting Rock Face (912 tris, free) | TJA | Semi-rare cliff proxy |
| Fjord Cliff Rock (538 tris, free) | TJA | Mountain |
| Kenney modular cliffs | Kenney | Toy blocks |
| Mesh mountains (Gobkit) | Gobkit | **Do not** replace heightfield |

### Fallen vegetation / water-edge

| Asset / target | Source | Notes |
| --- | --- | --- |
| MegaKit fallen / dead if present | Quaternius | Confirm on acquire |
| Driftwood Snag (556 tris, free) | TJA | Riparian |
| Cattail Reed Clump (544 tris, free) | TJA | Riparian — useful *shape*, wrong shader family |
| Lily Pad Cluster (366 tris, free) | TJA | Ponds |
| Cypress Knee / Mangrove | TJA | Wrong biome |

### Structures / props (later than first valley)

| Asset / target | Source | Notes |
| --- | --- | --- |
| Fantasy Props MegaKit | Quaternius | Carts, barrels, stalls — same family |
| Medieval Village MegaKit | Quaternius | Only if we accept grid vernacular |
| Cizzy7 sculptures | Cizzy7 | Possible **hero** props |
| TJA Cozy Village / farm kit | TJA | LP village; mismatch with MegaKit trees |
| KayKit medieval hex | KayKit | RTS, not Dynasty geography |

**Characters:** keep separate. MegaKit is not a character pack. Sketchfab anime bases are not World assets. Quaternius UAL / KayKit Adventurers are a later conversation.

---

## SECTION 5 — Visual families

```
FAMILY A — Quaternius stylized nature (MegaKit / Ultimate Stylized)
  Warm, rounded, textured leaf cards, game-forest. Highest coexistence internally.

FAMILY B — Cizzy7 illustrated / UE painterly
  Closer to “environment illustration.” Mid-poly, LODs, UE materials. Tiny library.

FAMILY C — threejsassets geometric GLB
  Flat color, city+countryside mix, excellent budgets. Reads as a different game.

FAMILY D — Kenney modular CC0
  Toy, square, terrain tiles. Blockout / greybox only.

FAMILY E — KayKit cartoon atlas
  Coherent, cute, saturated blobs. Not Dynasty.

FAMILY F — Photoreal CC0 / Megascans / SpeedTree
  Technically rich, wrong target.

FAMILY G — Store hand-painted (Fab/Unity, later)
  Potential film-adjacent foliage; EULA + conversion cost.
```

**Which can coexist?**

- **A + A props (Fantasy Props)** — yes, same creator.
- **A + B** — only after shared palette, roughness, and leaf treatment. Otherwise two forests.
- **A + C** — no at close/mid range. Maybe C as *impostor/LOD* if recolored and never mixed in the same shot.
- **A + D/E** — no.
- **A + F** — no.
- **Best-of-all-sources without normalization** — no.

---

## SECTION 6 — Recommended starter vocabulary (~50–80, not 400)

Acquire **MegaKit Source** after approval, then keep approximately:

| Bucket | Count | Role |
| --- | --- | --- |
| Trees | 8–12 | 3 conifer sizes, 3 deciduous sizes, 1 flowering/accent, 1 dead, 1 young, 1 wide canopy |
| Shrubs | 4–6 | Round, tall, sparse, berry/flowering |
| Ground plants | 8–12 | Grass clumps, ferns, forest floor, meadow mix |
| Flowers | 5–8 | 2 meadow, 1 forest shade, 1 bank, rest accents |
| Rocks | 8–12 | Pebble → boulder, mossy/dry variants |
| Fallen veg | 3–6 | Log, stump, branch pile |
| Geology | 3–6 | Outcrop, cliff chunk, scree pile — **plus** our heightfield |
| Human (optional v1) | 0–5 | One cabin, one bridge, fence, path markers — only if they match Family A |

**Do not** fill remaining slots from Kenney/KayKit/TJA palms just to hit a number.

### Procedural communities MegaKit can likely support

| Community | Covered well? | Weak without custom |
| --- | --- | --- |
| Mountain forest | Yes (conifer + rock + fern/grass) | Cliffs, mist, hero pine |
| Meadow | Yes (grass/flowers/sparse trees) | Ground shader, flower density art |
| Riparian | Partial | Willows, reeds, wet rock materials, water |
| Dry slope | Partial | Sparse grass + rock; may lack true scrub |
| Beach | No | Custom |
| Ruin overlay | Weak | Props MegaKit or custom |

**Hero vs repeatable**

- **Repeatable:** MegaKit trees/rocks/grass (instance + rotate + leaf-tint + scale).
- **Semi-rare:** largest MegaKit boulders, fallen logs, Cizzy7 sculptures if converted, TJA rock faces as LOD-only.
- **Hero (plan to author):** enormous valley tree, distinctive ruin, landmark bridge, geological oddity. **No scouted library gives a true landmark at Dynasty scale.**

---

## SECTION 7 — Asset gaps

| Gap | Why it matters | Likely path |
| --- | --- | --- |
| Landmark / ancient tree | Tiny player vs geography needs one unforgettable silhouette | Custom / commission / Blender |
| Cliffs & overhangs | Rock meshes ≠ mountain walls | Heightfield + few hero meshes |
| River water & waterfalls | Packs ship shaders, not portable water | Our water (already a World problem) |
| Willow / wet-bank specialists | Riparian identity | Custom or careful MegaKit subset |
| Beaches / cobble shores | Coastal later | Custom |
| Architecture matching nature | Medieval grid village fights organic World | Delay structures; or one cabin authored |
| Wind + leaf translucency in WebGPU | Beauty at high angle | Our materials on MegaKit textures |
| LOD chain in glTF | Large worlds | Generate ourselves; don’t reject MegaKit for this |
| Coherent ruin language | Story geography | Custom or Props kit after nature is locked |

---

## SECTION 8 — License risks

| Item | Risk | Scout advice |
| --- | --- | --- |
| Cizzy7 | License is an **itch comment**, not CC0/SPDX. Commercial use claimed by author. Pack resale forbidden. No attribution clause. | Legal read before shipping. Fine to use as **mood reference** now. |
| FreeStylized | “Royalty free” without redistribution/mod/attribution detail on the pack page | Do not redistribute files; confirm FAQ/ToS before production |
| threejsassets | Game/client use OK; **cannot** put GLBs in a public Dynasty asset dump / competing kit | Fine if we only embed in the product |
| Sketchfab collection | Per-asset; names like “Genshin Style” | **Avoid** for World |
| Quaternius CC0 | Legally very safe. Still download the LICENSE with the files. | Primary |
| Kenney/KayKit CC0 | Safe legally, wrong visually | Don’t ship as Dynasty look |
| Unity/Fab later | Game embedding usually allowed; raw extraction culture is messy | Lawyer if we go this route |
| Engine projects | Source MegaKit Unity/UE/Godot shaders are for those engines | We want **glTF meshes + our shading** |
| AI-generated gray-market kits | Unclear training/rights | Not recommended |
| “Ghibli” in titles | Directional marketing, not a Ghibli license | Do not imply Studio Ghibli IP |

---

## SECTION 9 — Technical risks

| Risk | Where | Mitigation |
| --- | --- | --- |
| Engine shaders don’t travel | MegaKit Source, Cizzy7 UE, FreeStylized | Author Three.js/WebGPU materials |
| Alpha-tested leaf cards | MegaKit / most stylized trees | Sort/overdraw cost at forests; instance + cheap alpha clip |
| Missing glTF LOD | Almost all | Bake LOD later; first biome can use 1–2 mesh resolutions |
| High texture (2K×N) | Cizzy7, FreeStylized | Atlas / downres for web |
| UE RVT / distance fields | Cizzy7 | Don’t expect drop-in; FBX geometry only |
| Draco/KTX2 | TJA | Three.js decoder setup if we use them |
| Mixed climates in one catalog | TJA nature hub | Filter hard (no palms/ficus in valley) |
| Mesh mountains | Gobkit, some Kenney tiles | Procedural heightfield remains source of truth |
| Animation on nature | Usually none; skip if present | Static instances |
| Poly count | TJA median ~600 tris (good); MegaKit trees likely mid-poly (unmeasured — **do not pretend we counted**) | Profile after approved acquire |
| Origins/transforms | Unknown until open in Blender | Normalize on ingest |

---

## SECTION 10 — Recommendation

### PRIMARY LIBRARY

**Quaternius Stylized Nature MegaKit, Source tier** (~$15 on itch as of listing: Standard free, Pro ~$10, Source ~$15).

This appears to be the strongest candidate because it is the only pack that simultaneously has (1) CC0, (2) glTF, (3) a full temperate vocabulary, (4) a warm stylized-naturalistic look, and (5) enough unique meshes that a 50–80 subset is a *choice*, not a scrape of the whole internet.

### SECONDARY

- Quaternius **Fantasy Props MegaKit** when settlements exist.
- **Cizzy7** as style reference; optionally 5–10 FBX hero pieces **after** license comfort.
- **Poly Haven HDRI** for lighting experiments.
- **threejsassets** only as a possible distant-LOD / reed-shape supplement after palette matching — not as a second forest.

### AVOID (for Dynasty look, not because they are “bad packs”)

- Kenney Nature Kit as visible art
- KayKit Forest as visible art
- TJA palms, plaza trees, hedges, Halloween, vice beach
- Sketchfab anime bases for environment
- Photoreal Megascans / NatureManufacture / Poly Haven trees as the World language
- Synty-style cartoon kits
- Mixing Families A–E in one camera frustum

### CUSTOM / BLENDER / COMMISSION

Terrain macro, water, atmosphere, cliffs, 1–3 hero landmarks, any architecture that must feel “Dynasty,” wind foliage shading, LOD generation.

Code-authored primitives (`world/src/render/vocab.ts`) already proved the **runtime** path and failed the **art** gate. External blocks are how we raise the ceiling — they do not replace shading, placement, and geography.

---

## SECTION 17 — Multi-source coherence test

| Set | Contents | Coherence | Material mismatch | Silhouette mismatch | Palette | Normalization? |
| --- | --- | --- | --- | --- | --- | --- |
| **A** | Mostly MegaKit | **Best** | Low | Low | Shared | Tint + our lighting |
| **B** | MegaKit + Cizzy7 | Risky | High (UE baked vs glTF cards) | Medium | Could work | Hard: retarget roughness, leaf cards, scale |
| **C** | MegaKit + TJA | Poor at gameplay camera | High (textured vs flat) | High | Clash | Only if TJA is LOD/impostor |
| **D** | MegaKit + FreeStylized | Unknown | Likely (2K baked PBR-ish vs stylized) | Medium | Maybe | Convert + shared shader |
| **E** | Best-of-all | **Worst** unless we throw most away | Severe | Severe | Severe | Equivalent to making a new library |

**Recommended ecosystem: Set A.** Optionally a later, tightly gated Set B hero slice.

---

## Visual shortlist (official previews)

Do not treat these stills as a final art call. They are enough to answer “does this family even look like Dynasty?”

1. **Family A (primary)** — [Quaternius MegaKit page](https://quaternius.com/packs/stylizednaturemegakit.html) · [itch](https://quaternius.itch.io/stylized-nature-megakit) · trailer [YouTube 3PKFkUcopjA](https://youtu.be/3PKFkUcopjA)
2. **Family B (mood)** — [Cizzy7 itch](https://cizzy7.itch.io/studio-ghibli-inspired-asset-pack) (trailer thumb on page: illustrated trees/meadow)
3. **Family C (tech, not look)** — [threejsassets nature](https://threejsassets.com/assets/nature)
4. **Family E (negative)** — [KayKit Forest](https://kaylousberg.itch.io/kaykit-forest) — cartoon isometric, useful as “do not mix”
5. **Family D (negative)** — [Kenney Nature Kit](https://kenney.nl/assets/nature-kit)

Local captures from this scout (headers/metadata, not full contact sheets of every mesh):

- `docs/research/asset-scout/previews/quaternius-header.png`
- `docs/research/asset-scout/previews/kaykit-forest-header.png`
- `docs/research/asset-scout/previews/cizzy7-trailer-thumb.png`

A true per-mesh contact sheet requires a **legitimate download** of MegaKit Standard/Source after you approve acquire. That was in-scope to *not* do.

---

## SECTION 19 — Direct answer

> If we acquired only ~50–100 carefully selected assets from the sources researched, could we plausibly build a beautiful first Dynasty temperate mountain/forest valley through procedural composition?

### **PROBABLY**

**Why not YES:** Beauty still depends on *our* terrain, water, atmosphere, placement ecology, and 2–5 hero pieces. MegaKit is a strong **vocabulary**, not a finished illustrated World. Mixing catalogs would make this a NO. We did not open the meshes, so poly/LOD/origin quality is unverified.

**Why not UNCERTAIN/NO:** A single CC0 glTF pack already contains on the order of 40 trees + 35 plants + 27 rocks — enough unique blocks that 50–100 curated assets is a **subset**, which is exactly the hypothesis. Kenney/KayKit prove CC0 volume is easy; MegaKit is the first seed source that is both volumetrically enough **and** in the right style neighborhood.

**Suggested human/CTO gate**

1. Approve MegaKit Source acquire (legal: CC0).
2. Open in Blender: 12 trees + 8 rocks + 8 plants on a gray ground. Yes/no on silhouette at Dynasty camera.
3. Only then ingest into `world/` — this scout stops here.

---

*End of scout. No Worldgen, Unreal, or biome expansion was performed.*
