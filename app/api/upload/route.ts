import { NextResponse, type NextRequest } from "next/server";
import { isAssetType } from "@/lib/asset-types";
import { prepareAssetFile } from "@/lib/asset-files";
import { saveAsset, uploadStoredAsset } from "@/lib/assets";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const brandId = String(formData.get("brandId") ?? "").trim();
    const assetType = String(formData.get("assetType") ?? "").trim();
    const file = formData.get("file");

    if (!brandId || !isAssetType(assetType) || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Choose a brand, type and file." },
        { status: 400 },
      );
    }

    const prepared = await prepareAssetFile(file, brandId, assetType);
    const stored = await uploadStoredAsset(
      prepared.path,
      prepared.body,
      prepared.contentType,
    );

    if (stored.error) {
      return NextResponse.json({ error: stored.error }, { status: 500 });
    }

    const error = await saveAsset({
      brand_id: brandId,
      asset_type: assetType,
      file_url: stored.publicUrl,
      original_filename: file.name,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ fileUrl: stored.publicUrl });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Upload failed.";
}
