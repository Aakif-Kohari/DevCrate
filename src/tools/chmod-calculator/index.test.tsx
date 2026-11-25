import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ChmodCalculator from './index'
import { fromOctal, toOctal, toSymbolic } from './utils'

function setOctal(value: string) {
  fireEvent.change(screen.getByLabelText('Octal'), { target: { value } })
}

describe('ChmodCalculator', () => {
  it('converts 644 and 755 to octal and symbolic forms', () => {
    const p644 = fromOctal('644')!
    expect(toOctal(p644)).toBe('644')
    expect(toSymbolic(p644)).toBe('rw-r--r--')
    const p755 = fromOctal('755')!
    expect(toOctal(p755)).toBe('755')
    expect(toSymbolic(p755)).toBe('rwxr-xr-x')
  })

  it('supports special bits: 4755 is rwsr-xr-x', () => {
    const p = fromOctal('4755')!
    expect(p.setuid).toBe(true)
    expect(toOctal(p)).toBe('4755')
    expect(toSymbolic(p)).toBe('rwsr-xr-x')
    expect(toSymbolic(fromOctal('1777')!)).toBe('rwxrwxrwt')
    expect(toSymbolic(fromOctal('2644')!)).toBe('rw-r-Sr--')
  })

  it('updates every output when the grid changes', () => {
    render(<ChmodCalculator />)
    expect((screen.getByLabelText('Octal') as HTMLInputElement).value).toBe('644')
    fireEvent.click(screen.getByLabelText('owner execute'))
    fireEvent.click(screen.getByLabelText('group execute'))
    fireEvent.click(screen.getByLabelText('other execute'))
    expect((screen.getByLabelText('Octal') as HTMLInputElement).value).toBe('755')
    expect(screen.getByText('rwxr-xr-x')).toBeTruthy()
    expect(screen.getByText('chmod 755 file')).toBeTruthy()
  })

  it('fills the grid from a typed octal value', () => {
    render(<ChmodCalculator />)
    setOctal('4755')
    expect((screen.getByLabelText('owner execute') as HTMLInputElement).checked).toBe(true)
    expect((screen.getByLabelText('Setuid') as HTMLInputElement).checked).toBe(true)
    expect(screen.getByText('rwsr-xr-x')).toBeTruthy()
  })

  it('rejects invalid octal and keeps the last valid permissions', () => {
    render(<ChmodCalculator />)
    setOctal('789')
    expect(screen.getByRole('alert').textContent).toMatch(/octal digits/i)
    expect(screen.getByText('rw-r--r--')).toBeTruthy()
    expect(fromOctal('77')).toBeNull()
    expect(fromOctal('12345')).toBeNull()
  })

  it('stops saying Copied once the command changes', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
    render(<ChmodCalculator />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copied' })).toBeTruthy())
    fireEvent.click(screen.getByLabelText('owner execute'))
    expect(screen.getByRole('button', { name: 'Copy' })).toBeTruthy()
  })
})
