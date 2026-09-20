# Dynasty World (Unreal 5.8 demonstrator)

Physical-world technology fork. Dynasty `docs/design` and `src/` remain conceptual/simulation authority. This project does **not** extend the browser `world/` or `prototype/` renderers.

## M1 success
A tiny character stands on a seed-deterministic procedural landscape (~8 km) and walks toward right-clicked locations. High-angle camera pan/zoom. No biomes, vegetation, resources, structures, or weather.

## Layout
| Path | Role |
| --- | --- |
| `Source/DynastyWorld/WorldGen/` | Authoritative deterministic World data (no Unreal types) |
| `Source/DynastyWorld/Presentation/` | Unreal actors: chunks, pawn, camera, HUD |
| `Config/` | Engine/game/input defaults |
| `NativeTests/` | clang tests for seed/chunk determinism |

## Engine
- Association: **5.8**
- This machine had Epic Launcher only (no UE 5.8 binaries) and ~37 GB free when M1 source was authored. Install 5.8 on a disk that can hold it, then open `DynastyWorld.uproject`.

### After install
1. Open `DynastyWorld.uproject` with Unreal Engine 5.8 and compile the game module.
2. Play In Editor.
3. If the stock template map has a floor/landscape, delete those actors so only generated terrain remains.
4. Controls: right-click ground to move; WASD / arrows / MMB-drag to pan; Q/E yaw; mouse wheel zoom.

### Native tests (no Editor)
```bash
./NativeTests/run.sh
```
Expected: `ok seed=739184 version=1` with both land and ocean samples and mountain-scale max height.
