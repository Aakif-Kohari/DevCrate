import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import QueryStringParser from './index'
import { parseQuery } from './utils'

function type(value: string) {
  fireEvent.change(screen.getByLabelText('URL or query string'), { target: { value } })
}

describe('parseQuery', () => {
  it('accepts a full URL, a ?query and a bare query', () => {
    expect(parseQuery('https://example.com/p?a=1&b=2#frag').json).toEqual({ a: '1', b: '2' })
    expect(parseQuery('?a=1&b=2').json).toEqual({ a: '1', b: '2' })
    expect(parseQuery('a=1&b=2').json).toEqual({ a: '1', b: '2' })
  })

  it('collects repeated keys into arrays', () => {
    expect(parseQuery('tag=a&tag=b&tag=c&x=1').json).toEqual({ tag: ['a', 'b', 'c'], x: '1' })
  })

  it('decodes plus signs and percent-encoding', () => {
    expect(parseQuery('q=hello+world&e=caf%C3%A9%20%26%20co').json).toEqual({
      q: 'hello world',
      e: 'café & co',
    })
  })

  it('throws for empty and invalid URLs', () => {
    expect(() => parseQuery('   ')).toThrow()
    expect(() => parseQuery('http://')).toThrow(/valid URL/i)
  })
})

describe('QueryStringParser', () => {
  it('shows a table and JSON including a repeated key and an encoded value', () => {
    render(<QueryStringParser />)
    type('https://example.com/?tag=a&tag=b&q=hello%20there')
    expect(screen.getAllByText('tag')).toHaveLength(2)
    expect(screen.getByText('hello there')).toBeTruthy()
    const json = screen.getByLabelText('JSON', { selector: 'pre' }).textContent ?? ''
    expect(JSON.parse(json)).toEqual({ tag: ['a', 'b'], q: 'hello there' })
  })

  it('shows a message instead of throwing for an invalid URL', () => {
    render(<QueryStringParser />)
    type('http://')
    expect(screen.getByRole('alert').textContent).toMatch(/valid URL/i)
  })

  it('says so when there are no parameters, and stays quiet when empty', () => {
    render(<QueryStringParser />)
    expect(screen.queryByRole('alert')).toBeNull()
    type('https://example.com/path')
    expect(screen.getByRole('status').textContent).toMatch(/no query parameters/i)
  })
})
