export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-text">
      <section className="w-full max-w-sm border border-border bg-surface p-8">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-text-muted">
          Brand Asset Studio
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-text">Sign in</h1>
        <form action="/auth/login" method="post" className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-12 border border-border bg-background px-3 text-sm text-text outline-none hover:border-text-muted focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-12 border border-border bg-background px-3 text-sm text-text outline-none hover:border-text-muted focus:border-accent"
            />
          </div>

          <button
            type="submit"
            className="h-12 border border-accent bg-accent px-4 text-sm font-semibold text-background hover:bg-background hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
