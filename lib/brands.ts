import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type Brand = {
  id: string;
  name: string;
  created_at: string;
};

export type BrandResult = {
  brands: Brand[];
  error?: string;
};

export async function listBrands(): Promise<BrandResult> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("brands")
      .select("id, name, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return { brands: [], error: error.message };
    }

    return { brands: data ?? [] };
  } catch (error) {
    return { brands: [], error: getErrorMessage(error) };
  }
}

export async function createBrand(name: string) {
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("brands").insert({ name });

    if (error) {
      return error.message;
    }

    return null;
  } catch (error) {
    return getErrorMessage(error);
  }
}

export async function deleteBrand(id: string) {
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("brands").delete().eq("id", id);

    if (error) {
      return error.message;
    }

    return null;
  } catch (error) {
    return getErrorMessage(error);
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected Supabase error.";
}
