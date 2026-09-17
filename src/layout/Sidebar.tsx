import { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, LayoutGrid, Wrench, PanelLeftClose, PanelLeft, X } from 'lucide-react'
import { categories } from '../tools/categories'
import { getToolsByCategory } from '../tools/registry'
import { useSidebar } from '../lib/useSidebar'
import { useFocusTrap } from '../lib/useFocusTrap'

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `focus-ring flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`

  // When collapsed, labels are visually hidden (sr-only) rather than left
  // out of the DOM entirely — an icon-only nav still needs an accessible
  // name for screen reader users, who don't benefit from "it's just an
  // icon, the meaning is obvious visually".
  const labelClasses = collapsed ? 'sr-only' : ''

  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto px-3 py-4">
      <NavLink to="/" end className={linkClasses}>
        <Home size={17} className="shrink-0" />
        <span className={labelClasses}>Home</span>
      </NavLink>
      <NavLink to="/categories" className={linkClasses}>
        <LayoutGrid size={17} className="shrink-0" />
        <span className={labelClasses}>Categories</span>
      </NavLink>
      <NavLink to="/tools" className={linkClasses}>
        <Wrench size={17} className="shrink-0" />
        <span className={labelClasses}>All Tools</span>
      </NavLink>

      {!collapsed && (
        <div className="mt-4 flex flex-col gap-4">
          {categories.map((category) => {
            const tools = getToolsByCategory(category.slug)
            if (tools.length === 0) return null
            const Icon = category.icon
            return (
              <div key={category.slug}>
                <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Icon size={13} />
                  {category.name}
                </div>
                <div className="flex flex-col gap-0.5">
                  {tools.map(({ meta }) => (
                    <NavLink key={meta.slug} to={`/tools/${meta.slug}`} className={linkClasses}>
                      <span className="ml-[23px] truncate">{meta.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </nav>
  )
}

export default function Sidebar() {
  const { isMobileOpen, setMobileOpen, isCollapsed, toggleCollapsed } = useSidebar()
  const drawerRef = useRef<HTMLElement | null>(null)
  const closeDrawer = () => setMobileOpen(false)

  // Modal-dialog keyboard behavior for the mobile drawer: focus moves in
  // on open, Tab is trapped inside it, Escape closes it, and focus is
  // restored to the hamburger button on close.
  useFocusTrap(drawerRef, isMobileOpen, closeDrawer)

  return (
    <>
      {/* Desktop rail — collapses to icon-only width, slides via width transition */}
      <aside
        className={`sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 border-r border-border bg-background transition-[width] duration-200 ease-in-out md:block ${
          isCollapsed ? 'w-14' : 'w-64'
        }`}
      >
        <SidebarContent collapsed={isCollapsed} />
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="focus-ring absolute -right-3 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground"
        >
          {isCollapsed ? <PanelLeft size={13} /> : <PanelLeftClose size={13} />}
        </button>
      </aside>

      {/* Mobile off-canvas drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              aria-hidden="true"
            />
            <motion.aside
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-background md:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="font-semibold">Menu</span>
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close menu"
                  className="focus-ring rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
