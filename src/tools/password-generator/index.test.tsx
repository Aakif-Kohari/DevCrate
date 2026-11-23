import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PasswordGenerator from './index'
import { generatePassword, getCharacterSets, randomInt, type PasswordOptions } from './utils'

const base: PasswordOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  digits: true,
  symbols: true,
  excludeAmbiguous: false,
}

describe('generatePassword', () => {
  it('produces the requested length, clamped to 8-128', () => {
    expect(generatePassword({ ...base, length: 24 })).toHaveLength(24)
    expect(generatePassword({ ...base, length: 3 })).toHaveLength(8)
    expect(generatePassword({ ...base, length: 500 })).toHaveLength(128)
  })

  it('only uses enabled sets', () => {
    for (let i = 0; i < 25; i++) {
      const pw = generatePassword({ ...base, uppercase: false, symbols: false, length: 30 })
      expect(pw).toMatch(/^[a-z0-9]+$/)
    }
  })

  it('includes at least one character from every enabled set', () => {
    for (let i = 0; i < 100; i++) {
      const pw = generatePassword({ ...base, length: 8 })
      expect(pw).toMatch(/[A-Z]/)
      expect(pw).toMatch(/[a-z]/)
      expect(pw).toMatch(/[0-9]/)
      expect(pw).toMatch(/[^A-Za-z0-9]/)
    }
  })

  it('can exclude ambiguous characters', () => {
    for (let i = 0; i < 50; i++) {
      expect(generatePassword({ ...base, excludeAmbiguous: true, length: 64 })).not.toMatch(
        /[0O1lI]/,
      )
    }
    expect(getCharacterSets({ ...base, excludeAmbiguous: true }).join('')).not.toMatch(/[0O1lI]/)
  })

  it('throws when no set is enabled', () => {
    expect(() =>
      generatePassword({
        ...base,
        uppercase: false,
        lowercase: false,
        digits: false,
        symbols: false,
      }),
    ).toThrow()
  })

  it('randomInt stays within range', () => {
    for (let i = 0; i < 200; i++) {
      const n = randomInt(7)
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(7)
    }
  })
})

describe('PasswordGenerator', () => {
  it('renders a password, an entropy estimate, and regenerates', () => {
    render(<PasswordGenerator />)
    const out = screen.getByLabelText('Password', { selector: 'output' })
    expect(out.textContent).toHaveLength(16)
    expect(screen.getByText(/bits of entropy/i)).toBeTruthy()
    const first = out.textContent
    let changed = false
    for (let i = 0; i < 5 && !changed; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Regenerate' }))
      changed = out.textContent !== first
    }
    expect(changed).toBe(true)
  })

  it('warns when every character set is turned off', () => {
    render(<PasswordGenerator />)
    for (const name of [/Uppercase/, /Lowercase/, /Digits/, /Symbols/]) {
      fireEvent.click(screen.getByLabelText(name))
    }
    expect(screen.getByRole('alert').textContent).toMatch(/at least one/i)
    expect(screen.getByLabelText('Password', { selector: 'output' }).textContent).toBe('')
  })
})
