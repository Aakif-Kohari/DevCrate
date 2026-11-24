export interface ParsedQuery {
  pairs: [string, string][]
  json: Record<string, string | string[]>
}

/**
 * Parses a full URL, `?a=1&b=2` or `a=1&b=2` into decoded key/value pairs.
 * Throws an Error with a readable message when the input looks like a URL but is invalid.
 */
export function parseQuery(input: string): ParsedQuery {
  const value = input.trim()
  if (!value) throw new Error('Enter a URL or query string.')

  let query: string
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value) || value.startsWith('//')) {
    let url: URL
    try {
      url = new URL(value.startsWith('//') ? `https:${value}` : value)
    } catch {
      throw new Error('That does not look like a valid URL.')
    }
    query = url.search
  } else {
    const hashAt = value.indexOf('#')
    const withoutHash = hashAt === -1 ? value : value.slice(0, hashAt)
    const questionAt = withoutHash.indexOf('?')
    const looksLikePath = questionAt > 0 && !withoutHash.slice(0, questionAt).includes('=')
    query = looksLikePath ? withoutHash.slice(questionAt) : withoutHash
  }

  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query)
  const pairs = [...params.entries()] as [string, string][]
  const json: Record<string, string | string[]> = {}
  for (const [key, val] of pairs) {
    const existing = json[key]
    if (existing === undefined) json[key] = val
    else if (Array.isArray(existing)) existing.push(val)
    else json[key] = [existing, val]
  }
  return { pairs, json }
}
