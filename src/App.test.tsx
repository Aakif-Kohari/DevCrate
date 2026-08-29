import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the header and at least one registered tool', () => {
    render(<App />)
    expect(screen.getByText('🧰 DevCrate')).toBeTruthy()
    expect(screen.getByText('JSON Formatter')).toBeTruthy()
  })
})
