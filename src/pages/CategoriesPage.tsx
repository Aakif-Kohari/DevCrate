import { motion } from 'framer-motion'
import { categories } from '../tools/categories'
import { getToolsByCategory } from '../tools/registry'
import CategoryCard from '../components/CategoryCard'
import Breadcrumbs from '../components/Breadcrumbs'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

/** Lists the available tool categories with their current tool counts. */
export default function CategoriesPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
      <h1 className="text-2xl font-bold">Categories</h1>
      <p className="mt-1 text-muted-foreground">Browse tools grouped by what they're for.</p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map((category) => (
          <motion.div key={category.slug} variants={item}>
            <CategoryCard
              category={category}
              toolCount={getToolsByCategory(category.slug).length}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
