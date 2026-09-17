import { useMemo, useState } from 'react'

// Reference implementation — copy this folder's shape for new tools.
// Keep tools self-contained: no imports from other tools, no new
// dependencies without discussing it in the issue first. Use the
// border/card/muted/foreground design tokens (not hardcoded gray-*/
// indigo-* colors) so the tool follows light/dark theme automatically.
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label htmlFor="json-formatter-input" className="mb-1 block text-sm font-medium">
          Input
        </label>
        <textarea
          id="json-formatter-input"
          className="focus-ring h-72 w-full rounded-lg border border-border bg-card p-3 font-mono text-base text-card-foreground sm:text-sm"
          placeholder='{"paste": "your JSON here"}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div>
        <label id="json-formatter-output-label" className="mb-1 block text-sm font-medium">
          {error ? 'Error' : 'Formatted'}
        </label>
        {error ? (
          <div
            role="alert"
            aria-labelledby="json-formatter-output-label"
            className="h-72 w-full overflow-auto rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            {error}
          </div>
        ) : (
          <pre
            aria-labelledby="json-formatter-output-label"
            className="h-72 w-full overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm"
          >
            {formatted}
          </pre>
        )}
      </div>
    </div>
  )
}
