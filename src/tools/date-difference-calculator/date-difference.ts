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
