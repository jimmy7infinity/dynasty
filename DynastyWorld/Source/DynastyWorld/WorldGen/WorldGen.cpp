#include "WorldGen.h"

#include <cmath>

namespace dynasty::world {
namespace {

std::uint32_t Pcg(std::uint32_t x) {
  x ^= x >> 16;
  x *= 0x7feb352du;
  x ^= x >> 15;
  x *= 0x846ca68bu;
  x ^= x >> 16;
  return x;
}

double Smooth(double t) {
  return t * t * (3.0 - 2.0 * t);
}

std::uint32_t Lattice(std::uint32_t stream, int x, int z) {
  std::uint32_t h = Pcg(stream);
  h = Pcg(h ^ static_cast<std::uint32_t>(x) * 0x9E3779B9u);
  h = Pcg(h ^ static_cast<std::uint32_t>(z) * 0x85EBCA6Bu);
  return h;
}

double Clamp01(double t) {
  if (t < 0.0) {
    return 0.0;
  }
  if (t > 1.0) {
    return 1.0;
  }
  return t;
}

double ValueNoise(std::uint32_t stream, double x, double z) {
  const double x0d = std::floor(x);
  const double z0d = std::floor(z);
  const int x0 = static_cast<int>(x0d);
  const int z0 = static_cast<int>(z0d);
  const double tx = Smooth(x - x0d);
  const double tz = Smooth(z - z0d);

  const double v00 = Hash01(Lattice(stream, x0, z0));
  const double v10 = Hash01(Lattice(stream, x0 + 1, z0));
  const double v01 = Hash01(Lattice(stream, x0, z0 + 1));
  const double v11 = Hash01(Lattice(stream, x0 + 1, z0 + 1));

  const double a = v00 + (v10 - v00) * tx;
  const double b = v01 + (v11 - v01) * tx;
  return a + (b - a) * tz;
}

double Fbm(std::uint32_t stream, double x, double z, int octaves) {
  double sum = 0.0;
  double amp = 1.0;
  double freq = 1.0;
  double norm = 0.0;
  for (int i = 0; i < octaves; ++i) {
    sum += amp * ValueNoise(stream + static_cast<std::uint32_t>(i) * 101u, x * freq, z * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}

double Ridge(std::uint32_t stream, double x, double z, int octaves) {
  const double n = Fbm(stream, x, z, octaves);
  const double r = 1.0 - std::abs(n * 2.0 - 1.0);
  return r * r;
}

}  // namespace

std::uint32_t MixSeed(WorldIdentity id, StreamDomain domain, std::int32_t ix, std::int32_t iz) {
  std::uint32_t h = Pcg(id.seed ^ 0xA341316Cu);
  h = Pcg(h ^ id.generation_version);
  h = Pcg(h ^ static_cast<std::uint32_t>(domain));
  h = Pcg(h ^ static_cast<std::uint32_t>(ix) * 0x9E3779B9u);
  h = Pcg(h ^ static_cast<std::uint32_t>(iz) * 0x85EBCA6Bu);
  return h;
}

double Hash01(std::uint32_t n) {
  return static_cast<double>(Pcg(n)) / 4294967295.0;
}

ChunkCoord ChunkAt(double x_meters, double z_meters, const WorldGenConfig& cfg) {
  const double half = cfg.extent_meters * 0.5;
  const double local_x = x_meters + half;
  const double local_z = z_meters + half;
  ChunkCoord c;
  c.x = static_cast<std::int32_t>(std::floor(local_x / cfg.chunk_meters));
  c.z = static_cast<std::int32_t>(std::floor(local_z / cfg.chunk_meters));
  return c;
}

double ChunkOriginMeters(std::int32_t index, const WorldGenConfig& cfg) {
  const double half = cfg.extent_meters * 0.5;
  return -half + static_cast<double>(index) * cfg.chunk_meters;
}

double SampleHeightMeters(WorldIdentity id, const WorldGenConfig& cfg, double x_meters, double z_meters) {
  const std::uint32_t height_stream = MixSeed(id, StreamDomain::Height, 0, 0);

  const double nx = x_meters * 0.00022;
  const double nz = z_meters * 0.00022;
  const double continent = Smooth(Clamp01((Fbm(height_stream, nx, nz, 5) - 0.36) / 0.28));
  const double land = continent;

  const double hills = (Fbm(height_stream + 17u, x_meters * 0.0011, z_meters * 0.0011, 4) - 0.5) * 70.0;
  const double mountains = Ridge(height_stream + 91u, x_meters * 0.00048, z_meters * 0.00048, 4) * 560.0;
  const double valleys = Fbm(height_stream + 140u, x_meters * 0.0007, z_meters * 0.0007, 3) * 90.0;

  const double land_height = 12.0 + hills + mountains * land - valleys * 0.35;
  const double ocean_floor = -38.0 + Fbm(height_stream + 200u, x_meters * 0.0008, z_meters * 0.0008, 3) * 16.0;

  const double h = ocean_floor + (land_height - ocean_floor) * land;
  return h - cfg.sea_level_meters;
}

}  // namespace dynasty::world
