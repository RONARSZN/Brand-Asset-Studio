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
    <div className="flex min-h-screen bg-background text-text">
      <Sidebar />
      <main className="min-w-0 flex-1 px-10 py-8">
        <section className="flex min-h-full flex-col">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-text-muted">
              Studio Mode
            </p>
            <h1 className="text-3xl font-semibold text-text">
              Generation Studio
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">
              Build image directions with active-brand pegs. Generation is mocked
              until the provider adapter is connected.
            </p>
          </div>
          {error || assets.error ? (
            <div className="mt-5 border border-red-400 bg-surface p-4 text-sm text-red-200">
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
