"use client";

import type { StudioGeneration } from "@/components/studio/types";

type StudioOutputProps = {
  generation?: StudioGeneration;
};

export function StudioOutput({ generation }: StudioOutputProps) {
  if (!generation?.imageUrl) {
    return (
      <section className="flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-background">
        <p className="text-sm text-text-muted">Your generation will appear here</p>
      </section>
    );
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={generation.imageUrl}
          alt={generation.prompt}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-surface px-5 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-text">{generation.prompt}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
            {generation.modelLabel} / {generation.pegCount} pegs
            {generation.provider ? ` / ${generation.provider}` : ""}
          </p>
        </div>
        <a
          href={generation.imageUrl}
          download={`studio-generation-${generation.id}.png`}
          className="shrink-0 border border-border bg-background px-4 py-2 text-sm font-semibold text-text-muted hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Download
        </a>
      </div>
    </section>
  );
}
