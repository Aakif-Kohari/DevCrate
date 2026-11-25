import { useMemo, useState } from 'react'
import { decodeBase64, encodeBase64 } from './utils'

type Operation = 'encode' | 'decode'

const toggleClass = (active: boolean) =>
  `focus-ring rounded-lg border px-3 py-2 text-sm ${
    active
      ? 'border-primary bg-primary text-primary-foreground'
      : 'border-border bg-card text-card-foreground hover:bg-muted'
  }`

/** Encodes text to Base64 or decodes it back, UTF-8 safe, with an optional URL-safe variant. */
export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [operation, setOperation] = useState<Operation>('encode')
  const [urlSafe, setUrlSafe] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: null as string | null }
    try {
      return {
        output: operation === 'encode' ? encodeBase64(input, urlSafe) : decodeBase64(input),
        error: null,
      }
    } catch (e) {
      return { output: '', error: e instanceof Error ? e.message : 'Unable to convert this input.' }
    }
  }, [input, operation, urlSafe])

  return (
    <section className="space-y-4" aria-label="Base64 encoder and decoder">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <p className="mb-1 text-sm font-medium">Operation</p>
          <div className="flex gap-2" role="group" aria-label="Operation">
            <button
              type="button"
              aria-pressed={operation === 'encode'}
              onClick={() => setOperation('encode')}
              className={toggleClass(operation === 'encode')}
            >
              Encode
            </button>
            <button
              type="button"
              aria-pressed={operation === 'decode'}
              onClick={() => setOperation('decode')}
              className={toggleClass(operation === 'decode')}
            >
              Decode
            </button>
          </div>
        </div>
        {operation === 'encode' && (
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
            />
            URL-safe (use - and _, no padding)
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="base64-input" className="mb-1 block text-sm font-medium">
            Input
          </label>
          <textarea
            id="base64-input"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'base64-error' : undefined}
            className="focus-ring h-72 w-full rounded-lg border border-border bg-card p-3 font-mono text-base text-card-foreground sm:text-sm"
            placeholder={
              operation === 'encode' ? 'Type or paste text to encode' : 'Paste Base64 to decode'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div>
          <span id="base64-output-label" className="mb-1 block text-sm font-medium">
            {error ? 'Error' : 'Output'}
          </span>
          {error ? (
            <div
              id="base64-error"
              role="alert"
              className="h-72 w-full overflow-auto rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            >
              {error}
            </div>
          ) : (
            <pre
              aria-labelledby="base64-output-label"
              className="h-72 w-full overflow-auto whitespace-pre-wrap break-all rounded-lg border border-border bg-muted p-3 font-mono text-sm"
            >
              {output}
            </pre>
          )}
        </div>
      </div>
    </section>
  )
}
