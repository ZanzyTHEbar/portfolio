# Portfolio Content Contract

## Source of Truth

- `content/projects/*.mdx` contains public project records.
- `content/notes/*.mdx` contains public notes.
- React components render content; they do not invent project claims or carry public copy that belongs in content.

## Public Project Records

- State only source-backed facts about the artifact, its implementation, and its demonstrated use.
- Use `System` for the artifact and `Evidence` for primary references. Tier S records may also use `Strange Idea`, `Hypothesis`, `Constraints`, and `Decisions` when they describe the work itself.
- Do not publish process residue: `Reality`, `Failure`, `Open Questions`, TODOs, source-audit prose, unknowns, verification status, missing-work inventories, or speculative next steps.
- Resolve useful factual questions before publishing. If evidence is unavailable, track the follow-up outside the repository and omit it from frontmatter, hidden content, and rendered copy.
- Keep caveats only when they are material, source-backed operational facts. Write them as plain statements, not editorial disclaimers.

## Public Notes

- Publish a complete claim or explanation. Do not publish unresolved design choices, unverified assertions, or research reminders.
- Keep sources and uncertainty tracking outside public content until a claim is ready to state.

## Validation

- Preserve MDX frontmatter, Evidence URLs, project slugs, and content schemas.
- Run the repository tests, typecheck, lint, build, and content validators after content changes.
