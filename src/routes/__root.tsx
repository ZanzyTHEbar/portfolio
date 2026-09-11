import { Link, Outlet, createRootRoute, useRouterState } from "@tanstack/react-router";
import { MotionConfig, motion } from "motion/react";
import { lab } from "@/content/lab";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/builds", label: "Builds" },
  { to: "/thinking", label: "Thinking" },
  { to: "/trajectory", label: "Trajectory" },
  { to: "/contact", label: "Contact" },
] as const;

export const Route = createRootRoute({
  notFoundComponent: PageNotFound,
  component: RootComponent,
});

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-elevated focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-kicker"
      >
        Skip to content
      </a>
      <header className="border-b border-border">
        <div className="page-wrap flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Link to="/" className="font-mono text-xs font-medium uppercase tracking-kicker text-fg">
            Zacariah Heim
          </Link>
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-mono text-xs uppercase tracking-kicker text-muted transition-colors hover:text-fg [&.active]:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <motion.main
        id="main"
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <Outlet />
      </motion.main>
      <footer className="border-t border-border">
        <div className="page-wrap flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md font-mono text-xs uppercase leading-relaxed tracking-kicker text-subtle">
            Projects, notes, and links.
          </p>
          <nav aria-label="Contact" className="flex items-center gap-4">
            <a
              href={lab.contact.github}
              className="font-mono text-xs uppercase tracking-kicker text-muted hover:text-fg"
            >
              GitHub
            </a>
            <a
              href={lab.contact.x}
              className="font-mono text-xs uppercase tracking-kicker text-muted hover:text-fg"
            >
              X
            </a>
            <a
              href={lab.contact.consultancy}
              className="font-mono text-xs uppercase tracking-kicker text-muted hover:text-fg"
            >
              Consultancy
            </a>
            <a
              href={lab.contact.linkedin}
              className="font-mono text-xs uppercase tracking-kicker text-muted hover:text-fg"
            >
              LinkedIn
            </a>
          </nav>
        </div>
      </footer>
      <noscript>
        <h1>Zacariah Heim</h1>
        <p>I build embedded hardware, Go systems, and tools for agents.</p>
        <nav>
          <ul>
            <li>
              <a href="/builds">Builds</a>
            </li>
            <li>
              <a href="/thinking">Thinking</a>
            </li>
            <li>
              <a href="/trajectory">Trajectory</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
        <h2>Selected projects</h2>
        <ul>
          <li>
            <a href="/builds/prometheon">Prometheon</a>
          </li>
          <li>
            <a href="/builds/dragonscale">DragonScale</a>
          </li>
          <li>
            <a href="/builds/openiris">OpenIris / EyeTrackVR</a>
          </li>
          <li>
            <a href="/builds/mcp-memory">MCP Memory</a>
          </li>
        </ul>
      </noscript>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                name: "Zacariah Heim",
                url: "https://zacariahheim.com/",
                sameAs: [
                  lab.contact.github,
                  lab.contact.x,
                  lab.contact.consultancy,
                  lab.contact.linkedin,
                ],
              },
              {
                "@type": "WebSite",
                name: "Zacariah Heim",
                url: "https://zacariahheim.com/",
              },
            ],
          }),
        }}
      />
    </MotionConfig>
  );
}

function PageNotFound() {
  return (
    <main className="page-wrap flex min-h-[60dvh] flex-col items-start justify-center gap-4 py-16">
      <p className="font-mono text-xs uppercase tracking-kicker text-subtle">404</p>
      <h1 className="font-sans text-3xl font-medium tracking-tight">Page not found.</h1>
      <p className="max-w-md text-sm text-muted">
        The route you requested does not exist. Choose another page.
      </p>
      <Link
        to="/"
        className="font-mono text-xs uppercase tracking-kicker text-fg underline underline-offset-4"
      >
        Back to home
      </Link>
    </main>
  );
}
