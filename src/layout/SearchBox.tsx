import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { toolRegistry } from '../tools/registry'

/** Provides global tool search with live suggestions and route navigation. */
export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return toolRegistry
      .filter(
        ({ meta }) =>
          meta.name.toLowerCase().includes(q) ||
          meta.description.toLowerCase().includes(q) ||
          meta.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
      .slice(0, 6)
  }, [query])

  useEffect(() => {
    /** Closes search suggestions when a pointer interaction occurs outside the search. */
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  /** Clears the search state and navigates to the selected tool. */
  function goToTool(slug: string) {
    setQuery('')
    setIsFocused(false)
    navigate(`/tools/${slug}`)
  }

  /** Opens the best match or forwards the query to the full tools page. */
  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (matches.length > 0) {
      goToTool(matches[0].meta.slug)
    } else if (query.trim()) {
      navigate(`/tools?q=${encodeURIComponent(query.trim())}`)
      setIsFocused(false)
    }
  }

  const showDropdown = isFocused && query.trim().length > 0

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <form onSubmit={onSubmit}>
        <Search
          size={15}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search tools…"
          aria-label="Search tools"
          className="focus-ring w-full rounded-lg border border-border bg-card py-1.5 pl-8 pr-8 text-base text-card-foreground sm:text-sm placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-border bg-card shadow-lg motion-safe:animate-fade-in">
          {matches.length === 0 ? (
            <p className="px-3 py-2.5 text-sm text-muted-foreground">No tools match "{query}"</p>
          ) : (
            <ul>
              {matches.map(({ meta }) => (
                <li key={meta.slug}>
                  <button
                    type="button"
                    onClick={() => goToTool(meta.slug)}
                    className="focus-ring flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    <span className="font-medium">{meta.name}</span>
                    <span className="text-xs text-muted-foreground">{meta.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
