import { Link } from 'react-router-dom'
import { Menu, Star } from 'lucide-react'
import GitHubIcon from '../components/icons/GitHubIcon'
import Logo from '../components/icons/Logo'
import ThemeToggle from './ThemeToggle'
import SearchBox from './SearchBox'
import { useSidebar } from '../lib/useSidebar'

/** Renders the sticky site header and its global controls. */
export default function Header() {
  const { setMobileOpen } = useSidebar()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="focus-ring rounded-lg p-1.5 text-foreground hover:bg-muted md:hidden"
      >
        <Menu size={20} />
      </button>

      <Link
        to="/"
        aria-label="DevCrate home"
        className="focus-ring flex shrink-0 items-center gap-2 rounded-lg"
      >
        <Logo className="h-7 w-7 shrink-0" />
        <span className="hidden text-base font-bold tracking-tight sm:inline">DevCrate</span>
      </Link>

      <div className="ml-2 hidden flex-1 justify-center md:flex">
        <SearchBox />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex md:hidden">
          <SearchBox />
        </div>
        <a
          href="https://github.com/Aakif-Kohari/DevCrate"
          target="_blank"
          rel="noreferrer"
          className="focus-ring hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:flex"
        >
          <GitHubIcon className="h-4 w-4" />
          <span>Star</span>
          <Star size={13} className="text-muted-foreground" />
        </a>
        <ThemeToggle />
      </div>
    </header>
  )
}
