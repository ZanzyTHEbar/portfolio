import { useMemo, type ComponentType } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import * as jsxRuntime from "react/jsx-runtime";
import { notes, projects } from "@/.velite/index.js";

export const Route = createFileRoute("/thinking/$slug")({
  component: EssayPage,
});

type MdxProps = { components?: Record<string, ComponentType<any>> };

// Same compiled-MDX pattern as the builds case-study template: Velite
// s.mdx() emits code that reads the jsx runtime off arguments[0].
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

function MdxP(props: any) {
  return <p className="max-w-[68ch] leading-relaxed">{props.children}</p>;
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
  p: MdxP,
  a: MdxA,
};

function EssayPage() {
  const { slug } = Route.useParams();
  const essay = notes.find((n) => n.slug === slug);
  const body = essay?.body ?? "";
  const MdxContent = useMemo(() => (essay ? compileMdx(body) : null), [essay, body]);
  if (!essay) throw notFound();

  // Dangling projectSlugs resolve to nothing and render nothing.
  const linked = essay.projectSlugs
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p) => p !== undefined);

  return (
    <article className="page-wrap flex max-w-3xl flex-col gap-6 py-12">
      <header className="reveal flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-kicker text-subtle">{essay.date}</p>
        <h1 className="font-sans text-3xl font-medium tracking-tight">{essay.title}</h1>
        <p className="text-base text-muted">{essay.summary}</p>
      </header>

      {MdxContent && (
        <div className="reveal reveal-2 flex flex-col gap-4">
          <MdxContent components={mdxComponents} />
        </div>
      )}

      {linked.length > 0 && (
        <footer aria-label="Linked systems" className="flex flex-col gap-2">
          <h2 className="font-mono text-xs uppercase tracking-kicker text-subtle">
            Linked systems
          </h2>
          <ul className="flex flex-wrap gap-2">
            {linked.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/builds/$slug"
                  params={{ slug: p.slug }}
                  className="hairline inline-block bg-elevated px-2 py-1 font-mono text-xs uppercase tracking-kicker text-muted hover:text-fg"
                >
                  {p.title} →
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      )}

      <footer>
        <Link
          to="/thinking"
          className="font-mono text-xs uppercase tracking-kicker text-fg underline underline-offset-4"
        >
          ← All thinking
        </Link>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: essay.title,
            description: essay.summary,
            datePublished: essay.date,
          }),
        }}
      />
    </article>
  );
}
