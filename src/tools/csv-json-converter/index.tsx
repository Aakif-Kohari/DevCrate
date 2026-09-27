import { useMemo, useState } from 'react'
import { csvToJson, jsonToCsv, type Delimiter } from './parser'

type Direction = 'csv-to-json' | 'json-to-csv'

export default function CsvJsonConverter() {
  const [direction, setDirection] = useState<Direction>('csv-to-json')
  const [input, setInput] = useState('')
  const [delimiter, setDelimiter] = useState<Delimiter>(',')
  const [firstRowHeader, setFirstRowHeader] = useState(true)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null as string | null }

    try {
      if (direction === 'csv-to-json') {
        const result = csvToJson(input, { delimiter, firstRowHeader })
        return { output: JSON.stringify(result, null, 2), error: null }
      }

      return { output: jsonToCsv(input, delimiter), error: null }
    } catch (caught) {
      return { output: '', error: (caught as Error).message }
    }
  }, [delimiter, direction, firstRowHeader, input])

  const inputLabel = direction === 'csv-to-json' ? 'CSV input' : 'JSON input'
  const outputLabel = direction === 'csv-to-json' ? 'JSON output' : 'CSV output'

  return (
    <section className="space-y-4" aria-label="CSV and JSON converter">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Conversion direction">
        <button
          type="button"
          aria-pressed={direction === 'csv-to-json'}
          onClick={() => setDirection('csv-to-json')}
          className={`focus-ring rounded-lg border px-3 py-2 text-sm ${
            direction === 'csv-to-json'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-card-foreground hover:bg-muted'
          }`}
        >
          CSV to JSON
        </button>
        <button
          type="button"
          aria-pressed={direction === 'json-to-csv'}
          onClick={() => setDirection('json-to-csv')}
          className={`focus-ring rounded-lg border px-3 py-2 text-sm ${
            direction === 'json-to-csv'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-card-foreground hover:bg-muted'
          }`}
        >
          JSON to CSV
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="csv-json-delimiter" className="mb-1 block text-sm font-medium">
            Delimiter
          </label>
          <select
            id="csv-json-delimiter"
            className="focus-ring rounded-lg border border-border bg-card px-3 py-2 text-card-foreground"
            value={delimiter}
            onChange={(event) => setDelimiter(event.target.value as Delimiter)}
          >
            <option value=",">Comma</option>
            <option value=";">Semicolon</option>
            <option value={'\t'}>Tab</option>
          </select>
        </div>

        {direction === 'csv-to-json' ? (
          <label className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={firstRowHeader}
              onChange={(event) => setFirstRowHeader(event.target.checked)}
            />
            First row is header
          </label>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">
        CSV values stay as strings. JSON to CSV accepts an array of flat objects; missing keys
        become empty cells.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="csv-json-input" className="mb-1 block text-sm font-medium">
            {inputLabel}
          </label>
          <textarea
            id="csv-json-input"
            className="focus-ring h-72 w-full rounded-lg border border-border bg-card p-3 font-mono text-base text-card-foreground sm:text-sm"
            placeholder={
              direction === 'csv-to-json'
                ? 'name,note\nAlice,"hello, world"'
                : '[{"name":"Alice","note":"hello, world"}]'
            }
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>

        <div>
          <label id="csv-json-output-label" className="mb-1 block text-sm font-medium">
            {error ? 'Error' : outputLabel}
          </label>
          {error ? (
            <div
              role="status"
              aria-labelledby="csv-json-output-label"
              className="h-72 w-full overflow-auto rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            >
              {error}
            </div>
          ) : (
            <pre
              aria-labelledby="csv-json-output-label"
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
