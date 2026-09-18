# Adding a New Tool

This is the exact pattern every tool follows. Sticking to it is what lets automated checks verify your PR in seconds instead of a human needing to read every line.

## The rule

> A new-tool PR may only add files inside `src/tools/<your-slug>/`, and add **one registry entry** to `src/tools/registry.ts`. Nothing else.

That's it. That one rule is what the automated scope check enforces.

`src/tools/_template/` is shared contributor scaffolding, not a tool slug, so a
template-only maintenance PR is outside the one-tool rule. Keep template edits
out of individual tool PRs. The check also has a one-time exception for the
architecture migration that first adds `src/tools/categories.ts`, because that
change must update the shared shell and existing tool metadata together; later
category changes do not receive that exception.

## Steps

1. **Pick a slug** — lowercase, hyphenated (`base64-encoder`, `regex-tester`, `uuid-generator`).
2. **Copy the template folder**: `cp -r src/tools/_template src/tools/<your-slug>`. It's a minimal, working, fully-tested starting point — a two-pane input/output tool with the right shape already in place, so you're editing working code instead of starting from a blank file. (`src/tools/json-formatter/` is also worth a look as a second real-world reference.)
3. **Fill in `meta.ts`**:
   ```ts
   import type { ToolMeta } from '../registry'

   const meta: ToolMeta = {
     slug: 'your-slug',
     name: 'Human Readable Name',
     description: 'One sentence describing what it does.',
     tags: ['relevant', 'tags'],
     category: 'dev-utils', // one of the CategorySlug values in src/tools/categories.ts
   }

   export default meta
   ```
   Pick whichever existing category in [`src/tools/categories.ts`](../src/tools/categories.ts) fits best. Adding a new category is a maintainer decision — open an issue first if you don't think any of them fit.
4. **Replace the logic in `index.tsx`** — a default-exported React component. Keep it self-contained: no imports from other tools' folders, and check with a maintainer before adding a new npm dependency. Don't add any page chrome (headers, breadcrumbs, etc.) — every tool already renders inside a shared page template (`src/pages/ToolPage.tsx`) that handles that.
5. **Register it** — open `src/tools/registry.ts` and add one line:
   ```ts
   import yourSlugMeta from './your-slug/meta'
   import YourSlug from './your-slug'
   // ...
   { meta: yourSlugMeta, Component: YourSlug },
   ```
6. **Test locally**: `npm run dev`, find your tool at `/tools/<your-slug>` (or via the sidebar / search), make sure it works.
7. **Update the test** — the template's `index.test.tsx` comes with two passing tests already; adjust the assertions to match your tool's actual behavior rather than deleting them.
8. **Run everything CI will run, before you open the PR**:
   ```bash
   npm run verify
   ```
   This runs lint, typecheck, tests, the local scope-check, and a full build — the same things `ci.yml` and `ai-pr-review.yml` check, just faster and before you've used up a PR cycle finding out. `check:scope` diffs your branch against your local `main`, so make sure that's up to date first (`git fetch origin main` if you're not sure).

## What gets checked automatically

- **Scope**: if your PR touches a `src/tools/<slug>/**` folder at all, it must stay to exactly one tool's folder (fails if it also touches another tool's folder or unrelated files). The shared `_template` folder is not considered a tool, but its maintenance must stay separate from a tool submission. If you're adding a **new** tool (i.e. adding a new `meta.ts`), it also needs the matching entry in `registry.ts`, and that entry has to actually register the tool you imported — the tool has to genuinely appear in `toolRegistry`, and reference the exact identifiers you imported. A **polish/bugfix** PR on an existing tool doesn't need to touch `registry.ts` at all. PRs that don't touch a real tool folder at all — template maintenance, docs, infra, config — aren't subject to this rule. The one-time migration that introduces `src/tools/categories.ts` is also exempt so it can update existing metadata and shared application code together.
- **Build**: does `npm run build` succeed?
- **Lint**: does the code pass ESLint?
- **Relevance / correctness**: does the implementation actually do what the linked issue described? Is it a duplicate of an existing tool?

## Good tool ideas, by category

- **Text & String**: case converter, slugify, Lorem Ipsum generator, text diff checker
- **Data & Format**: CSV↔JSON converter, Markdown previewer
- **Encoding & Security**: JWT decoder, hash generator (MD5/SHA), password generator, Base64 encode/decode
- **Web & Design**: color format converter (HEX/RGB/HSL), QR code generator
- **Date & Time**: timestamp converter, cron expression parser
- **Developer Utilities**: regex tester, Unix permission calculator, URL encode/decode

Small, self-contained, useful to a working developer, explainable in one sentence.

If you have an idea that isn't listed as an issue yet, open one with the **New Tool Proposal** template — don't just start building, since it might already exist or might not fit.
