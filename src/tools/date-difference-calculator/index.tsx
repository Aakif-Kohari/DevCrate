import { useMemo, useState } from 'react'

const DAY_MS = 86_400_000

function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null
}

function addMonthsClamped(date: Date, months: number): Date {
  const targetMonth = date.getUTCMonth() + months
  const year = date.getUTCFullYear() + Math.floor(targetMonth / 12)
  const month = ((targetMonth % 12) + 12) % 12
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), lastDay)))
}

function businessDays(start: Date, end: Date, inclusive: boolean): number {
  let count = 0
  const limit = end.getTime() + (inclusive ? DAY_MS : 0)
  for (let time = start.getTime(); time < limit; time += DAY_MS) {
    const day = new Date(time).getUTCDay()
    if (day !== 0 && day !== 6) count += 1
  }
  return count
}

export function dateDifference(
  startValue: string,
  endValue: string,
  includeEnd = false,
  weekdaysOnly = false,
) {
  const parsedStart = parseDate(startValue)
  const parsedEnd = parseDate(endValue)
  if (!parsedStart || !parsedEnd) return null

  const reversed = parsedStart > parsedEnd
  const start = reversed ? parsedEnd : parsedStart
  const end = reversed ? parsedStart : parsedEnd
  const inclusiveExtra = includeEnd ? 1 : 0
  const totalDays = Math.round((end.getTime() - start.getTime()) / DAY_MS) + inclusiveExtra
  const effectiveEnd = new Date(end.getTime() + inclusiveExtra * DAY_MS)

  let years = effectiveEnd.getUTCFullYear() - start.getUTCFullYear()
  if (addMonthsClamped(start, years * 12) > effectiveEnd) {
    years -= 1
  }

  let months = 0
  while (addMonthsClamped(start, years * 12 + months + 1) <= effectiveEnd) {
    months += 1
  }

  const cursor = addMonthsClamped(start, years * 12 + months)
  const days = Math.round((effectiveEnd.getTime() - cursor.getTime()) / DAY_MS)
  const selectedDays = weekdaysOnly ? businessDays(start, end, includeEnd) : totalDays

  return {
    reversed,
    years,
    months,
    days,
    totalDays: selectedDays,
    totalWeeks: selectedDays / 7,
    totalHours: selectedDays * 24,
  }
}

export default function DateDifferenceCalculator() {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [includeEnd, setIncludeEnd] = useState(false)
  const [weekdaysOnly, setWeekdaysOnly] = useState(false)
  const result = useMemo(
    () => dateDifference(start, end, includeEnd, weekdaysOnly),
    [start, end, includeEnd, weekdaysOnly],
  )

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Start date
          <input
            aria-label="Start date"
            type="date"
            className="focus-ring mt-1 block w-full rounded-lg border border-border bg-card p-2"
            value={start}
            onChange={(event) => setStart(event.target.value)}
          />
        </label>
        <label className="text-sm font-medium">
          End date
          <input
            aria-label="End date"
            type="date"
            className="focus-ring mt-1 block w-full rounded-lg border border-border bg-card p-2"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label>
          <input
            type="checkbox"
            checked={includeEnd}
            onChange={(event) => setIncludeEnd(event.target.checked)}
          />{' '}
          Include end date
        </label>
        <label>
          <input
            type="checkbox"
            checked={weekdaysOnly}
            onChange={(event) => setWeekdaysOnly(event.target.checked)}
          />{' '}
          Business days only (Mon–Fri)
        </label>
      </div>
      {result && (
        <div className="rounded-lg border border-border bg-muted p-4" aria-live="polite">
          {result.reversed && (
            <p className="mb-2 text-sm">
              Dates were swapped so the earlier date is calculated first.
            </p>
          )}
          <p className="font-medium">
            {result.years} years, {result.months} months, {result.days} days
          </p>
          <p className="text-sm">
            Total: {result.totalDays} days · {result.totalWeeks.toFixed(2)} weeks ·{' '}
            {result.totalHours} hours
          </p>
        </div>
      )}
    </div>
  )
}
