import { useMemo, useState } from 'react'

type Operation = 'encode' | 'decode'
type EncodingMode = 'component' | 'url'

function transform(value: string, operation: Operation, mode: EncodingMode): string {
  if (operation === 'encode') {
    return mode === 'component' ? encodeURIComponent(value) : encodeURI(value)
  }
  return mode === 'component' ? decodeURIComponent(value) : decodeURI(value)
}

/** Percent-encodes or decodes URL text using browser-native URI helpers. */
export default function UrlEncoderDecoder() {
  const [input, setInput] = useState('')
  const [operation, setOperation] = useState<Operation>('encode')
  const [mode, setMode] = useState<EncodingMode>('component')

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: null as string | null }

    try {
      return { output: transform(input, operation, mode), error: null }
    } catch {
      return {
        output: '',
        error:
          operation === 'decode'
            ? 'Unable to decode this value because it contains a malformed percent-encoded sequence.'
            : 'Unable to encode this value because it contains invalid Unicode.',
      }
    }
  }, [input, operation, mode])

  const swap = () => {
    if (error || !output) return
    setInput(output)
    setOperation((current) => (current === 'encode' ? 'decode' : 'encode'))
  }

  return (
    <section className="space-y-4" aria-label="URL encoder and decoder">
      <div className="flex flex-wrap gap-4">
        <div>
          <p className="mb-1 text-sm font-medium">Operation</p>
          <div className="flex gap-2" role="group" aria-label="Operation">
            <button
              type="button"
              aria-pressed={operation === 'encode'}
              onClick={() => setOperation('encode')}
              className={`focus-ring rounded-lg border px-3 py-2 text-sm ${
                operation === 'encode'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-card-foreground hover:bg-muted'
              }`}
            >
              Encode
            </button>
            <button
              type="button"
              aria-pressed={operation === 'decode'}
              onClick={() => setOperation('decode')}
              className={`focus-ring rounded-lg border px-3 py-2 text-sm ${
                operation === 'decode'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-card-foreground hover:bg-muted'
              }`}
            >
              Decode
            </button>
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium">Encoding mode</p>
          <div className="flex gap-2" role="group" aria-label="Encoding mode">
            <button
              type="button"
              aria-pressed={mode === 'component'}
              onClick={() => setMode('component')}
              className={`focus-ring rounded-lg border px-3 py-2 text-sm ${
                mode === 'component'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-card-foreground hover:bg-muted'
              }`}
            >
              URL component
            </button>
            <button
              type="button"
              aria-pressed={mode === 'url'}
              onClick={() => setMode('url')}
              className={`focus-ring rounded-lg border px-3 py-2 text-sm ${
                mode === 'url'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-card-foreground hover:bg-muted'
              }`}
            >
              Full URL
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="url-encoder-input" className="mb-1 block text-sm font-medium">
            Input
          </label>
          <textarea
            id="url-encoder-input"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'url-encoder-error' : undefined}
            className="focus-ring h-72 w-full rounded-lg border border-border bg-card p-3 font-mono text-base text-card-foreground sm:text-sm"
            placeholder="Paste text or a URL"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span id="url-encoder-output-label" className="block text-sm font-medium">
              {error ? 'Error' : 'Output'}
            </span>
            <button
              type="button"
              className="focus-ring rounded-lg border border-border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!output || Boolean(error)}
              onClick={swap}
            >
              Swap input/output
            </button>
          </div>
          {error ? (
            <div
              id="url-encoder-error"
              role="alert"
              aria-labelledby="url-encoder-output-label"
              className="h-72 w-full overflow-auto rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            >
              {error}
            </div>
          ) : (
            <pre
              aria-labelledby="url-encoder-output-label"
              className="h-72 w-full overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm"
            >
              {output}
            </pre>
          )}
        </div>
      </div>
    </section>
  )
}
