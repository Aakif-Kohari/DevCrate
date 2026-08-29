// Central tool registry.
//
// This is the ONLY shared file a new-tool PR is allowed to touch —
// everything else about a tool lives inside its own folder.
// Add exactly ONE line per new tool. Do not remove or reorder existing lines
// unless you are the one who added them.

import type { ComponentType } from 'react'
import jsonFormatterMeta from './json-formatter/meta'
import JsonFormatter from './json-formatter'

export interface ToolMeta {
  slug: string
  name: string
  description: string
  tags: string[]
}

export interface ToolEntry {
  meta: ToolMeta
  Component: ComponentType
}

export const toolRegistry: ToolEntry[] = [
  { meta: jsonFormatterMeta, Component: JsonFormatter },
  // <-- new tools are registered below this line, one per PR -->
]
