"use client";

import { useState, type FormEvent } from "react";
import type { Asset } from "@/lib/assets";
import type { Brand } from "@/lib/brands";
import {
  GENERATION_MODELS,
  type GenerationModelId,
} from "@/lib/generation-models";
import { PegSelector } from "@/components/studio/peg-selector";
import { StudioChat } from "@/components/studio/studio-chat";
import type { StudioMessage } from "@/components/studio/types";

type StudioShellProps = {
  activeBrandId?: string;
  assets: Asset[];
  brands: Brand[];
};

type GenerateResponse = {
  error?: string;
  id?: string;
  imageUrl?: string;
  message?: string;
  model?: string;
  provider?: string;
};

export function StudioShell({
  activeBrandId,
  assets,
  brands,
}: StudioShellProps) {
  const [model, setModel] = useState<GenerationModelId>(GENERATION_MODELS[0].id);
  const [messages, setMessages] = useState<StudioMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [selectedPegUrls, setSelectedPegUrls] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const activeAssetUrls = new Set(assets.map((asset) => asset.file_url));
  const activePegUrls = selectedPegUrls.filter((fileUrl) =>
    activeAssetUrls.has(fileUrl),
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isGenerating) {
      return;
    }

    setError("");
    setPrompt("");
    setIsGenerating(true);
    setMessages((current) => [
      ...current,
      createMessage("user", trimmedPrompt, `${activePegUrls.length} pegs`),
    ]);

    try {
      const response = await requestGeneration(trimmedPrompt, model, activePegUrls);

      if (response.error || !response.imageUrl) {
        throw new Error(response.error || "Generation failed.");
      }

      setMessages((current) => [
        ...current,
        {
          id: response.id || crypto.randomUUID(),
          role: "assistant",
          content: response.message || "Mock generation complete.",
          imageUrl: response.imageUrl,
          meta: `${response.provider} / ${response.model}`,
        },
      ]);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsGenerating(false);
    }
  }

  function togglePeg(fileUrl: string) {
    setSelectedPegUrls((current) => {
      const activeCurrent = current.filter((item) => activeAssetUrls.has(item));

      if (activeCurrent.includes(fileUrl)) {
        return activeCurrent.filter((item) => item !== fileUrl);
      }

      if (activeCurrent.length >= 14) {
        setError("Peg limit reached. Remove one before adding another.");
        return activeCurrent;
      }

      setError("");
      return [...activeCurrent, fileUrl];
    });
  }

  return (
    <div className="mt-8 flex h-[calc(100vh-150px)] gap-5">
      <StudioChat
        error={error}
        isGenerating={isGenerating}
        messages={messages}
        model={model}
        onModelChange={setModel}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
        pegCount={activePegUrls.length}
        prompt={prompt}
      />
      <PegSelector
        activeBrandId={activeBrandId}
        assets={assets}
        brands={brands}
        onTogglePeg={togglePeg}
        selectedPegUrls={activePegUrls}
      />
    </div>
  );
}

async function requestGeneration(
  prompt: string,
  model: GenerationModelId,
  pegs: string[],
): Promise<GenerateResponse> {
  const response = await fetch("/api/generate", {
    body: JSON.stringify({ prompt, model, pegs }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  return (await response.json()) as GenerateResponse;
}

function createMessage(role: StudioMessage["role"], content: string, meta: string) {
  return { id: crypto.randomUUID(), role, content, meta };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Generation failed.";
}
