import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Category } from '../tools/categories'

export default function CategoryCard({
  category,
  toolCount,
}: {
  category: Category
  toolCount: number
}) {
  const Icon = category.icon
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
      <Link
        to={`/categories/${category.slug}`}
        className="focus-ring group flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:shadow-glow"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon size={19} />
        </div>
        <div>
          <h3 className="font-semibold text-card-foreground group-hover:text-primary">
            {category.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
        </div>
        <span className="mt-auto text-xs font-medium text-muted-foreground">
          {toolCount} {toolCount === 1 ? 'tool' : 'tools'}
        </span>
      </Link>
    </motion.div>
  )
}
