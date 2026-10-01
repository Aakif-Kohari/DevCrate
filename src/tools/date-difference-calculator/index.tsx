import { useMemo, useState } from 'react'
import { dateDifference } from './date-difference'

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
