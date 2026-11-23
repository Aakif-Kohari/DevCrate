import { useState } from 'react'
import {
  PERMS,
  WHO,
  emptyPermissions,
  fromOctal,
  toOctal,
  toSymbolic,
  type Perm,
  type Permissions,
  type Special,
  type Who,
} from './utils'

const SPECIALS: { key: Special; label: string }[] = [
  { key: 'setuid', label: 'Setuid' },
  { key: 'setgid', label: 'Setgid' },
  { key: 'sticky', label: 'Sticky bit' },
]

function initial(): Permissions {
  return fromOctal('644') ?? emptyPermissions()
}

/** Calculates Unix file permissions from a checkbox grid or an octal value. */
export default function ChmodCalculator() {
  const [perms, setPerms] = useState<Permissions>(initial)
  const [octalDraft, setOctalDraft] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const octal = toOctal(perms)
  const symbolic = toSymbolic(perms)
  const command = `chmod ${octal} file`
  const draftInvalid = octalDraft !== null && fromOctal(octalDraft) === null

  const togglePerm = (who: Who, perm: Perm) => {
    setOctalDraft(null)
    setPerms((prev) => ({ ...prev, [who]: { ...prev[who], [perm]: !prev[who][perm] } }))
  }

  const toggleSpecial = (key: Special) => {
    setOctalDraft(null)
    setPerms((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const onOctalChange = (value: string) => {
    setOctalDraft(value)
    const parsed = fromOctal(value)
    if (parsed) setPerms(parsed)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="space-y-6" aria-label="Unix permission calculator">
      <table className="w-full max-w-md border-collapse text-sm">
        <thead>
          <tr className="text-left">
            <th scope="col" className="p-2 font-medium">
              <span className="sr-only">Class</span>
            </th>
            {PERMS.map((perm) => (
              <th key={perm} scope="col" className="p-2 font-medium capitalize">
                {perm}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {WHO.map((who) => (
            <tr key={who} className="border-t border-border">
              <th scope="row" className="p-2 text-left font-medium capitalize">
                {who}
              </th>
              {PERMS.map((perm) => (
                <td key={perm} className="p-2">
                  <input
                    type="checkbox"
                    aria-label={`${who} ${perm}`}
                    checked={perms[who][perm]}
                    onChange={() => togglePerm(who, perm)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <fieldset className="flex flex-wrap gap-4">
        <legend className="mb-1 text-sm font-medium">Special bits (optional)</legend>
        {SPECIALS.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={perms[key]} onChange={() => toggleSpecial(key)} />
            {label}
          </label>
        ))}
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="chmod-octal" className="mb-1 block text-sm font-medium">
            Octal
          </label>
          <input
            id="chmod-octal"
            type="text"
            inputMode="numeric"
            maxLength={4}
            aria-invalid={draftInvalid}
            aria-describedby={draftInvalid ? 'chmod-octal-error' : undefined}
            className="focus-ring w-full rounded-lg border border-border bg-card p-2 font-mono text-base text-card-foreground sm:text-sm"
            value={octalDraft ?? octal}
            onChange={(e) => onOctalChange(e.target.value)}
          />
          {draftInvalid && (
            <p id="chmod-octal-error" role="alert" className="mt-1 text-sm text-red-600">
              Enter 3 or 4 octal digits (0-7), for example 755 or 4755.
            </p>
          )}
        </div>
        <div>
          <span id="chmod-symbolic-label" className="mb-1 block text-sm font-medium">
            Symbolic
          </span>
          <output
            aria-labelledby="chmod-symbolic-label"
            className="block w-full rounded-lg border border-border bg-muted p-2 font-mono text-sm"
          >
            {symbolic}
          </output>
        </div>
      </div>

      <div>
        <span id="chmod-command-label" className="mb-1 block text-sm font-medium">
          Command
        </span>
        <div className="flex items-center gap-2">
          <output
            aria-labelledby="chmod-command-label"
            className="block flex-1 rounded-lg border border-border bg-muted p-2 font-mono text-sm"
          >
            {command}
          </output>
          <button
            type="button"
            onClick={copy}
            className="focus-ring rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </section>
  )
}
