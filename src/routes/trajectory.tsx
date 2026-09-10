import { Link, createFileRoute } from "@tanstack/react-router";
import { projects } from "@/.velite/index.js";
import { trajectory, type TrajectoryEntry } from "@/content/trajectory";

export const Route = createFileRoute("/trajectory")({
  component: TrajectoryPage,
});

const lanes: TrajectoryEntry["kind"][] = ["career", "experiment"];

function TrajectoryPage() {
  return (
    <div className="page-wrap flex max-w-3xl flex-col gap-8 py-12">
      <header className="reveal flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
          Trajectory // Technical evolution
        </p>
        <h1 className="font-sans text-3xl font-medium tracking-tight">How the lab got here</h1>
      </header>
      {lanes.map((kind, lane) => {
        const entries = trajectory.filter((e) => e.kind === kind);
        if (entries.length === 0) return null;
        return (
          <section
            key={kind}
            aria-label={kind}
            className={`reveal ${lane === 0 ? "reveal-2" : "reveal-3"} flex flex-col gap-4`}
          >
            <h2 className="font-mono text-xs uppercase tracking-kicker text-subtle">{kind}</h2>
            <ol className="flex flex-col gap-4">
              {entries.map((entry) => {
                // Dangling projectSlugs resolve to nothing and render nothing.
                const linked = (entry.projectSlugs ?? [])
                  .map((s) => projects.find((p) => p.slug === s))
                  .filter((p) => p !== undefined);
                return (
                  <li key={`${entry.period}-${entry.title}`} className="hairline bg-elevated p-5">
                    <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
                      {entry.period}
                    </p>
                    <h3 className="mt-2 font-sans text-xl font-medium tracking-tight">
                      {entry.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{entry.summary}</p>
                    {linked.length > 0 && (
                      <p className="mt-3 flex flex-wrap gap-2">
                        {linked.map((p) => (
                          <Link
                            key={p.slug}
                            to="/builds/$slug"
                            params={{ slug: p.slug }}
                            className="font-mono text-xs uppercase tracking-kicker text-muted hover:text-fg"
                          >
                            {p.title} →
                          </Link>
                        ))}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
