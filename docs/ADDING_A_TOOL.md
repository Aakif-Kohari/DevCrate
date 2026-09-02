# Adding a New Tool

This is the exact pattern every tool follows. Sticking to it is what lets automated checks verify your PR in seconds instead of a human needing to read every line.

## The rule

> A new-tool PR may only add files inside `src/tools/<your-slug>/`, and add **exactly one line** to `src/tools/registry.ts`. Nothing else.

That's it. That one rule is what the automated scope check enforces.

## Steps

1. **Pick a slug** — lowercase, hyphenated (`base64-encoder`, `regex-tester`, `uuid-generator`).
2. **Create the folder**: `src/tools/<your-slug>/`
3. **Add `meta.ts`**:
   ```ts
   import type { ToolMeta } from '../registry'

   const meta: ToolMeta = {
     slug: 'your-slug',
     name: 'Human Readable Name',
     description: 'One sentence describing what it does.',
     tags: ['relevant', 'tags'],
   }

   export default meta
   ```
4. **Add `index.tsx`** — a default-exported React component. Keep it self-contained: no imports from other tools' folders, and check with a maintainer before adding a new npm dependency.
5. **Register it** — open `src/tools/registry.ts` and add one line:
   ```ts
   import yourSlugMeta from './your-slug/meta'
   import YourSlug from './your-slug'
   // ...
   { meta: yourSlugMeta, Component: YourSlug },
   ```
6. **Test locally**: `npm run dev`, click your tool in the sidebar, make sure it works.
7. **Add a test** (optional but appreciated): see `src/tools/json-formatter/index.test.tsx` for the pattern.
8. **Run everything CI will run, before you open the PR**:
   ```bash
   npm run verify
   ```
   This runs lint, typecheck, tests, the local scope-check, and a full build — the same things `ci.yml` and `ai-pr-review.yml` check, just faster and before you've used up a PR cycle finding out. `check:scope` diffs your branch against your local `main`, so make sure that's up to date first (`git fetch origin main` if you're not sure).

## What gets checked automatically

- **Scope**: if your PR touches a `src/tools/<slug>/**` folder at all, it must stay to exactly one tool's folder (fails if it also touches another tool's folder or unrelated files). If you're adding a **new** tool (i.e. adding a new `meta.ts`), it also needs the matching entry in `registry.ts`. A **polish/bugfix** PR on an existing tool doesn't need to touch `registry.ts` at all. PRs that don't touch `src/tools/` at all — docs, infra, config — aren't subject to this rule.
- **Build**: does `npm run build` succeed?
- **Lint**: does the code pass ESLint?
- **Relevance / correctness**: does the implementation actually do what the linked issue described? Is it a duplicate of an existing tool?

## Good tool ideas

Small, self-contained, useful to a working developer, explainable in one sentence: JWT decoder, UUID generator, regex tester, timestamp converter, Base64 encode/decode, color format converter (HEX/RGB/HSL), cron expression parser, Markdown previewer, text diff checker, hash generator (MD5/SHA), case converter, URL encode/decode, Lorem Ipsum generator, password generator, slugify, CSV↔JSON converter, Unix permission calculator, QR code generator.

If you have an idea that isn't listed as an issue yet, open one with the **New Tool Proposal** template — don't just start building, since it might already exist or might not fit.
