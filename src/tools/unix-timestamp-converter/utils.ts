export type Unit = 'seconds' | 'milliseconds'

export interface ParsedTimestamp {
  unit: Unit
  date: Date
}

/** Largest instant a JS Date can represent, in milliseconds. */
const MAX_MS = 8.64e15

/**
 * Parses an integer Unix timestamp. Values with 12 or more digits are treated as
 * milliseconds, anything shorter as seconds. Throws a readable Error when invalid.
 */
export function parseTimestamp(input: string): ParsedTimestamp {
  const value = input.trim()
  if (!/^-?\d+$/.test(value)) {
    throw new Error('Enter a whole number, for example 1700000000 or 1700000000000.')
  }
  const digits = value.replace('-', '').length
  const unit: Unit = digits >= 12 ? 'milliseconds' : 'seconds'
  const n = Number(value)
  const ms = unit === 'seconds' ? n * 1000 : n
  if (!Number.isFinite(ms) || Math.abs(ms) > MAX_MS) {
    throw new Error('That timestamp is outside the range of dates JavaScript can represent.')
  }
  return { unit, date: new Date(ms) }
}

const STEPS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: 'year', ms: 365 * 24 * 3600 * 1000 },
  { unit: 'month', ms: 30 * 24 * 3600 * 1000 },
  { unit: 'day', ms: 24 * 3600 * 1000 },
  { unit: 'hour', ms: 3600 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
  { unit: 'second', ms: 1000 },
]

/** Describes `date` relative to `now`, e.g. "3 hours ago" or "in 2 days". */
export function relativeTime(date: Date, now: Date = new Date()): string {
  const diff = date.getTime() - now.getTime()
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  for (const { unit, ms } of STEPS) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.trunc(diff / ms), unit)
  }
  return rtf.format(0, 'second')
}

/** Formats a Date in the user's local zone, including the zone name. */
export function formatLocal(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date)
}

/** Formats a Date as UTC, e.g. "Tue, 14 Nov 2023 22:13:20 GMT". */
export function formatUtc(date: Date): string {
  return date.toUTCString()
}

/** Converts a `datetime-local` value (local time) to a Date, or null when incomplete/invalid. */
export function parseLocalInput(value: string): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
