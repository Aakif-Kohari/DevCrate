import { describe, expect, it } from 'vitest'
import { stats } from './stats'

describe('stats', () => {
  it('returns zeros for empty input', () => {
    expect(stats('')).toMatchObject({
      chars: 0,
      noSpaces: 0,
      words: 0,
      sentences: 0,
      lines: 0,
      paragraphs: 0,
    })
  })

  it('counts a known sample', () => {
    expect(stats('Hello world.\n\nSecond paragraph!')).toMatchObject({
      words: 4,
      sentences: 2,
      lines: 3,
      paragraphs: 2,
    })
  })

  it('counts emoji and accented characters as code points', () => {
    expect(stats('\u00e9\ud83d\ude42').chars).toBe(2)
  })
})
