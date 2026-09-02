## What kind of change is this?

<!-- Choose those that apply -->
- [ ] 🧰 New tool (`src/tools/<slug>/`)
- [ ] 🔧 Polish on an existing tool (tests, accessibility, mobile layout, edge cases)
- [ ] 📝 Documentation only
- [ ] 🐛 Bug fix
- [ ] Other (explain below)

## Summary

<!-- What does this PR add or change? A sentence or two about it -->

Closes #<!-- issue number -->

## What changed

<!--
Bullet the actual changes. For a new tool, this is usually short:
- Added <ToolName> under src/tools/<slug>/
- Registered it in src/tools/registry.ts
For polish/bugfix PRs, be specific about the before/after behavior.
-->

-

## Checklist

**Scope** (check the option that applies; this is what the automated `scope-check` verifies)
- [ ] New tool: this PR touches only `src/tools/<slug>/` for one new tool, plus one added line in `src/tools/registry.ts`
- [ ] Polish/bugfix: this PR touches only `src/tools/<slug>/` for one existing tool — `registry.ts` isn't touched
- [ ] This PR is documentation-only / infra-only (doesn't touch `src/tools/**`).
- [ ] No unrelated files were touched (no drive-by formatting changes, no edits to other tools' folders)

**Before opening this PR**
- [ ] `npm run verify` passes locally (runs format check, lint, typecheck, tests, scope-check, and build in one command)
- [ ] `npm run dev` — I clicked through the tool myself and it behaves as described in the linked issue
- [ ] If I added a new tool, I followed the pattern in [`docs/ADDING_A_TOOL.md`](../blob/main/docs/ADDING_A_TOOL.md) (own folder, `meta.ts`, registered in `registry.ts`)
- [ ] No new npm dependencies — or, if one was genuinely needed, it was discussed in the linked issue first (link that comment here)
- [ ] Added or updated a test for the change, if practical (see `src/tools/json-formatter/index.test.tsx` for the pattern)

## Screenshot or recording

<!-- A quick screenshot or screen recording of the tool/change working. For a bug fix, before/after is ideal. -->

## Anything the reviewer should know?

<!--
Optional — flag anything unusual: a deliberate scope exception, a design
tradeoff you made, something you're unsure about, or context the automated
checks can't see. Leave blank if there's nothing to add.
-->
