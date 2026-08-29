import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import JsonFormatter from './index'

// A reference test for the reference tool — copy this shape when you add
// tests for a new tool (see docs/ADDING_A_TOOL.md).
describe('JsonFormatter', () => {
  it('pretty-prints valid JSON', () => {
    render(<JsonFormatter />)
    const textarea = screen.getByPlaceholderText(/paste/i)
    fireEvent.change(textarea, { target: { value: '{"a":1}' } })
    expect(screen.getByText(/"a": 1/)).toBeTruthy()
  })

  it('shows an error for invalid JSON instead of crashing', () => {
    render(<JsonFormatter />)
    const textarea = screen.getByPlaceholderText(/paste/i)
    fireEvent.change(textarea, { target: { value: '{not valid' } })
    expect(screen.getByText('Error')).toBeTruthy()
  })
})
