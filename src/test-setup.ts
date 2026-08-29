import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// @testing-library/react leaves the previous render's DOM in place between
// tests unless this runs — without it, a second render() in the same file
// can match elements from BOTH renders and fail with a false "found
// multiple elements" error that has nothing to do with your actual change.
afterEach(() => {
  cleanup()
})
