import { useMemo, useState } from 'react'
import { convertCases } from './convert'

export default function CaseConverter() {
  const [input, setInput] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const results = useMemo(() => convertCases(input), [input])

  async function copy(value: string, label: string) {
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(value)
      setCopyStatus(`${label} copied`)
    } catch {
      setCopyStatus(
        'Clipboard is unavailable. Select and copy the result manually.',
      )
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="case-converter-input"
          className="mb-1 block text-sm font-medium"
        >
          Text
        </label>
        <textarea
          id="case-converter-input"
          className="focus-ring h-40 w-full rounded-lg border border-border bg-card p-3 text-card-foreground"
          placeholder="Type or paste text to convert"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-muted p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{label}</span>
              <button
                type="button"
                className="focus-ring rounded border border-border px-2 py-1 text-xs"
                onClick={() => copy(value, label)}
              >
                Copy
              </button>
            </div>
            <output
              aria-label={label}
              className="block break-all font-mono text-sm"
            >
              {value}
            </output>
          </div>
        ))}
      </div>
      <p
        role="status"
        aria-live="polite"
        className="text-sm text-muted-foreground"
      >
        {copyStatus}
      </p>
    </div>
  )
}
