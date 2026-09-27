import { useMemo, useState } from 'react'

type Direction = 'csv-to-json' | 'json-to-csv'
type Delimiter = ',' | ';' | '\t'

interface CsvOptions {
  delimiter: Delimiter
  firstRowHeader: boolean
}

export function parseCsv(input: string, delimiter: Delimiter): string[][] {
  if (!input) return []

  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let endedWithRowBreak = false

  const pushField = () => {
    row.push(field)
    field = ''
  }

  const pushRow = () => {
    pushField()
    rows.push(row)
    row = []
  }

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]

    if (inQuotes) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          field += '"'
          index += 1
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      endedWithRowBreak = false
      continue
    }

    if (char === '"') {
      if (field.length > 0) {
        throw new Error('Unexpected quote inside an unquoted CSV field.')
      }
      inQuotes = true
      endedWithRowBreak = false
      continue
    }

    if (char === delimiter) {
      pushField()
      endedWithRowBreak = false
      continue
    }

    if (char === '\n' || char === '\r') {
      if (char === '\r' && input[index + 1] === '\n') index += 1
      pushRow()
      endedWithRowBreak = true
      continue
    }

    field += char
    endedWithRowBreak = false
  }

  if (inQuotes) throw new Error('Unterminated quoted CSV field.')

  if (!endedWithRowBreak || field.length > 0 || row.length > 0) pushRow()

  return rows
}

export function csvToJson(input: string, options: CsvOptions): unknown[] {
  const rows = parseCsv(input, options.delimiter)
  if (rows.length === 0) return []

  if (!options.firstRowHeader) return rows

  const [header, ...body] = rows
  const normalizedHeader = header.map((value) => value.trim())

  if (normalizedHeader.some((value) => value.length === 0)) {
    throw new Error('Header cells must not be empty.')
  }

  if (new Set(normalizedHeader).size !== normalizedHeader.length) {
    throw new Error('Header names must be unique.')
  }

  return body.map((values, rowIndex) => {
    if (values.length > normalizedHeader.length) {
      throw new Error(`Row ${rowIndex + 2} has more values than the header.`)
    }

    return Object.fromEntries(
      normalizedHeader.map((key, columnIndex) => [key, values[columnIndex] ?? '']),
    )
  })
}

function isFlatValue(value: unknown): boolean {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value)
}

function escapeCsvCell(value: string, delimiter: Delimiter): string {
  if (value.includes('"') || value.includes('\n') || value.includes('\r') || value.includes(delimiter)) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}

export function jsonToCsv(input: string, delimiter: Delimiter): string {
  if (!input.trim()) return ''

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (error) {
    throw new Error(`Invalid JSON: ${(error as Error).message}`)
  }

  if (!Array.isArray(parsed)) throw new Error('JSON input must be an array of flat objects.')
  if (parsed.length === 0) return ''

  const records = parsed.map((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`Item ${index + 1} must be a flat object.`)
    }

    const record = entry as Record<string, unknown>
    for (const [key, value] of Object.entries(record)) {
      if (!isFlatValue(value)) {
        throw new Error(`Field "${key}" in item ${index + 1} must be a string, number, boolean, or null.`)
      }
    }
    return record
  })

  const keys: string[] = []
  const seen = new Set<string>()

  for (const record of records) {
    for (const key of Object.keys(record)) {
      if (!seen.has(key)) {
        seen.add(key)
        keys.push(key)
      }
    }
  }

  if (keys.length === 0) return ''

  const lines = [
    keys.map((key) => escapeCsvCell(key, delimiter)).join(delimiter),
    ...records.map((record) =>
      keys
        .map((key) => {
          const value = record[key]
          return escapeCsvCell(value === null || value === undefined ? '' : String(value), delimiter)
        })
        .join(delimiter),
    ),
  ]

  return lines.join('\n')
}

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
        CSV values stay as strings. JSON to CSV accepts an array of flat objects; missing keys become empty cells.
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
