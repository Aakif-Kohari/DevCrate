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

  const result = useMemo(() => {
    if (!input) return { output: '', error: '' }

    try {
      return { output: transform(input, operation, mode), error: '' }
    } catch {
      return {
        output: '',
        error: 'Unable to decode this value because it contains a malformed percent-encoded sequence.',
      }
    }
  }, [input, operation, mode])

  const swap = () => {
    if (result.error || !result.output) return
    setInput(result.output)
    setOperation((current) => (current === 'encode' ? 'decode' : 'encode'))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <fieldset>
          <legend className="mb-1 text-sm font-medium">Operation</legend>
          <div className="flex rounded-lg border border-border p-1">
            <button
              type="button"
              aria-pressed={operation === 'encode'}
              className={`rounded-md px-3 py-1.5 text-sm ${operation === 'encode' ? 'bg-muted font-medium' : ''}`}
              onClick={() => setOperation('encode')}
            >
              Encode
            </button>
            <button
              type="button"
              aria-pressed={operation === 'decode'}
              className={`rounded-md px-3 py-1.5 text-sm ${operation === 'decode' ? 'bg-muted font-medium' : ''}`}
              onClick={() => setOperation('decode')}
            >
              Decode
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1 text-sm font-medium">Encoding mode</legend>
          <div className="flex rounded-lg border border-border p-1">
            <button
              type="button"
              aria-pressed={mode === 'component'}
              className={`rounded-md px-3 py-1.5 text-sm ${mode === 'component' ? 'bg-muted font-medium' : ''}`}
              onClick={() => setMode('component')}
            >
              URL component
            </button>
            <button
              type="button"
              aria-pressed={mode === 'url'}
              className={`rounded-md px-3 py-1.5 text-sm ${mode === 'url' ? 'bg-muted font-medium' : ''}`}
              onClick={() => setMode('url')}
            >
              Full URL
            </button>
          </div>
        </fieldset>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="url-encoder-input" className="mb-1 block text-sm font-medium">
            Input
          </label>
          <textarea
            id="url-encoder-input"
            className="focus-ring h-72 w-full rounded-lg border border-border bg-card p-3 font-mono text-base text-card-foreground sm:text-sm"
            placeholder="Paste text or a URL"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span id="url-encoder-output-label" className="block text-sm font-medium">
              Output
            </span>
            <button
              type="button"
              className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!result.output || Boolean(result.error)}
              onClick={swap}
            >
              Swap input/output
            </button>
          </div>
          <pre
            aria-labelledby="url-encoder-output-label"
            className="h-72 w-full overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm"
          >
            {result.output}
          </pre>
          {result.error ? (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {result.error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
