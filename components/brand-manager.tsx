"use client";

import { useActionState, useState } from "react";
import type { Brand } from "@/lib/brands";
import { createBrandAction, type BrandActionState } from "@/app/library/actions";
import { BrandCard } from "@/components/brand-card";

type BrandManagerProps = {
  brands: Brand[];
  error?: string;
};

const initialState: BrandActionState = {
  status: "idle",
  message: "",
};

export function BrandManager({ brands, error }: BrandManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    createBrandAction,
    initialState,
  );

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-6 border-b border-border pb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Brand Index
          </p>
          <h2 className="mt-2 text-xl font-semibold text-text">
            Managed Brands
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating((current) => !current)}
          className="h-11 border border-accent px-4 text-sm font-semibold text-accent hover:bg-accent hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {isCreating ? "Close" : "New Brand"}
        </button>
      </div>

      {isCreating ? (
        <form
          action={formAction}
          className="mt-5 flex max-w-xl items-end gap-3 border border-border bg-surface p-4"
        >
          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="brand-name"
              className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted"
            >
              Brand Name
            </label>
            <input
              id="brand-name"
              name="name"
              type="text"
              required
              className="h-11 border border-border bg-background px-3 text-sm text-text outline-none hover:border-text-muted focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="h-11 border border-accent bg-accent px-4 text-sm font-semibold text-background hover:bg-background hover:text-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-strong disabled:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {isPending ? "Saving..." : "Create"}
          </button>
        </form>
      ) : null}

      {state.message ? (
        <p
          className={`mt-3 text-sm ${
            state.status === "error" ? "text-red-300" : "text-text-muted"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      {error ? <ErrorState message={error} /> : null}
      {!error && brands.length === 0 ? <EmptyState /> : null}

      {!error && brands.length > 0 ? (
        <div className="mt-6 grid grid-cols-3 gap-4">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              isConfirming={confirmingId === brand.id}
              onCancel={() => setConfirmingId(null)}
              onRequestDelete={() => setConfirmingId(brand.id)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 border border-dashed border-border bg-surface p-10 text-center">
      <p className="text-lg font-semibold text-text">No brands yet.</p>
      <p className="mt-2 text-sm text-text-muted">
        Create the first brand before adding assets in Phase 4.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mt-6 border border-red-400 bg-surface p-5 text-sm text-red-200">
      Brand data could not load: {message}
    </div>
  );
}
