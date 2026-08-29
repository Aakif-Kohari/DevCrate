import { useState } from 'react'
import { toolRegistry } from './tools/registry'
import ToolCard from './components/ToolCard'

export default function App() {
  const [activeSlug, setActiveSlug] = useState(toolRegistry[0]?.meta.slug)
  const active = toolRegistry.find((t) => t.meta.slug === activeSlug)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold">🧰 DevCrate</h1>
        <p className="text-sm text-gray-500">
          Small developer tools, built one PR at a time.
        </p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 p-6">
        <nav className="space-y-2">
          {toolRegistry.map((t) => (
            <ToolCard
              key={t.meta.slug}
              meta={t.meta}
              active={t.meta.slug === activeSlug}
              onClick={() => setActiveSlug(t.meta.slug)}
            />
          ))}
        </nav>
        <section>{active ? <active.Component /> : null}</section>
      </main>
    </div>
  )
}
