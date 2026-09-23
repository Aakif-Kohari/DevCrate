/**
 * Generates a random RFC 4122 version 4 UUID string.
 * Uses `crypto.randomUUID()` when available, falling back to `crypto.getRandomValues()`
 * or a pseudo-random generator.
 *
 * @returns A canonical RFC 4122 v4 UUID string.
 */
export function generateV4UUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40 // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80 // Variant 10xx (RFC 4122)
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export interface ValidationResult {
  isValid: boolean
  version: string | null
  variant: string | null
  error: string | null
  formatted: string | null
}

/**
 * Validates a UUID string and extracts its version, variant, and canonical representation.
 * Supports canonical hyphenated format, non-hyphenated 32-hex format, braced `{...}`,
 * and `urn:uuid:...` (case-insensitive) formats, along with nil and max UUIDs.
 *
 * @param raw - The input string to validate as a UUID.
 * @returns A ValidationResult indicating validity, version, variant, canonical format, or error.
 */
export function validateUUID(raw: string): ValidationResult {
  let trimmed = raw.trim()
  if (!trimmed) {
    return { isValid: false, version: null, variant: null, error: null, formatted: null }
  }

  if (/^urn:uuid:/i.test(trimmed)) {
    trimmed = trimmed.slice(9).trim()
  } else if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    trimmed = trimmed.slice(1, -1).trim()
  }

  if (/^0{8}-?0{4}-?0{4}-?0{4}-?0{12}$/i.test(trimmed)) {
    return {
      isValid: true,
      version: 'Nil (all zeros)',
      variant: 'N/A',
      error: null,
      formatted: '00000000-0000-0000-0000-000000000000',
    }
  }

  if (/^[fF]{8}-?[fF]{4}-?[fF]{4}-?[fF]{4}-?[fF]{12}$/i.test(trimmed)) {
    return {
      isValid: true,
      version: 'Max (all ones)',
      variant: 'N/A',
      error: null,
      formatted: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    }
  }

  const hyphenMatch = trimmed.match(
    /^([0-9a-fA-F]{8})-([0-9a-fA-F]{4})-([0-9a-fA-F]{4})-([0-9a-fA-F]{4})-([0-9a-fA-F]{12})$/,
  )
  const noHyphenMatch = trimmed.match(
    /^([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{12})$/,
  )

  const match = hyphenMatch || noHyphenMatch
  if (!match) {
    return {
      isValid: false,
      version: null,
      variant: null,
      error: 'Invalid UUID format. Expected 32 hexadecimal characters (with or without hyphens).',
      formatted: null,
    }
  }

  const p1 = match[1].toLowerCase()
  const p2 = match[2].toLowerCase()
  const p3 = match[3].toLowerCase()
  const p4 = match[4].toLowerCase()
  const p5 = match[5].toLowerCase()
  const formatted = `${p1}-${p2}-${p3}-${p4}-${p5}`

  const verChar = p3[0]
  const versionNum = parseInt(verChar, 16)
  let versionDesc: string
  switch (versionNum) {
    case 1:
      versionDesc = 'Version 1 (date-time & MAC address)'
      break
    case 2:
      versionDesc = 'Version 2 (DCE Security)'
      break
    case 3:
      versionDesc = 'Version 3 (MD5 hash namespace)'
      break
    case 4:
      versionDesc = 'Version 4 (random)'
      break
    case 5:
      versionDesc = 'Version 5 (SHA-1 hash namespace)'
      break
    case 6:
      versionDesc = 'Version 6 (reordered time)'
      break
    case 7:
      versionDesc = 'Version 7 (Unix Epoch time)'
      break
    case 8:
      versionDesc = 'Version 8 (custom / experimental)'
      break
    default:
      versionDesc = `Unknown version (${verChar})`
  }

  const varNibble = parseInt(p4[0], 16)
  let variantDesc: string
  if ((varNibble & 0x8) === 0) {
    variantDesc = 'NCS backward compatibility'
  } else if ((varNibble & 0xc) === 0x8) {
    variantDesc = 'RFC 4122 / DCE 1.1'
  } else if ((varNibble & 0xe) === 0xc) {
    variantDesc = 'Microsoft GUID'
  } else {
    variantDesc = 'Reserved for future definition'
  }

  return {
    isValid: true,
    version: versionDesc,
    variant: variantDesc,
    error: null,
    formatted,
  }
}
