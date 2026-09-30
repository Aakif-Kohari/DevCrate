import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import SlugGenerator from './index'

describe('SlugGenerator', () => {
  it('handles diacritics and punctuation', () => {
    render(<SlugGenerator />)
    fireEvent.change(screen.getByLabelText('Text'), { target: { value: 'Crème Brûlée!!!' } })
    expect(screen.getByText('creme-brulee')).toBeTruthy()
  })

  it('honours separator and max length without trailing separator', () => {
    render(<SlugGenerator />)
    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Hello wonderful world' },
    })
    fireEvent.change(screen.getByLabelText('Separator'), { target: { value: '_' } })
    fireEvent.change(screen.getByLabelText(/Maximum length/), { target: { value: '16' } })
    expect(screen.getByText('hello_wonderful')).toBeTruthy()
  })

  it('returns empty output for symbols only', () => {
    render(<SlugGenerator />)
    fireEvent.change(screen.getByLabelText('Text'), { target: { value: '!!!' } })
    expect(screen.getByLabelText('Slug').textContent).toBe('')
  })
})
