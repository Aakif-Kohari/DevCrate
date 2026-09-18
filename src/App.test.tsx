import { describe, it, expect } from 'vitest'
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './lib/ThemeProvider'

/** Renders the application at a route and scopes queries to its main content. */
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

  it('updates All Tools results when the URL q param changes without unmounting the page', () => {
    // Regression test: AllToolsPage stays mounted across /tools <->
    // /tools?q=... (same route, just a query-string change), so its query
    // state has to re-sync from searchParams via an effect, not just a
    // useState initializer that only runs once on mount. Exercises the
    // real flow: submit the header search with no live-preview matches,
    // which navigates to /tools?q=<query> as a fallback.
    renderAt('/tools')
    expect(screen.getAllByText('JSON Formatter').length).toBeGreaterThan(0)

    const searchInputs = screen.getAllByPlaceholderText('Search tools…')
    fireEvent.change(searchInputs[0], { target: { value: 'zzz-no-such-tool' } })
    fireEvent.submit(searchInputs[0].closest('form')!)

    const main = within(screen.getByRole('main'))
    expect(main.getByText(/no tools match/i)).toBeTruthy()

    fireEvent.click(screen.getAllByRole('link', { name: 'All Tools' })[0])
    expect(main.getByText('JSON Formatter')).toBeTruthy()
  })

  it('renders the sidebar navigation alongside every page', () => {
    renderAt('/')
    const homeLinks = screen.getAllByRole('link', { name: 'Home' })
    expect(homeLinks.length).toBeGreaterThan(0)
    const nav = homeLinks[0].closest('nav')
    expect(nav && within(nav).getByText('All Tools')).toBeTruthy()
  })

  it('mobile menu traps focus, closes on Escape, and restores focus to the trigger', async () => {
    renderAt('/')
    const openButton = screen.getByRole('button', { name: 'Open menu' })
    openButton.focus()
    fireEvent.click(openButton)

    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    expect(dialog).toBeTruthy()
    // Focus should have moved into the dialog (its first focusable element).
    expect(dialog.contains(document.activeElement)).toBe(true)

    fireEvent.keyDown(document, { key: 'Escape' })
    // Focus restoration happens synchronously with the state update, but
    // the dialog's own removal from the DOM waits on framer-motion's exit
    // animation (AnimatePresence keeps it mounted until that finishes).
    expect(document.activeElement).toBe(openButton)
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull()
    })
  })
})
