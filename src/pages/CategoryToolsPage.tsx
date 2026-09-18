import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCategory } from '../tools/categories'
import { getToolsByCategory } from '../tools/registry'
import ToolCard from '../components/ToolCard'
import Breadcrumbs from '../components/Breadcrumbs'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

/** Lists tools in the selected category or redirects invalid category routes. */
export default function CategoryToolsPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const category = categorySlug ? getCategory(categorySlug) : undefined

  if (!category) {
    return <Navigate to="/categories" replace />
  }

  const tools = getToolsByCategory(category.slug)
  const Icon = category.icon

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Categories', to: '/categories' },
          { label: category.name },
        ]}
      />
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon size={21} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      </div>

      {tools.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          No tools in this category yet.{' '}
          <Link to="/tools" className="text-primary hover:underline">
            Browse all tools
          </Link>{' '}
          or be the first to add one here.
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tools.map(({ meta }) => (
            <motion.div key={meta.slug} variants={item}>
              <ToolCard meta={meta} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
