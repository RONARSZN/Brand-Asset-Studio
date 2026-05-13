import { NextResponse, type NextRequest } from "next/server";
import {
  getImageGenerationProvider,
  isGenerationModelId,
} from "@/lib/generation-models";
import { createMockGeneration } from "@/lib/generation-mock";

type GenerateBody = {
  prompt?: unknown;
  model?: unknown;
  pegs?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateBody;
    const prompt = String(body.prompt ?? "").trim();
    const model = String(body.model ?? "").trim();
    const pegs = getPegUrls(body.pegs);
    const provider = getImageGenerationProvider();

    if (!prompt || !isGenerationModelId(model) || pegs.length > 14) {
      return jsonError("Invalid generation request.", 400);
    }

    if (!provider) {
      return jsonError("IMAGE_GENERATION_PROVIDER is not configured.", 500);
    }

    await wait(3000);

    return NextResponse.json({
      ...createMockGeneration({
        model,
        pegCount: pegs.length,
        prompt,
        provider,
      }),
      pegs,
    });
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

function getPegUrls(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Generation failed.";
}
