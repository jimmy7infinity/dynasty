#pragma once

#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "DynastyWorldHUD.generated.h"

UCLASS()
class DYNASTYWORLD_API ADynastyWorldHUD : public AHUD
{
	GENERATED_BODY()

public:
	virtual void DrawHUD() override;
};
