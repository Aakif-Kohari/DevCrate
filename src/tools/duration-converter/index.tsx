import { useMemo, useState } from 'react'
import { parseDuration, readableDuration } from './duration'

const UNIT_SECONDS = {
  milliseconds: 0.001,
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
} as const

type Unit = keyof typeof UNIT_SECONDS

/** Render the interactive duration converter tool. */
export default function DurationConverter() {
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState<Unit>('seconds')
  const [human, setHuman] = useState('')

  const numeric = Number(value)
  const seconds =
    value.trim() && Number.isFinite(numeric)
      ? numeric * UNIT_SECONDS[unit]
      : null
  const parsed = useMemo(() => parseDuration(human), [human])

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Value
          <input
            aria-label="Value"
            type="number"
            step="any"
            className="focus-ring mt-1 block w-full rounded-lg border border-border bg-card p-2"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </label>
        <label className="text-sm font-medium">
          Unit
          <select
            aria-label="Unit"
            className="focus-ring mt-1 block w-full rounded-lg border border-border bg-card p-2"
            value={unit}
            onChange={(event) => setUnit(event.target.value as Unit)}
          >
            {Object.keys(UNIT_SECONDS).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>

      {seconds !== null && (
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.entries(UNIT_SECONDS).map(([name, factor]) => (
            <div key={name} className="rounded border border-border bg-muted p-2">
              <dt className="text-xs">{name}</dt>
              <dd>{seconds / factor}</dd>
            </div>
          ))}
        </dl>
      )}

      <div>
        <label htmlFor="human-duration" className="text-sm font-medium">
          Human duration
        </label>
        <input
          id="human-duration"
          className="focus-ring mt-1 block w-full rounded-lg border border-border bg-card p-2"
          placeholder="1h 30m 15s"
          value={human}
          onChange={(event) => setHuman(event.target.value)}
        />
        {human &&
          (parsed === null ? (
            <p role="alert" className="mt-2 text-sm">
              Invalid duration string.
            </p>
          ) : (
            <p className="mt-2 text-sm">
              {parsed} seconds · {readableDuration(parsed)}
            </p>
          ))}
      </div>

      {seconds !== null && (
        <p className="text-sm">Readable: {readableDuration(seconds)}</p>
      )}
    </div>
  )
}
