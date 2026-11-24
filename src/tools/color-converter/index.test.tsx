import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ColorConverter from './index'
import { formatHex, formatHsl, formatRgb, parseColor } from './utils'

function type(value: string) {
  fireEvent.change(screen.getByLabelText('Color value'), { target: { value } })
}

const out = (key: string) => screen.getByLabelText(`${key} value`).textContent

describe('parseColor', () => {
  it('expands 3-digit hex', () => {
    expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    expect(parseColor('0f0')).toEqual({ r: 0, g: 255, b: 0, a: 1 })
  })

  it('reads 8-digit hex alpha', () => {
    const c = parseColor('#ff000080')!
    expect(c.a).toBeCloseTo(0.5, 1)
    expect(formatHex(c)).toBe('#ff000080')
  })

  it('keeps the smallest alpha step visible', () => {
    const c = parseColor('#ff000001')!
    expect(formatRgb(c)).toBe('rgba(255, 0, 0, 0.004)')
    expect(formatHex(c)).toBe('#ff000001')
  })

  it('parses rgb(), rgba() and hsl() forms', () => {
    expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    expect(parseColor('rgba(0, 0, 255, 0.5)')).toEqual({ r: 0, g: 0, b: 255, a: 0.5 })
    expect(parseColor('rgb(0 255 0 / 50%)')).toEqual({ r: 0, g: 255, b: 0, a: 0.5 })
    expect(parseColor('hsl(120, 100%, 50%)')).toEqual({ r: 0, g: 255, b: 0, a: 1 })
  })

  it('rejects invalid input', () => {
    expect(parseColor('')).toBeNull()
    expect(parseColor('#12')).toBeNull()
    expect(parseColor('#gggggg')).toBeNull()
    expect(parseColor('rgb(1, 2)')).toBeNull()
    expect(parseColor('banana')).toBeNull()
  })
})

describe('ColorConverter', () => {
  it('converts #ff0000 to rgb and hsl', () => {
    render(<ColorConverter />)
    type('#ff0000')
    expect(out('HEX')).toBe('#ff0000')
    expect(out('RGB')).toBe('rgb(255, 0, 0)')
    expect(out('HSL')).toBe('hsl(0, 100%, 50%)')
  })

  it('converts a 3-digit hex', () => {
    render(<ColorConverter />)
    type('#0f0')
    expect(out('RGB')).toBe('rgb(0, 255, 0)')
    expect(out('HSL')).toBe('hsl(120, 100%, 50%)')
  })

  it('flags invalid input and keeps the last valid colour', () => {
    render(<ColorConverter />)
    type('#ff0000')
    type('#zzz')
    expect(screen.getByRole('alert').textContent).toMatch(/not a valid colour/i)
    expect(out('RGB')).toBe('rgb(255, 0, 0)')
  })

  it('formats helpers round trip through hsl', () => {
    const c = parseColor('hsl(240, 100%, 50%)')!
    expect(formatRgb(c)).toBe('rgb(0, 0, 255)')
    expect(formatHsl(c)).toBe('hsl(240, 100%, 50%)')
  })

  it('updates when the picker changes', () => {
    render(<ColorConverter />)
    fireEvent.change(screen.getByLabelText('Picker'), { target: { value: '#00ff00' } })
    expect(out('RGB')).toBe('rgb(0, 255, 0)')
    expect((screen.getByLabelText('Color value') as HTMLInputElement).value).toBe('#00ff00')
  })
})
