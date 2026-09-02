# Contributing to DevCrate

Thanks for considering a contribution — this project is built entirely by people like you, and many contributors here are making their first-ever open-source PR. This guide is self-contained: everything you need to actually get code merged is below. For general OSCI'26 program rules (professionalism expectations, event-wide guidelines), see the [Open Source Connect India program page](https://www.osconnect.org/osci).

If DevCrate is useful to you, a ⭐ on the repo helps other first-time contributors find it — no obligation, just appreciated.

## 1. Fork and set up your local copy

You won't have permission to push directly to this repo — that's normal, it's how every open-source project works. Instead, you make your own copy (a "fork"), work there, and then propose your changes back via a pull request.

1. Click **Fork** (top-right of this repo's GitHub page). This creates a copy under your own account: `github.com/<your-username>/DevCrate`.
2. Clone *your fork* (not this repo) to your machine:
   ```bash
   git clone https://github.com/<your-username>/DevCrate.git
   cd DevCrate
   ```
3. Add this original repo as a second remote, called `upstream`, so you can pull in the latest changes later:
   ```bash
   git remote add upstream https://github.com/Aakif-Kohari/DevCrate.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

**Before starting any new issue**, make sure your fork's `main` is up to date — this matters because both the local scope-check and CI compare your branch against `main`:
```bash
git checkout main

# 1. Fetch and Merge
git fetch upstream
git merge upstream/main

# OR 2, Directly Pull
git pull upstream main

git push origin main
```

## 2. Pick an issue

- Browse [open issues](../../issues). Anything tagged `new-tool` and `good first issue` is ready to build.
- Anyone can open new issues too — if you have an idea for a tool that isn't listed, open one using the **New Tool Proposal**, **Documentation**, or **Polish an Existing Tool** template. It'll be auto-checked for relevance and duplicates before anyone starts work, and it gets assigned straight to you automatically — no separate claim step needed for issues you open yourself.

## 3. Claim it

If you're picking up an issue someone *else* opened (usually one tagged `new-tool` from the maintainer's own backlog), comment **`/claim`** (or `/assign`, `/take`). A bot will assign it to you automatically, as long as:

- it isn't already claimed by someone else, and
- you don't already have 5 other issues claimed and unfinished.

If you get stuck or change your mind, comment `/unclaim` so someone else can pick it up. If there's no activity here for 52 hours, the issue is automatically released back to the pool for someone else to claim — you can always `/claim` it again if you're still working on it, nothing is held against you.

## 4. Create a branch

```bash
git checkout -b add-jwt-decoder
```

(Name it after what you're building — doesn't need to match the issue number.)

## 5. Build the tool

Every tool lives entirely inside its own folder: `src/tools/<tool-slug>/`. Follow [`docs/ADDING_A_TOOL.md`](docs/ADDING_A_TOOL.md) — it's short and it's exactly what the automated PR checks look for.

The existing `src/tools/json-formatter/` folder is a working reference implementation. Copy its shape.

## 6. Run the checks locally first

```bash
npm run verify
```

This runs lint, typecheck, tests, a local scope-check, and a full build — everything CI checks, before you've spent a PR cycle finding out.

## 7. Push and open your PR

```bash
git add .
git commit -m "Add JWT decoder tool"
git push origin add-jwt-decoder
```

Then on GitHub: open a pull request from `<your-username>/DevCrate:add-jwt-decoder` into `Aakif-Kohari/DevCrate:main` (GitHub usually prompts this automatically right after you push).

- Keep the PR to **exactly** what the issue describes. Don't also "fix the spacing" in an unrelated file — that will fail the automated scope check and slow down your merge.
- Fill out the PR template. Link the issue with `Closes #123`.

## 8. Let the checks run

Within a few minutes you'll see `build`, `typecheck`, `test`, `lint`, and `scope-check` — all objective, all required. You'll also see an `ai-review` comment and a Vercel preview link — both informational, not required checks.

If everything passes, the maintainer reviews and merges manually — this isn't an auto-merge repo, so don't worry if it takes a little while after checks go green. If something fails, the bot comments leave specific, actionable feedback — fix and push again to the same branch, no need to open a new PR.

## Code style

- TypeScript, functional components, Tailwind utility classes for styling.
- No new dependencies without discussing it in the issue first — keeps the bundle small and review fast.

## Questions

Use [GitHub Discussions](../../discussions) for anything that isn't a bug or a specific tool. Please don't DM the maintainer on LinkedIn for support — keep contribution-related communication in the project's own spaces.
