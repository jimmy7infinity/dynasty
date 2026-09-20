#include "WorldTerrainChunk.h"

#include "Materials/MaterialInterface.h"
#include "Presentation/WorldAdapter.h"
#include "ProceduralMeshComponent.h"
#include "WorldGen/WorldGen.h"

namespace
{
FColor HeightColor(double HeightMeters)
{
	if (HeightMeters < 0.0)
	{
		return FColor(28, 72, 118);
	}
	if (HeightMeters < 6.0)
	{
		return FColor(214, 196, 148);
	}
	if (HeightMeters < 90.0)
	{
		return FColor(92, 130, 74);
	}
	if (HeightMeters < 220.0)
	{
		return FColor(110, 108, 90);
	}
	return FColor(232, 232, 236);
}
}  // namespace

AWorldTerrainChunk::AWorldTerrainChunk()
{
	PrimaryActorTick.bCanEverTick = false;
	Mesh = CreateDefaultSubobject<UProceduralMeshComponent>(TEXT("Mesh"));
	SetRootComponent(Mesh);
	Mesh->bUseComplexAsSimpleCollision = true;
	Mesh->SetCollisionEnabled(ECollisionEnabled::QueryAndPhysics);
	Mesh->SetCollisionObjectType(ECC_WorldStatic);
	Mesh->SetCollisionResponseToAllChannels(ECR_Block);
	Mesh->SetCanEverAffectNavigation(true);
	Mesh->SetGenerateOverlapEvents(false);
}

void AWorldTerrainChunk::Build(int32 Seed, int32 GenerationVersion, FIntPoint InCoord, double& OutMilliseconds)
{
	const double Start = FPlatformTime::Seconds();
	Coord = InCoord;

	const dynasty::world::WorldIdentity Identity = DynastyWorld::MakeIdentity(Seed, GenerationVersion);
	const dynasty::world::WorldGenConfig Config = DynastyWorld::DefaultConfig();

	const int Verts = Config.verts_per_side;
	const double Spacing = Config.chunk_meters / static_cast<double>(Verts - 1);
	const double OriginX = dynasty::world::ChunkOriginMeters(InCoord.X, Config);
	const double OriginZ = dynasty::world::ChunkOriginMeters(InCoord.Y, Config);

	TArray<FVector> Vertices;
	TArray<FVector> Normals;
	TArray<FVector2D> UVs;
	TArray<int32> Indices;
	TArray<FColor> Colors;
	TArray<FProcMeshTangent> Tangents;
	Vertices.Reserve(Verts * Verts);
	Normals.Reserve(Verts * Verts);
	UVs.Reserve(Verts * Verts);
	Indices.Reserve((Verts - 1) * (Verts - 1) * 6);

	for (int Z = 0; Z < Verts; ++Z)
	{
		for (int X = 0; X < Verts; ++X)
		{
			const double XM = OriginX + static_cast<double>(X) * Spacing;
			const double ZM = OriginZ + static_cast<double>(Z) * Spacing;
			const double H = dynasty::world::SampleHeightMeters(Identity, Config, XM, ZM);
			const FVector World = DynastyWorld::WorldLocationFromMeters(XM, H, ZM);
			Vertices.Add(World - FVector(OriginX * 100.0, OriginZ * 100.0, 0.0));
			UVs.Add(FVector2D(XM / 16.0, ZM / 16.0));
			Colors.Add(HeightColor(H));
		}
	}

	auto HeightAt = [&](int X, int Z) {
		X = FMath::Clamp(X, 0, Verts - 1);
		Z = FMath::Clamp(Z, 0, Verts - 1);
		return Vertices[Z * Verts + X].Z;
	};

	const double Horizontal = Spacing * 100.0;
	for (int Z = 0; Z < Verts; ++Z)
	{
		for (int X = 0; X < Verts; ++X)
		{
			const double Dx = HeightAt(X + 1, Z) - HeightAt(X - 1, Z);
			const double Dy = HeightAt(X, Z + 1) - HeightAt(X, Z - 1);
			FVector N(-Dx, -Dy, Horizontal * 2.0);
			N.Normalize();
			Normals.Add(N);
			Tangents.Add(FProcMeshTangent(FVector::ForwardVector, false));
		}
	}

	for (int Z = 0; Z < Verts - 1; ++Z)
	{
		for (int X = 0; X < Verts - 1; ++X)
		{
			const int I00 = Z * Verts + X;
			const int I10 = I00 + 1;
			const int I01 = I00 + Verts;
			const int I11 = I01 + 1;
			Indices.Add(I00);
			Indices.Add(I01);
			Indices.Add(I10);
			Indices.Add(I10);
			Indices.Add(I01);
			Indices.Add(I11);
		}
	}

	SetActorLocation(FVector(OriginX * 100.0, OriginZ * 100.0, 0.0));
	Mesh->CreateMeshSection(0, Vertices, Indices, Normals, UVs, Colors, Tangents, true);
	UMaterialInterface* Grid = LoadObject<UMaterialInterface>(nullptr, TEXT("/Engine/EngineMaterials/WorldGridMaterial.WorldGridMaterial"));
	if (Grid != nullptr)
	{
		Mesh->SetMaterial(0, Grid);
	}

	OutMilliseconds = (FPlatformTime::Seconds() - Start) * 1000.0;
}
