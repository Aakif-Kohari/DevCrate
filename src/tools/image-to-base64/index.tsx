import { useCallback, useRef, useState } from 'react'

const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
])
const LARGE_FILE_BYTES = 2 * 1024 * 1024

type ImageResult = {
  name: string
  size: number
  dataUri: string
  base64: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function ImageToBase64() {
  const [result, setResult] = useState<ImageResult | null>(null)
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [copied, setCopied] = useState('')
  const readerRef = useRef<FileReader | null>(null)

  const readFile = useCallback((file?: File) => {
    readerRef.current?.abort?.()
    readerRef.current = null
    setCopied('')
    setError('')
    setWarning('')
    setResult(null)

    if (!file) return
    if (!ALLOWED_TYPES.has(file.type)) {
      setError('Choose a PNG, JPG, GIF, WebP, or SVG image.')
      return
    }
    if (file.size > LARGE_FILE_BYTES) {
      setWarning('Large image: Base64 increases file size. Consider using a file under 2 MB.')
    }

    const reader = new FileReader()
    readerRef.current = reader
    reader.onerror = () => {
      if (readerRef.current !== reader) return
      readerRef.current = null
      setError('Could not read this image.')
    }
    reader.onload = () => {
      if (readerRef.current !== reader) return
      readerRef.current = null
      if (typeof reader.result !== 'string' || !reader.result.startsWith('data:image/')) {
        setError('Could not create an image data URI.')
        return
      }
      const comma = reader.result.indexOf(',')
      setResult({
        name: file.name,
        size: file.size,
        dataUri: reader.result,
        base64: comma >= 0 ? reader.result.slice(comma + 1) : '',
      })
    }
    reader.readAsDataURL(file)
  }, [])

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
    } catch {
      setError('Clipboard access was unavailable. Select the output and copy it manually.')
    }
  }

  return (
    <section className="space-y-4" aria-label="Image to Base64 converter">
      <div
        className="rounded-lg border border-dashed border-border bg-card p-5 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          readFile(event.dataTransfer.files[0])
        }}
      >
        <label htmlFor="image-base64-file" className="mb-2 block text-sm font-medium">
          Choose an image or drag and drop it here
        </label>
        <input
          id="image-base64-file"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
          onChange={(event) => readFile(event.target.files?.[0])}
          className="focus-ring mx-auto block max-w-full text-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border file:border-primary file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          PNG, JPG, GIF, WebP, and SVG. Everything stays in your browser.
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {error}
        </p>
      ) : null}
      {warning ? (
        <p role="status" className="rounded-lg border border-border bg-muted p-3 text-sm">
          {warning}
        </p>
      ) : null}

      {result ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="text-sm font-medium">Preview</h2>
              <div className="flex min-h-56 items-center justify-center rounded-lg border border-border bg-muted p-3">
                <img
                  src={result.dataUri}
                  alt={`Preview of ${result.name}`}
                  className="max-h-72 max-w-full object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {result.name} · {formatBytes(result.size)}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="image-base64-output" className="block text-sm font-medium">
                Data URI
              </label>
              <textarea
                id="image-base64-output"
                readOnly
                value={result.dataUri}
                className="focus-ring h-56 w-full rounded-lg border border-border bg-muted p-3 font-mono text-xs"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="focus-ring rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => copy(result.dataUri, 'Data URI')}
                >
                  Copy data URI
                </button>
                <button
                  type="button"
                  className="focus-ring rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => copy(result.base64, 'Base64')}
                >
                  Copy raw Base64
                </button>
                <button
                  type="button"
                  className="focus-ring rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => copy(`url("${result.dataUri}")`, 'CSS')}
                >
                  Copy CSS url()
                </button>
              </div>
              {copied ? (
                <p role="status" className="text-sm text-muted-foreground">
                  Copied {copied}.
                </p>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </section>
  )
}
