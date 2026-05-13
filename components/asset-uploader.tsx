"use client";

import { useActionState } from "react";
import { uploadAssetAction, type BrandActionState } from "@/app/library/actions";
import { ASSET_TYPES } from "@/lib/asset-types";

type AssetUploaderProps = {
  brandId: string;
};

const initialState: BrandActionState = {
  status: "idle",
  message: "",
};

export function AssetUploader({ brandId }: AssetUploaderProps) {
  const [state, formAction, isPending] = useActionState(
    uploadAssetAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="border border-border bg-surface p-4"
      encType="multipart/form-data"
    >
      <input type="hidden" name="brandId" value={brandId} />
      <div className="grid grid-cols-[180px_1fr_auto] items-end gap-3">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
            Asset Type
          </span>
          <select
            name="assetType"
            className="h-11 border border-border bg-background px-3 text-sm text-text outline-none hover:border-text-muted focus:border-accent"
            required
          >
            {ASSET_TYPES.map((assetType) => (
              <option key={assetType} value={assetType}>
                {assetType}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
            Upload File
          </span>
          <input
            name="file"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.psd,.tiff,.tif,.ai,.eps"
            className="h-11 border border-dashed border-border bg-background px-3 py-2 text-sm text-text file:mr-3 file:border-0 file:bg-accent file:px-3 file:py-1 file:text-sm file:font-semibold file:text-background hover:border-accent focus:border-accent"
            required
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="h-11 border border-accent bg-accent px-4 text-sm font-semibold text-background hover:bg-background hover:text-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-strong disabled:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {isPending ? "Uploading..." : "Upload"}
        </button>
      </div>

      <p className="mt-3 text-xs text-text-muted">
        Source files are converted to PNG and not retained
      </p>
      {state.message ? (
        <p
          className={`mt-2 text-sm ${
            state.status === "error" ? "text-red-300" : "text-text-muted"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
