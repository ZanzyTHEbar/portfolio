import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const notes = join(import.meta.dirname, "../content/notes");

test("notes omit unknown publication dates", () => {
  for (const file of readdirSync(notes).filter((name) => name.endsWith(".mdx"))) {
    const source = readFileSync(join(notes, file), "utf8");
    const date = source.match(/^date:\s*"?([^"\n]+)"?\s*$/m)?.[1];

    assert.notEqual(date, "2025-01-01", `${file} uses a placeholder date`);
    if (date) assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${file} has an invalid date`);
  }
});
