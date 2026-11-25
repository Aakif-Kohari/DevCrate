import { useMemo, useState } from 'react'
import { parseQuery, type ParsedQuery } from './utils'

/** Splits a URL or query string into decoded parameters, shown as a table and as JSON. */
export default function QueryStringParser() {
  const [input, setInput] = useState('')

  const { result, message, isError } = useMemo(() => {
    if (!input.trim()) {
      return {
        result: null as ParsedQuery | null,
        message: 'Enter a URL or query string.' as string | null,
        isError: false,
      }
    }
    try {
      const parsed = parseQuery(input)
      return {
        result: parsed,
        message: parsed.pairs.length === 0 ? 'No query parameters found.' : null,
        isError: false,
      }
    } catch (e) {
      return {
        result: null,
        message: e instanceof Error ? e.message : 'Unable to parse input.',
        isError: true,
      }
    }
  }, [input])

  const hasPairs = result !== null && result.pairs.length > 0

  return (
    <section className="space-y-4" aria-label="URL query string parser">
      <div>
        <label htmlFor="query-input" className="mb-1 block text-sm font-medium">
          URL or query string
        </label>
        <textarea
          id="query-input"
          spellCheck={false}
          className="focus-ring h-28 w-full rounded-lg border border-border bg-card p-3 font-mono text-base text-card-foreground sm:text-sm"
          placeholder="https://example.com/search?q=hello+world&tag=a&tag=b"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {message && (
        <p
          role={isError ? 'alert' : 'status'}
          className={`rounded-lg border p-3 text-sm ${
            isError
              ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
              : 'border-border bg-muted'
          }`}
        >
          {message}
        </p>
      )}

      {hasPairs && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="overflow-auto">
            <h3 className="mb-1 text-sm font-medium">Parameters</h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th scope="col" className="p-2 font-medium">
                    Key
                  </th>
                  <th scope="col" className="p-2 font-medium">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.pairs.map(([key, value], i) => (
                  <tr key={`${key}-${i}`} className="border-b border-border align-top">
                    <td className="break-all p-2 font-mono">{key}</td>
                    <td className="break-all p-2 font-mono">{value === '' ? '(empty)' : value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 id="query-json-label" className="mb-1 text-sm font-medium">
              JSON
            </h3>
            <pre
              aria-labelledby="query-json-label"
              className="max-h-96 overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm"
            >
              {JSON.stringify(result.json, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </section>
  )
}
