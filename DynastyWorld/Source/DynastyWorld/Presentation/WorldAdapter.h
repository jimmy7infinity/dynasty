#pragma once

#include "CoreMinimal.h"
#include "WorldGen/WorldGen.h"

namespace DynastyWorld
{
inline dynasty::world::WorldIdentity MakeIdentity(int32 Seed, int32 GenerationVersion)
{
	dynasty::world::WorldIdentity Id;
	Id.seed = static_cast<std::uint32_t>(Seed);
	Id.generation_version = static_cast<std::uint32_t>(GenerationVersion);
	return Id;
}

inline dynasty::world::WorldGenConfig DefaultConfig()
{
	return dynasty::world::WorldGenConfig{};
}

inline FVector WorldLocationFromMeters(double XMeters, double HeightMeters, double ZMeters)
{
	return FVector(XMeters * 100.0, ZMeters * 100.0, HeightMeters * 100.0);
}

inline void WorldMetersFromLocation(const FVector& Location, double& OutXMeters, double& OutZMeters)
{
	OutXMeters = Location.X / 100.0;
	OutZMeters = Location.Y / 100.0;
}
}  // namespace DynastyWorld
