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
  isOpen: boolean;
  selectedPegUrls: string[];
  onClose: () => void;
  onTogglePeg: (fileUrl: string) => void;
};

export function PegSelector({
  activeBrandId,
  assets,
  brands,
  isOpen,
  selectedPegUrls,
  onClose,
  onTogglePeg,
}: PegSelectorProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute bottom-24 left-3 z-20 w-[356px] border border-border bg-surface shadow-2xl shadow-black/40">
      <div className="flex items-start justify-between gap-4 border-b border-border p-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            Reference Pegs
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/studio?brand=${brand.id}`}
                className={`border px-2.5 py-1.5 text-xs font-semibold ${
                  activeBrandId === brand.id
                    ? "border-accent text-accent"
                    : "border-border text-text-muted hover:border-text-muted"
                }`}
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-8 w-8 border border-border font-mono text-xs text-text-muted hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Close peg selector"
        >
          X
        </button>
      </div>

      <div className="max-h-[48vh] overflow-y-auto p-4">
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
    </div>
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
    <section className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
          {assetType}
        </h3>
        <span className="text-xs text-text-muted">{assets.length}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
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
                  sizes="80px"
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
