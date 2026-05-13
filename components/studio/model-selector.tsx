import {
  GENERATION_MODELS,
  type GenerationModelId,
} from "@/lib/generation-models";

type ModelSelectorProps = {
  value: GenerationModelId;
  onChange: (value: GenerationModelId) => void;
};

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
        Model
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as GenerationModelId)}
        className="h-11 border border-border bg-background px-3 text-sm text-text outline-none hover:border-text-muted focus:border-accent"
      >
        {GENERATION_MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.costLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
