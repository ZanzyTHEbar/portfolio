import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://zacariahheim.com";
const STATIC_ROUTES = ["/", "/builds", "/thinking", "/trajectory", "/contact"];
const XML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function frontmatterSlug(source) {
  const frontmatter = source.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  const field = frontmatter?.[1].match(/^slug:[ \t]*(.*)$/m);
  if (!field) return "";

  const value = field[1].trim();
  const doubleQuoted = value.match(/^("(?:\\.|[^"\\])*")[ \t]*(?:#.*)?$/);
  if (doubleQuoted) {
    try {
      return JSON.parse(doubleQuoted[1]);
    } catch {
      return doubleQuoted[1].slice(1, -1);
    }
  }
  const singleQuoted = value.match(/^'((?:''|[^'])*)'[ \t]*(?:#.*)?$/);
  if (singleQuoted) {
    return singleQuoted[1].replaceAll("''", "'");
  }
  return value.replace(/[ \t]+#.*/, "").trim();
}

function collectionSlugs(directory) {
  const path = join(ROOT, directory);
  if (!existsSync(path)) return [];

  return readdirSync(path)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const source = readFileSync(join(path, file), "utf8");
      return frontmatterSlug(source) || file.replace(/\.mdx$/, "");
    });
}

function duplicateSlugs(slugs) {
  const seen = new Set();
  return slugs.filter((slug) => {
    if (seen.has(slug)) return true;
    seen.add(slug);
    return false;
  });
}

function xmlEscape(value) {
  return value.replace(/[&<>"']/g, (character) => XML_ENTITIES[character]);
}

const builds = collectionSlugs("content/projects");
const thinking = collectionSlugs("content/notes");

if (builds.length === 0 || thinking.length === 0) {
  console.error(
    `sitemap: expected content/projects + content/notes, found ${builds.length} builds / ${thinking.length} thinking`,
  );
  process.exit(1);
}

for (const [collection, slugs] of [
  ["projects", builds],
  ["notes", thinking],
]) {
  const duplicates = duplicateSlugs(slugs);
  if (duplicates.length > 0) {
    console.error(
      `sitemap: duplicate ${collection} slug${duplicates.length === 1 ? "" : "s"}: ${duplicates.join(", ")}`,
    );
    process.exit(1);
  }

  const invalid = slugs.filter((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug));
  if (invalid.length > 0) {
    console.error(
      `sitemap: invalid ${collection} slug${invalid.length === 1 ? "" : "s"}: ${invalid.join(", ")}`,
    );
    process.exit(1);
  }
}

const dynamicRoutes = [
  ...builds.map((slug) => ({ slug, route: `/builds/${slug}` })),
  ...thinking.map((slug) => ({ slug, route: `/thinking/${slug}` })),
].sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...[...STATIC_ROUTES, ...dynamicRoutes.map(({ route }) => route)].map(
    (route) => `  <url><loc>${xmlEscape(`${SITE}${route}`)}</loc></url>`,
  ),
  "</urlset>",
  "",
].join("\n");

writeFileSync(join(ROOT, "public", "sitemap.xml"), sitemap);
console.log(`sitemap: wrote ${builds.length} builds + ${thinking.length} thinking URLs`);
