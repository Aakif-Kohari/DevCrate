import { useEffect, useMemo, useState } from 'react'
import {
  formatLocal,
  formatUtc,
  parseLocalInput,
  parseTimestamp,
  relativeTime,
  type ParsedTimestamp,
} from './utils'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr]">
      <dt className="text-sm font-medium">{label}</dt>
      <dd className="break-all font-mono text-sm" aria-label={label}>
        {value}
      </dd>
    </div>
  )
}

/** Converts Unix timestamps to readable dates and dates back to timestamps. */
export default function UnixTimestampConverter() {
  const [input, setInput] = useState('')
  const [picked, setPicked] = useState('')
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const { parsed, error } = useMemo(() => {
    if (!input.trim())
      return { parsed: null as ParsedTimestamp | null, error: null as string | null }
    try {
      return { parsed: parseTimestamp(input), error: null }
    } catch (e) {
      return { parsed: null, error: e instanceof Error ? e.message : 'Invalid timestamp.' }
    }
  }, [input])

  const pickedDate = parseLocalInput(picked)
  const nowSeconds = Math.floor(now.getTime() / 1000)

  return (
    <section className="space-y-8" aria-label="Unix timestamp converter">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm">
        <span>Current Unix time:</span>
        <output aria-label="Current timestamp" className="font-mono font-medium">
          {nowSeconds}
        </output>
        <button
          type="button"
          onClick={() => {
            setNow(new Date())
            setInput(String(Math.floor(Date.now() / 1000)))
          }}
          className="focus-ring rounded-lg border border-border px-3 py-1.5 hover:bg-muted"
        >
          Now
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Timestamp to date</h3>
        <div>
          <label htmlFor="ts-input" className="mb-1 block text-sm font-medium">
            Unix timestamp
          </label>
          <input
            id="ts-input"
            type="text"
            inputMode="numeric"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'ts-error' : undefined}
            placeholder="1700000000 (seconds) or 1700000000000 (milliseconds)"
            className="focus-ring w-full rounded-lg border border-border bg-card p-2 font-mono text-base text-card-foreground sm:text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        {error && (
          <p id="ts-error" role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        {parsed && (
          <dl className="space-y-2 rounded-lg border border-border bg-muted p-3">
            <Row label="Detected unit" value={parsed.unit} />
            <Row label="Local time" value={formatLocal(parsed.date)} />
            <Row label="UTC" value={formatUtc(parsed.date)} />
            <Row label="ISO 8601" value={parsed.date.toISOString()} />
            <Row label="Relative" value={relativeTime(parsed.date, now)} />
          </dl>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Date to timestamp</h3>
        <div>
          <label htmlFor="ts-picker" className="mb-1 block text-sm font-medium">
            Date and time (local)
          </label>
          <input
            id="ts-picker"
            type="datetime-local"
            step={1}
            className="focus-ring rounded-lg border border-border bg-card p-2 text-base text-card-foreground sm:text-sm"
            value={picked}
            onChange={(e) => setPicked(e.target.value)}
          />
        </div>
        {pickedDate && (
          <dl className="space-y-2 rounded-lg border border-border bg-muted p-3">
            <Row label="Seconds" value={String(Math.floor(pickedDate.getTime() / 1000))} />
            <Row label="Milliseconds" value={String(pickedDate.getTime())} />
          </dl>
        )}
      </div>
    </section>
  )
}
