import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { SidebarContext, SIDEBAR_STORAGE_KEY } from './SidebarContext'

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })
  const location = useLocation()

  // Close the mobile drawer automatically on navigation.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? '1' : '0')
      } catch {
        // storage unavailable — collapse state just won't persist across reloads
      }
      return next
    })
  }

  return (
    <SidebarContext.Provider value={{ isMobileOpen, setMobileOpen, isCollapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}
