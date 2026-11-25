import { useMemo, useState } from 'react'
import { decodeEntities, encodeEntities } from './utils'

type Operation = 'encode' | 'decode'

const toggleClass = (active: boolean) =>
  `focus-ring rounded-lg border px-3 py-2 text-sm ${
    active
      ? 'border-primary bg-primary text-primary-foreground'
      : 'border-border bg-card text-card-foreground hover:bg-muted'
  }`

/** Escapes text into HTML entities or decodes entities back to text. Output is always plain text. */
export default function HtmlEntityEncoder() {
  const [input, setInput] = useState('')
  const [operation, setOperation] = useState<Operation>('encode')
  const [encodeNonAscii, setEncodeNonAscii] = useState(false)

  const output = useMemo(() => {
    if (!input) return ''
    return operation === 'encode' ? encodeEntities(input, encodeNonAscii) : decodeEntities(input)
  }, [input, operation, encodeNonAscii])

  return (
    <section className="space-y-4" aria-label="HTML entity encoder and decoder">
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
              checked={encodeNonAscii}
              onChange={(e) => setEncodeNonAscii(e.target.checked)}
            />
            Encode all non-ASCII characters as numeric entities
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="entity-input" className="mb-1 block text-sm font-medium">
            Input
          </label>
          <textarea
            id="entity-input"
            className="focus-ring h-72 w-full rounded-lg border border-border bg-card p-3 font-mono text-base text-card-foreground sm:text-sm"
            placeholder={
              operation === 'encode' ? 'Type or paste text to escape' : 'Paste entities to decode'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div>
          <span id="entity-output-label" className="mb-1 block text-sm font-medium">
            Output
          </span>
          <pre
            aria-labelledby="entity-output-label"
            className="h-72 w-full overflow-auto whitespace-pre-wrap break-all rounded-lg border border-border bg-muted p-3 font-mono text-sm"
          >
            {output}
          </pre>
        </div>
      </div>
    </section>
  )
}
