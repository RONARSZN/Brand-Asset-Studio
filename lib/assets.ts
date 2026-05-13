import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type Asset = {
  id: string;
  brand_id: string;
  asset_type: string;
  file_url: string;
  original_filename: string;
  created_at: string;
};

export type AssetResult = {
  assets: Asset[];
  error?: string;
};

export async function listAssetsByBrand(brandId?: string): Promise<AssetResult> {
  if (!brandId) {
    return { assets: [] };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("assets")
      .select("id, brand_id, asset_type, file_url, original_filename, created_at")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });

    if (error) {
      return { assets: [], error: error.message };
    }

    return { assets: data ?? [] };
  } catch (error) {
    return { assets: [], error: getErrorMessage(error) };
  }
}

export async function saveAsset(asset: Omit<Asset, "id" | "created_at">) {
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("assets").insert(asset);
    return error?.message ?? null;
  } catch (error) {
    return getErrorMessage(error);
  }
}

export async function deleteAsset(id: string) {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("assets")
      .select("file_url")
      .eq("id", id)
      .single();

    if (error) {
      return error.message;
    }

    await removeStoredAsset(data.file_url);
    const deleted = await supabase.from("assets").delete().eq("id", id);
    return deleted.error?.message ?? null;
  } catch (error) {
    return getErrorMessage(error);
  }
}

export async function uploadStoredAsset(
  path: string,
  body: Buffer,
  contentType: string,
) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from("assets").upload(path, body, {
    contentType,
    upsert: false,
  });

  if (error) {
    return { publicUrl: "", error: error.message };
  }

  const { data } = supabase.storage.from("assets").getPublicUrl(path);
  return { publicUrl: data.publicUrl, error: null };
}

async function removeStoredAsset(fileUrl: string) {
  const path = fileUrl.split("/assets/").pop();

  if (!path) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  await supabase.storage.from("assets").remove([decodeURIComponent(path)]);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected asset error.";
}
