"use client";

import Link from "next/link";
import type { Brand } from "@/lib/brands";
import { deleteBrandAction } from "@/app/library/actions";

type BrandCardProps = {
  brand: Brand;
  isConfirming: boolean;
  isSelected: boolean;
  onCancel: () => void;
  onRequestDelete: () => void;
};

export function BrandCard({
  brand,
  isConfirming,
  isSelected,
  onCancel,
  onRequestDelete,
}: BrandCardProps) {
  return (
    <article
      className={`border bg-surface p-5 ${
        isSelected ? "border-accent" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-text">
            {brand.name}
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
            Created {formatDate(brand.created_at)}
          </p>
        </div>
        <span className="border border-accent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {isSelected ? "Open" : "Brand"}
        </span>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
        <Link
          href={`/library?brand=${brand.id}`}
          className="flex h-9 items-center border border-border px-3 text-xs font-semibold text-text-muted hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Select
        </Link>
        {isConfirming ? (
          <form action={deleteBrandAction} className="flex gap-2">
            <input type="hidden" name="id" value={brand.id} />
            <button
              type="submit"
              className="h-9 border border-red-400 px-3 text-xs font-semibold text-red-300 hover:bg-red-400 hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
            >
              Confirm Delete
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="h-9 border border-border px-3 text-xs font-semibold text-text-muted hover:border-text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={onRequestDelete}
            className="h-9 border border-border px-3 text-xs font-semibold text-text-muted hover:border-red-300 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Delete
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
