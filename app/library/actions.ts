"use server";

import { revalidatePath } from "next/cache";
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

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Brand action failed.";
}
