#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WorldTerrainChunk.generated.h"

class UProceduralMeshComponent;

UCLASS()
class DYNASTYWORLD_API AWorldTerrainChunk : public AActor
{
	GENERATED_BODY()

public:
	AWorldTerrainChunk();

	void Build(int32 Seed, int32 GenerationVersion, FIntPoint Coord, double& OutMilliseconds);
	FIntPoint GetCoord() const { return Coord; }

private:
	UPROPERTY(VisibleAnywhere)
	TObjectPtr<UProceduralMeshComponent> Mesh;

	UPROPERTY(VisibleAnywhere)
	FIntPoint Coord = FIntPoint(0, 0);
};
