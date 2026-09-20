#include "DynastyWorldHUD.h"

#include "Engine/Canvas.h"
#include "Engine/Engine.h"
#include "Presentation/DynastyWorldCharacter.h"
#include "Presentation/DynastyWorldGameState.h"
#include "Presentation/WorldAdapter.h"
#include "Presentation/WorldTerrainSubsystem.h"

void ADynastyWorldHUD::DrawHUD()
{
	Super::DrawHUD();
	if (Canvas == nullptr || GEngine == nullptr)
	{
		return;
	}

	UFont* Font = GEngine->GetSmallFont();
	if (Font == nullptr)
	{
		return;
	}

	int32 Seed = 0;
	int32 Version = 0;
	if (const ADynastyWorldGameState* State = GetWorld()->GetGameState<ADynastyWorldGameState>())
	{
		Seed = State->WorldSeed;
		Version = State->GenerationVersion;
	}

	FVector Location = FVector::ZeroVector;
	if (APawn* Pawn = GetOwningPawn())
	{
		Location = Pawn->GetActorLocation();
	}

	float CameraMeters = 0.0f;
	if (const ADynastyWorldCharacter* Character = Cast<ADynastyWorldCharacter>(GetOwningPawn()))
	{
		CameraMeters = Character->GetCameraArmLength() / 100.0f;
	}

	double XMeters = 0.0;
	double ZMeters = 0.0;
	DynastyWorld::WorldMetersFromLocation(Location, XMeters, ZMeters);

	int32 Loaded = 0;
	int32 Generated = 0;
	double GenMs = 0.0;
	FString ChunkText = TEXT("n/a");
	if (UWorldTerrainSubsystem* Terrain = GetWorld()->GetSubsystem<UWorldTerrainSubsystem>())
	{
		Loaded = Terrain->GetLoadedChunkCount();
		Generated = Terrain->GetGeneratedChunkCount();
		GenMs = Terrain->GetLastGenerationMilliseconds();
		const FIntPoint Chunk = Terrain->ChunkAtLocation(Location);
		ChunkText = FString::Printf(TEXT("%d, %d"), Chunk.X, Chunk.Y);
	}

	const float Dt = GetWorld()->GetDeltaSeconds();
	const float Fps = Dt > 0.0f ? 1.0f / Dt : 0.0f;

	const FPlatformMemoryStats Mem = FPlatformMemory::GetStats();
	const double UsedMb = static_cast<double>(Mem.UsedPhysical) / (1024.0 * 1024.0);

	const FString Lines = FString::Printf(
		TEXT("Dynasty World M1\nSeed %d  gen %d\nPos %.1f, %.1f m  z %.1f m\nChunk %s\nCamera %.0f m\nFPS %.0f  frame %.2f ms\nChunks loaded %d  generated %d\nLast chunk gen %.2f ms\nMem %.0f MB"),
		Seed, Version, XMeters, ZMeters, Location.Z / 100.0, *ChunkText, CameraMeters, Fps, Dt * 1000.0f, Loaded,
		Generated, GenMs, UsedMb);

	FCanvasTextItem Item(FVector2D(18.0, 18.0), FText::FromString(Lines), Font, FLinearColor::White);
	Item.EnableShadow(FLinearColor::Black);
	Canvas->DrawItem(Item);
}
