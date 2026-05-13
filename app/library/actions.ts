"use server";

import { revalidatePath } from "next/cache";
import { isAssetType } from "@/lib/asset-types";
import { prepareAssetFile } from "@/lib/asset-files";
import { deleteAsset, saveAsset, uploadStoredAsset } from "@/lib/assets";
import { createBrand, deleteBrand } from "@/lib/brands";

export type BrandActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createBrandAction(
  _state: BrandActionState,
  formData: FormData,
): Promise<BrandActionState> {
  try {
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      return { status: "error", message: "Enter a brand name." };
    }

    const error = await createBrand(name);

    if (error) {
      return { status: "error", message: error };
    }

    revalidatePath("/library");
    return { status: "success", message: "Brand created." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function deleteBrandAction(formData: FormData) {
  try {
    const id = String(formData.get("id") ?? "").trim();

    if (!id) {
      return;
    }

    await deleteBrand(id);
    revalidatePath("/library");
  } catch {
    revalidatePath("/library");
  }
}

export async function uploadAssetAction(
  _state: BrandActionState,
  formData: FormData,
): Promise<BrandActionState> {
  try {
    const brandId = String(formData.get("brandId") ?? "").trim();
    const assetType = String(formData.get("assetType") ?? "").trim();
    const file = formData.get("file");

    if (!brandId || !isAssetType(assetType) || !(file instanceof File)) {
      return { status: "error", message: "Choose a brand, type and file." };
    }

    const prepared = await prepareAssetFile(file, brandId, assetType);
    const stored = await uploadStoredAsset(
      prepared.path,
      prepared.body,
      prepared.contentType,
    );

    if (stored.error) {
      return { status: "error", message: stored.error };
    }

    const error = await saveAsset({
      brand_id: brandId,
      asset_type: assetType,
      file_url: stored.publicUrl,
      original_filename: file.name,
    });

    revalidatePath("/library");
    return error ? { status: "error", message: error } : success("Asset saved.");
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function deleteAssetAction(formData: FormData) {
  try {
    const id = String(formData.get("id") ?? "").trim();

    if (id) {
      await deleteAsset(id);
    }
  } finally {
    revalidatePath("/library");
  }
}

function success(message: string): BrandActionState {
  return { status: "success", message };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Brand action failed.";
}
