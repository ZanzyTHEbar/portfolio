import { defineCollection, defineConfig, s } from "velite";

// Shared A4 editorial frontmatter (ADDENDUM-OS1 §A4). Unverified metrics
// (verified: false) are stored but never rendered — see §A5.
const editorial = {
  slug: s.string(),
  title: s.string(),
  tier: s.enum(["S", "A", "workshop", "archive"]).optional(),
  status: s.enum(["active", "maintained", "completed", "archived", "experimental"]).optional(),
  dates: s.object({ start: s.string().optional(), end: s.string().optional() }).optional(),
  dimensions: s
    .array(s.enum(["build", "research", "experiment", "teaching", "opinion", "life"]))
    .optional(),
  thesis: s.string(),
  stack: s.array(s.string()).default([]),
  domains: s.array(s.string()).default([]),
  related: s.array(s.string()).default([]),
  featured: s.boolean().default(false),
  priority: s.number().default(0),
  metrics: s
    .array(
      s.object({
        label: s.string(),
        value: s.string(),
        verified: s.boolean(),
      }),
    )
    .default([]),
};

const projects = defineCollection({
  name: "Project",
  pattern: "projects/*.mdx",
  schema: s.object({ ...editorial, body: s.mdx() }),
});

const notes = defineCollection({
  name: "Note",
  pattern: "notes/*.mdx",
  schema: s.object({
    ...editorial,
    date: s.string().optional(),
    summary: s.string(),
    projectSlugs: s.array(s.string()).default([]),
    body: s.mdx(),
  }),
});

export default defineConfig({
  strict: true,
  root: "./content",
  output: {
    data: "./src/.velite",
    clean: true,
    format: "esm",
  },
  collections: { projects, notes },
});
