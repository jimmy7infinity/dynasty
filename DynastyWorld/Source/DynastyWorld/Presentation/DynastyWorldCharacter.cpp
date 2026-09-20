#include "DynastyWorldCharacter.h"

#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/StaticMeshComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/SpringArmComponent.h"
#include "NavigationInvokerComponent.h"
#include "UObject/ConstructorHelpers.h"

ADynastyWorldCharacter::ADynastyWorldCharacter()
{
	PrimaryActorTick.bCanEverTick = true;
	bUseControllerRotationYaw = false;

	GetCapsuleComponent()->InitCapsuleSize(18.0f, 36.0f);

	UCharacterMovementComponent* Move = GetCharacterMovement();
	Move->bOrientRotationToMovement = true;
	Move->RotationRate = FRotator(0.0, 480.0, 0.0);
	Move->MaxWalkSpeed = 280.0f;
	Move->GravityScale = 1.0f;
	Move->bCanWalkOffLedges = true;
	Move->SetWalkableFloorAngle(55.0f);

	CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));
	CameraBoom->SetupAttachment(RootComponent);
	CameraBoom->TargetArmLength = ArmLength;
	CameraBoom->bDoCollisionTest = false;
	CameraBoom->bUsePawnControlRotation = false;
	CameraBoom->SetRelativeRotation(FRotator(-54.0f, 0.0f, 0.0f));

	FollowCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FollowCamera"));
	FollowCamera->SetupAttachment(CameraBoom, USpringArmComponent::SocketName);
	FollowCamera->bUsePawnControlRotation = false;
	FollowCamera->FieldOfView = 70.0f;

	BodyMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("BodyMesh"));
	BodyMesh->SetupAttachment(RootComponent);
	BodyMesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);
	static ConstructorHelpers::FObjectFinder<UStaticMesh> CubeMesh(TEXT("/Engine/BasicShapes/Cube.Cube"));
	if (CubeMesh.Succeeded())
	{
		BodyMesh->SetStaticMesh(CubeMesh.Object);
	}
	BodyMesh->SetRelativeScale3D(FVector(0.32f, 0.32f, 0.70f));
	BodyMesh->SetRelativeLocation(FVector(0.0f, 0.0f, -2.0f));

	NavInvoker = CreateDefaultSubobject<UNavigationInvokerComponent>(TEXT("NavInvoker"));
	NavInvoker->SetGenerationRadii(4500.0f, 6000.0f);
}

void ADynastyWorldCharacter::BeginPlay()
{
	Super::BeginPlay();
	CameraBoom->TargetArmLength = ArmLength;
}

float ADynastyWorldCharacter::GetCameraArmLength() const
{
	return ArmLength;
}

void ADynastyWorldCharacter::SetMoveTarget(const FVector& WorldLocation)
{
	MoveTarget = WorldLocation;
	bHasMoveTarget = true;
}

void ADynastyWorldCharacter::AddCameraPan(FVector2D Offset)
{
	PanOffset += Offset;
	const float Limit = FMath::Max(ArmLength * 0.85f, 8000.0f);
	PanOffset.X = FMath::Clamp(PanOffset.X, -Limit, Limit);
	PanOffset.Y = FMath::Clamp(PanOffset.Y, -Limit, Limit);
}

void ADynastyWorldCharacter::AddCameraZoom(float Delta)
{
	ArmLength = FMath::Clamp(ArmLength + Delta, MinArmLength, MaxArmLength);
	CameraBoom->TargetArmLength = ArmLength;
}

void ADynastyWorldCharacter::AddCameraYaw(float DeltaYaw)
{
	CameraYaw += DeltaYaw;
}

void ADynastyWorldCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	const float ZoomAlpha = FMath::Clamp((ArmLength - MinArmLength) / (MaxArmLength - MinArmLength), 0.0f, 1.0f);
	const float Pitch = FMath::Lerp(-48.0f, -72.0f, ZoomAlpha);
	CameraBoom->SetRelativeRotation(FRotator(Pitch, CameraYaw, 0.0f));

	const FRotator YawRot(0.0, CameraYaw, 0.0);
	const FVector Forward = FRotationMatrix(YawRot).GetUnitAxis(EAxis::X);
	const FVector Right = FRotationMatrix(YawRot).GetUnitAxis(EAxis::Y);
	CameraBoom->SetRelativeLocation(Forward * PanOffset.Y + Right * PanOffset.X);

	if (!bHasMoveTarget)
	{
		return;
	}

	FVector To = MoveTarget - GetActorLocation();
	To.Z = 0.0f;
	if (To.Size() < 40.0f)
	{
		bHasMoveTarget = false;
		return;
	}

	AddMovementInput(To.GetSafeNormal(), 1.0f);
}
