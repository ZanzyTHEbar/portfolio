import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/components/AliveDiagram.tsx", "utf8");

test("the diagram exposes a direct control for every Tier S project", () => {
  const tierS = readdirSync("content/projects")
    .filter((file) => file.endsWith(".mdx"))
    .filter((file) => /^tier:\s*S\s*$/m.test(readFileSync(`content/projects/${file}`, "utf8")));

  assert.ok(tierS.length > 0);
  assert.match(source, /items\.map\(\(item\) =>/);
  assert.match(source, /aria-pressed=\{selected === item\.slug\}/);
  assert.match(source, /onSelect\(item\.slug\)/);
  assert.doesNotMatch(source, /itemIndex|offsets|shard/);
});
