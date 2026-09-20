# Dynasty 500m Art Gate — Cizzy7 + FreeStylized

**Date:** 2026-09-15  
**Runtime:** `world/art-gate.html` (existing Three.js `three/webgpu` stack, no renderer rewrite)  
**Playable composition:** ~500m × 500m around `findLandSpawn` on seed `739184`  
**Do not confuse store-page beauty with what we can instance in Dynasty’s production renderer.**

---

## 1. Executive verdict

| Subject | Verdict |
|---|---|
| **Cizzy7** (as Dynasty Three.js/WebGPU vocabulary) | **RED** |
| **Cizzy7** (as Unreal 4.26 authored look, store/screenshots) | **YELLOW** — promising *if* we were an Unreal foliage project, which we are not |
| **FreeStylized Foliage Kit 01** | **RED** — not acquired; cannot judge |
| **Combined visual family** | **RED** — Test C impossible; Cizzy7 FBX already fails alone |
| **Overall Dynasty art hypothesis** (these two packs as DNA for a beautiful procedural World) | **RED** |

### Why Cizzy7 is RED for us

The author is explicit on [the itch page](https://cizzy7.itch.io/studio-ghibli-inspired-asset-pack):

> Download and use the folder given it has all the **uassets and project settings** enabled.
>
> Some materials are using certain features such as **ground blending** so … you will have to setup **RVTs**. [Video](https://www.youtube.com/watch?v=AEMe-kcZBLw)
>
> Highly recommend **migrating the project files** along with importing the project settings … **external tools are used**.

Listed engine: **Unreal 4.26.2+**. Also listed: Runtime Virtual Textures, Distance Fields, a **UE4 Game Scene.zip (121 MB)**.

The file we legally downloaded (`Studio Ghibli inspired assets.zip`) is **CompiledAssets FBX + PNG only**. There is **no** `.uasset`, `.umap`, or `.uproject` in that archive. FBX was added later so other software can load *meshes*. It does not ship the material graph that produces the Ghibli-adjacent screenshots.

In our WebGPU runtime the FBX path is technically usable (loads, instances, ~60 fps) and **artistically wrong**: leaf-clump cards, missing RVT ground blend, texture names in FBX (`bark17.png`, `Tree1_BillboardFixed.png`) that do not match the PNG folder. That is the same class of failure as Quaternius, for a different reason — Quaternius was the wrong visual language; Cizzy7 is a language we cannot actually speak without Unreal.

We will **not** resurrect this by reverse-engineering RVT in Three.js, recoloring, or “just using High FBX.” That would be rescuing a pipeline, not choosing a vocabulary.

### Why FreeStylized is RED this gate

[Foliage Kit 01](https://freestylized.com/asset_pack/foliage_kit_01/) markets “Royalty Free … Commercial and Non-Commercial.” The **Free Download** control goes to **Patreon / Join now**. No package, therefore no in-file license, no meshes in the scene. Test B is empty terrain with a HUD flag. Marketing copy is not a license we inspected.

---

## 2. Best assets

### Cizzy7 (from file inspection + live import — *meshes only*)

Strongest *mesh intent* in the FBX dump (not proven as Dynasty look):

- **Tree 1 / Tree 2 High + MidBlend** — deciduous canopy masses, LODs exist
- **Oak Tree 3 High** — distinct silhouette among the four trees
- **Tree 4 Birch Mid/High** — paler second species
- **Large bush High** — understory / forest edge
- **Rocks 1, 2, 4** — real albedo maps; usable geology if materials bind

These are the assets that *could* matter **inside Unreal with RVT**. In Three.js they currently read as dark leafy cards.

### FreeStylized

None in-engine. Store page shows stylized foliage cards/plants; unscored.

---

## 3. Weak assets (do not become Dynasty vocabulary from this gate)

- **FBX MidBlend / billboard LODs** used as hero meshes — they are UE LOD/billboard, not hero trees
- **LeafClump / GrassMask PNGs without the UE foliage shader** — black/white cutouts, not painterly canopies
- **Rock 3** (`Rocks3_High_UVgrid_BaseColor`) — debug UV grid naming; skip
- **Pebbles** — vanish at 36m gameplay camera (same lesson as MegaKit)
- **Flowers** — atlas/UV mismatch in FBX; giant until we forced scale; still not a meadow
- **Bridge / lantern / sculptures** — scene-prop, not environmental DNA; easy to theme-park
- **Unfinished wind nodes** (author’s own warning) — animation demo, not pack contract

---

## 4. Visual compatibility

**Not tested.** FreeStylized never entered the scene. Do not assume Cizzy7’s UE-painted Ghibli-adjacent foliage would sit next to FreeStylized’s kit even if both imported cleanly.

Cizzy7 FBX + our olive vertex-color terrain already clash: no ground blend (exactly the RVT warning).

---

## 5. Missing vocabulary

Even if Cizzy7 UE materials worked here, the pack is small (~28 assets) and still missing Dynasty’s 500m valley needs:

- cliffs / rock strata / mountain geology
- conifers (none in this temperate Ghibli-deciduous set)
- dead / fallen trees
- reeds, willows, riverbank specialists
- ferns as a class (ivy is not ferns)
- hero-scale trees that read at 36m *and* 220m
- ruins / structures (sculptures are not Sites)
- snow / high-altitude
- water shader is UE “simple water” — we already have our own water; don’t dual-stack

---

## 6. Performance

Machine: existing Dynasty world Vite session, WebGPU.

| Metric (Cizzy7 pack mode) | Observed |
|---|---|
| Backend | webgpu |
| FPS | ~60 (display-limited) |
| Frame | ~16–18 ms |
| Instances | ~395 |
| Batches / InstancedMesh | 19 |
| Triangles (instanced estimate) | ~316k |
| JS heap | ~30–50 MB |
| FreeStylized mode | 0 instances, same terrain/water cost |

Sane enough. **The gate does not fail on performance.** It fails on art and on engine contract.

Import path used:

`itch zip CompiledAssets FBX` → copy selected FBX/PNG to `world/public/art-gate/cizzy7/` (gitignored) → `FBXLoader` + `InstancedMesh` + `MeshStandardNodeMaterial`.

Source kept at `world/assets/cizzy7/source/` (gitignored). No permanent edits to originals.

---

## 7. Art assessment

**If we had to build the first 500m × 500m of Dynasty tomorrow, could these assets form a beautiful World?**

### **NO**

Not in the production renderer we committed to (Three.js + WebGPU).

The itch stills can look like the *feeling* we want. That feeling is authored in **Unreal materials (RVT ground blend, distance fields, project settings, external tools)**. Our live evidence:

- [cizzy-gameplay.png](art-gate/cizzy-gameplay.png) — gameplay 36m: sparse cutout bushes, empty olive floor, player not reading as tiny-in-a-place
- [cizzy-forest-edge.png](art-gate/cizzy-forest-edge.png) — closer foliage: leafy cards, not a forest
- [cizzy-regional.png](art-gate/cizzy-regional.png) — 220m: dark specks, no valley-forest mass
- [cizzy-distant.png](art-gate/cizzy-distant.png) — 900m: geography is our terrain/fog; vegetation does not carry the shot
- [fs-not-acquired.png](art-gate/fs-not-acquired.png) — Test B empty

That is **not** “beautiful natural World + curiosity + enormous geography.” It is an honest failed import of an Unreal foliage demo.

---

## 8. Recommendation

**D. Neither is strong enough; continue asset search** (after human/CTO visual review of these stills).

Do **not** choose A (Cizzy7 dominant) for Dynasty’s Three.js World. That would mean either:

- silently shipping the broken FBX look, or
- reopening Unreal as the presentation layer (explicitly out of this gate).

Do **not** choose B until FreeStylized is actually downloaded and licensed from a file, not a Patreon interstitial.

Do **not** choose C.

### Allowed follow-ups (not this gate)

1. Human looks at itch/UE stills vs our `art-gate.html` stills and confirms RED.
2. Next search: packs that are **GLTF/GLB + portable materials**, painterly/stylized-naturalistic, licensed for commercial games, **not** UE-project-shaped.
3. If someone later wants to *evaluate Cizzy7’s authored look*, that is an Unreal sandbox with `UE4 Game Scene.zip` — a separate, explicit decision, not a Three.js rescue.

---

## Provenance

### Cizzy7 — Studio Ghibli inspired asset pack

| Field | Record |
|---|---|
| Creator | Callum Andrews (cizzy7) |
| Pack | Studio Ghibli inspired asset pack |
| Source | https://cizzy7.itch.io/studio-ghibli-inspired-asset-pack |
| Date checked | 2026-09-15 |
| File acquired | `Studio Ghibli inspired assets.zip` (CompiledAssets FBX/PNG) |
| File not acquired | `UE4 Game Scene.zip` (121 MB, uassets / project) |
| License in zip | **None** |
| Author comment | Use/edit/publish; do not resell the pack |
| Commercial | Claimed by comment only |
| Modification | Claimed allowed |
| Redistribution of pack | Prohibited by author |
| Attribution | Unspecified |
| Studio Ghibli | Inspiration only; no IP relationship |

### FreeStylized — Foliage Kit 01

| Field | Record |
|---|---|
| Creator | Team FreeStylized |
| Source | https://freestylized.com/asset_pack/foliage_kit_01/ |
| Date checked | 2026-09-15 |
| Page license | “Royalty Free … Commercial and Non-Commercial” |
| In-file license | **Not inspected** (no download) |
| Acquire | **BLOCKED** — Free Download → Patreon membership |

---

## Compact catalog (Cizzy7 runtime set)

| id | category | format | notes |
|---|---|---|---|
| Tree1_Mid / Tree1_Hero | large trees | FBX | MidBlend + High; FBX refs missing `Tree1_BillboardFixed.png` |
| Tree2_Mid | large trees | FBX | same family |
| Oak_Mid / Oak_Hero | large trees | FBX | smaller measured mesh; forced to ~9.5–12 m |
| Birch_Mid | small trees | FBX | BirchClump.png |
| Bush / LargeBush | bushes / shrubs | FBX | best *readable* cards at 36m after cutout hack |
| Grass / Weed | grass | FBX | GrassMask; needs UE grass shader |
| Flowers | flowers | FBX | Flowers_Albedo atlas |
| Ivy | ground plants | FBX | wild native scale (~67 m) before normalize |
| Rock1–4 | rocks / boulders | FBX | Rock3 UV-grid albedo |
| Pebble | rocks | FBX | close-only |
| Bridge | prop | FBX | landmark, not biome |

No GLB supplied. Conversion: none (runtime FBX). LODs exist in source (High/Mid/Low) but Low billboards are not a visual upgrade.

---

## How to inspect

```text
cd world && npm run dev
open http://localhost:5174/art-gate.html?pack=cizzy&cam=gameplay
```

- `1` gameplay 36m · `2` regional 220m · `3` distant 900m · `4` explore  
- RMB terrain walk · WASD pan · Q/E yaw · P cycles pack (`cizzy` / `fs` / `combined`)  
- `?pack=fs` shows the Patreon-blocked empty Test B

STOP. No WorldGen, no more libraries, no Unreal migration from this gate.
