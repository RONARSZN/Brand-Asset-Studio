import {
  getGenerationModelLabel,
  type GenerationModelId,
} from "@/lib/generation-models";
import type { StudioGeneration } from "@/components/studio/types";

export type GenerateResponse = {
  error?: string;
  id?: string;
  imageUrl?: string;
  provider?: string;
};

export function createPendingGeneration(
  prompt: string,
  model: GenerationModelId,
  pegs: string[],
): StudioGeneration {
  return {
    id: crypto.randomUUID(),
    modelId: model,
    modelLabel: getGenerationModelLabel(model),
    pegCount: pegs.length,
    prompt,
    status: "pending",
  };
}

export async function requestGeneration(
  prompt: string,
  model: GenerationModelId,
  pegs: string[],
) {
  const response = await fetch("/api/generate", {
    body: JSON.stringify({ prompt, model, pegs }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  return (await response.json()) as GenerateResponse;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Generation failed.";
}
