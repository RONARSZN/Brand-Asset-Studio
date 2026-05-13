"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center bg-background px-6 text-text">
          <section className="w-full max-w-sm border border-border bg-surface p-8">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-text-muted">
              Brand Asset Studio
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-text">
              Something broke
            </h1>
            <p className="mt-3 text-sm text-text-muted">
              {error.digest ? `Error ${error.digest}` : "Try reloading this view."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 h-11 border border-accent px-4 text-sm font-semibold text-accent hover:bg-accent hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Try Again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
