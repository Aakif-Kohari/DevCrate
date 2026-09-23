import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UuidGenerator from './index'
import { generateV4UUID, validateUUID } from './utils'

const V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('UUID Helper Functions', () => {
  it('generateV4UUID produces valid v4 UUIDs matching RFC 4122', () => {
    for (let i = 0; i < 20; i++) {
      const uuid = generateV4UUID()
      expect(uuid).toMatch(V4_REGEX)
    }
  })

  it('generateV4UUID falls back to crypto.getRandomValues when crypto.randomUUID is absent', () => {
    const originalRandomUUID = crypto.randomUUID
    // @ts-expect-error - simulating environment without randomUUID
    crypto.randomUUID = undefined
    try {
      const uuid = generateV4UUID()
      expect(uuid).toMatch(V4_REGEX)
    } finally {
      crypto.randomUUID = originalRandomUUID
    }
  })

  it('validateUUID correctly identifies versions and formats', () => {
    // Valid v4
    const v4 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    const res4 = validateUUID(v4)
    expect(res4.isValid).toBe(true)
    expect(res4.version).toContain('Version 4')
    expect(res4.variant).toBe('RFC 4122 / DCE 1.1')
    expect(res4.formatted).toBe(v4)

    // Valid v1
    const v1 = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    const res1 = validateUUID(v1)
    expect(res1.isValid).toBe(true)
    expect(res1.version).toContain('Version 1')

    // Valid unhyphenated UUID
    const unhyphenated = 'f47ac10b58cc4372a5670e02b2c3d479'
    const resUnhyphenated = validateUUID(unhyphenated)
    expect(resUnhyphenated.isValid).toBe(true)
    expect(resUnhyphenated.formatted).toBe(v4)

    // Nil UUID
    const nil = '00000000-0000-0000-0000-000000000000'
    const resNil = validateUUID(nil)
    expect(resNil.isValid).toBe(true)
    expect(resNil.version).toContain('Nil')

    // Braced GUID format
    const braced = '{f47ac10b-58cc-4372-a567-0e02b2c3d479}'
    const resBraced = validateUUID(braced)
    expect(resBraced.isValid).toBe(true)
    expect(resBraced.formatted).toBe(v4)
    expect(resBraced.version).toContain('Version 4')

    // URN format (lower, upper, mixed)
    const urn = 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479'
    const resUrn = validateUUID(urn)
    expect(resUrn.isValid).toBe(true)
    expect(resUrn.formatted).toBe(v4)

    const urnUpper = 'URN:UUID:f47ac10b-58cc-4372-a567-0e02b2c3d479'
    const resUrnUpper = validateUUID(urnUpper)
    expect(resUrnUpper.isValid).toBe(true)
    expect(resUrnUpper.formatted).toBe(v4)

    // Max UUID
    const max = 'ffffffff-ffff-ffff-ffff-ffffffffffff'
    const resMax = validateUUID(max)
    expect(resMax.isValid).toBe(true)
    expect(resMax.version).toContain('Max')

    // Invalid format
    const invalid = 'not-a-real-uuid'
    const resInvalid = validateUUID(invalid)
    expect(resInvalid.isValid).toBe(false)
    expect(resInvalid.error).toBeTruthy()

    // Empty input
    const resEmpty = validateUUID('')
    expect(resEmpty.isValid).toBe(false)
    expect(resEmpty.error).toBeNull()
  })
})

describe('UuidGenerator Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('renders and generates UUIDs matching v4 pattern and requested count', () => {
    render(<UuidGenerator />)

    // Default renders 1 UUID
    const countInput = screen.getByLabelText(/quantity/i) as HTMLInputElement
    expect(countInput.value).toBe('1')

    const generateBtn = screen.getByRole('button', { name: /generate/i })
    fireEvent.change(countInput, { target: { value: '' } })
    expect(countInput.value).toBe('')

    fireEvent.change(countInput, { target: { value: '5' } })
    fireEvent.click(generateBtn)

    // Should now show 5 UUIDs
    const listLabel = screen.getByText(/generated uuids \(5\)/i)
    expect(listLabel).toBeTruthy()

    const copyButtons = screen.getAllByRole('button', { name: /copy uuid \d+/i })
    expect(copyButtons).toHaveLength(5)
  })

  it('supports uppercase and hyphen-removal options', () => {
    render(<UuidGenerator />)

    const uppercaseCheckbox = screen.getByLabelText(/uppercase/i) as HTMLInputElement
    const hyphensCheckbox = screen.getByLabelText(/remove hyphens/i) as HTMLInputElement

    fireEvent.click(uppercaseCheckbox)
    expect(uppercaseCheckbox.checked).toBe(true)

    // Check that generated items are uppercase
    const listContainer = screen.getByLabelText(/generated uuids/i)
    const textContent = listContainer.textContent || ''
    expect(textContent).toMatch(/[A-F0-9]/)
    expect(textContent).not.toMatch(/[a-f]/)

    // Remove hyphens
    fireEvent.click(hyphensCheckbox)
    expect(hyphensCheckbox.checked).toBe(true)
    const textContentNoHyphen = listContainer.textContent || ''
    // Each UUID without hyphens is 32 chars
    expect(textContentNoHyphen.replace(/[^A-F0-9]/g, '').length).toBeGreaterThanOrEqual(32)
  })

  it('allows copying a single UUID and copying all UUIDs', async () => {
    render(<UuidGenerator />)

    const copyAllBtn = screen.getByRole('button', { name: /copy all/i })
    fireEvent.click(copyAllBtn)
    expect(navigator.clipboard.writeText).toHaveBeenCalled()

    const copyOneBtn = screen.getByRole('button', { name: /copy uuid 1/i })
    fireEvent.click(copyOneBtn)
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
  })

  it('displays failure feedback when copying fails', async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('Permission denied'))
    render(<UuidGenerator />)

    const copyAllBtn = screen.getByRole('button', { name: /copy all/i })
    fireEvent.click(copyAllBtn)

    expect(await screen.findByText(/failed to copy/i)).toBeTruthy()
  })

  it('validates a valid UUID and displays version information', () => {
    render(<UuidGenerator />)

    const validatorInput = screen.getByLabelText(/paste uuid/i)
    fireEvent.change(validatorInput, { target: { value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' } })

    expect(screen.getByText(/valid uuid/i)).toBeTruthy()
    expect(screen.getByText(/version 4 \(random\)/i)).toBeTruthy()
    expect(screen.getByText(/rfc 4122/i)).toBeTruthy()
  })

  it('displays an error message for invalid UUID input and empty state when cleared', () => {
    render(<UuidGenerator />)

    const validatorInput = screen.getByLabelText(/paste uuid/i)

    // Invalid input
    fireEvent.change(validatorInput, { target: { value: 'invalid-uuid-string' } })
    const statusBox = screen.getByRole('status')
    expect(statusBox.textContent).toMatch(/invalid uuid/i)
    expect(screen.getByText(/expected 32 hexadecimal characters/i)).toBeTruthy()

    // Empty input
    fireEvent.change(validatorInput, { target: { value: '' } })
    expect(screen.getByText(/paste a uuid above to check its validity/i)).toBeTruthy()
  })
})
