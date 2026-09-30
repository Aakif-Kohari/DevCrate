import { useMemo, useState } from 'react'

const UNIT_SECONDS = { milliseconds: 0.001, seconds: 1, minutes: 60, hours: 3600, days: 86400, weeks: 604800 } as const
type Unit = keyof typeof UNIT_SECONDS

const TOKEN_UNITS: Record<string, number> = {
  ms: 0.001, millisecond: 0.001, milliseconds: 0.001,
  s: 1, sec: 1, second: 1, seconds: 1,
  m: 60, min: 60, minute: 60, minutes: 60,
  h: 3600, hr: 3600, hour: 3600, hours: 3600,
  d: 86400, day: 86400, days: 86400,
  w: 604800, week: 604800, weeks: 604800,
}

export function parseDuration(input: string): number | null {
  const source = input.trim()
  if (!source) return null
  const pattern = /([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*(milliseconds?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w)/gi
  let total = 0
  let cursor = 0
  let matched = false
  for (const match of source.matchAll(pattern)) {
    if (source.slice(cursor, match.index).trim()) return null
    const multiplier = TOKEN_UNITS[match[2].toLocaleLowerCase()]
    if (multiplier === undefined) return null
    total += Number(match[1]) * multiplier
    cursor = (match.index ?? 0) + match[0].length
    matched = true
  }
  if (!matched || source.slice(cursor).trim()) return null
  return total
}

export function readableDuration(totalSeconds: number): string {
  const sign = totalSeconds < 0 ? '-' : ''
  let remaining = Math.abs(totalSeconds)
  const days = Math.floor(remaining / 86400); remaining -= days * 86400
  const hours = Math.floor(remaining / 3600); remaining -= hours * 3600
  const minutes = Math.floor(remaining / 60); remaining -= minutes * 60
  const seconds = Number(remaining.toFixed(3))
  const parts = [[days,'d'],[hours,'h'],[minutes,'m'],[seconds,'s']] as const
  const text = parts.filter(([value]) => value !== 0).map(([value,unit]) => `${value}${unit}`).join(' ')
  return sign + (text || '0s')
}

export default function DurationConverter() {
  const [value,setValue]=useState(''); const [unit,setUnit]=useState<Unit>('seconds'); const [human,setHuman]=useState('')
  const numeric=Number(value)
  const seconds=value.trim() && Number.isFinite(numeric) ? numeric * UNIT_SECONDS[unit] : null
  const parsed=useMemo(()=>parseDuration(human),[human])
  return <div className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Value<input aria-label="Value" type="number" step="any" className="focus-ring mt-1 block w-full rounded-lg border border-border bg-card p-2" value={value} onChange={e=>setValue(e.target.value)}/></label><label className="text-sm font-medium">Unit<select aria-label="Unit" className="focus-ring mt-1 block w-full rounded-lg border border-border bg-card p-2" value={unit} onChange={e=>setUnit(e.target.value as Unit)}>{Object.keys(UNIT_SECONDS).map(u=><option key={u}>{u}</option>)}</select></label></div>
    {seconds!==null && <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">{Object.entries(UNIT_SECONDS).map(([name,factor])=><div key={name} className="rounded border border-border bg-muted p-2"><dt className="text-xs">{name}</dt><dd>{seconds/factor}</dd></div>)}</dl>}
    <div><label htmlFor="human-duration" className="text-sm font-medium">Human duration</label><input id="human-duration" className="focus-ring mt-1 block w-full rounded-lg border border-border bg-card p-2" placeholder="1h 30m 15s" value={human} onChange={e=>setHuman(e.target.value)}/>{human && (parsed===null?<p role="alert" className="mt-2 text-sm">Invalid duration string.</p>:<p className="mt-2 text-sm">{parsed} seconds · {readableDuration(parsed)}</p>)}</div>
    {seconds!==null && <p className="text-sm">Readable: {readableDuration(seconds)}</p>}
  </div>
}
