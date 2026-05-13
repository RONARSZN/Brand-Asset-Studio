import Link from "next/link";

const routes = [
  { href: "/library", label: "Library", icon: "L" },
  { href: "/studio", label: "Studio", icon: "S" },
];

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface px-5 py-6">
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-text-muted">
          Brand Asset
        </p>
        <h2 className="mt-2 text-xl font-semibold text-text">Studio</h2>
      </div>

      <nav className="flex flex-col gap-2" aria-label="Main navigation">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="group flex h-11 items-center gap-3 border border-transparent px-3 text-sm font-medium text-text-muted hover:border-border hover:bg-surface-strong hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="flex h-6 w-6 items-center justify-center border border-border font-mono text-xs text-accent group-hover:border-accent">
              {route.icon}
            </span>
            {route.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
