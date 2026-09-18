import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from './ThemeContext'

/** Returns theme state from the nearest theme provider. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
