import type { Asset } from "@/lib/assets";
import { AssetCard } from "@/components/asset-card";

type AssetGridProps = {
  assets: Asset[];
  assetType: string;
};

export function AssetGrid({ assets, assetType }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="border border-dashed border-border bg-surface p-5 text-sm text-text-muted">
        No {assetType.toLowerCase()} assets yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {assets.map((asset) => (
        <AssetCard asset={asset} key={asset.id} />
      ))}
    </div>
  );
}
