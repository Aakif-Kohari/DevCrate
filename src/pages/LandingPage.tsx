import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { toolRegistry, getToolsByCategory } from '../tools/registry'
import { categories } from '../tools/categories'
import ToolCard from '../components/ToolCard'
import CategoryCard from '../components/CategoryCard'
import GitHubIcon from '../components/icons/GitHubIcon'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

/** Renders the landing page with featured tools, categories, and contribution links. */
export default function LandingPage() {
  const featuredTools = toolRegistry.slice(0, 6)

  return (
    <div className="flex flex-col gap-16 pb-8">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 py-10 text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          <Sparkles size={13} className="text-primary" />
          Built for Open Source Connect India 2026
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl"
        >
          Small tools, <span className="text-primary">built by everyone</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl text-lg text-muted-foreground"
        >
          A community-built crate of developer utilities — JSON formatters, encoders, converters,
          and more. Every tool lives entirely in your browser, and every tool was somebody's first
          open-source pull request.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/categories"
            className="focus-ring flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
          >
            Browse Categories <ArrowRight size={15} />
          </Link>
          <a
            href="https://github.com/Aakif-Kohari/DevCrate"
            target="_blank"
            rel="noreferrer"
            className="focus-ring flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <GitHubIcon className="h-4 w-4" /> View on GitHub
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex gap-8 text-sm"
        >
          <div>
            <div className="text-2xl font-bold">{toolRegistry.length}</div>
            <div className="text-muted-foreground">tools</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-muted-foreground">categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold">∞</div>
            <div className="text-muted-foreground">contributors welcome</div>
          </div>
        </motion.div>
      </section>

      {/* Featured tools */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold">Tools</h2>
          <Link
            to="/tools"
            className="focus-ring flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featuredTools.map(({ meta }) => (
            <motion.div key={meta.slug} variants={item}>
              <ToolCard meta={meta} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Categories preview */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold">Categories</h2>
          <Link
            to="/categories"
            className="focus-ring flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
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
      </section>

      {/* Contribution CTA */}
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-12 text-center">
        <h2 className="text-2xl font-bold">Build the next tool</h2>
        <p className="max-w-md text-muted-foreground">
          Every tool here is one small, well-scoped PR. Copy the template, follow the pattern, and
          ship your first open-source contribution.
        </p>
        <a
          href="https://github.com/Aakif-Kohari/DevCrate/blob/main/docs/ADDING_A_TOOL.md"
          target="_blank"
          rel="noreferrer"
          className="focus-ring flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
        >
          Read the guide <ArrowRight size={15} />
        </a>
      </section>
    </div>
  )
}
