import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext, THEME_STORAGE_KEY, type Theme } from './ThemeContext'

/** Resolves the initial theme from storage before falling back to the system preference. */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    // localStorage unavailable — fall through to system preference
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Provides theme state and keeps the document and stored preference in sync. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // private-mode / storage-disabled browsers — theme still applies for this session
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
