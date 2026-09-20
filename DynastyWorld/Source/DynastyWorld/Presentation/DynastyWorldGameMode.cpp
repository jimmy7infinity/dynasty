#include "DynastyWorldGameMode.h"

#include "Engine/StaticMeshActor.h"
#include "Engine/World.h"
#include "EngineUtils.h"
#include "GameFramework/GameStateBase.h"
#include "GameFramework/HUD.h"
#include "GameFramework/PlayerStart.h"
#include "Presentation/DynastyWorldCharacter.h"
#include "Presentation/DynastyWorldGameState.h"
#include "Presentation/DynastyWorldHUD.h"
#include "Presentation/DynastyWorldPlayerController.h"
#include "Presentation/WorldTerrainChunk.h"
#include "Presentation/WorldTerrainSubsystem.h"

ADynastyWorldGameMode::ADynastyWorldGameMode()
{
	DefaultPawnClass = ADynastyWorldCharacter::StaticClass();
	PlayerControllerClass = ADynastyWorldPlayerController::StaticClass();
	HUDClass = ADynastyWorldHUD::StaticClass();
	GameStateClass = ADynastyWorldGameState::StaticClass();
}

void ADynastyWorldGameMode::EnsureWorldGenerated()
{
	const int32 Seed = 739184;
	const int32 Version = 1;
	if (ADynastyWorldGameState* State = GetGameState<ADynastyWorldGameState>())
	{
		State->WorldSeed = Seed;
		State->GenerationVersion = Version;
	}

	if (UWorld* World = GetWorld())
	{
		if (UWorldTerrainSubsystem* Terrain = World->GetSubsystem<UWorldTerrainSubsystem>())
		{
			Terrain->InitializeWorld(Seed, Version);
		}
	}
}

void ADynastyWorldGameMode::StripStockMapGeometry()
{
	UWorld* World = GetWorld();
	if (World == nullptr)
	{
		return;
	}

	TArray<AActor*> ToDestroy;
	for (TActorIterator<AActor> It(World); It; ++It)
	{
		AActor* Actor = *It;
		if (Actor == nullptr || Actor->IsA<AWorldTerrainChunk>() || Actor->IsA<APawn>()
			|| Actor->IsA<APlayerController>() || Actor->IsA<AHUD>() || Actor->IsA<AGameStateBase>()
			|| Actor->IsA<APlayerStart>())
		{
			continue;
		}
		if (Actor->IsA<AStaticMeshActor>() || Actor->GetName().Contains(TEXT("Floor"))
			|| Actor->GetName().Contains(TEXT("Cube")))
		{
			if (UWorldTerrainSubsystem* Terrain = World->GetSubsystem<UWorldTerrainSubsystem>())
			{
				if (Actor == Terrain->GetWaterPlane())
				{
					continue;
				}
			}
			ToDestroy.Add(Actor);
		}
	}
	for (AActor* Actor : ToDestroy)
	{
		Actor->Destroy();
	}
}

void ADynastyWorldGameMode::StartPlay()
{
	EnsureWorldGenerated();
	StripStockMapGeometry();
	Super::StartPlay();
}

void ADynastyWorldGameMode::BeginPlay()
{
	Super::BeginPlay();
	EnsureWorldGenerated();
	StripStockMapGeometry();
}

void ADynastyWorldGameMode::RestartPlayer(AController* NewPlayer)
{
	EnsureWorldGenerated();
	Super::RestartPlayer(NewPlayer);
	UWorld* World = GetWorld();
	if (World == nullptr || NewPlayer == nullptr || NewPlayer->GetPawn() == nullptr)
	{
		return;
	}
	if (UWorldTerrainSubsystem* Terrain = World->GetSubsystem<UWorldTerrainSubsystem>())
	{
		const FVector Spawn = Terrain->FindLandSpawn();
		NewPlayer->GetPawn()->SetActorLocation(Spawn, false, nullptr, ETeleportType::TeleportPhysics);
		UE_LOG(LogTemp, Display, TEXT("DynastyWorld: spawn at %s loaded=%d"), *Spawn.ToCompactString(),
			Terrain->GetLoadedChunkCount());
	}
}
