import { Sidebar } from "@/components/sidebar";
import { BrandManager } from "@/components/brand-manager";
import { listAssetsByBrand } from "@/lib/assets";
import { listBrands } from "@/lib/brands";

type LibraryPageProps = {
  searchParams?: Promise<{ brand?: string }>;
};

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { brands, error } = await listBrands();
  const params = await searchParams;
  const selectedBrandId = getSelectedBrandId(params?.brand, brands[0]?.id);
  const selectedBrand = brands.find((brand) => brand.id === selectedBrandId);
  const assets = await listAssetsByBrand(selectedBrand?.id);

  return (
    <div className="flex min-h-screen bg-background text-text">
      <Sidebar />
      <main className="min-w-0 flex-1 px-10 py-8">
        <section>
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-text-muted">
              Library Mode
            </p>
            <h1 className="text-3xl font-semibold text-text">Asset Library</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">
              Manage the brand layer first. Asset upload and conversion stay
              out of this phase.
            </p>
          </div>

          <BrandManager
            assets={assets.assets}
            assetError={assets.error}
            brands={brands}
            error={error}
            selectedBrandId={selectedBrand?.id}
            selectedBrandName={selectedBrand?.name}
          />
        </section>
      </main>
    </div>
  );
}

function getSelectedBrandId(brandId?: string, fallbackId?: string) {
  return brandId || fallbackId;
}
