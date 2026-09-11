// Post-build meta injection (SPEC §7). Node stdlib only.
//
// Single-file SPA: there is one dist/index.html, so this script injects home
// meta (title, description, canonical, OG/Twitter, Person+WebSite JSON-LD)
// into dist/index.html. Per-slug meta is NOT faked as per-route HTML files;
// per-slug discoverability lives in public/sitemap.xml plus the ItemList
// JSON-LD below, built from the real builds + thinking slugs parsed out of
// content/** frontmatter (`slug:`, `title:`, `thesis:`/`summary:` lines).
// Idempotent; exits non-zero when dist/ is missing so failures are loud.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = join(ROOT, "dist", "index.html");
const SITE = "https://zacariahheim.com";

const THESIS =
  "I build embedded hardware, Go systems, and tools for agents.";

// Parse a top-level `field: value` (optionally quoted) frontmatter line.
function field(src, name) {
  const m = src.match(new RegExp(`^${name}:\\s*"?([^"\n]+)"?\\s*$`, "m"));
  return m ? m[1].trim() : "";
}

// Read slugs + titles + descriptions from an MDX content dir.
// `route` is the public URL prefix ("/builds" for projects, "/thinking" for notes).
function readSlugs(dir, route) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const src = readFileSync(join(full, f), "utf8");
      const slug = field(src, "slug") || f.replace(/\.mdx$/, "");
      const title = field(src, "title");
      const description = field(src, "thesis") || field(src, "summary");
      return { slug, title, description, url: `${SITE}${route}/${slug}` };
    })
    .filter((e) => e.slug)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

const builds = readSlugs("content/projects", "/builds");
const thinking = readSlugs("content/notes", "/thinking");
const items = [...builds, ...thinking];

if (builds.length === 0 || thinking.length === 0) {
  console.error(
    `inject-meta: expected slugs in content/projects + content/notes, found ${builds.length} builds / ${thinking.length} thinking`,
  );
  process.exit(1);
}

const itemListJson = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Zacariah Heim",
      url: `${SITE}/`,
    },
    {
      "@type": "WebSite",
      name: "Zacariah Heim",
      url: `${SITE}/`,
    },
    {
      "@type": "ItemList",
      name: "Builds and thinking",
      itemListElement: items.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: e.title || e.slug,
        ...(e.description ? { description: e.description } : {}),
        url: e.url,
      })),
    },
  ],
});

const REQUIRED = [
  ["<title>Zacariah Heim</title>", /<title>[^<]*<\/title>/],
  [`<meta name="description" content="${THESIS}" />`, /<meta\s+name="description"[^>]*>/],
  [`<link rel="canonical" href="${SITE}/" />`, /<link\s+rel="canonical"[^>]*>/],
  [
    `<meta property="og:title" content="Zacariah Heim" />`,
    /<meta\s+property="og:title"[^>]*>/,
  ],
  [
    `<meta property="og:description" content="${THESIS}" />`,
    /<meta\s+property="og:description"[^>]*>/,
  ],
  [`<meta property="og:url" content="${SITE}/" />`, /<meta\s+property="og:url"[^>]*>/],
  [`<meta property="og:image" content="${SITE}/og.svg" />`, /<meta\s+property="og:image"[^>]*>/],
  [
    `<meta name="twitter:card" content="summary_large_image" />`,
    /<meta\s+name="twitter:card"[^>]*>/,
  ],
];

if (!existsSync(INDEX)) {
  console.error(`inject-meta: ${INDEX} not found, run vite build first`);
  process.exit(1);
}

let html = readFileSync(INDEX, "utf8");
let injected = 0;
for (const [tag, pattern] of REQUIRED) {
  if (!pattern.test(html)) {
    html = html.replace("</head>", `  ${tag}\n  </head>`);
    injected += 1;
  }
}
// JSON-LD with the real per-slug ItemList (index.html carries the static
// Person+WebSite block; the ItemList is build-time generated from content).
if (!html.includes('"ItemList"')) {
  html = html.replace(
    "</head>",
    `  <script type="application/ld+json">${itemListJson}</script>\n  </head>`,
  );
  injected += 1;
}
if (injected > 0) writeFileSync(INDEX, html);
console.log(
  `inject-meta: ok (${injected} tags injected, ${builds.length} builds + ${thinking.length} thinking slugs)`,
);
