#include "WorldGen.h"

#include <cmath>
#include <cstdio>
#include <cstdlib>

using dynasty::world::ChunkAt;
using dynasty::world::ChunkOriginMeters;
using dynasty::world::SampleHeightMeters;
using dynasty::world::WorldGenConfig;
using dynasty::world::WorldIdentity;

static void Fail(const char* message) {
  std::fprintf(stderr, "FAIL: %s\n", message);
  std::exit(1);
}

int main() {
  const WorldGenConfig cfg{};
  const WorldIdentity a{739184u, 1u};
  const WorldIdentity b{739184u, 1u};
  const WorldIdentity other_seed{42u, 1u};
  const WorldIdentity other_version{739184u, 2u};

  const double h0 = SampleHeightMeters(a, cfg, 120.5, -80.25);
  const double h1 = SampleHeightMeters(b, cfg, 120.5, -80.25);
  if (h0 != h1) {
    Fail("same identity must match exactly");
  }

  const double h_seed = SampleHeightMeters(other_seed, cfg, 120.5, -80.25);
  const double h_ver = SampleHeightMeters(other_version, cfg, 120.5, -80.25);
  if (h0 == h_seed) {
    Fail("different seed should change height at this sample");
  }
  if (h0 == h_ver) {
    Fail("different generation version should change height at this sample");
  }

  const double spacing = cfg.chunk_meters / static_cast<double>(cfg.verts_per_side - 1);
  const auto chunk = ChunkAt(0.0, 0.0, cfg);
  const double origin_x = ChunkOriginMeters(chunk.x, cfg);
  const double origin_z = ChunkOriginMeters(chunk.z, cfg);
  const double seam_x = origin_x + cfg.chunk_meters;
  const double z_sample = origin_z + spacing * 3.0;
  const double left = SampleHeightMeters(a, cfg, seam_x, z_sample);
  const auto east = ChunkAt(seam_x + 0.01, z_sample, cfg);
  const double east_origin = ChunkOriginMeters(east.x, cfg);
  const double right = SampleHeightMeters(a, cfg, east_origin, z_sample);
  if (std::abs(left - right) > 1e-9) {
    std::fprintf(stderr, "seam left=%.17g right=%.17g\n", left, right);
    Fail("chunk seam heights must match");
  }

  int above = 0;
  int below = 0;
  double max_h = -1.0e9;
  double min_h = 1.0e9;
  for (int z = 0; z < 64; ++z) {
    for (int x = 0; x < 64; ++x) {
      const double xm = -4096.0 + (static_cast<double>(x) + 0.5) * (8192.0 / 64.0);
      const double zm = -4096.0 + (static_cast<double>(z) + 0.5) * (8192.0 / 64.0);
      const double h = SampleHeightMeters(a, cfg, xm, zm);
      min_h = h < min_h ? h : min_h;
      max_h = h > max_h ? h : max_h;
      if (h >= 0.0) {
        ++above;
      } else {
        ++below;
      }
    }
  }
  if (above == 0 || below == 0) {
    std::fprintf(stderr, "land=%d ocean=%d min=%.3f max=%.3f\n", above, below, min_h, max_h);
    Fail("expected both land and ocean samples across 8km");
  }
  if (max_h < 80.0) {
    Fail("expected mountain-scale relief");
  }

  std::printf("ok seed=%u version=%u sample=%.4f min=%.1f max=%.1f land=%d ocean=%d\n", a.seed,
              a.generation_version, h0, min_h, max_h, above, below);
  return 0;
}
