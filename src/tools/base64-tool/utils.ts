/** Encodes text as UTF-8 Base64. The URL-safe variant uses `-`/`_` and drops padding. */
export function encodeBase64(text: string, urlSafe = false): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  const encoded = btoa(binary)
  return urlSafe ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : encoded
}

/**
 * Decodes standard or URL-safe Base64 (padding optional) into UTF-8 text.
 * Throws when the input is not valid Base64 or does not decode to valid UTF-8.
 */
export function decodeBase64(input: string): string {
  const cleaned = input.replace(/\s+/g, '')
  if (!/^[A-Za-z0-9+/_-]*={0,2}$/.test(cleaned)) {
    throw new Error('Input contains characters that are not valid Base64.')
  }
  const unpadded = cleaned.replace(/=+$/, '')
  if (unpadded.length % 4 === 1) {
    throw new Error('Input has an invalid Base64 length.')
  }
  const standard = unpadded.replace(/-/g, '+').replace(/_/g, '/')
  const padded = standard + '='.repeat((4 - (standard.length % 4)) % 4)
  let binary: string
  try {
    binary = atob(padded)
  } catch {
    throw new Error('Input is not valid Base64.')
  }
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new Error('Decoded bytes are not valid UTF-8 text.')
  }
}
