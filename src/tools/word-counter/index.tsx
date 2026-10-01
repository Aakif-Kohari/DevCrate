import { useMemo, useState } from 'react'
import { stats } from './stats'

export default function WordCounter() {
  const [input, setInput] = useState('')
  const result = useMemo(() => stats(input), [input])
  const rows = [
    ['Characters', result.chars],
    ['Characters without spaces', result.noSpaces],
    ['Words', result.words],
    ['Sentences', result.sentences],
    ['Lines', result.lines],
    ['Paragraphs', result.paragraphs],
  ]

  return (
    <div className="space-y-4">
      <label htmlFor="word-counter-input" className="block text-sm font-medium">
        Text
      </label>
      <textarea
        id="word-counter-input"
        className="focus-ring h-48 w-full rounded-lg border border-border bg-card p-3"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-muted p-3">
            <dt className="text-sm">{label}</dt>
            <dd className="text-xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm">
        Estimated reading time: {result.reading.toFixed(2)} min at 200 wpm · Speaking time:{' '}
        {result.speaking.toFixed(2)} min at 130 wpm
      </p>
    </div>
  )
}
