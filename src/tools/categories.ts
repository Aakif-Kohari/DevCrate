// Fixed set of tool categories. Every tool's meta.ts assigns itself to one
// of these via its `category` field (see registry.ts's ToolMeta type).
//
// Adding a new category is a maintainer decision, not a per-tool one — if
// you're building a new tool and none of these fit well, open an issue
// first rather than adding one in the same PR.

import type { LucideIcon } from 'lucide-react'
import { Type, Braces, KeyRound, Palette, Clock, Terminal } from 'lucide-react'

export type CategorySlug = 'text' | 'data' | 'encoding' | 'web-design' | 'datetime' | 'dev-utils'

export interface Category {
  slug: CategorySlug
  name: string
  description: string
  icon: LucideIcon
}

export const categories: Category[] = [
  {
    slug: 'text',
    name: 'Text & String',
    description: 'Formatting, comparing, and transforming plain text.',
    icon: Type,
  },
  {
    slug: 'data',
    name: 'Data & Format',
    description: 'Parsing and converting between structured data formats.',
    icon: Braces,
  },
  {
    slug: 'encoding',
    name: 'Encoding & Security',
    description: 'Encoding, hashing, tokens, and password generation.',
    icon: KeyRound,
  },
  {
    slug: 'web-design',
    name: 'Web & Design',
    description: 'Color, imagery, and other visual front-end helpers.',
    icon: Palette,
  },
  {
    slug: 'datetime',
    name: 'Date & Time',
    description: 'Timestamps, cron expressions, and scheduling helpers.',
    icon: Clock,
  },
  {
    slug: 'dev-utils',
    name: 'Developer Utilities',
    description: 'Regex, permissions, and other everyday dev helpers.',
    icon: Terminal,
  },
]

/** Looks up a category by its URL slug. */
export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
