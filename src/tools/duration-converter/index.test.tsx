import { describe, expect, it } from 'vitest'
import { parseDuration, readableDuration } from './duration'

describe('duration converter', () => {
  it('formats 3661 seconds', () => expect(readableDuration(3661)).toBe('1h 1m 1s'))

  it('parses 1h 30m', () => expect(parseDuration('1h 30m')).toBe(5400))

  it('parses long unit names and decimals', () =>
    expect(parseDuration('1.5 hours 30 minutes')).toBe(7200))

  it('accepts plural abbreviations supported by the parser pattern', () => {
    expect(parseDuration('90 secs')).toBe(90)
    expect(parseDuration('2 mins')).toBe(120)
    expect(parseDuration('1 hrs')).toBe(3600)
  })

  it('carries rounded seconds across minute and hour boundaries', () => {
    expect(readableDuration(59.9999)).toBe('1m')
    expect(readableDuration(3599.9999)).toBe('1h')
  })

  it('handles negatives', () => expect(readableDuration(-3661)).toBe('-1h 1m 1s'))

  it('rejects invalid and empty strings', () => {
    expect(parseDuration('tomorrow')).toBeNull()
    expect(parseDuration('')).toBeNull()
  })
})
