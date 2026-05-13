import type { GenerationModelId } from "@/lib/generation-models";

export type StudioGeneration = {
  id: string;
  prompt: string;
  pegCount: number;
  modelId: GenerationModelId;
  modelLabel: string;
  imageUrl?: string;
  provider?: string;
  status: "pending" | "complete" | "error";
  error?: string;
};
