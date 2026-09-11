import { createFileRoute } from "@tanstack/react-router";
import { lab } from "@/content/lab";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const { contact } = lab;
  const links = [
    { label: "GitHub", href: contact.github },
    { label: "X", href: contact.x },
    { label: "Consultancy", href: "https://zacariahheim.com" },
  ];
  return (
    <div className="page-wrap flex max-w-3xl flex-col gap-8 py-12">
      <header className="reveal flex flex-col gap-2">
        <h1 className="font-sans text-3xl font-medium tracking-tight">Contact</h1>
      </header>
      {/* lab.contact.email is empty: render nothing, never guess an address. */}
      {contact.email && (
        <p className="hairline bg-elevated p-5">
          <a
            href={`mailto:${contact.email}`}
            className="font-mono text-sm uppercase tracking-kicker text-fg hover:underline hover:underline-offset-4"
          >
            {contact.email} →
          </a>
        </p>
      )}
      <ul className="reveal reveal-2 flex flex-col gap-4">
        {links.map((l) => (
          <li key={l.label} className="hairline bg-elevated p-5">
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm uppercase tracking-kicker text-fg hover:underline hover:underline-offset-4"
            >
              {l.label} →
            </a>
            <p className="mt-1 font-mono text-xs text-subtle">{l.href}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
