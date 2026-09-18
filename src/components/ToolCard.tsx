import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ToolMeta } from '../tools/registry'

/** Displays a tool summary that links to the tool's page. */
export default function ToolCard({ meta }: { meta: ToolMeta }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
      <Link
        to={`/tools/${meta.slug}`}
        className="focus-ring group flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40 hover:shadow-glow"
      >
        <h3 className="font-semibold text-card-foreground group-hover:text-primary">{meta.name}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{meta.description}</p>
        {meta.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {meta.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  )
}
