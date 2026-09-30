export type Delimiter = ',' | ';' | '\t'

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
  if (
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r') ||
    value.includes(delimiter)
  ) {
    return `"${value.split('"').join('""')}"`
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
        throw new Error(
          `Field "${key}" in item ${index + 1} must be a string, number, boolean, or null.`,
        )
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
          return escapeCsvCell(
            value === null || value === undefined ? '' : String(value),
            delimiter,
          )
        })
        .join(delimiter),
    ),
  ]

  return lines.join('\n')
}
