# DevCrate

A community-built crate of small, single-purpose developer utility tools — one clean React app, one tool per folder, built entirely by open-source contributors.

Think of it as an in-browser Swiss-army knife: a JSON formatter, a JWT decoder, a regex tester, a UUID generator, a color converter, a cron parser — dozens of tiny, useful, self-contained tools, each contributed by a different person.

**Built for [Open Source Connect India 2026 (OSCI'26)](https://www.osconnect.org/osci).**

---

## Why DevCrate?

Every "developer utility" site (JSON formatter, JWT decoder, etc.) is one Google search away — the point here isn't to reinvent them, it's to give first-time open-source contributors an easy, well-scoped, portfolio-worthy PR:

- **Small scope** — one tool, one folder, usually one component file.
- **Clear pattern** — copy an existing tool, follow [`docs/ADDING_A_TOOL.md`](docs/ADDING_A_TOOL.md), done.
- **Fast feedback** — automated checks tell you within minutes if your PR is mergeable.
- **No merge-conflict roulette** — every tool lives in its own folder, so PRs almost never collide.


## Tech Stack

React 18 + TypeScript + Vite + Tailwind CSS. No backend, no database — everything runs client-side.

## Getting Started

Just want to run it locally?

```bash
git clone https://github.com/Aakif-Kohari/DevCrate.git
cd DevCrate
npm install
npm run dev
```

Open `http://localhost:5173`.

Want to contribute a tool? You'll fork instead of cloning this repo directly — see [Contributing](#contributing) below.

## Contributing

New here? Full guide: [`CONTRIBUTING.md`](CONTRIBUTING.md) (fork/branch/PR steps, written for a first-time contributor) and [`docs/ADDING_A_TOOL.md`](docs/ADDING_A_TOOL.md) (the code pattern every tool follows). Short version:

1. **Fork this repo** (button top-right of this page), then clone *your fork*:
   ```bash
   git clone https://github.com/<your-username>/DevCrate.git
   cd DevCrate
   npm install
   ```
2. Find an open issue tagged `good-first-issue` or `new-tool`, comment `/claim`.
3. Branch, build, register: `git checkout -b my-tool`, build the tool inside `src/tools/<your-tool-slug>/` (copy the existing `json-formatter` example), register it in `src/tools/registry.ts` (one line).
4. `npm run verify`, then push your branch and open a PR from your fork into this repo's `main`.
5. Automated checks + an AI review bot will comment within minutes.

## Project Structure

```
src/
  tools/
    registry.ts          <- central list every tool registers itself in
    json-formatter/       <- example tool — copy this folder to start a new one
      index.tsx
      meta.ts
  components/
    ToolCard.tsx
  App.tsx
```

## Live Demo & Releases

Deployed automatically to Vercel on every push to `main`, with an automatic preview URL on every pull request too. Snapshots of what's shipped are kept as [Releases](../../releases).

## Enjoying this project?

A ⭐ on the repo genuinely helps — it's how other first-time contributors find beginner-friendly projects like this one.

## License

[MIT](LICENSE) — free to use, fork, and build on.

## Code of Conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.
