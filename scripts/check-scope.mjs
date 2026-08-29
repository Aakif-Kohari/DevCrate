#!/usr/bin/env node
// Local approximation of the CI "scope-check" — run this before opening a
// PR to catch scope violations early. CI's version (in
// .github/workflows/ai-pr-review.yml) is the authoritative one; this is
// just fast local feedback using the same rule: a tool PR should only
// touch one src/tools/<slug>/ folder, plus additions to registry.ts.

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

for (const file of files) {
  if (file === 'src/tools/registry.ts') continue // additions-only check is CI-side, needs PR diff detail
  const m = file.match(/^src\/tools\/([^/]+)\//)
  if (!m) {
    violations.push(`touches \`${file}\`, which is outside src/tools/**`)
    continue
  }
  const slug = m[1]
  if (touchedSlug && touchedSlug !== slug) {
    violations.push(
      `touches files in both src/tools/${touchedSlug}/ and src/tools/${slug}/ — one PR should add exactly one tool`,
    )
  }
  touchedSlug = slug
}

if (violations.length > 0) {
  console.error('❌ Scope check failed:')
  for (const v of violations) console.error(`   - ${v}`)
  console.error(
    '\nSee docs/ADDING_A_TOOL.md — a tool PR should only touch its own folder plus registry.ts.',
  )
  process.exit(1)
}

console.log(
  `✅ Scope check passed — changes stay within src/tools/${touchedSlug || '<unknown>'}/** (+ registry.ts).`,
)
