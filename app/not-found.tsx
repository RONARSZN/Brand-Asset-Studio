export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-text">
      <section className="w-full max-w-sm border border-border bg-surface p-8">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-text-muted">
          Brand Asset Studio
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-text">Not found</h1>
      </section>
    </main>
  );
}
