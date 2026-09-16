// TEMPLATE — a minimal, working two-pane tool: input on the left, a derived
// result on the right. Replace the transformation logic and labels with
// your own; keep the overall shape (self-contained, no imports from other
// tools' folders, no new npm dependencies without discussing it first).

import { useMemo, useState } from 'react'

export default function TemplateTool() {
  const [input, setInput] = useState('')

  // Replace this with your tool's actual logic. Keep derived output in a
  // useMemo (or useState + useEffect if it needs to be async) rather than
  // computing it directly in the render body every time input changes for
  // no reason, or recomputing it as a side effect.
  const output = useMemo(() => {
    if (!input) return ''
    return input.split('').reverse().join('')
  }, [input])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label htmlFor="template-input" className="mb-1 block text-sm font-medium">
          Input
        </label>
        <textarea
          id="template-input"
          className="focus-ring h-72 w-full rounded-lg border border-border bg-card p-3 font-mono text-sm text-card-foreground"
          placeholder="Type or paste something here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div>
        <label id="template-output-label" className="mb-1 block text-sm font-medium">
          Output
        </label>
        <pre
          aria-labelledby="template-output-label"
          className="h-72 w-full overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm"
        >
          {output}
        </pre>
      </div>
    </div>
  )
}
