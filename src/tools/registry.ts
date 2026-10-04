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
import uuidGeneratorMeta from './uuid-generator/meta'
import UuidGenerator from './uuid-generator'
import durationConverterMeta from './duration-converter/meta'
import DurationConverter from './duration-converter'
import dateDifferenceMeta from './date-difference-calculator/meta'
import DateDifferenceCalculator from './date-difference-calculator'
import wordCounterMeta from './word-counter/meta'
import WordCounter from './word-counter'
import caseConverterMeta from './case-converter/meta'
import CaseConverter from './case-converter'
import csvJsonConverterMeta from './csv-json-converter/meta'
import CsvJsonConverter from './csv-json-converter'
import slugifyMeta from './slugify/meta'
import SlugGenerator from './slugify'
import urlEncoderDecoderMeta from './url-encoder-decoder/meta'
import UrlEncoderDecoder from './url-encoder-decoder'
import imageToBase64Meta from './image-to-base64/meta'
import ImageToBase64 from './image-to-base64'

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
  // <-- new tools are registered below this line, one per PR -->
  { meta: durationConverterMeta, Component: DurationConverter },
  { meta: dateDifferenceMeta, Component: DateDifferenceCalculator },
  { meta: wordCounterMeta, Component: WordCounter },
  { meta: caseConverterMeta, Component: CaseConverter },
  { meta: jsonFormatterMeta, Component: JsonFormatter },
  { meta: httpStatusCodesMeta, Component: HttpStatusCodes },
  { meta: uuidGeneratorMeta, Component: UuidGenerator },
  { meta: csvJsonConverterMeta, Component: CsvJsonConverter },
  { meta: slugifyMeta, Component: SlugGenerator },
  { meta: urlEncoderDecoderMeta, Component: UrlEncoderDecoder },
  { meta: imageToBase64Meta, Component: ImageToBase64 },
]

/** Looks up a registered tool by its URL slug. */
export function getToolBySlug(slug: string): ToolEntry | undefined {
  return toolRegistry.find((t) => t.meta.slug === slug)
}

/** Returns all registered tools assigned to a category. */
export function getToolsByCategory(categorySlug: CategorySlug): ToolEntry[] {
  return toolRegistry.filter((t) => t.meta.category === categorySlug)
}
