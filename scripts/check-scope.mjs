#!/usr/bin/env node
// Local approximation of the CI "scope-check" — run this before opening a
// PR to catch scope violations early. CI's version (in
// .github/workflows/ai-pr-review.yml) is the authoritative one; this is
// just fast local feedback using the same rules:
//   - a tool PR should only touch one src/tools/<slug>/ folder
//   - a registry.ts change must be paired with a tool folder (can't be
//     the only thing touched)
//   - once you touch a tools folder at all, unrelated files elsewhere are
//     out of scope
//   - if you don't touch src/tools/** at all (docs/infra/config changes),
//     none of this applies
// This script intentionally does NOT check whether registry.ts was
// updated *correctly* for a new tool (imports, exactly one entry, whether
// the tool is actually new) — that needs each file's added/modified
// status, patch content, and a base-branch lookup, none of which
// `git diff --name-only` gives us. That finer check is CI-side only, see
// ai-pr-review.yml.

import { execSync } from 'node:child_process'

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim()
}

const base = 'main'
try {
  run(`git rev-parse --verify ${base}`)
} catch {
  console.error(
    `⚠️  No local "main" branch found to diff against. Run "git fetch origin main" ` +
      `and "git branch main origin/main" first, or skip this check and rely on CI.`,
  )
  process.exit(0) // don't block a contributor over an unrelated git setup issue
}

let files
try {
  files = run(`git diff --name-only ${base}...HEAD`).split('\n').filter(Boolean)
} catch (e) {
  console.error('⚠️  Could not compute a diff against main:', e.message)
  process.exit(0)
}

if (files.length === 0) {
  console.log('No changes relative to main yet — nothing to check.')
  process.exit(0)
}

const violations = []
let touchedSlug = null
let touchesRegistry = false
let touchesATool = false
const otherFiles = []

for (const file of files) {
  if (file === 'src/tools/registry.ts') {
    touchesRegistry = true
    touchesATool = true
    continue
  }
  const m = file.match(/^src\/tools\/([^/]+)\//)
  if (!m) {
    otherFiles.push(file)
    continue
  }
  touchesATool = true
  const slug = m[1]
  if (touchedSlug && touchedSlug !== slug) {
    violations.push(
      `touches files in both src/tools/${touchedSlug}/ and src/tools/${slug}/ — one PR should add exactly one tool`,
    )
  }
  touchedSlug = slug
}

// The one-tool-per-PR rule only applies once a PR actually touches
// src/tools/** at all — a docs-only, infra-only, or config-only PR isn't a
// tool submission and shouldn't be judged as one (matches CI).
if (!touchesATool) {
  console.log(
    '✅ No src/tools/** folder touched — not subject to the one-tool-per-PR rule (docs/infra/config change).',
  )
  process.exit(0)
}

// registry.ts on its own, with no tool folder touched, is never valid —
// it must be paired with the tool it's registering (matches CI).
if (touchesRegistry && touchedSlug === null) {
  violations.push(
    'touches `src/tools/registry.ts` without touching any `src/tools/<slug>/` folder — registry.ts must be paired with exactly one tool folder',
  )
}

if (otherFiles.length > 0) {
  violations.push(
    ...otherFiles.map(
      (f) =>
        `touches \`${f}\`, which is outside src/tools/** — keep tool PRs scoped to just the tool`,
    ),
  )
}

if (violations.length > 0) {
  console.error('❌ Scope check failed:')
  for (const v of violations) console.error(`   - ${v}`)
  console.error(
    '\nSee docs/ADDING_A_TOOL.md — a tool PR should only touch its own folder plus, for new tools, registry.ts.',
  )
  process.exit(1)
}

console.log(
  `✅ Scope check passed — changes stay within src/tools/${touchedSlug || '<unknown>'}/** (+ registry.ts, if this is a new tool).`,
)
