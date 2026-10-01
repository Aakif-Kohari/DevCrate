const TOKEN_UNITS: Record<string, number> = {
  ms: 0.001,
  millisecond: 0.001,
  milliseconds: 0.001,
  s: 1,
  sec: 1,
  secs: 1,
  second: 1,
  seconds: 1,
  m: 60,
  min: 60,
  mins: 60,
  minute: 60,
  minutes: 60,
  h: 3600,
  hr: 3600,
  hrs: 3600,
  hour: 3600,
  hours: 3600,
  d: 86400,
  day: 86400,
  days: 86400,
  w: 604800,
  week: 604800,
  weeks: 604800,
}

/** Parse a signed human-readable duration into total seconds. */
export function parseDuration(input: string): number | null {
  const source = input.trim()
  if (!source) return null

  const pattern =
    /([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*(milliseconds?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w)/gi
  let total = 0
  let cursor = 0
  let matched = false

  for (const match of source.matchAll(pattern)) {
    if (source.slice(cursor, match.index).trim()) return null

    const multiplier = TOKEN_UNITS[match[2].toLocaleLowerCase()]
    if (multiplier === undefined) return null

    total += Number(match[1]) * multiplier
    cursor = (match.index ?? 0) + match[0].length
    matched = true
  }

  if (!matched || source.slice(cursor).trim()) return null
  return total
}

/** Format total seconds as a compact day/hour/minute/second duration. */
export function readableDuration(totalSeconds: number): string {
  const sign = totalSeconds < 0 ? '-' : ''
  let remaining = Math.round(Math.abs(totalSeconds) * 1000) / 1000

  const days = Math.floor(remaining / 86400)
  remaining -= days * 86400
  const hours = Math.floor(remaining / 3600)
  remaining -= hours * 3600
  const minutes = Math.floor(remaining / 60)
  remaining -= minutes * 60
  const seconds = Number(remaining.toFixed(3))

  const parts = [
    [days, 'd'],
    [hours, 'h'],
    [minutes, 'm'],
    [seconds, 's'],
  ] as const
  const text = parts
    .filter(([value]) => value !== 0)
    .map(([value, unit]) => `${value}${unit}`)
    .join(' ')

  return sign + (text || '0s')
}
