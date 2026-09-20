#include "WorldTerrainSubsystem.h"

#include "Engine/StaticMesh.h"
#include "Engine/StaticMeshActor.h"
#include "Engine/World.h"
#include "GameFramework/Pawn.h"
#include "GameFramework/PlayerController.h"
#include "Presentation/WorldAdapter.h"
#include "Presentation/WorldTerrainChunk.h"
#include "WorldGen/WorldGen.h"

TStatId UWorldTerrainSubsystem::GetStatId() const
{
	RETURN_QUICK_DECLARE_CYCLE_STAT(UWorldTerrainSubsystem, STATGROUP_Tickables);
}

void UWorldTerrainSubsystem::InitializeWorld(int32 Seed, int32 InGenerationVersion)
{
	if (bInitialized)
	{
		return;
	}
	WorldSeed = Seed;
	GenerationVersion = InGenerationVersion;
	bInitialized = true;
	UE_LOG(LogTemp, Display, TEXT("DynastyWorld: seed=%d gen=%d extent=8192m chunk=128m"), WorldSeed, GenerationVersion);
	EnsureWater();
	UpdateAround(FVector::ZeroVector);
}

FIntPoint UWorldTerrainSubsystem::ChunkAtLocation(const FVector& WorldLocation) const
{
	double XMeters = 0.0;
	double ZMeters = 0.0;
	DynastyWorld::WorldMetersFromLocation(WorldLocation, XMeters, ZMeters);
	const dynasty::world::ChunkCoord Coord =
		dynasty::world::ChunkAt(XMeters, ZMeters, DynastyWorld::DefaultConfig());
	return FIntPoint(Coord.x, Coord.z);
}

FVector UWorldTerrainSubsystem::FindLandSpawn() const
{
	const dynasty::world::WorldIdentity Identity = DynastyWorld::MakeIdentity(WorldSeed, GenerationVersion);
	const dynasty::world::WorldGenConfig Config = DynastyWorld::DefaultConfig();
	for (int Ring = 0; Ring < 64; ++Ring)
	{
		const double Step = 48.0;
		for (int I = 0; I < 12; ++I)
		{
			const double Angle = static_cast<double>(I) / 12.0 * 2.0 * PI;
			const double X = FMath::Cos(Angle) * Step * Ring;
			const double Z = FMath::Sin(Angle) * Step * Ring;
			const double H = dynasty::world::SampleHeightMeters(Identity, Config, X, Z);
			if (H >= 4.0)
			{
				return DynastyWorld::WorldLocationFromMeters(X, H + 1.0, Z);
			}
		}
	}
	return DynastyWorld::WorldLocationFromMeters(0.0, 20.0, 0.0);
}

void UWorldTerrainSubsystem::Tick(float DeltaTime)
{
	(void)DeltaTime;
	UWorld* World = GetWorld();
	if (World == nullptr)
	{
		return;
	}
	if (APlayerController* PC = World->GetFirstPlayerController())
	{
		if (APawn* Pawn = PC->GetPawn())
		{
			UpdateAround(Pawn->GetActorLocation());
		}
	}
}

void UWorldTerrainSubsystem::EnsureWater()
{
	UWorld* World = GetWorld();
	if (World == nullptr || WaterPlane != nullptr)
	{
		return;
	}

	FActorSpawnParameters Params;
	Params.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AlwaysSpawn;
	WaterPlane = World->SpawnActor<AStaticMeshActor>(FVector::ZeroVector, FRotator::ZeroRotator, Params);
	if (WaterPlane == nullptr)
	{
		return;
	}

	UStaticMesh* Plane = LoadObject<UStaticMesh>(nullptr, TEXT("/Engine/BasicShapes/Plane.Plane"));
	if (Plane == nullptr || WaterPlane->GetStaticMeshComponent() == nullptr)
	{
		return;
	}

	const dynasty::world::WorldGenConfig Config = DynastyWorld::DefaultConfig();
	WaterPlane->SetMobility(EComponentMobility::Movable);
	WaterPlane->GetStaticMeshComponent()->SetStaticMesh(Plane);
	WaterPlane->SetActorScale3D(FVector(Config.extent_meters, Config.extent_meters, 1.0));
	WaterPlane->GetStaticMeshComponent()->SetCollisionEnabled(ECollisionEnabled::NoCollision);
	WaterPlane->SetActorLocation(FVector(0.0, 0.0, Config.sea_level_meters * 100.0));
}

void UWorldTerrainSubsystem::UpdateAround(const FVector& WorldLocation)
{
	UWorld* World = GetWorld();
	if (World == nullptr)
	{
		return;
	}

	const FIntPoint Center = ChunkAtLocation(WorldLocation);
	const dynasty::world::WorldGenConfig Config = DynastyWorld::DefaultConfig();
	const int MaxIndex = static_cast<int>(Config.extent_meters / Config.chunk_meters) - 1;
	TSet<FIntPoint> Needed;
	for (int Z = Center.Y - LoadRadiusChunks; Z <= Center.Y + LoadRadiusChunks; ++Z)
	{
		for (int X = Center.X - LoadRadiusChunks; X <= Center.X + LoadRadiusChunks; ++X)
		{
			if (X < 0 || Z < 0 || X > MaxIndex || Z > MaxIndex)
			{
				continue;
			}
			const FIntPoint Key(X, Z);
			Needed.Add(Key);
			if (!Loaded.Contains(Key))
			{
				LoadChunk(Key);
			}
		}
	}

	TArray<FIntPoint> ToRemove;
	for (const auto& Pair : Loaded)
	{
		if (!Needed.Contains(Pair.Key))
		{
			ToRemove.Add(Pair.Key);
		}
	}
	for (const FIntPoint& Key : ToRemove)
	{
		if (AWorldTerrainChunk* Chunk = Loaded.FindRef(Key))
		{
			Chunk->Destroy();
		}
		Loaded.Remove(Key);
	}
}

void UWorldTerrainSubsystem::LoadChunk(FIntPoint Coord)
{
	UWorld* World = GetWorld();
	if (World == nullptr)
	{
		return;
	}

	FActorSpawnParameters Params;
	Params.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AlwaysSpawn;
	AWorldTerrainChunk* Chunk = World->SpawnActor<AWorldTerrainChunk>(Params);
	if (Chunk == nullptr)
	{
		return;
	}

	double Ms = 0.0;
	Chunk->Build(WorldSeed, GenerationVersion, Coord, Ms);
	LastGenerationMs = Ms;
	++GeneratedCount;
	Loaded.Add(Coord, Chunk);
	UE_LOG(LogTemp, Verbose, TEXT("DynastyWorld: loaded chunk %d,%d in %.2f ms (loaded=%d generated=%d)"), Coord.X, Coord.Y,
		Ms, Loaded.Num(), GeneratedCount);
}
