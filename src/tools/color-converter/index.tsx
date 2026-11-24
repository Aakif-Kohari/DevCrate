import { useState } from 'react'
import { formatHex, formatHsl, formatRgb, parseColor, type Rgba } from './utils'

const START: Rgba = { r: 59, g: 130, b: 246, a: 1 }

/** Converts a colour between HEX, RGB and HSL, with a swatch and native picker. */
export default function ColorConverter() {
  const [text, setText] = useState(formatHex(START))
  const [color, setColor] = useState<Rgba>(START)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const invalid = text.trim() !== '' && parseColor(text) === null

  const onTextChange = (value: string) => {
    setText(value)
    const parsed = parseColor(value)
    if (parsed) setColor(parsed)
  }

  const onPick = (hex: string) => {
    const parsed = parseColor(hex)
    if (!parsed) return
    setColor(parsed)
    setText(formatHex(parsed))
  }

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 2000)
    } catch {
      setCopiedKey(null)
    }
  }

  const outputs = [
    { key: 'HEX', value: formatHex(color) },
    { key: 'RGB', value: formatRgb(color) },
    { key: 'HSL', value: formatHsl(color) },
  ]
  const pickerValue = formatHex({ ...color, a: 1 })
  const swatch = formatRgb(color)

  return (
    <section className="space-y-6" aria-label="Color converter">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <label htmlFor="color-input" className="mb-1 block text-sm font-medium">
            Color value
          </label>
          <input
            id="color-input"
            type="text"
            spellCheck={false}
            aria-invalid={invalid}
            aria-describedby={invalid ? 'color-error' : undefined}
            placeholder="#3b82f6, rgb(59, 130, 246) or hsl(217, 91%, 60%)"
            className="focus-ring w-full rounded-lg border border-border bg-card p-2 font-mono text-base text-card-foreground sm:text-sm"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="color-picker" className="mb-1 block text-sm font-medium">
            Picker
          </label>
          <input
            id="color-picker"
            type="color"
            value={pickerValue}
            onChange={(e) => onPick(e.target.value)}
            className="h-10 w-16 cursor-pointer rounded-lg border border-border bg-card"
          />
        </div>
      </div>

      {invalid && (
        <p id="color-error" role="alert" className="text-sm text-red-600">
          Not a valid colour. Showing the last valid value. Try HEX (3, 4, 6 or 8 digits), rgb() or
          hsl().
        </p>
      )}

      <div
        role="img"
        aria-label={`Swatch for ${swatch}`}
        className="h-24 w-full rounded-lg border border-border"
        style={{
          backgroundImage:
            'linear-gradient(45deg, rgba(128,128,128,.25) 25%, transparent 25%, transparent 75%, rgba(128,128,128,.25) 75%), linear-gradient(45deg, rgba(128,128,128,.25) 25%, transparent 25%, transparent 75%, rgba(128,128,128,.25) 75%)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 8px 8px',
        }}
      >
        <div className="h-full w-full rounded-lg" style={{ backgroundColor: swatch }} />
      </div>

      <ul className="space-y-2">
        {outputs.map(({ key, value }) => (
          <li key={key} className="flex items-center gap-2">
            <span className="w-10 text-sm font-medium">{key}</span>
            <output
              aria-label={`${key} value`}
              className="block flex-1 break-all rounded-lg border border-border bg-muted p-2 font-mono text-sm"
            >
              {value}
            </output>
            <button
              type="button"
              aria-label={`Copy ${key}`}
              onClick={() => copy(key, value)}
              className="focus-ring rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
            >
              {copiedKey === key ? 'Copied' : 'Copy'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
