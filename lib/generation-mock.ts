import { generateId } from "ai";

export type MockGenerationInput = {
  model: string;
  pegCount: number;
  prompt: string;
  provider: string;
};

export function createMockGeneration({
  model,
  pegCount,
  prompt,
  provider,
}: MockGenerationInput) {
  return {
    id: generateId(),
    imageUrl: createMockImage(prompt, model, pegCount),
    message: `Mock ${provider} generation complete. ${pegCount} pegs attached.`,
    model,
    provider,
  };
}

function createMockImage(prompt: string, model: string, pegCount: number) {
  const safePrompt = escapeSvg(prompt.slice(0, 90));
  const safeModel = escapeSvg(model);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">`,
    `<rect width="1280" height="720" fill="#141312"/>`,
    `<rect x="48" y="48" width="1184" height="624" fill="#1f1d1a" stroke="#b07d3a" stroke-width="4"/>`,
    `<text x="92" y="138" fill="#b07d3a" font-family="Arial" font-size="28" font-weight="700">MOCK GENERATION</text>`,
    `<text x="92" y="230" fill="#e8e6e1" font-family="Arial" font-size="44" font-weight="700">${safePrompt}</text>`,
    `<text x="92" y="600" fill="#9b968d" font-family="Courier New" font-size="24">${safeModel} / ${pegCount} pegs</text>`,
    `</svg>`,
  ].join("");
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeSvg(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[char];
  });
}
