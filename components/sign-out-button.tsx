export function SignOutButton() {
  return (
    <form action="/auth/signout" method="post" className="mt-auto">
      <button
        type="submit"
        className="flex h-11 w-full items-center gap-3 border border-border px-3 text-sm font-medium text-text-muted hover:border-accent hover:bg-surface-strong hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="flex h-6 w-6 items-center justify-center border border-border font-mono text-xs text-accent">
          X
        </span>
        Sign out
      </button>
    </form>
  );
}
