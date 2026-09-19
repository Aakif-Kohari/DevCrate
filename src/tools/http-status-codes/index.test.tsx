import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HttpStatusCodes from './index'

describe('HttpStatusCodes', () => {
  it('finds a status by code and displays its explanation', () => {
    render(<HttpStatusCodes />)
    fireEvent.change(screen.getByRole('searchbox', { name: /search status codes/i }), {
      target: { value: '404' },
    })

    expect(screen.getByText('Not Found')).toBeTruthy()
    expect(screen.getByText('The requested resource could not be found.')).toBeTruthy()
    expect(screen.queryByText('Internal Server Error')).toBeNull()
  })

  it('searches status names and descriptions', () => {
    render(<HttpStatusCodes />)
    const search = screen.getByRole('searchbox', { name: /search status codes/i })

    fireEvent.change(search, { target: { value: 'Unauthorized' } })
    expect(screen.getByText('Unauthorized')).toBeTruthy()

    fireEvent.change(search, { target: { value: 'temporarily unable' } })
    expect(screen.getByText('Service Unavailable')).toBeTruthy()
  })

  it('filters results by status class', () => {
    render(<HttpStatusCodes />)
    fireEvent.click(screen.getByRole('button', { name: '4xx' }))

    expect(screen.getByText('Not Found')).toBeTruthy()
    expect(screen.queryByText('Created')).toBeNull()
  })

  it('shows a helpful empty state for an unmatched search', () => {
    render(<HttpStatusCodes />)
    fireEvent.change(screen.getByRole('searchbox', { name: /search status codes/i }), {
      target: { value: 'not-a-status-code' },
    })

    expect(screen.getByRole('status').textContent).toMatch(/no status codes match your search/i)
  })
})
