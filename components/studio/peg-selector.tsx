"use client";

import Image from "next/image";
import Link from "next/link";
import type { Asset } from "@/lib/assets";
import { ASSET_TYPES } from "@/lib/asset-types";
import type { Brand } from "@/lib/brands";

type PegSelectorProps = {
  activeBrandId?: string;
  assets: Asset[];
  brands: Brand[];
  selectedPegUrls: string[];
  onTogglePeg: (fileUrl: string) => void;
};

export function PegSelector({
  activeBrandId,
  assets,
  brands,
  selectedPegUrls,
  onTogglePeg,
}: PegSelectorProps) {
  return (
    <aside className="flex w-[420px] shrink-0 flex-col border border-border bg-surface">
      <div className="border-b border-border p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Reference Pegs
        </p>
        <h2 className="mt-2 text-xl font-semibold text-text">Active Brand</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/studio?brand=${brand.id}`}
              className={`border px-3 py-2 text-xs font-semibold ${
                activeBrandId === brand.id
                  ? "border-accent text-accent"
                  : "border-border text-text-muted hover:border-text-muted hover:text-text"
              }`}
            >
              {brand.name}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-text-muted">
          Select up to 14 library assets as visual reference pegs.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {brands.length === 0 ? <EmptyState /> : null}
        {ASSET_TYPES.map((assetType) => (
          <PegTypeSection
            assetType={assetType}
            assets={assets.filter((asset) => asset.asset_type === assetType)}
            key={assetType}
            onTogglePeg={onTogglePeg}
            selectedPegUrls={selectedPegUrls}
          />
        ))}
      </div>
    </aside>
  );
}

function PegTypeSection({
  assetType,
  assets,
  selectedPegUrls,
  onTogglePeg,
}: {
  assetType: string;
  assets: Asset[];
  selectedPegUrls: string[];
  onTogglePeg: (fileUrl: string) => void;
}) {
  if (assets.length === 0) {
    return null;
  }

  return (
    <section className="mb-7">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
          {assetType}
        </h3>
        <span className="text-xs text-text-muted">{assets.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {assets.map((asset) => {
          const isSelected = selectedPegUrls.includes(asset.file_url);
          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => onTogglePeg(asset.file_url)}
              className={`border bg-background p-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isSelected
                  ? "border-accent"
                  : "border-border hover:border-text-muted"
              }`}
              aria-pressed={isSelected}
            >
              <span className="relative block aspect-square">
                <Image
                  src={asset.file_url}
                  alt={asset.original_filename}
                  className="object-cover"
                  fill
                  sizes="120px"
                  unoptimized
                />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-border bg-background p-6 text-sm text-text-muted">
      Create a brand and upload assets in Library before selecting pegs.
    </div>
  );
}
