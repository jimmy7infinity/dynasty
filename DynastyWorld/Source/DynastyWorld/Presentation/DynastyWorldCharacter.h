#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "DynastyWorldCharacter.generated.h"

class UCameraComponent;
class USpringArmComponent;
class UNavigationInvokerComponent;
class UStaticMeshComponent;

UCLASS()
class DYNASTYWORLD_API ADynastyWorldCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	ADynastyWorldCharacter();

	virtual void Tick(float DeltaTime) override;
	void SetMoveTarget(const FVector& WorldLocation);
	void AddCameraPan(FVector2D Offset);
	void AddCameraZoom(float Delta);
	void AddCameraYaw(float DeltaYaw);

	float GetCameraArmLength() const;

protected:
	virtual void BeginPlay() override;

private:
	UPROPERTY(VisibleAnywhere)
	TObjectPtr<USpringArmComponent> CameraBoom;

	UPROPERTY(VisibleAnywhere)
	TObjectPtr<UCameraComponent> FollowCamera;

	UPROPERTY(VisibleAnywhere)
	TObjectPtr<UStaticMeshComponent> BodyMesh;

	UPROPERTY(VisibleAnywhere)
	TObjectPtr<UNavigationInvokerComponent> NavInvoker;

	FVector MoveTarget = FVector::ZeroVector;
	bool bHasMoveTarget = false;
	FVector2D PanOffset = FVector2D::ZeroVector;
	float ArmLength = 14000.0f;
	float CameraYaw = 0.0f;
	static constexpr float MinArmLength = 700.0f;
	static constexpr float MaxArmLength = 280000.0f;
};
