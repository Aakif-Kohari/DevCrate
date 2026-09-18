import { Link } from 'react-router-dom'
import GitHubIcon from '../components/icons/GitHubIcon'
import Logo from '../components/icons/Logo'

/** Renders project navigation and contribution links below every page. */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/" className="focus-ring flex items-center gap-2 rounded-lg">
            <Logo className="h-6 w-6 shrink-0" />
            <span className="font-bold tracking-tight">DevCrate</span>
          </Link>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Small developer tools, built one PR at a time by the open-source community.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="mb-2 font-semibold text-foreground">Explore</p>
            <ul className="flex flex-col gap-1.5 text-muted-foreground">
              <li>
                <Link to="/categories" className="hover:text-foreground">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-foreground">
                  All Tools
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold text-foreground">Contribute</p>
            <ul className="flex flex-col gap-1.5 text-muted-foreground">
              <li>
                <a
                  href="https://github.com/Aakif-Kohari/DevCrate/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  Contributing Guide
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Aakif-Kohari/DevCrate/blob/main/docs/ADDING_A_TOOL.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  Adding a Tool
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Aakif-Kohari/DevCrate/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  Open Issues
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold text-foreground">Project</p>
            <ul className="flex flex-col gap-1.5 text-muted-foreground">
              <li>
                <a
                  href="https://github.com/Aakif-Kohari/DevCrate"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground"
                >
                  <GitHubIcon className="h-3.5 w-3.5" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Aakif-Kohari/DevCrate/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  MIT License
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        Built for Open Source Connect India 2026 (OSCI'26) — by everyone who's opened a PR.
      </div>
    </footer>
  )
}
