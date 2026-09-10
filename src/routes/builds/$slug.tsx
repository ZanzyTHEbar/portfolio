import { useMemo, type ComponentType } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as jsxRuntime from "react/jsx-runtime";
import { projects, type Project } from "@/.velite/index.js";
import { lab } from "@/content/lab";

export const Route = createFileRoute("/builds/$slug")({
  component: BuildPage,
});

type MdxProps = { components?: Record<string, ComponentType<any>> };

// Velite s.mdx() emits compiled MDX code that reads the jsx runtime off
// arguments[0] and defaults to plain tags unless a `components` map is
// passed. Fixed section order comes from the MDX source itself (Strange
// Idea → Hypothesis → Constraints → System → Reality → Decisions →
// Failure → Open Questions → Evidence); absent sections render nothing
// because they are absent from the body.
function compileMdx(code: string): ComponentType<MdxProps> {
  try {
    const factory = new Function(code) as (runtime: unknown) => {
      default: ComponentType<MdxProps>;
    };
    return factory(jsxRuntime).default;
  } catch {
    // ponytail: malformed Velite output degrades to empty body, not a route crash.
    return () => null;
  }
}

function MdxH2(props: any) {
  return (
    <h2 className="pt-4 font-mono text-xs uppercase tracking-kicker text-subtle">
      {props.children}
    </h2>
  );
}

function MdxP(props: any) {
  return <p className="max-w-[68ch] leading-relaxed">{props.children}</p>;
}

function MdxUl(props: any) {
  return <ul className="flex flex-col gap-1.5">{props.children}</ul>;
}

function MdxLi(props: any) {
  return <li className="font-mono text-sm text-muted">— {props.children}</li>;
}

function MdxA(props: any) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      className="text-fg underline underline-offset-4 hover:text-accent"
    >
      {props.children}
    </a>
  );
}

const mdxComponents: Record<string, ComponentType<any>> = {
  h2: MdxH2,
  p: MdxP,
  ul: MdxUl,
  li: MdxLi,
  a: MdxA,
};

const byPriority = (a: Project, b: Project) =>
  a.priority - b.priority || Number(b.featured) - Number(a.featured);

function BuildPage() {
  const { slug } = Route.useParams();
  const project = projects.find((p) => p.slug === slug);
  const body = project?.body ?? "";
  const MdxContent = useMemo(() => (project ? compileMdx(body) : null), [project, body]);
  if (!project) throw notFound();

  const dates = [project.dates?.start, project.dates?.end].filter(Boolean).join(" — ");
  // Only verified metrics ever render; unverified numbers stay out.
  const verifiedMetrics = project.metrics.filter((m) => m.verified);
  // Dangling related[] slugs resolve to nothing and render nothing.
  const related = project.related
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is Project => Boolean(p));
  const tierGroup = projects
    .filter((p) => (p.tier ?? "") === (project.tier ?? ""))
    .sort(byPriority);
  const at = tierGroup.findIndex((p) => p.slug === project.slug);
  const prev = at > 0 ? tierGroup[at - 1] : undefined;
  const next = at >= 0 && at < tierGroup.length - 1 ? tierGroup[at + 1] : undefined;
  const howIThink = lab.howIThink[project.priority % lab.howIThink.length] ?? lab.howIThink[0];

  return (
    <article className="page-wrap flex max-w-3xl flex-col gap-8 py-12">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
          Tier {project.tier} // Status {project.status}
        </p>
        <h1 className="font-sans text-3xl font-medium tracking-tight">{project.title}</h1>
        {dates && (
          <p className="font-mono text-xs uppercase tracking-kicker text-subtle">{dates}</p>
        )}
        {project.domains.length > 0 && (
          <p className="font-mono text-xs uppercase tracking-kicker text-subtle">
            {project.domains.join(" · ")}
          </p>
        )}
        {project.stack.length > 0 && (
          <ul aria-label="Stack" className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li
                key={s}
                className="hairline bg-elevated px-2 py-1 font-mono text-xs uppercase tracking-kicker text-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
        <p className="text-base text-muted">{project.thesis}</p>
      </header>

      {verifiedMetrics.length > 0 && (
        <section aria-label="Verified metrics" className="flex flex-col gap-2">
          <h2 className="font-mono text-xs uppercase tracking-kicker text-subtle">Results</h2>
          <ul className="flex flex-col gap-1.5">
            {verifiedMetrics.map((m) => (
              <li key={m.label} className="font-mono text-sm text-muted">
                {m.label}: <span className="text-fg">{m.value}</span>{" "}
                <span className="text-xs uppercase tracking-kicker text-ok">verified</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {MdxContent && (
        <div className="flex flex-col gap-4">
          <MdxContent components={mdxComponents} />
        </div>
      )}

      {howIThink && (
        <p className="text-sm text-muted">
          How I think —{" "}
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-kicker text-fg underline underline-offset-4"
          >
            {howIThink.title} →
          </Link>
        </p>
      )}

      {related.length > 0 && (
        <footer aria-label="Related systems" className="flex flex-col gap-2">
          <h2 className="font-mono text-xs uppercase tracking-kicker text-subtle">
            Related systems
          </h2>
          <ul className="flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  to="/builds/$slug"
                  params={{ slug: r.slug }}
                  className="hairline inline-block bg-elevated px-2 py-1 font-mono text-xs uppercase tracking-kicker text-muted hover:text-fg"
                >
                  {r.title} →
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      )}

      {(prev || next) && (
        <nav
          aria-label="More in this tier"
          className="flex items-center justify-between gap-4 border-t border-border pt-6"
        >
          {prev ? (
            <Link
              to="/builds/$slug"
              params={{ slug: prev.slug }}
              rel="prev"
              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-kicker text-muted hover:text-fg"
            >
              <ArrowLeft size={16} aria-hidden /> {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to="/builds/$slug"
              params={{ slug: next.slug }}
              rel="next"
              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-kicker text-muted hover:text-fg"
            >
              {next.title} <ArrowRight size={16} aria-hidden />
            </Link>
          )}
        </nav>
      )}

      <footer>
        <Link
          to="/builds"
          className="font-mono text-xs uppercase tracking-kicker text-fg underline underline-offset-4"
        >
          ← All builds
        </Link>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: project.title,
            description: project.thesis,
            datePublished: project.dates?.start,
          }),
        }}
      />
    </article>
  );
}
