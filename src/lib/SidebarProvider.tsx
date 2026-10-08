import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { SidebarContext, SIDEBAR_STORAGE_KEY } from './SidebarContext'

/** Provides responsive sidebar state and persists the desktop preference. */
export function SidebarProvider({ children }: { children: ReactNode }) {
  // The drawer remembers the path it was opened on, so navigating anywhere
  // closes it again without needing an effect to reset the state.
  const location = useLocation()
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null)
  if (mobileOpenPath !== null && mobileOpenPath !== location.pathname) {
    setMobileOpenPath(null)
  }
  const isMobileOpen = mobileOpenPath === location.pathname
  const setMobileOpen = (open: boolean) => setMobileOpenPath(open ? location.pathname : null)
  const [isCollapsed, setCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  // Persist collapse state as a side effect of the value changing, not
  // inside the state updater itself — updater functions are meant to be
  // pure (React 18 StrictMode double-invokes them specifically to catch
  // this), even though writing the same value twice here was harmless.
  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, isCollapsed ? '1' : '0')
    } catch {
      // storage unavailable — collapse state just won't persist across reloads
    }
  }, [isCollapsed])

  const toggleCollapsed = () => setCollapsed((prev) => !prev)

  return (
    <SidebarContext.Provider value={{ isMobileOpen, setMobileOpen, isCollapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}
