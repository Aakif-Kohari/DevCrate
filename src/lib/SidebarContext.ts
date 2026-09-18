import { createContext } from 'react'

export interface SidebarContextValue {
  /** Mobile off-canvas drawer open/closed. */
  isMobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  /** Desktop rail collapsed to icon-only width. */
  isCollapsed: boolean
  toggleCollapsed: () => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)
export const SIDEBAR_STORAGE_KEY = 'devcrate-sidebar-collapsed'
