#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/Source/DynastyWorld/WorldGen"
OUT="$ROOT/NativeTests/worldgen_determinism"
clang++ -std=c++20 -O0 -g -Wall -Wextra -Werror \
  -I "$SRC" \
  "$ROOT/NativeTests/worldgen_determinism.cpp" \
  "$SRC/WorldGen.cpp" \
  -o "$OUT"
"$OUT"
