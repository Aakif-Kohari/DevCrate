import { useMemo, useState } from 'react'
import { decodeJwt, getTimeClaims, isExpired, type DecodedJwt } from './utils'

/** Decodes a JWT in the browser. Nothing is verified, sent anywhere or stored. */
export default function JwtDecoder() {
  const [token, setToken] = useState('')

  const { decoded, error } = useMemo(() => {
    if (!token.trim()) return { decoded: null as DecodedJwt | null, error: null as string | null }
    try {
      return { decoded: decodeJwt(token), error: null }
    } catch (e) {
      return { decoded: null, error: e instanceof Error ? e.message : 'Unable to decode token.' }
    }
  }, [token])

  const timeClaims = decoded ? getTimeClaims(decoded.payload) : []
  const expired = decoded ? isExpired(decoded.payload) : false

  return (
    <section className="space-y-4" aria-label="JWT decoder">
      <div>
        <label htmlFor="jwt-input" className="mb-1 block text-sm font-medium">
          Token
        </label>
        <textarea
          id="jwt-input"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'jwt-error' : undefined}
          className="focus-ring h-32 w-full rounded-lg border border-border bg-card p-3 font-mono text-base text-card-foreground sm:text-sm"
          placeholder="Paste a JWT (header.payload.signature)"
          spellCheck={false}
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Decoded locally in your browser. The token is never sent anywhere or stored.
        </p>
      </div>

      {error && (
        <div
          id="jwt-error"
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {decoded && (
        <>
          {expired && (
            <div
              role="alert"
              className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
            >
              This token has expired.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-1 text-sm font-medium">Header</h3>
              <pre
                aria-label="Decoded header"
                className="h-56 w-full overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm"
              >
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium">Payload</h3>
              <pre
                aria-label="Decoded payload"
                className="h-56 w-full overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm"
              >
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>

          {timeClaims.length > 0 && (
            <dl className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-card p-3 text-sm sm:grid-cols-[auto_1fr]">
              {timeClaims.map((c) => (
                <div key={c.claim} className="contents">
                  <dt className="font-medium">
                    {c.label} <span className="font-mono text-xs">({c.claim})</span>
                  </dt>
                  <dd className="font-mono">{c.iso}</dd>
                </div>
              ))}
            </dl>
          )}

          <div>
            <h3 className="mb-1 text-sm font-medium">
              Signature <span className="font-normal text-muted-foreground">(not verified)</span>
            </h3>
            <pre
              aria-label="Signature"
              className="w-full overflow-auto whitespace-pre-wrap break-all rounded-lg border border-border bg-muted p-3 font-mono text-sm"
            >
              {decoded.signature}
            </pre>
          </div>
        </>
      )}
    </section>
  )
}
