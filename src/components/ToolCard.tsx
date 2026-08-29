import type { ToolMeta } from '../tools/registry'

export default function ToolCard({
  meta,
  active,
  onClick,
}: {
  meta: ToolMeta
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left w-full rounded-lg border p-3 transition ${
        active
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="font-medium">{meta.name}</div>
      <div className="text-sm text-gray-500">{meta.description}</div>
    </button>
  )
}
