export const GENERATION_MODELS = [
  {
    id: "gemini-2.5-flash-image",
    name: "Gemini 2.5 Flash Image",
    costLabel: "Free - Draft",
  },
  {
    id: "gemini-3-pro-image",
    name: "Gemini 3 Pro Image",
    costLabel: "$0.134/image - Final + Pegs",
  },
  {
    id: "imagen-4-fast",
    name: "Imagen 4 Fast",
    costLabel: "$0.02/image - Fast Paid",
  },
  {
    id: "imagen-4-standard",
    name: "Imagen 4 Standard",
    costLabel: "$0.04/image - Balanced Paid",
  },
  {
    id: "pollinations-flux",
    name: "Pollinations Flux",
    costLabel: "Free · No billing required",
    label: "Pollinations Flux · Free · No billing required",
    note: "No reference image support",
  },
] as const;

export type GenerationModelId = (typeof GENERATION_MODELS)[number]["id"];

export function getGenerationModelLabel(modelId: GenerationModelId) {
  const model = GENERATION_MODELS.find((item) => item.id === modelId);

  if (!model) {
    return modelId;
  }

  return "label" in model ? model.label : `${model.name} - ${model.costLabel}`;
}

export function isGenerationModelId(value: string): value is GenerationModelId {
  return GENERATION_MODELS.some((model) => model.id === value);
}

export function getImageGenerationProvider() {
  return process.env.IMAGE_GENERATION_PROVIDER?.trim();
}
