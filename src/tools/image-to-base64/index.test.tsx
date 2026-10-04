import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ImageToBase64 from './index'

class MockFileReader {
  result: string | ArrayBuffer | null = null
  onload: null | (() => void) = null
  onerror: null | (() => void) = null

  readAsDataURL(file: File) {
    this.result = `data:${file.type};base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB`
    this.onload?.()
  }
}

describe('ImageToBase64', () => {
  beforeEach(() => {
    vi.stubGlobal('FileReader', MockFileReader)
  })

  it('converts an image into a data URI and shows its preview', () => {
    render(<ImageToBase64 />)
    const input = screen.getByLabelText(/choose an image/i)
    const file = new File(['png'], 'pixel.png', { type: 'image/png' })

    fireEvent.change(input, { target: { files: [file] } })

    const output = screen.getByLabelText('Data URI') as HTMLTextAreaElement
    expect(output.value).toMatch(/^data:image\/png;base64,/)
    expect(screen.getByAltText('Preview of pixel.png')).toBeTruthy()
    expect(screen.getByText(/pixel\.png/)).toBeTruthy()
  })

  it('rejects a non-image file without reading it', () => {
    render(<ImageToBase64 />)
    const input = screen.getByLabelText(/choose an image/i)
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' })

    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByRole('alert').textContent).toMatch(/PNG, JPG, GIF, WebP, or SVG/i)
    expect(screen.queryByLabelText('Data URI')).toBeNull()
  })

  it('warns when an image is larger than 2 MB', () => {
    render(<ImageToBase64 />)
    const input = screen.getByLabelText(/choose an image/i)
    const file = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'large.webp', {
      type: 'image/webp',
    })

    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText(/file under 2 MB/i)).toBeTruthy()
  })
})
