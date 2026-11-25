import { useMemo, useState } from 'react'
import {
  MAX_LENGTH,
  MIN_LENGTH,
  estimateEntropy,
  generatePassword,
  getCharacterSets,
  strengthLabel,
  type PasswordOptions,
} from './utils'

const SET_TOGGLES: { key: 'uppercase' | 'lowercase' | 'digits' | 'symbols'; label: string }[] = [
  { key: 'uppercase', label: 'Uppercase (A-Z)' },
  { key: 'lowercase', label: 'Lowercase (a-z)' },
  { key: 'digits', label: 'Digits (0-9)' },
  { key: 'symbols', label: 'Symbols (!@#$...)' },
]

/** Generates random passwords in the browser with crypto.getRandomValues. */
export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    digits: true,
    symbols: true,
    excludeAmbiguous: false,
  })
  const [nonce, setNonce] = useState(0)
  const [copiedPassword, setCopiedPassword] = useState<string | null>(null)
  const [lengthDraft, setLengthDraft] = useState<string | null>(null)

  const noSets = getCharacterSets(options).length === 0

  const password = useMemo(() => {
    // `nonce` is read so Regenerate produces a fresh value for the same options.
    void nonce
    return noSets ? '' : generatePassword(options)
  }, [options, nonce, noSets])

  const entropy = estimateEntropy(options)

  const copy = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopiedPassword(password)
      setTimeout(() => setCopiedPassword(null), 2000)
    } catch {
      setCopiedPassword(null)
    }
  }

  const setLength = (value: number) => {
    if (Number.isNaN(value)) return
    setOptions((prev) => ({
      ...prev,
      length: Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, Math.round(value))),
    }))
  }

  const commitLengthDraft = () => {
    if (lengthDraft !== null && lengthDraft.trim() !== '') setLength(Number(lengthDraft))
    setLengthDraft(null)
  }

  return (
    <section className="space-y-6" aria-label="Password generator">
      <div>
        <span id="password-output-label" className="mb-1 block text-sm font-medium">
          Password
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <output
            aria-labelledby="password-output-label"
            className="min-h-10 flex-1 break-all rounded-lg border border-border bg-muted p-2 font-mono text-base"
          >
            {password}
          </output>
          <button
            type="button"
            onClick={() => setNonce((n) => n + 1)}
            disabled={noSets}
            className="focus-ring rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
          >
            Regenerate
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={!password}
            className="focus-ring rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
          >
            {copiedPassword === password ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="mt-2 text-sm" aria-live="polite">
          {noSets ? (
            <span role="alert" className="text-red-600">
              Select at least one character set.
            </span>
          ) : (
            <>
              Strength: <strong>{strengthLabel(entropy)}</strong> (about {entropy} bits of entropy)
            </>
          )}
        </p>
      </div>

      <div>
        <label htmlFor="password-length" className="mb-1 block text-sm font-medium">
          Length: {options.length}
        </label>
        <div className="flex items-center gap-3">
          <input
            id="password-length"
            type="range"
            min={MIN_LENGTH}
            max={MAX_LENGTH}
            value={options.length}
            onChange={(e) => {
              setLengthDraft(null)
              setLength(Number(e.target.value))
            }}
            className="w-full max-w-md"
          />
          <input
            type="number"
            aria-label="Length value"
            min={MIN_LENGTH}
            max={MAX_LENGTH}
            value={lengthDraft ?? options.length}
            onChange={(e) => setLengthDraft(e.target.value)}
            onBlur={commitLengthDraft}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitLengthDraft()
            }}
            className="focus-ring w-20 rounded-lg border border-border bg-card p-1 text-card-foreground"
          />
        </div>
      </div>

      <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <legend className="mb-1 text-sm font-medium">Character sets</legend>
        {SET_TOGGLES.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={(e) => setOptions((prev) => ({ ...prev, [key]: e.target.checked }))}
            />
            {label}
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={options.excludeAmbiguous}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, excludeAmbiguous: e.target.checked }))
            }
          />
          Exclude ambiguous characters (0 O 1 l I)
        </label>
      </fieldset>

      <p className="text-xs text-muted-foreground">
        Generated in your browser. Nothing is stored or sent anywhere.
      </p>
    </section>
  )
}
