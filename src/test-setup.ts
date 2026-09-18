import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// @testing-library/react leaves the previous render's DOM in place between
// tests unless this runs — without it, a second render() in the same file
// can match elements from BOTH renders and fail with a false "found
// multiple elements" error that has nothing to do with your actual change.
afterEach(() => {
  cleanup()
})

// jsdom (vitest's DOM environment) doesn't implement window.matchMedia —
// real browsers always do, so this is a test-environment gap, not an app
// bug. ThemeProvider (src/lib/ThemeProvider.tsx) reads it on mount to fall
// back to the OS-level light/dark preference when nothing is in localStorage yet.
// Defaults to "no preference" (matches: false) so tests get a stable,
// deterministic light-theme starting point regardless of the machine
// running them.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}
