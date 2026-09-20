#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "DynastyWorldPlayerController.generated.h"

class ADynastyWorldCharacter;

UCLASS()
class DYNASTYWORLD_API ADynastyWorldPlayerController : public APlayerController
{
	GENERATED_BODY()

public:
	ADynastyWorldPlayerController();

protected:
	virtual void BeginPlay() override;
	virtual void SetupInputComponent() override;
	virtual void PlayerTick(float DeltaTime) override;

private:
	void OnRightClick();
	void OnZoom(float AxisValue);
	void ApplyHeldPan(float DeltaTime);

	ADynastyWorldCharacter* GetWorldCharacter() const;
};
