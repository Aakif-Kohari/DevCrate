import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UnixTimestampConverter from './index'
import { parseTimestamp, relativeTime } from './utils'

function type(value: string) {
  fireEvent.change(screen.getByLabelText('Unix timestamp'), { target: { value } })
}

describe('parseTimestamp', () => {
  it('treats 0 as the epoch', () => {
    const { unit, date } = parseTimestamp('0')
    expect(unit).toBe('seconds')
    expect(date.toISOString()).toBe('1970-01-01T00:00:00.000Z')
  })

  it('detects a 13-digit value as milliseconds', () => {
    const { unit, date } = parseTimestamp('1700000000000')
    expect(unit).toBe('milliseconds')
    expect(date.toISOString()).toBe('2023-11-14T22:13:20.000Z')
  })

  it('treats a 10-digit value as seconds', () => {
    const { unit, date } = parseTimestamp('1700000000')
    expect(unit).toBe('seconds')
    expect(date.toISOString()).toBe('2023-11-14T22:13:20.000Z')
  })

  it('rejects non-numeric and out-of-range input', () => {
    expect(() => parseTimestamp('abc')).toThrow(/whole number/i)
    expect(() => parseTimestamp('12.5')).toThrow()
    expect(() => parseTimestamp('99999999999999999')).toThrow(/range/i)
  })
})

describe('relativeTime', () => {
  it('describes past and future offsets', () => {
    const now = new Date('2024-01-01T12:00:00Z')
    expect(relativeTime(new Date('2024-01-01T09:00:00Z'), now)).toBe('3 hours ago')
    expect(relativeTime(new Date('2024-01-03T12:00:00Z'), now)).toBe('in 2 days')
  })
})

describe('UnixTimestampConverter', () => {
  it('shows ISO and UTC output for 0', () => {
    render(<UnixTimestampConverter />)
    type('0')
    expect(screen.getByLabelText('ISO 8601').textContent).toBe('1970-01-01T00:00:00.000Z')
    expect(screen.getByLabelText('UTC').textContent).toBe('Thu, 01 Jan 1970 00:00:00 GMT')
    expect(screen.getByLabelText('Detected unit').textContent).toBe('seconds')
  })

  it('detects milliseconds for a 13-digit input', () => {
    render(<UnixTimestampConverter />)
    type('1700000000000')
    expect(screen.getByLabelText('Detected unit').textContent).toBe('milliseconds')
  })

  it('shows an error for invalid input and nothing for empty input', () => {
    render(<UnixTimestampConverter />)
    type('nope')
    expect(screen.getByRole('alert').textContent).toMatch(/whole number/i)
    type('')
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.queryByLabelText('ISO 8601')).toBeNull()
  })

  it('Now fills in the current timestamp', () => {
    render(<UnixTimestampConverter />)
    fireEvent.click(screen.getByRole('button', { name: 'Now' }))
    const value = (screen.getByLabelText('Unix timestamp') as HTMLInputElement).value
    expect(value).toMatch(/^\d{10}$/)
    expect(screen.getByLabelText('Relative').textContent).toMatch(/now|second/i)
  })

  it('converts a picked date to seconds and milliseconds', () => {
    render(<UnixTimestampConverter />)
    fireEvent.change(screen.getByLabelText('Date and time (local)'), {
      target: { value: '2024-01-01T00:00:00' },
    })
    const expected = new Date('2024-01-01T00:00:00').getTime()
    expect(screen.getByLabelText('Milliseconds').textContent).toBe(String(expected))
    expect(screen.getByLabelText('Seconds').textContent).toBe(String(Math.floor(expected / 1000)))
  })
})
