# Instructions for GitHub Copilot on this repo

This file is picked up automatically by GitHub Copilot Chat and Copilot code
review (free with a GitHub Student Developer Pack — no extra setup needed
beyond enabling Copilot on your account and, per PR, requesting it as a
reviewer). It's a free complement to the automated `scope-check` /
`ai-review` workflows, not a replacement for them.

## What this project is

DevCrate is a collection of small, self-contained developer utility tools.
Each tool lives entirely in its own folder under `src/tools/<slug>/` and
registers itself with exactly one added line in `src/tools/registry.ts`.
Full pattern: `docs/ADDING_A_TOOL.md`.

## When reviewing a pull request, check for:

1. **Scope** — the PR should only touch one `src/tools/<slug>/` folder. A
   brand-new tool (one that adds a new `meta.ts`) also needs one added
   (never removed) line in `registry.ts`; a polish/bugfix PR on an
   existing tool doesn't need to touch `registry.ts` at all. Flag
   anything outside that scope.
2. **Correctness** — does it do what the linked issue's acceptance criteria describe?
3. **Safety** — does it avoid changing or removing anything unrelated to the issue?
4. Tools are plain React function components, TypeScript, Tailwind for
   styling, no new npm dependencies unless already discussed in the issue.

## When helping a contributor write a new tool:

Point them to the `json-formatter` folder as the reference implementation
and to `docs/ADDING_A_TOOL.md` for the exact steps. Encourage small, focused
PRs — one tool per PR, nothing else touched.
