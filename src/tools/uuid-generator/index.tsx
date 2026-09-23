import { useState, useMemo, useCallback } from 'react'
import { Copy, Check, RefreshCw, CheckCircle2, XCircle } from 'lucide-react'
import { generateV4UUID, validateUUID } from './utils'

export default function UuidGenerator() {
  const [count, setCount] = useState<number | ''>(1)
  const [uppercase, setUppercase] = useState(false)
  const [removeHyphens, setRemoveHyphens] = useState(false)
  const [copyAllStatus, setCopyAllStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [copyOneStatus, setCopyOneStatus] = useState<{
    index: number
    status: 'copied' | 'error'
  } | null>(null)
  const [validatorInput, setValidatorInput] = useState('')

  // Seed with initial UUID
  const [rawUuids, setRawUuids] = useState<string[]>(() => [generateV4UUID()])

  const handleGenerate = useCallback(() => {
    const validCount = Math.max(1, Math.min(100, typeof count === 'number' ? count : 1))
    const next: string[] = []
    for (let i = 0; i < validCount; i++) {
      next.push(generateV4UUID())
    }
    setRawUuids(next)
    setCopyAllStatus('idle')
    setCopyOneStatus(null)
  }, [count])

  const formattedUuids = useMemo(() => {
    return rawUuids.map((uuid) => {
      let u = uuid
      if (removeHyphens) {
        u = u.replace(/-/g, '')
      }
      if (uppercase) {
        u = u.toUpperCase()
      } else {
        u = u.toLowerCase()
      }
      return u
    })
  }, [rawUuids, uppercase, removeHyphens])

  const allUuidsText = useMemo(() => formattedUuids.join('\n'), [formattedUuids])

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (!success) {
        throw new Error('Copy command failed')
      }
    }
  }

  const handleCopyAll = async () => {
    if (!allUuidsText) return
    try {
      await copyToClipboard(allUuidsText)
      setCopyAllStatus('copied')
      setTimeout(() => setCopyAllStatus('idle'), 2000)
    } catch {
      setCopyAllStatus('error')
      setTimeout(() => setCopyAllStatus('idle'), 2000)
    }
  }

  const handleCopyOne = async (text: string, index: number) => {
    try {
      await copyToClipboard(text)
      setCopyOneStatus({ index, status: 'copied' })
      setTimeout(() => setCopyOneStatus(null), 2000)
    } catch {
      setCopyOneStatus({ index, status: 'error' })
      setTimeout(() => setCopyOneStatus(null), 2000)
    }
  }

  const validation = useMemo(() => validateUUID(validatorInput), [validatorInput])

  return (
    <div className="space-y-8">
      {/* Generator Section */}
      <section className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-card-foreground sm:text-lg">
          Generate UUIDs (v4)
        </h2>

        <div className="mb-6 flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <label htmlFor="uuid-count" className="text-sm font-medium text-card-foreground">
              Quantity:
            </label>
            <input
              id="uuid-count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => {
                const rawVal = e.target.value
                if (rawVal === '') {
                  setCount('')
                } else {
                  const val = parseInt(rawVal, 10)
                  if (!Number.isNaN(val)) {
                    setCount(val)
                  }
                }
              }}
              onBlur={() => {
                if (count === '' || count < 1) {
                  setCount(1)
                } else if (count > 100) {
                  setCount(100)
                }
              }}
              className="focus-ring w-20 rounded-md border border-border bg-background px-3 py-1.5 text-base text-foreground sm:text-sm"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-card-foreground">
            <input
              id="uuid-uppercase"
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="focus-ring h-4 w-4 rounded border-border text-primary"
            />
            Uppercase
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-card-foreground">
            <input
              id="uuid-hyphens"
              type="checkbox"
              checked={removeHyphens}
              onChange={(e) => setRemoveHyphens(e.target.checked)}
              className="focus-ring h-4 w-4 rounded border-border text-primary"
            />
            Remove hyphens
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <RefreshCw className="h-4 w-4" />
              Generate
            </button>
            <button
              type="button"
              onClick={handleCopyAll}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
            >
              {copyAllStatus === 'copied' ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : copyAllStatus === 'error' ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copyAllStatus === 'copied'
                ? 'Copied!'
                : copyAllStatus === 'error'
                  ? 'Failed to copy'
                  : 'Copy All'}
            </button>
          </div>
        </div>

        <div>
          <label
            id="uuid-generated-list-label"
            className="mb-2 block text-sm font-medium text-card-foreground"
          >
            Generated UUIDs ({formattedUuids.length})
          </label>
          <div
            aria-labelledby="uuid-generated-list-label"
            className="max-h-72 divide-y divide-border overflow-y-auto rounded-lg border border-border bg-muted"
          >
            {formattedUuids.map((uuid, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-2 text-xs font-mono text-foreground sm:text-sm"
              >
                <span className="select-all break-all">{uuid}</span>
                <button
                  type="button"
                  onClick={() => handleCopyOne(uuid, idx)}
                  aria-label={`Copy UUID ${idx + 1}`}
                  className="focus-ring ml-2 shrink-0 rounded p-1.5 text-muted-foreground hover:bg-card hover:text-foreground"
                >
                  {copyOneStatus?.index === idx && copyOneStatus.status === 'copied' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : copyOneStatus?.index === idx && copyOneStatus.status === 'error' ? (
                    <XCircle className="h-3.5 w-3.5 text-red-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Validator Section */}
      <section className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-card-foreground sm:text-lg">
          Validate UUID
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="uuid-validator-input"
              className="mb-1 block text-sm font-medium text-card-foreground"
            >
              Paste UUID
            </label>
            <input
              id="uuid-validator-input"
              type="text"
              value={validatorInput}
              onChange={(e) => setValidatorInput(e.target.value)}
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000 or 123e4567e89b12d3a456426614174000"
              className="focus-ring w-full rounded-lg border border-border bg-background p-3 font-mono text-base text-foreground sm:text-sm"
            />
          </div>

          <div>
            {validatorInput.trim() === '' ? (
              <div className="rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
                Paste a UUID above to check its validity and version.
              </div>
            ) : validation.isValid ? (
              <div
                role="status"
                className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              >
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Valid UUID
                </div>
                <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-emerald-700 dark:text-emerald-300">Version</dt>
                    <dd className="font-semibold">{validation.version}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-emerald-700 dark:text-emerald-300">Variant</dt>
                    <dd className="font-semibold">{validation.variant}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-emerald-700 dark:text-emerald-300">
                      Canonical Format
                    </dt>
                    <dd className="font-mono text-xs sm:text-sm">{validation.formatted}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div
                role="status"
                className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
              >
                <div className="flex items-center gap-2 font-medium">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  Invalid UUID
                </div>
                <p className="mt-1 text-xs sm:text-sm text-red-700 dark:text-red-300">
                  {validation.error}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
