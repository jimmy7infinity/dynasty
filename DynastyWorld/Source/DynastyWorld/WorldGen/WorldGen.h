#pragma once

#include <cstdint>

namespace dynasty::world {

struct WorldIdentity {
  std::uint32_t seed = 739184u;
  std::uint32_t generation_version = 1u;
};

struct WorldGenConfig {
  double extent_meters = 8192.0;
  double chunk_meters = 128.0;
  int verts_per_side = 65;
  double sea_level_meters = 0.0;
};

struct ChunkCoord {
  std::int32_t x = 0;
  std::int32_t z = 0;

  friend bool operator==(ChunkCoord a, ChunkCoord b) {
    return a.x == b.x && a.z == b.z;
  }
};

enum class StreamDomain : std::uint32_t {
  Height = 1u,
};

std::uint32_t MixSeed(WorldIdentity id, StreamDomain domain, std::int32_t ix, std::int32_t iz);
double Hash01(std::uint32_t n);

ChunkCoord ChunkAt(double x_meters, double z_meters, const WorldGenConfig& cfg);
double ChunkOriginMeters(std::int32_t index, const WorldGenConfig& cfg);

double SampleHeightMeters(WorldIdentity id, const WorldGenConfig& cfg, double x_meters, double z_meters);

}  // namespace dynasty::world
