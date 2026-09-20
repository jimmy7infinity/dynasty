#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "DynastyWorldGameMode.generated.h"

UCLASS()
class DYNASTYWORLD_API ADynastyWorldGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	ADynastyWorldGameMode();

protected:
	virtual void StartPlay() override;
	virtual void BeginPlay() override;
	virtual void RestartPlayer(AController* NewPlayer) override;

private:
	void EnsureWorldGenerated();
	void StripStockMapGeometry();
};
