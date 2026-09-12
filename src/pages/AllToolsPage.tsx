import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { toolRegistry } from '../tools/registry'
import ToolCard from '../components/ToolCard'
import Breadcrumbs from '../components/Breadcrumbs'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
}
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

export default function AllToolsPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return toolRegistry
    return toolRegistry.filter(
      ({ meta }) =>
        meta.name.toLowerCase().includes(q) ||
        meta.description.toLowerCase().includes(q) ||
        meta.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }, [query])

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'All Tools' }]} />
      <h1 className="text-2xl font-bold">All Tools</h1>
      <p className="mt-1 text-muted-foreground">
        {toolRegistry.length} {toolRegistry.length === 1 ? 'tool' : 'tools'} and counting.
      </p>

      <div className="relative mt-5 max-w-sm">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, tag, or description…"
          aria-label="Filter tools"
          className="focus-ring w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          No tools match "{query}".
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map(({ meta }) => (
            <motion.div key={meta.slug} variants={item}>
              <ToolCard meta={meta} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
