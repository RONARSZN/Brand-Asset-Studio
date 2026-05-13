import {
  GENERATION_MODELS,
  getGenerationModelLabel,
  type GenerationModelId,
} from "@/lib/generation-models";

type ModelSelectorProps = {
  value: GenerationModelId;
  onChange: (value: GenerationModelId) => void;
};

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <label className="block">
      <span className="sr-only">Model</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as GenerationModelId)}
        className="h-8 max-w-full bg-transparent pr-8 text-xs text-text-muted outline-none hover:text-text focus:text-accent"
      >
        {GENERATION_MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {getGenerationModelLabel(model.id)}
          </option>
        ))}
      </select>
    </label>
  );
}
