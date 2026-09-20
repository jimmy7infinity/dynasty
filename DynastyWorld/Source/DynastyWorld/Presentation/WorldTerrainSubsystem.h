#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "WorldTerrainSubsystem.generated.h"

class AWorldTerrainChunk;
class AStaticMeshActor;

UCLASS()
class DYNASTYWORLD_API UWorldTerrainSubsystem : public UTickableWorldSubsystem
{
	GENERATED_BODY()

public:
	void InitializeWorld(int32 Seed, int32 GenerationVersion);
	void UpdateAround(const FVector& WorldLocation);
	FVector FindLandSpawn() const;

	int32 GetLoadedChunkCount() const { return Loaded.Num(); }
	int32 GetGeneratedChunkCount() const { return GeneratedCount; }
	double GetLastGenerationMilliseconds() const { return LastGenerationMs; }
	FIntPoint ChunkAtLocation(const FVector& WorldLocation) const;
	AStaticMeshActor* GetWaterPlane() const { return WaterPlane; }

	virtual TStatId GetStatId() const override;
	virtual void Tick(float DeltaTime) override;
	virtual bool IsTickable() const override { return bInitialized; }
	virtual bool IsTickableInEditor() const override { return false; }

private:
	void EnsureWater();
	void LoadChunk(FIntPoint Coord);

	int32 WorldSeed = 739184;
	int32 GenerationVersion = 1;
	bool bInitialized = false;
	int32 LoadRadiusChunks = 6;
	int32 GeneratedCount = 0;
	double LastGenerationMs = 0.0;

	UPROPERTY()
	TMap<FIntPoint, TObjectPtr<AWorldTerrainChunk>> Loaded;

	UPROPERTY()
	TObjectPtr<AStaticMeshActor> WaterPlane;
};
