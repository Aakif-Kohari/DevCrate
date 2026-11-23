import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Base64Tool from './index'
import { decodeBase64, encodeBase64 } from './utils'

function type(value: string) {
  fireEvent.change(screen.getByLabelText('Input'), { target: { value } })
}

describe('Base64Tool', () => {
  it('encodes ASCII text', () => {
    render(<Base64Tool />)
    type('Hello, World!')
    expect(screen.getByLabelText('Output', { selector: 'pre' }).textContent).toBe(
      'SGVsbG8sIFdvcmxkIQ==',
    )
  })

  it('decodes Base64 back to text', () => {
    render(<Base64Tool />)
    fireEvent.click(screen.getByRole('button', { name: 'Decode' }))
    type('SGVsbG8sIFdvcmxkIQ==')
    expect(screen.getByLabelText('Output', { selector: 'pre' }).textContent).toBe('Hello, World!')
  })

  it('round-trips emoji and accents', () => {
    const text = 'café ☕ 😀 naïve'
    expect(decodeBase64(encodeBase64(text))).toBe(text)
    expect(decodeBase64(encodeBase64(text, true))).toBe(text)
  })

  it('URL-safe output uses - and _ with no padding', () => {
    const encoded = encodeBase64('??>>~~', true)
    expect(encoded).toBe('Pz8-Pn5-')
    expect(encodeBase64('a', true)).toBe('YQ')
    expect(encoded).not.toMatch(/[+/=]/)
  })

  it('shows an error for invalid Base64 when decoding', () => {
    render(<Base64Tool />)
    fireEvent.click(screen.getByRole('button', { name: 'Decode' }))
    type('not base64!!')
    expect(screen.getByRole('alert').textContent).toMatch(/not valid base64/i)
  })

  it('renders empty output for empty input', () => {
    render(<Base64Tool />)
    type('abc')
    type('')
    expect(screen.getByLabelText('Output', { selector: 'pre' }).textContent).toBe('')
  })
})
