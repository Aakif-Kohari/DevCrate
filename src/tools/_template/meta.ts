// TEMPLATE — copy this whole `_template` folder to `src/tools/<your-slug>/`
// and fill in the fields below. See docs/ADDING_A_TOOL.md for the full guide.
//
// This folder is intentionally unregistered (not imported by registry.ts)
// — it's a reference/starting point only, never rendered by the app.

import type { ToolMeta } from '../registry'

const meta: ToolMeta = {
  // Lowercase, hyphenated, matches your folder name under src/tools/.
  slug: 'your-tool-slug',
  // Shown in the sidebar and page titles.
  name: 'Your Tool Name',
  // One sentence: what you paste/enter, what you get back.
  description: 'One sentence describing what this tool does.',
  // A few searchable keywords.
  tags: ['example', 'template'],
  // One of the CategorySlug values from src/tools/categories.ts — pick
  // whichever existing category your tool best fits under.
  category: 'dev-utils',
}

export default meta
