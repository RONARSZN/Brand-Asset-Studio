import { NextResponse, type NextRequest } from "next/server";
import { isGenerationModelId } from "@/lib/generation-models";

type GenerateBody = {
  prompt?: unknown;
  model?: unknown;
  pegs?: unknown;
};

const GEMINI_MODELS = {
  "gemini-2.5-flash-image": "gemini-2.5-flash-image",
  "gemini-3-pro-image": "gemini-3-pro-image-preview",
  "imagen-4-fast": "imagen-4.0-fast-generate-001",
  "imagen-4-standard": "imagen-4.0-generate-001",
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateBody;
    const prompt = String(body.prompt ?? "").trim();
    const model = String(body.model ?? "").trim();
    const pegs = getPegUrls(body.pegs);

    if (!prompt || !isGenerationModelId(model) || pegs.length > 14) {
      return jsonError("Invalid generation request.", 400);
    }

    if (!process.env.GEMINI_API_KEY) {
      return jsonError("Generation failed. Try again.", 500);
    }

    const imageBase64 = await generateImage(prompt, model, pegs);

    return NextResponse.json({
      id: crypto.randomUUID(),
      imageBase64,
      imageUrl: `data:image/png;base64,${imageBase64}`,
      message: `Generation complete. ${pegs.length} pegs attached.`,
      model,
      pegs,
      provider: "gemini",
    });
  } catch (error) {
    console.error("[generate] request failed", { error });
    return jsonError(getErrorMessage(error), getErrorStatus(error));
  }
}

async function generateImage(prompt: string, model: string, pegs: string[]) {
  const geminiModel = GEMINI_MODELS[model as keyof typeof GEMINI_MODELS];
  const pegParts = await Promise.all(pegs.map(fetchPegPart));

  if (model.startsWith("imagen")) {
    return callImagen(prompt, geminiModel);
  }

  return callGeminiImage(prompt, geminiModel, pegParts);
}

async function callGeminiImage(prompt: string, model: string, pegs: object[]) {
  const response = await callGoogleModel(`${model}:generateContent`, {
    contents: [{ parts: [{ text: prompt }, ...pegs] }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
  });
  assertNotRejected(response);
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const image = parts.find((part: ResponsePart) => part.inlineData?.data);
  return image?.inlineData?.data ?? throwGenerationFailed();
}

async function callImagen(prompt: string, model: string) {
  const response = await callGoogleModel(`${model}:predict`, {
    instances: [{ prompt }],
    parameters: { sampleCount: 1, aspectRatio: "16:9" },
  });
  assertNotRejected(response);
  const image = response.predictions?.[0];
  return image?.bytesBase64Encoded ?? image?.image?.imageBytes ??
    throwGenerationFailed();
}

async function callGoogleModel(action: string, body: object) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${action}`;
  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY || "",
    },
    method: "POST",
  });
  const responseBody = await response.text();
  const data = parseGoogleResponse(responseBody);

  if (!response.ok) {
    console.error("[generate] Google API error", {
      action,
      responseBody,
      status: response.status,
      statusText: response.statusText,
      url,
    });
    throw new GenerationError(getGoogleErrorMessage(data), response.status);
  }

  return data;
}

async function fetchPegPart(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new GenerationError("Generation failed. Try again.");
  }

  const mimeType = response.headers.get("content-type") || "image/png";
  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    inline_data: {
      data: buffer.toString("base64"),
      mime_type: mimeType,
    },
  };
}

function getPegUrls(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function getErrorMessage(error: unknown) {
  if (error instanceof GenerationError) {
    return error.message;
  }

  return "Generation failed. Try again.";
}

function getErrorStatus(error: unknown) {
  return error instanceof GenerationError ? error.status : 500;
}

function assertNotRejected(data: GoogleResponse) {
  const reason = data.promptFeedback?.blockReason ??
    data.predictions?.[0]?.raiFilteredReason ??
    data.candidates?.[0]?.finishReason;

  if (String(reason ?? "").match(/safety|block|prohibited|policy/i)) {
    throw new GenerationError("Prompt was rejected. Try rephrasing.");
  }
}

function throwGenerationFailed(): never {
  throw new GenerationError("Generation failed. Try again.");
}

function parseGoogleResponse(responseBody: string): GoogleResponse {
  try {
    return JSON.parse(responseBody) as GoogleResponse;
  } catch (error) {
    console.error("[generate] Google API returned non-JSON body", {
      error,
      responseBody,
    });
    return {};
  }
}

function getGoogleErrorMessage(data: GoogleResponse) {
  return data.error?.message || "Generation failed. Try again.";
}

class GenerationError extends Error {
  constructor(message: string, public status = 500) {
    super(message);
  }
}

type ResponsePart = { inlineData?: { data?: string } };
type GoogleError = { error?: { message?: string } };
type GoogleResponse = GoogleError & {
  candidates?: { finishReason?: string; content?: { parts?: ResponsePart[] } }[];
  predictions?: {
    bytesBase64Encoded?: string;
    image?: { imageBytes?: string };
    raiFilteredReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
};
