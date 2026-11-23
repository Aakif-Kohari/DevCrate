import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import JwtDecoder from './index'
import { decodeJwt, isExpired } from './utils'

function toB64url(text: string): string {
  let binary = ''
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64url(value: unknown): string {
  return toB64url(JSON.stringify(value))
}

function makeToken(payload: unknown): string {
  return `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.c2lnbmF0dXJl`
}

function paste(value: string) {
  fireEvent.change(screen.getByLabelText('Token'), { target: { value } })
}

describe('JwtDecoder', () => {
  it('decodes a valid token and labels the signature as not verified', () => {
    render(<JwtDecoder />)
    paste(makeToken({ sub: '1234', name: 'Ada', iat: 1516239022, exp: 4102444800 }))
    expect(screen.getByLabelText('Decoded header').textContent).toContain('"alg": "HS256"')
    expect(screen.getByLabelText('Decoded payload').textContent).toContain('"name": "Ada"')
    expect(screen.getByLabelText('Signature').textContent).toBe('c2lnbmF0dXJl')
    expect(screen.getByText(/not verified/i)).toBeTruthy()
    expect(screen.getByText('2018-01-18T01:30:22.000Z')).toBeTruthy()
    expect(screen.queryByText(/has expired/i)).toBeNull()
  })

  it('warns when the token has expired', () => {
    render(<JwtDecoder />)
    paste(makeToken({ sub: '1', exp: 1516239022 }))
    expect(screen.getByText(/has expired/i)).toBeTruthy()
  })

  it('handles base64url characters and UTF-8 in the payload', () => {
    const decoded = decodeJwt(makeToken({ name: 'Zoë ☕', q: '??>>' }))
    expect(decoded.payload).toEqual({ name: 'Zoë ☕', q: '??>>' })
  })

  it('shows an error for a token without three parts', () => {
    render(<JwtDecoder />)
    paste('abc.def')
    expect(screen.getByRole('alert').textContent).toMatch(/three/i)
  })

  it('shows an error for bad base64 or bad JSON', () => {
    render(<JwtDecoder />)
    paste('!!!.e30.sig')
    expect(screen.getByRole('alert').textContent).toMatch(/header is not valid base64url/i)
    paste(`${b64url({ a: 1 })}.${toB64url('not json')}.sig`)
    expect(screen.getByRole('alert').textContent).toMatch(/payload is not valid JSON/i)
  })

  it('shows nothing for empty input', () => {
    render(<JwtDecoder />)
    paste(makeToken({ a: 1 }))
    paste('')
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.queryByLabelText('Decoded header')).toBeNull()
  })

  it('isExpired compares exp against the supplied time', () => {
    expect(isExpired({ exp: 100 }, 99_000)).toBe(false)
    expect(isExpired({ exp: 100 }, 100_000)).toBe(true)
    expect(isExpired({ sub: 'x' }, 100_000)).toBe(false)
  })
})
