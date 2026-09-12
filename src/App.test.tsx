import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './lib/ThemeProvider'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MemoryRouter>,
  )
  // Scope assertions to <main> throughout: the sidebar independently lists
  // every tool/category by name too, so unscoped queries for e.g. "JSON
  // Formatter" or a category name can match twice (nav link + page content).
  return within(screen.getByRole('main'))
}

describe('App routing', () => {
  it('renders the landing page at /', () => {
    const main = renderAt('/')
    expect(main.getByRole('heading', { level: 1 }).textContent).toMatch(/small tools/i)
  })

  it('renders the categories page and lists every category', () => {
    const main = renderAt('/categories')
    expect(main.getByRole('heading', { name: 'Categories' })).toBeTruthy()
    expect(main.getByText('Data & Format')).toBeTruthy()
  })

  it('renders a category tool-list page for a known category', () => {
    const main = renderAt('/categories/data')
    expect(main.getByRole('heading', { name: 'Data & Format' })).toBeTruthy()
    expect(main.getByText('JSON Formatter')).toBeTruthy()
  })

  it('redirects an unknown category slug back to /categories', () => {
    const main = renderAt('/categories/does-not-exist')
    expect(main.getByRole('heading', { name: 'Categories' })).toBeTruthy()
  })

  it('renders the all-tools page with every registered tool', () => {
    const main = renderAt('/tools')
    expect(main.getByRole('heading', { name: 'All Tools' })).toBeTruthy()
    expect(main.getByText('JSON Formatter')).toBeTruthy()
  })

  it('renders a tool page for a known slug, including the tool itself', () => {
    const main = renderAt('/tools/json-formatter')
    const heading = main.getByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('JSON Formatter')
    expect(main.getByPlaceholderText(/paste/i)).toBeTruthy()
  })

  it('redirects an unknown tool slug back to /tools', () => {
    const main = renderAt('/tools/does-not-exist')
    expect(main.getByRole('heading', { name: 'All Tools' })).toBeTruthy()
  })

  it('renders a 404 page for an unmatched route', () => {
    const main = renderAt('/this/route/does/not/exist')
    expect(main.getByText('Page not found')).toBeTruthy()
  })

  it('renders the sidebar navigation alongside every page', () => {
    renderAt('/')
    const homeLinks = screen.getAllByRole('link', { name: 'Home' })
    expect(homeLinks.length).toBeGreaterThan(0)
    const nav = homeLinks[0].closest('nav')
    expect(nav && within(nav).getByText('All Tools')).toBeTruthy()
  })
})
