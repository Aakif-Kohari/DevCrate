import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import UrlEncoderDecoder from './index'

describe('UrlEncoderDecoder', () => {
  it('encodes spaces as %20 in URL component mode', () => {
    render(<UrlEncoderDecoder />)
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'hello world' } })
    expect(screen.getByLabelText('Output', { selector: 'pre' }).textContent).toBe('hello%20world')
  })

  it('round-trips Unicode and emoji when swapping from encode to decode', () => {
    render(<UrlEncoderDecoder />)
    const input = screen.getByLabelText('Input')
    const output = screen.getByLabelText('Output', { selector: 'pre' })

    fireEvent.change(input, { target: { value: 'café 🚀' } })
    const encoded = output.textContent
    expect(encoded).toBe('caf%C3%A9%20%F0%9F%9A%80')

    fireEvent.click(screen.getByRole('button', { name: 'Swap input/output' }))
    expect((input as HTMLTextAreaElement).value).toBe(encoded)
    expect(output.textContent).toBe('café 🚀')
  })

  it('shows an error instead of throwing for malformed percent sequences', () => {
    render(<UrlEncoderDecoder />)
    fireEvent.click(screen.getByRole('button', { name: 'Decode' }))
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: '%E0%A4%A' } })

    expect(screen.getByRole('alert').textContent).toMatch(/malformed percent-encoded sequence/i)
    expect(screen.getByText('Error')).toBeTruthy()
  })

  it('shows a clear encode error for invalid Unicode instead of throwing', () => {
    render(<UrlEncoderDecoder />)
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: '\uD800' } })

    expect(screen.getByRole('alert').textContent).toMatch(/invalid unicode/i)
    expect(screen.getByText('Error')).toBeTruthy()
  })

  it('preserves URL separators in full URL mode', () => {
    render(<UrlEncoderDecoder />)
    fireEvent.click(screen.getByRole('button', { name: 'Full URL' }))
    fireEvent.change(screen.getByLabelText('Input'), {
      target: { value: 'https://example.com/a path?q=hello world' },
    })

    expect(screen.getByLabelText('Output', { selector: 'pre' }).textContent).toBe(
      'https://example.com/a%20path?q=hello%20world',
    )
  })

  it('keeps empty input and output empty', () => {
    render(<UrlEncoderDecoder />)
    expect((screen.getByLabelText('Input') as HTMLTextAreaElement).value).toBe('')
    expect(screen.getByLabelText('Output', { selector: 'pre' }).textContent).toBe('')
  })
})
