export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  digits: boolean
  symbols: boolean
  excludeAmbiguous: boolean
}

export const MIN_LENGTH = 8
export const MAX_LENGTH = 128

const SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/~',
} as const

const AMBIGUOUS = new Set(['0', 'O', '1', 'l', 'I'])

/** Returns a uniformly distributed integer in [0, max) using rejection sampling. */
export function randomInt(max: number): number {
  if (max <= 0 || max > 0x100000000) throw new RangeError('max out of range')
  const limit = 0x100000000 - (0x100000000 % max)
  const buf = new Uint32Array(1)
  for (;;) {
    crypto.getRandomValues(buf)
    if (buf[0] < limit) return buf[0] % max
  }
}

/** The enabled character sets, with ambiguous characters removed when requested. */
export function getCharacterSets(options: PasswordOptions): string[] {
  const keys = ['uppercase', 'lowercase', 'digits', 'symbols'] as const
  return keys
    .filter((key) => options[key])
    .map((key) =>
      options.excludeAmbiguous
        ? [...SETS[key]].filter((ch) => !AMBIGUOUS.has(ch)).join('')
        : SETS[key],
    )
}

/** Generates a password with at least one character from every enabled set. */
export function generatePassword(options: PasswordOptions): string {
  const sets = getCharacterSets(options)
  if (sets.length === 0) throw new Error('Select at least one character set.')
  const length = Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, Math.floor(options.length)))
  const pool = sets.join('')
  const chars: string[] = sets.map((set) => set[randomInt(set.length)])
  while (chars.length < length) chars.push(pool[randomInt(pool.length)])
  // Fisher-Yates shuffle so the guaranteed characters are not always first.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}

/** Entropy estimate in bits for a password of this length drawn from the enabled sets. */
export function estimateEntropy(options: PasswordOptions): number {
  const poolSize = getCharacterSets(options).join('').length
  if (poolSize === 0) return 0
  return Math.round(options.length * Math.log2(poolSize))
}

export function strengthLabel(bits: number): string {
  if (bits < 40) return 'Weak'
  if (bits < 60) return 'Fair'
  if (bits < 80) return 'Strong'
  return 'Very strong'
}
