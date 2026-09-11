import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { projects } from "@/.velite/index.js";
import { lab } from "@/content/lab";
import { AliveDiagram } from "@/components/AliveDiagram";
import { DetailPanel } from "@/components/DetailPanel";

export const Route = createFileRoute("/")({
  component: ExplorePage,
});

const NOSCRIPT_LABELS = [
  "IDEA",
  "HYPOTHESIS",
  "CONSTRAINT",
  "SYSTEM",
  "SOFTWARE",
  "HARDWARE",
  "RESEARCH",
  "REALITY",
];

function ExplorePage() {
  const tierS = [...projects].filter((p) => p.tier === "S").sort((a, b) => a.priority - b.priority);
  const items = tierS.map(({ slug, title, thesis }) => ({
    slug,
    title,
    thesis,
  }));
  const [pinned, setPinned] = useState<string | null>(null);
  const pinnedItem = items.find((i) => i.slug === pinned) ?? null;
  const linkOuts = [
    {
      kicker: "X",
      label: lab.currentlyThinking.label,
      href: lab.currentlyThinking.href,
    },
    {
      kicker: "Consultancy",
      label: "Consultancy",
      href: "https://zacariahheim.com",
    },
    ...lab.benchScraps.map((g) => ({
      kicker: "Gists",
      label: g.label,
      href: g.href,
    })),
  ];

  return (
    <div className="page-wrap flex flex-col gap-12 py-12">
      <section className="reveal flex max-w-3xl flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-kicker text-subtle">Work</p>
        <h1 className="font-sans text-3xl font-medium leading-tight tracking-tight">
          {lab.thesis}
        </h1>
      </section>
      <section aria-label="Project diagram" className="reveal reveal-2 flex flex-col gap-4">
        <AliveDiagram items={items} selected={pinned} onSelect={setPinned} />
        <DetailPanel item={pinnedItem} />
      </section>
      <section aria-label="Selected projects" className="reveal reveal-3 flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-kicker text-subtle">
          Selected projects
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {tierS.map((p) => (
            <li key={p.slug} className="hairline bg-elevated p-5">
              <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
                Tier S{p.status ? ` · Status: ${p.status}` : ""}
              </p>
              <h3 className="mt-2 font-sans text-xl font-medium tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.thesis}</p>
              {p.stack.length > 0 && (
                <p className="mt-3 font-mono text-xs uppercase tracking-kicker text-subtle">
                  Stack: {p.stack.join(" · ")}
                </p>
              )}
              <Link
                to="/builds/$slug"
                params={{ slug: p.slug }}
                className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-kicker text-fg"
              >
                View project <ArrowRight size={16} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section aria-label="How I think" className="reveal reveal-4 flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-kicker text-subtle">How I think</h2>
        <ol className="grid gap-4 sm:grid-cols-2">
          {lab.howIThink.map((step, i) => (
            <li key={step.title} className="hairline bg-elevated p-5">
              <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-sans text-base font-medium tracking-tight">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
      <section aria-label="Elsewhere" className="reveal reveal-5 flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-kicker text-subtle">
          Elsewhere
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {linkOuts.map((l) => (
            <li key={`${l.kicker}-${l.href}`} className="hairline bg-elevated p-5">
              <p className="font-mono text-xs uppercase tracking-kicker text-subtle">{l.kicker}</p>
              <a
                href={l.href}
                className="mt-2 inline-block font-mono text-xs uppercase tracking-kicker text-fg underline underline-offset-4 hover:no-underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <noscript>
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
            Project diagram
          </p>
          <svg viewBox="0 0 960 420" role="img" aria-label="Project stages">
            {NOSCRIPT_LABELS.map((t, i) => (
              <text
                key={t}
                x={40 + i * 110}
                y={210}
                fontFamily="monospace"
                fontSize={11}
                fill="#9a968c"
              >
                {t}
              </text>
            ))}
          </svg>
          <ul>
            {tierS.map((p) => (
              <li key={p.slug}>
                <a href={`/builds/${p.slug}`}>{p.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </div>
  );
}
