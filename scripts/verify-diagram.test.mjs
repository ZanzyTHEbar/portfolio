import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const tierS = readdirSync("content/projects")
  .filter((file) => file.endsWith(".mdx"))
  .filter((file) => /^tier:\s*S\s*$/m.test(readFileSync(`content/projects/${file}`, "utf8")));

test("the diagram renders a direct control for every Tier S project", async () => {
  assert.ok(tierS.length > 0);
  const vite = await createServer({
    appType: "custom",
    configFile: false,
    server: { middlewareMode: true },
  });
  try {
    const { AliveDiagram } = await vite.ssrLoadModule("/src/components/AliveDiagram.tsx");
    const items = tierS.map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      return { slug, title: slug, thesis: `${slug} thesis` };
    });
    const html = renderToStaticMarkup(
      createElement(AliveDiagram, { items, selected: null, onSelect: () => {} }),
    );
    const selector = html.slice(html.indexOf('aria-label="All Tier S projects"'));

    assert.ok(selector);
    assert.equal((selector.match(/aria-pressed=/g) ?? []).length, items.length);
    for (const item of items) assert.match(selector, new RegExp(`>${item.title}<`));
  } finally {
    await vite.close();
  }
});
