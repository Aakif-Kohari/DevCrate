import { describe, expect, it } from 'vitest'
import { parseDuration, readableDuration } from './index'
describe('duration converter',()=>{it('formats 3661 seconds',()=>expect(readableDuration(3661)).toBe('1h 1m 1s'));it('parses 1h 30m',()=>expect(parseDuration('1h 30m')).toBe(5400));it('parses long unit names and decimals',()=>expect(parseDuration('1.5 hours 30 minutes')).toBe(7200));it('handles negatives',()=>expect(readableDuration(-3661)).toBe('-1h 1m 1s'));it('rejects invalid and empty strings',()=>{expect(parseDuration('tomorrow')).toBeNull();expect(parseDuration('')).toBeNull()})})
