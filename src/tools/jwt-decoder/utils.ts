export interface DecodedJwt {
  header: unknown
  payload: unknown
  signature: string
}

function decodeSegment(segment: string, label: string): unknown {
  if (!/^[A-Za-z0-9_-]*$/.test(segment)) {
    throw new Error(`The ${label} is not valid base64url.`)
  }
  const standard = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = standard + '='.repeat((4 - (standard.length % 4)) % 4)
  let text: string
  try {
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new Error(`The ${label} is not valid base64url text.`)
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`The ${label} is not valid JSON.`)
  }
}

/** Splits a JWT and decodes header and payload. The signature is returned raw and never verified. */
export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    throw new Error('A JWT must have exactly three dot-separated parts.')
  }
  return {
    header: decodeSegment(parts[0], 'header'),
    payload: decodeSegment(parts[1], 'payload'),
    signature: parts[2],
  }
}

export interface TimeClaim {
  claim: 'exp' | 'iat' | 'nbf'
  label: string
  iso: string
}

const CLAIM_LABELS: Record<TimeClaim['claim'], string> = {
  exp: 'Expires at',
  iat: 'Issued at',
  nbf: 'Not valid before',
}

/** Reads exp/iat/nbf (seconds since epoch) from a payload as readable dates. */
export function getTimeClaims(payload: unknown): TimeClaim[] {
  if (typeof payload !== 'object' || payload === null) return []
  const record = payload as Record<string, unknown>
  const out: TimeClaim[] = []
  for (const claim of ['iat', 'nbf', 'exp'] as const) {
    const value = record[claim]
    if (typeof value !== 'number' || !Number.isFinite(value)) continue
    const date = new Date(value * 1000)
    if (Number.isNaN(date.getTime())) continue
    out.push({ claim, label: CLAIM_LABELS[claim], iso: date.toISOString() })
  }
  return out
}

/** True when the payload has an `exp` claim at or before `nowMs`. */
export function isExpired(payload: unknown, nowMs: number = Date.now()): boolean {
  if (typeof payload !== 'object' || payload === null) return false
  const exp = (payload as Record<string, unknown>).exp
  return typeof exp === 'number' && Number.isFinite(exp) && exp * 1000 <= nowMs
}
