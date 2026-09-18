import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TemplateTool from './index'

// TEMPLATE — a minimal test matching the shape expected of every tool.
// Replace the assertions with ones that match your own tool's behavior.
describe('TemplateTool', () => {
  it('transforms input into the expected output', () => {
    render(<TemplateTool />)
    const textarea = screen.getByPlaceholderText(/type or paste/i)
    fireEvent.change(textarea, { target: { value: 'abc' } })
    expect(screen.getByText('cba')).toBeTruthy()
  })

  it('renders an empty output for empty input instead of crashing', () => {
    render(<TemplateTool />)
    const textarea = screen.getByPlaceholderText(/type or paste/i)
    fireEvent.change(textarea, { target: { value: 'abc' } })
    expect(screen.getByText('cba')).toBeTruthy()
    fireEvent.change(textarea, { target: { value: '' } })
    expect((textarea as HTMLTextAreaElement).value).toBe('')
    const output = screen.getByLabelText('Output', { selector: 'pre' })
    expect(output.textContent).toBe('')
  })
})
