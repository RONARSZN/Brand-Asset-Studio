"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Asset } from "@/lib/assets";
import type { Brand } from "@/lib/brands";
import {
  GENERATION_MODELS,
  type GenerationModelId,
} from "@/lib/generation-models";
import {
  createPendingGeneration,
  getErrorMessage,
  requestGeneration,
  type GenerateResponse,
} from "@/lib/studio-generation";
import { PegSelector } from "@/components/studio/peg-selector";
import { StudioChat } from "@/components/studio/studio-chat";
import { StudioOutput } from "@/components/studio/studio-output";
import type { StudioGeneration } from "@/components/studio/types";

type StudioShellProps = {
  activeBrandId?: string;
  assets: Asset[];
  brands: Brand[];
};

export function StudioShell(props: StudioShellProps) {
  const [model, setModel] = useState<GenerationModelId>(GENERATION_MODELS[0].id);
  const [generations, setGenerations] = useState<StudioGeneration[]>([]);
  const [prompt, setPrompt] = useState("");
  const [selectedPegUrls, setSelectedPegUrls] = useState<string[]>([]);
  const [activeGenerationId, setActiveGenerationId] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPegSelectorOpen, setIsPegSelectorOpen] = useState(false);
  const [error, setError] = useState("");
  const activePegUrls = useActivePegs(props.assets, selectedPegUrls);
  const activeGeneration = generations.find((item) => item.id === activeGenerationId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isGenerating) {
      return;
    }

    const generation = createPendingGeneration(trimmedPrompt, model, activePegUrls);
    setError("");
    setPrompt("");
    setIsGenerating(true);
    setGenerations((current) => [...current, generation]);
    setActiveGenerationId(generation.id);

    try {
      const response = await requestGeneration(trimmedPrompt, model, activePegUrls);
      if (response.error || !response.imageUrl) {
        throw new Error(response.error || "Generation failed.");
      }
      completeGeneration(generation.id, response);
    } catch (requestError) {
      failGeneration(generation.id, getErrorMessage(requestError));
    } finally {
      setIsGenerating(false);
    }
  }

  function togglePeg(fileUrl: string) {
    setSelectedPegUrls((current) => updateSelectedPegs(current, fileUrl));
  }

  function updateSelectedPegs(current: string[], fileUrl: string) {
    const activeCurrent = current.filter((item) => activePegUrls.includes(item));
    if (activeCurrent.includes(fileUrl)) {
      return activeCurrent.filter((item) => item !== fileUrl);
    }
    if (activeCurrent.length >= 14) {
      setError("Peg limit reached. Remove one before adding another.");
      return activeCurrent;
    }
    setError("");
    return [...activeCurrent, fileUrl];
  }

  function completeGeneration(id: string, response: GenerateResponse) {
    setGenerations((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, id: response.id || id, imageUrl: response.imageUrl, provider: response.provider, status: "complete" }
          : item,
      ),
    );
    setActiveGenerationId(response.id || id);
  }

  function failGeneration(id: string, message: string) {
    setError(message);
    setGenerations((current) =>
      current.map((item) =>
        item.id === id ? { ...item, error: message, status: "error" } : item,
      ),
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 min-w-0 overflow-hidden">
      <StudioChat
        activeGenerationId={activeGenerationId}
        error={error}
        generations={generations}
        isGenerating={isGenerating}
        isPegSelectorOpen={isPegSelectorOpen}
        model={model}
        onModelChange={setModel}
        onPegSelectorToggle={() => setIsPegSelectorOpen((current) => !current)}
        onPromptChange={setPrompt}
        onSelectGeneration={setActiveGenerationId}
        onSubmit={handleSubmit}
        pegCount={activePegUrls.length}
        prompt={prompt}
      />
      <PegSelector
        activeBrandId={props.activeBrandId}
        assets={props.assets}
        brands={props.brands}
        isOpen={isPegSelectorOpen}
        onClose={() => setIsPegSelectorOpen(false)}
        onTogglePeg={togglePeg}
        selectedPegUrls={activePegUrls}
      />
      <StudioOutput generation={activeGeneration} />
    </div>
  );
}

function useActivePegs(assets: Asset[], selectedPegUrls: string[]) {
  return useMemo(() => {
    const assetUrls = new Set(assets.map((asset) => asset.file_url));
    return selectedPegUrls.filter((fileUrl) => assetUrls.has(fileUrl));
  }, [assets, selectedPegUrls]);
}
