import { useMemo, useState } from 'react'

type StatusClass = '1xx' | '2xx' | '3xx' | '4xx' | '5xx'
type StatusFilter = 'all' | StatusClass

interface StatusCode {
  code: number
  name: string
  description: string
}

const statusCodes: StatusCode[] = [
  {
    code: 100,
    name: 'Continue',
    description: 'The request headers were received; send the request body.',
  },
  {
    code: 101,
    name: 'Switching Protocols',
    description: 'The server is switching to the protocol requested by the client.',
  },
  {
    code: 102,
    name: 'Processing',
    description: 'The server is still processing the request (WebDAV).',
  },
  {
    code: 103,
    name: 'Early Hints',
    description: 'The server is sending preliminary headers before the final response.',
  },
  { code: 200, name: 'OK', description: 'The request succeeded.' },
  { code: 201, name: 'Created', description: 'The request succeeded and created a resource.' },
  {
    code: 202,
    name: 'Accepted',
    description: 'The request was accepted for processing, but is not complete.',
  },
  {
    code: 203,
    name: 'Non-Authoritative Information',
    description: 'The response was modified by a transforming proxy.',
  },
  {
    code: 204,
    name: 'No Content',
    description: 'The request succeeded and there is no response body.',
  },
  {
    code: 205,
    name: 'Reset Content',
    description: 'The client should reset the document view that sent the request.',
  },
  {
    code: 206,
    name: 'Partial Content',
    description: 'The server is returning the requested range of a resource.',
  },
  {
    code: 207,
    name: 'Multi-Status',
    description: 'The response contains status information for multiple resources (WebDAV).',
  },
  {
    code: 208,
    name: 'Already Reported',
    description: 'A WebDAV binding was already reported in this response.',
  },
  {
    code: 226,
    name: 'IM Used',
    description: 'The response represents the result of an instance manipulation.',
  },
  {
    code: 300,
    name: 'Multiple Choices',
    description: 'The request has multiple possible representations.',
  },
  { code: 301, name: 'Moved Permanently', description: 'The resource has a new permanent URL.' },
  {
    code: 302,
    name: 'Found',
    description: 'The resource is temporarily available at another URL.',
  },
  {
    code: 303,
    name: 'See Other',
    description: 'Retrieve the response at another URL, usually with GET.',
  },
  { code: 304, name: 'Not Modified', description: 'The cached representation is still valid.' },
  {
    code: 305,
    name: 'Use Proxy',
    description: 'Unused; formerly indicated that the resource must be accessed through a proxy.',
  },
  { code: 306, name: 'Unused', description: 'Reserved and unused status code.' },
  {
    code: 307,
    name: 'Temporary Redirect',
    description: 'Retry the request at another URL without changing its method.',
  },
  {
    code: 308,
    name: 'Permanent Redirect',
    description: 'The resource has moved permanently; keep the request method.',
  },
  {
    code: 400,
    name: 'Bad Request',
    description: 'The server cannot process the request because it is invalid.',
  },
  {
    code: 401,
    name: 'Unauthorized',
    description: 'Valid authentication credentials are required.',
  },
  {
    code: 402,
    name: 'Payment Required',
    description: 'Reserved for future use; some services use it for payment requirements.',
  },
  {
    code: 403,
    name: 'Forbidden',
    description: 'The server understood the request but refuses to authorize it.',
  },
  { code: 404, name: 'Not Found', description: 'The requested resource could not be found.' },
  {
    code: 405,
    name: 'Method Not Allowed',
    description: 'The method is known but not supported for this resource.',
  },
  {
    code: 406,
    name: 'Not Acceptable',
    description: 'No available representation matches the request preferences.',
  },
  {
    code: 407,
    name: 'Proxy Authentication Required',
    description: 'Authentication with the proxy is required.',
  },
  {
    code: 408,
    name: 'Request Timeout',
    description: 'The server timed out waiting for the request.',
  },
  {
    code: 409,
    name: 'Conflict',
    description: 'The request conflicts with the current state of the resource.',
  },
  {
    code: 410,
    name: 'Gone',
    description: 'The resource is no longer available and this is likely permanent.',
  },
  {
    code: 411,
    name: 'Length Required',
    description: 'The request must include a valid Content-Length header.',
  },
  {
    code: 412,
    name: 'Precondition Failed',
    description: 'A request precondition evaluated to false.',
  },
  {
    code: 413,
    name: 'Content Too Large',
    description: 'The request content exceeds the server limit.',
  },
  {
    code: 414,
    name: 'URI Too Long',
    description: 'The request URI is longer than the server can process.',
  },
  {
    code: 415,
    name: 'Unsupported Media Type',
    description: 'The request content format is not supported.',
  },
  {
    code: 416,
    name: 'Range Not Satisfiable',
    description: 'The requested range cannot be provided.',
  },
  {
    code: 417,
    name: 'Expectation Failed',
    description: 'The server cannot meet the request Expect header.',
  },
  {
    code: 418,
    name: 'Unused (I’m a teapot)',
    description: 'An unused status code, commonly known as “I’m a teapot”.',
  },
  {
    code: 421,
    name: 'Misdirected Request',
    description: 'The request was sent to a server unable to produce a response.',
  },
  {
    code: 422,
    name: 'Unprocessable Content',
    description: 'The request is well-formed but its instructions cannot be processed.',
  },
  { code: 423, name: 'Locked', description: 'The resource is locked (WebDAV).' },
  {
    code: 424,
    name: 'Failed Dependency',
    description: 'The request failed because another request failed (WebDAV).',
  },
  {
    code: 425,
    name: 'Too Early',
    description: 'The server is unwilling to risk processing a request that might be replayed.',
  },
  {
    code: 426,
    name: 'Upgrade Required',
    description: 'The client must switch to a different protocol.',
  },
  {
    code: 428,
    name: 'Precondition Required',
    description: 'The server requires a conditional request.',
  },
  {
    code: 429,
    name: 'Too Many Requests',
    description: 'The client sent too many requests in a given time.',
  },
  {
    code: 431,
    name: 'Request Header Fields Too Large',
    description: 'The server refuses the request because its headers are too large.',
  },
  {
    code: 451,
    name: 'Unavailable For Legal Reasons',
    description: 'Access to the resource is denied for legal reasons.',
  },
  {
    code: 500,
    name: 'Internal Server Error',
    description: 'The server encountered an unexpected condition.',
  },
  {
    code: 501,
    name: 'Not Implemented',
    description: 'The server does not support the functionality required.',
  },
  {
    code: 502,
    name: 'Bad Gateway',
    description: 'A gateway received an invalid response from an upstream server.',
  },
  {
    code: 503,
    name: 'Service Unavailable',
    description: 'The server is temporarily unable to handle the request.',
  },
  {
    code: 504,
    name: 'Gateway Timeout',
    description: 'A gateway did not receive a timely upstream response.',
  },
  {
    code: 505,
    name: 'HTTP Version Not Supported',
    description: 'The server does not support the HTTP version used.',
  },
  {
    code: 506,
    name: 'Variant Also Negotiates',
    description: 'A content negotiation configuration error occurred.',
  },
  {
    code: 507,
    name: 'Insufficient Storage',
    description: 'The server cannot store the representation (WebDAV).',
  },
  {
    code: 508,
    name: 'Loop Detected',
    description: 'The server detected an infinite loop while processing the request (WebDAV).',
  },
  {
    code: 510,
    name: 'Not Extended',
    description: 'Obsoleted status code; the request extension is not supported.',
  },
  {
    code: 511,
    name: 'Network Authentication Required',
    description: 'The client must authenticate to gain network access.',
  },
]

const filters: StatusFilter[] = ['all', '1xx', '2xx', '3xx', '4xx', '5xx']

function getStatusClass(code: number): StatusClass {
  return `${Math.floor(code / 100)}xx` as StatusClass
}

export default function HttpStatusCodes() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')

  const visibleCodes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return statusCodes.filter((status) => {
      const matchesFilter = filter === 'all' || getStatusClass(status.code) === filter
      const matchesQuery =
        !normalizedQuery ||
        `${status.code} ${status.name} ${status.description}`
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesFilter && matchesQuery
    })
  }, [filter, query])

  return (
    <section className="space-y-5" aria-label="HTTP status code reference">
      <div>
        <label htmlFor="status-code-search" className="mb-1 block text-sm font-medium">
          Search status codes
        </label>
        <input
          id="status-code-search"
          type="search"
          className="focus-ring w-full rounded-lg border border-border bg-card p-3 text-card-foreground"
          placeholder="Search by code, name, or description"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status class">
        {filters.map((statusFilter) => (
          <button
            key={statusFilter}
            type="button"
            aria-pressed={filter === statusFilter}
            onClick={() => setFilter(statusFilter)}
            className={`focus-ring rounded-full border px-3 py-1.5 text-sm ${
              filter === statusFilter
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-card-foreground hover:bg-muted'
            }`}
          >
            {statusFilter === 'all' ? 'All' : statusFilter}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {visibleCodes.length} {visibleCodes.length === 1 ? 'status code' : 'status codes'}
      </p>

      {visibleCodes.length === 0 ? (
        <p className="rounded-lg border border-border bg-muted p-4 text-sm" role="status">
          No status codes match your search. Try another code, name, or description.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {visibleCodes.map(({ code, name, description }) => (
            <li key={code}>
              <article className="h-full rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-lg font-semibold text-card-foreground">
                    {code}
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {getStatusClass(code)}
                  </span>
                </div>
                <h2 className="font-medium text-card-foreground">{name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
