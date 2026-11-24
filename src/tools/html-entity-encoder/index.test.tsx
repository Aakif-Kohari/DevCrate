import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HtmlEntityEncoder from './index'
import { decodeEntities, encodeEntities } from './utils'

function type(value: string) {
  fireEvent.change(screen.getByLabelText('Input'), { target: { value } })
}

const output = () => screen.getByLabelText('Output', { selector: 'pre' })

describe('entity helpers', () => {
  it('round-trips the five special characters', () => {
    const text = `<a href="x">Tom & 'Jerry'</a>`
    const encoded = encodeEntities(text)
    expect(encoded).toBe('&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;')
    expect(decodeEntities(encoded)).toBe(text)
  })

  it('encodes non-ASCII as numeric entities only when asked', () => {
    expect(encodeEntities('café ☕ 😀')).toBe('café ☕ 😀')
    expect(encodeEntities('café ☕ 😀', true)).toBe('caf&#233; &#9749; &#128512;')
  })

  it('decodes named, decimal and hex entities', () => {
    expect(decodeEntities('&copy; &eacute; &mdash; &hellip;')).toBe('© é — …')
    expect(decodeEntities('&#169; &#233; &#128512;')).toBe('© é 😀')
    expect(decodeEntities('&#xA9; &#x1F600; &#XE9;')).toBe('© 😀 é')
  })

  it('leaves unknown or invalid entities alone', () => {
    expect(decodeEntities('&bogus; &#0; &#xD800; &#99999999; & plain')).toBe(
      '&bogus; &#0; &#xD800; &#99999999; & plain',
    )
    expect(decodeEntities('&toString; &constructor;')).toBe('&toString; &constructor;')
  })

  it('does not double-decode', () => {
    expect(decodeEntities('&amp;lt;')).toBe('&lt;')
  })
})

describe('HtmlEntityEncoder', () => {
  it('keeps a <script> string as text in both directions', () => {
    render(<HtmlEntityEncoder />)
    type('<script>alert(1)</script>')
    expect(output().textContent).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')

    fireEvent.click(screen.getByRole('button', { name: 'Decode' }))
    type('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(output().textContent).toBe('<script>alert(1)</script>')
    expect(document.querySelector('script')).toBeNull()
    expect(output().children).toHaveLength(0)
  })

  it('renders empty output for empty input', () => {
    render(<HtmlEntityEncoder />)
    type('a & b')
    type('')
    expect(output().textContent).toBe('')
  })

  it('offers the non-ASCII option when encoding', () => {
    render(<HtmlEntityEncoder />)
    type('é')
    fireEvent.click(screen.getByLabelText(/non-ASCII/i))
    expect(output().textContent).toBe('&#233;')
  })
})
