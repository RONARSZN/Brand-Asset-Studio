"use client";

import type { FormEvent } from "react";
import type { GenerationModelId } from "@/lib/generation-models";
import { PegToggle } from "@/components/studio/peg-toggle";
import { StudioComposer } from "@/components/studio/studio-composer";
import type { StudioGeneration } from "@/components/studio/types";

type StudioChatProps = {
  activeGenerationId?: string;
  error?: string;
  generations: StudioGeneration[];
  isGenerating: boolean;
  isPegSelectorOpen: boolean;
  model: GenerationModelId;
  pegCount: number;
  prompt: string;
  onModelChange: (value: GenerationModelId) => void;
  onPegSelectorToggle: () => void;
  onPromptChange: (value: string) => void;
  onSelectGeneration: (id: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function StudioChat({
  activeGenerationId,
  error,
  generations,
  isGenerating,
  isPegSelectorOpen,
  model,
  pegCount,
  prompt,
  onModelChange,
  onPegSelectorToggle,
  onPromptChange,
  onSelectGeneration,
  onSubmit,
}: StudioChatProps) {
  return (
    <section className="relative flex h-full w-[380px] shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          Studio
        </p>
        <PegToggle
          isOpen={isPegSelectorOpen}
          onToggle={onPegSelectorToggle}
          pegCount={pegCount}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {generations.length === 0 ? <EmptyState /> : null}
        <div className="flex flex-col gap-4">
          {generations.map((generation) => (
            <GenerationMessage
              generation={generation}
              isActive={generation.id === activeGenerationId}
              key={generation.id}
              onSelect={() => onSelectGeneration(generation.id)}
            />
          ))}
        </div>
      </div>

      <StudioComposer
        error={error}
        isGenerating={isGenerating}
        model={model}
        onModelChange={onModelChange}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
        pegCount={pegCount}
        prompt={prompt}
      />
    </section>
  );
}

function GenerationMessage({
  generation,
  isActive,
  onSelect,
}: {
  generation: StudioGeneration;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <article className="border border-border bg-background p-3">
      <p className="text-sm leading-6 text-text">{generation.prompt}</p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
        {generation.pegCount} pegs / {generation.modelLabel}
      </p>

      {generation.status === "pending" ? <LoadingInline /> : null}
      {generation.status === "error" ? (
        <p className="mt-3 border border-red-400/50 bg-red-950/20 p-3 text-xs text-red-300">
          {generation.error}
        </p>
      ) : null}
      {generation.imageUrl ? (
        <button
          type="button"
          onClick={onSelect}
          className={`mt-3 block w-full border bg-surface text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            isActive ? "border-accent" : "border-border hover:border-accent"
          }`}
          aria-label="Show generation in output panel"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={generation.imageUrl}
            alt={generation.prompt}
            className="h-auto w-full object-contain"
          />
        </button>
      ) : null}
    </article>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-border bg-background p-5 text-sm leading-6 text-text-muted">
      Start with a prompt. Generated images will stay in the feed and open in
      the artifact panel.
    </div>
  );
}

function LoadingInline() {
  return (
    <div className="mt-3 border border-border bg-surface p-3">
      <div className="h-2 w-24 animate-pulse bg-accent" />
      <div className="mt-3 h-2 w-full animate-pulse bg-border" />
      <div className="mt-2 h-2 w-2/3 animate-pulse bg-border" />
    </div>
  );
}
