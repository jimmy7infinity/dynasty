#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameStateBase.h"
#include "DynastyWorldGameState.generated.h"

UCLASS()
class DYNASTYWORLD_API ADynastyWorldGameState : public AGameStateBase
{
	GENERATED_BODY()

public:
	UPROPERTY(VisibleAnywhere)
	int32 WorldSeed = 739184;

	UPROPERTY(VisibleAnywhere)
	int32 GenerationVersion = 1;
};
