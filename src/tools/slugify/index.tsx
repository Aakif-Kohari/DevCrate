import { useMemo, useState } from 'react'

function makeSlug(input: string, separator: '-' | '_', maxLength?: number): string {
  let slug = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '')

  if (maxLength && maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(new RegExp(`${separator}+$`), '')
  }
  return slug
}

export default function SlugGenerator() {
  const [input, setInput] = useState('')
  const [separator, setSeparator] = useState<'-' | '_'>('-')
  const [maxLength, setMaxLength] = useState('')
  const output = useMemo(
    () => makeSlug(input, separator, maxLength ? Number(maxLength) : undefined),
    [input, separator, maxLength],
  )

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <label htmlFor="slug-input" className="block text-sm font-medium">
          Text
        </label>
        <textarea
          id="slug-input"
          aria-label="Text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="focus-ring h-56 w-full rounded-lg border border-border bg-card p-3"
        />
        <label htmlFor="slug-separator" className="block text-sm font-medium">
          Separator
        </label>
        <select
          id="slug-separator"
          value={separator}
          onChange={(e) => setSeparator(e.target.value as '-' | '_')}
          className="focus-ring rounded-lg border border-border bg-card p-2"
        >
          <option value="-">Hyphen (-)</option>
          <option value="_">Underscore (_)</option>
        </select>
        <label htmlFor="slug-max" className="block text-sm font-medium">
          Maximum length (optional)
        </label>
        <input
          id="slug-max"
          type="number"
          min="1"
          value={maxLength}
          onChange={(e) => setMaxLength(e.target.value)}
          className="focus-ring rounded-lg border border-border bg-card p-2"
        />
      </div>
      <div>
        <label id="slug-output-label" className="mb-1 block text-sm font-medium">
          Slug
        </label>
        <pre
          aria-labelledby="slug-output-label"
          aria-live="polite"
          className="min-h-24 whitespace-pre-wrap break-all rounded-lg border border-border bg-muted p-3"
        >
          {output}
        </pre>
      </div>
    </div>
  )
}
