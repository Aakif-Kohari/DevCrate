export type Who = 'owner' | 'group' | 'other'
export type Perm = 'read' | 'write' | 'execute'
export type Special = 'setuid' | 'setgid' | 'sticky'

export interface Permissions {
  owner: Record<Perm, boolean>
  group: Record<Perm, boolean>
  other: Record<Perm, boolean>
  setuid: boolean
  setgid: boolean
  sticky: boolean
}

export const WHO: Who[] = ['owner', 'group', 'other']
export const PERMS: Perm[] = ['read', 'write', 'execute']

const PERM_BITS: Record<Perm, number> = { read: 4, write: 2, execute: 1 }
const SPECIAL_BITS: Record<Special, number> = { setuid: 4, setgid: 2, sticky: 1 }

export function emptyPermissions(): Permissions {
  const none = { read: false, write: false, execute: false }
  return {
    owner: { ...none },
    group: { ...none },
    other: { ...none },
    setuid: false,
    setgid: false,
    sticky: false,
  }
}

function digitFor(p: Record<Perm, boolean>): number {
  return PERMS.reduce((sum, perm) => sum + (p[perm] ? PERM_BITS[perm] : 0), 0)
}

/** Returns the octal form: 3 digits, or 4 when any special bit is set. */
export function toOctal(p: Permissions): string {
  const special = (['setuid', 'setgid', 'sticky'] as Special[]).reduce(
    (sum, s) => sum + (p[s] ? SPECIAL_BITS[s] : 0),
    0,
  )
  const base = `${digitFor(p.owner)}${digitFor(p.group)}${digitFor(p.other)}`
  return special ? `${special}${base}` : base
}

/** Returns the 9-character symbolic form, e.g. `rwxr-xr-x`, using s/S/t/T for special bits. */
export function toSymbolic(p: Permissions): string {
  const triple = (who: Who, special: boolean, specialChar: string): string => {
    const perm = p[who]
    const x = perm.execute
      ? special
        ? specialChar
        : 'x'
      : special
        ? specialChar.toUpperCase()
        : '-'
    return `${perm.read ? 'r' : '-'}${perm.write ? 'w' : '-'}${x}`
  }
  return (
    triple('owner', p.setuid, 's') + triple('group', p.setgid, 's') + triple('other', p.sticky, 't')
  )
}

/** Parses 3 or 4 octal digits into permissions, or returns null when the input is invalid. */
export function fromOctal(value: string): Permissions | null {
  if (!/^[0-7]{3,4}$/.test(value)) return null
  const digits = value.length === 4 ? value : `0${value}`
  const [s, o, g, t] = digits.split('').map(Number)
  const perms = emptyPermissions()
  const apply = (who: Who, digit: number) => {
    for (const perm of PERMS) perms[who][perm] = (digit & PERM_BITS[perm]) !== 0
  }
  apply('owner', o)
  apply('group', g)
  apply('other', t)
  perms.setuid = (s & SPECIAL_BITS.setuid) !== 0
  perms.setgid = (s & SPECIAL_BITS.setgid) !== 0
  perms.sticky = (s & SPECIAL_BITS.sticky) !== 0
  return perms
}
