import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { projects, type Project } from "@/.velite/index.js";

export const Route = createFileRoute("/builds/")({
  component: BuildsPage,
});

type TierFilter = NonNullable<Project["tier"]> | "all";

const TIERS: TierFilter[] = ["all", "S", "A", "workshop"];

const byPriority = (a: Project, b: Project) =>
  a.priority - b.priority || Number(b.featured) - Number(a.featured);

function BuildsPage() {
  const [tier, setTier] = useState<TierFilter>("all");
  const tiers: TierFilter[] = projects.some((p) => p.tier === "archive")
    ? [...TIERS, "archive"]
    : TIERS;
  const dossiers = useMemo(
    () => [...projects].sort(byPriority).filter((p) => tier === "all" || p.tier === tier),
    [tier],
  );

  return (
    <div className="page-wrap flex flex-col gap-8 py-12">
      <header className="flex max-w-3xl flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
          Builds // The archive
        </p>
        <h1 className="font-sans text-3xl font-medium tracking-tight">Systems under constraint</h1>
      </header>

      <div role="group" aria-label="Filter by tier" className="flex flex-wrap gap-2">
        {tiers.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tier === t}
            onClick={() => setTier(t)}
            className={`hairline px-3 py-1.5 font-mono text-xs uppercase tracking-kicker transition-colors ${
              tier === t ? "bg-surface text-fg" : "bg-elevated text-muted hover:text-fg"
            }`}
          >
            {t === "all" ? "All" : `Tier ${t}`}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="font-mono text-xs uppercase tracking-kicker text-subtle">
        {dossiers.length} of {projects.length} dossiers
      </p>

      {dossiers.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {dossiers.map((p) => (
            <li key={p.slug} className="hairline bg-elevated p-5">
              <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
                Tier {p.tier} // Status {p.status}
              </p>
              <h2 className="mt-2 font-sans text-xl font-medium tracking-tight">
                <Link
                  to="/builds/$slug"
                  params={{ slug: p.slug }}
                  className="hover:underline hover:underline-offset-4"
                >
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted">{p.thesis}</p>
              {p.domains.length > 0 && (
                <p className="mt-3 font-mono text-xs uppercase tracking-kicker text-subtle">
                  {p.domains.join(" · ")}
                </p>
              )}
              {p.stack.length > 0 && (
                <ul aria-label="Stack" className="mt-2 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <li
                      key={s}
                      className="hairline bg-surface px-2 py-0.5 font-mono text-xs uppercase tracking-kicker text-muted"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No dossiers filed under Tier {tier} yet.</p>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: [...projects].sort(byPriority).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.title,
              url: `https://zacariahheim.com/builds/${p.slug}`,
            })),
          }),
        }}
      />
    </div>
  );
}
