import { Sidebar } from "@/components/sidebar";

export default function StudioPage() {
  return (
    <div className="flex min-h-screen bg-background text-text">
      <Sidebar />
      <main className="min-w-0 flex-1 px-10 py-8">
        <section className="flex min-h-full flex-col justify-between">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-text-muted">
              Studio Mode
            </p>
            <h1 className="text-3xl font-semibold text-text">
              Generation Studio
            </h1>
          </div>
        </section>
      </main>
    </div>
  );
}
