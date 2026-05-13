"use client";

import Image from "next/image";
import { useState } from "react";
import type { Asset } from "@/lib/assets";
import { deleteAssetAction } from "@/app/library/actions";

type AssetCardProps = {
  asset: Asset;
};

export function AssetCard({ asset }: AssetCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <article className="overflow-hidden border border-border bg-surface">
      <div className="relative aspect-square bg-background">
        <Image
          src={asset.file_url}
          alt={asset.original_filename}
          className="object-cover"
          fill
          sizes="180px"
          unoptimized
        />
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-text">
          {asset.original_filename}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
          {formatDate(asset.created_at)}
        </p>

        {isConfirming ? (
          <form action={deleteAssetAction} className="mt-3 flex gap-2">
            <input type="hidden" name="id" value={asset.id} />
            <button
              type="submit"
              className="h-8 border border-red-400 px-2 text-[11px] font-semibold text-red-300 hover:bg-red-400 hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              className="h-8 border border-border px-2 text-[11px] font-semibold text-text-muted hover:border-text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsConfirming(true)}
            className="mt-3 h-8 border border-border px-2 text-[11px] font-semibold text-text-muted hover:border-red-300 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Delete Asset
          </button>
        )}
      </div>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
