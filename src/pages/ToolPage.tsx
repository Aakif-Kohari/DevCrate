import { useParams, Navigate, Link } from 'react-router-dom'
import { getToolBySlug, getToolsByCategory } from '../tools/registry'
import { getCategory } from '../tools/categories'
import Breadcrumbs from '../components/Breadcrumbs'

// The constant template every tool renders inside: breadcrumb, a header
// with the tool's own metadata, the tool's component itself, then a
// "more in this category" strip. Individual tools stay self-contained —
// none of this page chrome lives in a tool's own folder.
export default function ToolPage() {
  const { toolSlug } = useParams<{ toolSlug: string }>()
  const entry = toolSlug ? getToolBySlug(toolSlug) : undefined

  if (!entry) {
    return <Navigate to="/tools" replace />
  }

  const { meta, Component } = entry
  const category = getCategory(meta.category)
  const related = getToolsByCategory(meta.category).filter((t) => t.meta.slug !== meta.slug)

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Categories', to: '/categories' },
          ...(category ? [{ label: category.name, to: `/categories/${category.slug}` }] : []),
          { label: meta.name },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{meta.name}</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">{meta.description}</p>
        </div>
        {category && (
          <Link
            to={`/categories/${category.slug}`}
            className="focus-ring shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground hover:opacity-80"
          >
            {category.name}
          </Link>
        )}
      </div>

      {meta.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <Component />
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            More in {category?.name}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {related.map((t) => (
              <li key={t.meta.slug}>
                <Link
                  to={`/tools/${t.meta.slug}`}
                  className="focus-ring block rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:border-primary/40 hover:text-primary"
                >
                  {t.meta.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
