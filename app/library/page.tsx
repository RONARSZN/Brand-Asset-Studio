import { Sidebar } from "@/components/sidebar";
import { BrandManager } from "@/components/brand-manager";
import { listBrands } from "@/lib/brands";

export default async function LibraryPage() {
  const { brands, error } = await listBrands();

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

          <BrandManager brands={brands} error={error} />
        </section>
      </main>
    </div>
  );
}
