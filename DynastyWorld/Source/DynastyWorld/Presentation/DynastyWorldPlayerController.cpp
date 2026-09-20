#include "DynastyWorldPlayerController.h"

#include "Components/InputComponent.h"
#include "Engine/World.h"
#include "Presentation/DynastyWorldCharacter.h"

ADynastyWorldPlayerController::ADynastyWorldPlayerController()
{
	bShowMouseCursor = true;
	bEnableClickEvents = true;
	bEnableMouseOverEvents = true;
	DefaultMouseCursor = EMouseCursor::Crosshairs;
}

void ADynastyWorldPlayerController::BeginPlay()
{
	Super::BeginPlay();
	FInputModeGameAndUI Mode;
	Mode.SetHideCursorDuringCapture(false);
	Mode.SetLockMouseToViewportBehavior(EMouseLockMode::DoNotLock);
	SetInputMode(Mode);
}

void ADynastyWorldPlayerController::SetupInputComponent()
{
	Super::SetupInputComponent();
	InputComponent->BindKey(EKeys::RightMouseButton, IE_Pressed, this, &ADynastyWorldPlayerController::OnRightClick);
	InputComponent->BindAxisKey(EKeys::MouseWheelAxis, this, &ADynastyWorldPlayerController::OnZoom);
}

void ADynastyWorldPlayerController::PlayerTick(float DeltaTime)
{
	Super::PlayerTick(DeltaTime);
	ApplyHeldPan(DeltaTime);
}

ADynastyWorldCharacter* ADynastyWorldPlayerController::GetWorldCharacter() const
{
	return Cast<ADynastyWorldCharacter>(GetPawn());
}

void ADynastyWorldPlayerController::OnRightClick()
{
	ADynastyWorldCharacter* Character = GetWorldCharacter();
	if (Character == nullptr)
	{
		return;
	}

	FHitResult Hit;
	if (GetHitResultUnderCursor(ECC_Visibility, true, Hit)
		|| GetHitResultUnderCursor(ECC_WorldStatic, true, Hit))
	{
		Character->SetMoveTarget(Hit.Location);
	}
}

void ADynastyWorldPlayerController::OnZoom(float AxisValue)
{
	if (ADynastyWorldCharacter* Character = GetWorldCharacter())
	{
		Character->AddCameraZoom(-AxisValue * 2800.0f);
	}
}

void ADynastyWorldPlayerController::ApplyHeldPan(float DeltaTime)
{
	ADynastyWorldCharacter* Character = GetWorldCharacter();
	if (Character == nullptr)
	{
		return;
	}

	const float Speed = 4200.0f * DeltaTime;
	FVector2D Pan = FVector2D::ZeroVector;
	if (IsInputKeyDown(EKeys::W) || IsInputKeyDown(EKeys::Up))
	{
		Pan.Y += Speed;
	}
	if (IsInputKeyDown(EKeys::S) || IsInputKeyDown(EKeys::Down))
	{
		Pan.Y -= Speed;
	}
	if (IsInputKeyDown(EKeys::D) || IsInputKeyDown(EKeys::Right))
	{
		Pan.X += Speed;
	}
	if (IsInputKeyDown(EKeys::A) || IsInputKeyDown(EKeys::Left))
	{
		Pan.X -= Speed;
	}
	if (IsInputKeyDown(EKeys::Q))
	{
		Character->AddCameraYaw(-40.0f * DeltaTime);
	}
	if (IsInputKeyDown(EKeys::E))
	{
		Character->AddCameraYaw(40.0f * DeltaTime);
	}

	if (IsInputKeyDown(EKeys::MiddleMouseButton))
	{
		float Dx = 0.0f;
		float Dy = 0.0f;
		GetInputMouseDelta(Dx, Dy);
		Pan.X += Dx * 25.0f;
		Pan.Y += Dy * 25.0f;
	}

	if (!Pan.IsNearlyZero())
	{
		Character->AddCameraPan(Pan);
	}
}
