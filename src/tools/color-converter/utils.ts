export interface Rgba {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
  a: number // 0-1
}

const NUM = '(-?\\d*\\.?\\d+)'
const SEP = '\\s*(?:,|\\s)\\s*'
const ALPHA = `(?:\\s*[,/]\\s*${NUM}(%)?)?`
const RGB_RE = new RegExp(
  `^rgba?\\(\\s*${NUM}(%)?${SEP}${NUM}(%)?${SEP}${NUM}(%)?${ALPHA}\\s*\\)$`,
  'i',
)
const HSL_RE = new RegExp(
  `^hsla?\\(\\s*${NUM}(?:deg)?${SEP}${NUM}%${SEP}${NUM}%${ALPHA}\\s*\\)$`,
  'i',
)

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

function parseAlpha(value: string | undefined, percent: string | undefined): number {
  if (value === undefined) return 1
  const n = parseFloat(value)
  return clamp(percent ? n / 100 : n, 0, 1)
}

function parseHex(input: string): Rgba | null {
  const match = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(input)
  if (!match) return null
  let hex = match[1]
  if (hex.length <= 4) hex = [...hex].map((c) => c + c).join('')
  const n = (i: number) => parseInt(hex.slice(i, i + 2), 16)
  return { r: n(0), g: n(2), b: n(4), a: hex.length === 8 ? n(6) / 255 : 1 }
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hue = ((h % 360) + 360) % 360
  const sat = clamp(s, 0, 100) / 100
  const light = clamp(l, 0, 100) / 100
  const k = (n: number) => (n + hue / 30) % 12
  const a = sat * Math.min(light, 1 - light)
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return { r: f(0) * 255, g: f(8) * 255, b: f(4) * 255 }
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === rn) h = ((gn - bn) / d) % 6
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: s * 100, l: l * 100 }
}

/** Parses HEX (3, 4, 6 or 8 digits), rgb()/rgba() or hsl()/hsla(). Returns null when invalid. */
export function parseColor(input: string): Rgba | null {
  const value = input.trim()
  if (!value) return null

  const hex = parseHex(value)
  if (hex) return hex

  const rgb = RGB_RE.exec(value)
  if (rgb) {
    const channel = (v: string, pct: string | undefined) =>
      clamp(pct ? (parseFloat(v) / 100) * 255 : parseFloat(v), 0, 255)
    return {
      r: Math.round(channel(rgb[1], rgb[2])),
      g: Math.round(channel(rgb[3], rgb[4])),
      b: Math.round(channel(rgb[5], rgb[6])),
      a: parseAlpha(rgb[7], rgb[8]),
    }
  }

  const hsl = HSL_RE.exec(value)
  if (hsl) {
    const { r, g, b } = hslToRgb(parseFloat(hsl[1]), parseFloat(hsl[2]), parseFloat(hsl[3]))
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a: parseAlpha(hsl[4], hsl[5]) }
  }

  return null
}

const trim = (n: number) => String(Math.round(n * 1000) / 1000)

export function formatHex({ r, g, b, a }: Rgba): string {
  const h = (n: number) => Math.round(n).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}${a < 1 ? h(a * 255) : ''}`
}

export function formatRgb({ r, g, b, a }: Rgba): string {
  return a < 1
    ? `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${trim(a)})`
    : `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

export function formatHsl({ r, g, b, a }: Rgba): string {
  const { h, s, l } = rgbToHsl(r, g, b)
  const body = `${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%`
  return a < 1 ? `hsla(${body}, ${trim(a)})` : `hsl(${body})`
}
