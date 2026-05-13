import { Sidebar } from "@/components/sidebar";
import { StudioShell } from "@/components/studio/studio-shell";
import { listAssetsByBrand } from "@/lib/assets";
import { listBrands } from "@/lib/brands";

type StudioPageProps = {
  searchParams?: Promise<{ brand?: string }>;
};

export default async function StudioPage({ searchParams }: StudioPageProps) {
  const { brands, error } = await listBrands();
  const params = await searchParams;
  const selectedBrandId = getSelectedBrandId(params?.brand, brands[0]?.id);
  const selectedBrand = brands.find((brand) => brand.id === selectedBrandId);
  const assets = await listAssetsByBrand(selectedBrand?.id);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-text">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-hidden">
        <section className="flex h-full min-w-0 flex-col">
          {error || assets.error ? (
            <div className="shrink-0 border-b border-red-400 bg-surface p-4 text-sm text-red-200">
              {error || assets.error}
            </div>
          ) : null}
          <StudioShell
            activeBrandId={selectedBrand?.id}
            assets={assets.assets}
            brands={brands}
          />
        </section>
      </main>
    </div>
  );
}

function getSelectedBrandId(brandId?: string, fallbackId?: string) {
  return brandId || fallbackId;
}
