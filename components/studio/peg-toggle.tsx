"use client";

type PegToggleProps = {
  isOpen: boolean;
  pegCount: number;
  onToggle: () => void;
};

export function PegToggle({ isOpen, pegCount, onToggle }: PegToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title="Pegs"
      className={`relative grid h-8 w-8 place-items-center border text-text-muted hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isOpen ? "border-accent text-accent" : "border-border"
      }`}
      aria-expanded={isOpen}
      aria-label="Toggle pegs"
    >
      <span className="grid grid-cols-2 gap-0.5" aria-hidden="true">
        <span className="h-1.5 w-1.5 bg-current" />
        <span className="h-1.5 w-1.5 bg-current" />
        <span className="h-1.5 w-1.5 bg-current" />
        <span className="h-1.5 w-1.5 bg-current" />
      </span>
      {pegCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-accent px-1 font-mono text-[10px] text-background">
          {pegCount}
        </span>
      ) : null}
    </button>
  );
}
