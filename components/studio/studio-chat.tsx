"use client";

import type { FormEvent } from "react";
import type { GenerationModelId } from "@/lib/generation-models";
import { ModelSelector } from "@/components/studio/model-selector";
import type { StudioMessage } from "@/components/studio/types";

type StudioChatProps = {
  error?: string;
  isGenerating: boolean;
  messages: StudioMessage[];
  model: GenerationModelId;
  pegCount: number;
  prompt: string;
  onModelChange: (value: GenerationModelId) => void;
  onPromptChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function StudioChat({
  error,
  isGenerating,
  messages,
  model,
  pegCount,
  prompt,
  onModelChange,
  onPromptChange,
  onSubmit,
}: StudioChatProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col border border-border bg-surface">
      <div className="border-b border-border p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Generation Feed
        </p>
        <h2 className="mt-2 text-xl font-semibold text-text">Studio Chat</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {messages.length === 0 ? <EmptyState /> : null}
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isGenerating ? <LoadingMessage /> : null}
        </div>
      </div>

      <form onSubmit={onSubmit} className="border-t border-border p-5">
        <ModelSelector value={model} onChange={onModelChange} />
        <div className="mt-4 flex gap-3">
          <textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Describe the poster or image direction..."
            rows={3}
            className="min-h-24 flex-1 resize-none border border-border bg-background p-3 text-sm leading-6 text-text outline-none hover:border-text-muted focus:border-accent"
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="h-24 w-32 border border-accent bg-accent text-sm font-semibold text-background hover:bg-background hover:text-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-strong disabled:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {isGenerating ? "Generating" : "Generate"}
          </button>
        </div>
        <div className="mt-3 flex justify-between text-xs text-text-muted">
          <span>{pegCount}/14 pegs attached</span>
          {error ? <span className="text-red-300">{error}</span> : null}
        </div>
      </form>
    </section>
  );
}

function MessageBubble({ message }: { message: StudioMessage }) {
  const isUser = message.role === "user";

  return (
    <article className={isUser ? "ml-auto max-w-2xl" : "mr-auto max-w-3xl"}>
      <div
        className={`border p-4 ${
          isUser ? "border-accent bg-background" : "border-border bg-surface-strong"
        }`}
      >
        <p className="text-sm leading-6 text-text">{message.content}</p>
        {message.imageUrl ? (
          <GeneratedImage imageUrl={message.imageUrl} messageId={message.id} />
        ) : null}
        {message.meta ? (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
            {message.meta}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function GeneratedImage({
  imageUrl,
  messageId,
}: {
  imageUrl: string;
  messageId: string;
}) {
  return (
    <div className="mt-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Generated output"
        className="h-auto w-full border border-border"
      />
      <a
        href={imageUrl}
        download={`studio-generation-${messageId}.png`}
        className="mt-3 inline-flex h-10 items-center border border-border bg-background px-4 text-sm font-semibold text-text-muted hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Download
      </a>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-border bg-background p-8 text-sm text-text-muted">
      Start with a prompt. Selected pegs from the active brand will travel with
      the generation request.
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="mr-auto max-w-xl border border-border bg-surface-strong p-4">
      <div className="h-3 w-28 animate-pulse bg-accent" />
      <div className="mt-4 h-3 w-80 animate-pulse bg-border" />
      <div className="mt-2 h-3 w-64 animate-pulse bg-border" />
    </div>
  );
}
