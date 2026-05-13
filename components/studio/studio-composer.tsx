"use client";

import type { FormEvent } from "react";
import type { GenerationModelId } from "@/lib/generation-models";
import { ModelSelector } from "@/components/studio/model-selector";

type StudioComposerProps = {
  error?: string;
  isGenerating: boolean;
  model: GenerationModelId;
  pegCount: number;
  prompt: string;
  onModelChange: (value: GenerationModelId) => void;
  onPromptChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function StudioComposer({
  error,
  isGenerating,
  model,
  pegCount,
  prompt,
  onModelChange,
  onPromptChange,
  onSubmit,
}: StudioComposerProps) {
  return (
    <form onSubmit={onSubmit} className="border-t border-border p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <ModelSelector value={model} onChange={onModelChange} />
        <span className="shrink-0 text-[11px] text-text-muted">
          {pegCount}/14 pegs
        </span>
      </div>

      <div className="border border-border bg-background focus-within:border-accent">
        <div className="flex min-h-16 items-end gap-2 px-3 py-2">
          <textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Describe the image direction..."
            rows={2}
            className="min-h-10 flex-1 resize-none overflow-hidden bg-transparent py-1 text-sm leading-6 text-text outline-none placeholder:text-text-muted"
          />

          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center bg-accent font-mono text-sm font-semibold text-background hover:bg-text disabled:cursor-not-allowed disabled:bg-surface-strong disabled:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Generate"
          >
            &gt;
          </button>
        </div>
      </div>

      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </form>
  );
}
