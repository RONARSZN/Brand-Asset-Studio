import type { Asset } from "@/lib/assets";
import { ASSET_TYPES } from "@/lib/asset-types";
import { AssetGrid } from "@/components/asset-grid";
import { AssetUploader } from "@/components/asset-uploader";

type AssetLibraryProps = {
  assets: Asset[];
  error?: string;
  selectedBrandId?: string;
  selectedBrandName?: string;
};

export function AssetLibrary({
  assets,
  error,
  selectedBrandId,
  selectedBrandName,
}: AssetLibraryProps) {
  if (!selectedBrandId || !selectedBrandName) {
    return (
      <section className="mt-10 border border-dashed border-border bg-surface p-10 text-center">
        <p className="text-lg font-semibold text-text">Select a brand.</p>
        <p className="mt-2 text-sm text-text-muted">
          Assets are organized inside each brand library.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-5 flex items-end justify-between border-b border-border pb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Asset Library
          </p>
          <h2 className="mt-2 text-xl font-semibold text-text">
            {selectedBrandName}
          </h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
          {assets.length} files
        </p>
      </div>

      <AssetUploader brandId={selectedBrandId} />
      {error ? <ErrorState message={error} /> : null}
      {ASSET_TYPES.map((assetType) => (
        <AssetTypeSection
          assets={assets.filter((asset) => asset.asset_type === assetType)}
          assetType={assetType}
          key={assetType}
        />
      ))}
    </section>
  );
}

function AssetTypeSection({
  assets,
  assetType,
}: {
  assets: Asset[];
  assetType: string;
}) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
          {assetType}
        </h3>
        <span className="text-xs text-text-muted">{assets.length}</span>
      </div>
      <AssetGrid assets={assets} assetType={assetType} />
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mt-5 border border-red-400 bg-surface p-4 text-sm text-red-200">
      Asset data could not load: {message}
    </div>
  );
}
