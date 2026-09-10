import { Link, createFileRoute } from "@tanstack/react-router";
import { notes, projects, type Note } from "@/.velite/index.js";

export const Route = createFileRoute("/thinking/")({
  component: ThinkingPage,
});

const byNewest = (a: Note, b: Note) =>
  b.date.localeCompare(a.date) || a.title.localeCompare(b.title);

function ThinkingPage() {
  const essays = [...notes].sort(byNewest);
  return (
    <div className="page-wrap flex max-w-3xl flex-col gap-8 py-12">
      <header className="reveal flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
          Thinking // Notes and essays
        </p>
        <h1 className="font-sans text-3xl font-medium tracking-tight">Written thinking</h1>
      </header>
      <ul className="reveal reveal-2 flex flex-col gap-4">
        {essays.map((e) => {
          // Dangling projectSlugs resolve to nothing and render nothing.
          const linked = e.projectSlugs
            .map((s) => projects.find((p) => p.slug === s))
            .filter((p) => p !== undefined);
          return (
            <li key={e.slug} className="hairline bg-elevated p-5">
              <p className="font-mono text-xs uppercase tracking-kicker text-subtle">{e.date}</p>
              <h2 className="mt-2 font-sans text-xl font-medium tracking-tight">
                <Link
                  to="/thinking/$slug"
                  params={{ slug: e.slug }}
                  className="hover:underline hover:underline-offset-4"
                >
                  {e.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted">{e.summary}</p>
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
      </ul>
    </div>
  );
}
