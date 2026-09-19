// Central tool registry.
//
// This is the ONLY shared file a new-tool PR is allowed to touch —
// everything else about a tool lives inside its own folder.
// Add exactly ONE line per new tool. Do not remove or reorder existing lines
// unless you are the one who added them.

import type { ComponentType } from 'react'
import type { CategorySlug } from './categories'
import jsonFormatterMeta from './json-formatter/meta'
import JsonFormatter from './json-formatter'
import httpStatusCodesMeta from './http-status-codes/meta'
import HttpStatusCodes from './http-status-codes'

export interface ToolMeta {
  slug: string
  name: string
  description: string
  tags: string[]
  /** Which category page this tool is grouped under — see tools/categories.ts. */
  category: CategorySlug
}

export interface ToolEntry {
  meta: ToolMeta
  Component: ComponentType
}

export const toolRegistry: ToolEntry[] = [
  { meta: jsonFormatterMeta, Component: JsonFormatter },
  { meta: httpStatusCodesMeta, Component: HttpStatusCodes },
  // <-- new tools are registered below this line, one per PR -->
]

/** Looks up a registered tool by its URL slug. */
export function getToolBySlug(slug: string): ToolEntry | undefined {
  return toolRegistry.find((t) => t.meta.slug === slug)
}

/** Returns all registered tools assigned to a category. */
export function getToolsByCategory(categorySlug: CategorySlug): ToolEntry[] {
  return toolRegistry.filter((t) => t.meta.category === categorySlug)
}
