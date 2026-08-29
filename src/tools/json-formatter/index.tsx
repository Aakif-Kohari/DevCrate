import { useMemo, useState } from 'react'

// Reference implementation — copy this folder's shape for new tools.
// Keep tools self-contained: no imports from other tools, no new
// dependencies without discussing it in the issue first.
export default function JsonFormatter() {
  const [input, setInput] = useState('')

  const { formatted, error } = useMemo(() => {
    if (!input.trim()) return { formatted: '', error: null as string | null }
    try {
      const parsed = JSON.parse(input)
      return { formatted: JSON.stringify(parsed, null, 2), error: null }
    } catch (e) {
      return { formatted: '', error: (e as Error).message }
    }
  }, [input])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Input</label>
        <textarea
          className="w-full h-72 rounded-lg border border-gray-300 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder='{"paste": "your JSON here"}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          {error ? 'Error' : 'Formatted'}
        </label>
        {error ? (
          <div className="w-full h-72 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 overflow-auto">
            {error}
          </div>
        ) : (
          <pre className="w-full h-72 rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm overflow-auto">
            {formatted}
          </pre>
        )}
      </div>
    </div>
  )
}
