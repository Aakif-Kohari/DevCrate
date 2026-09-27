import { describe, expect, fireEvent, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CsvJsonConverter from './index'
import { csvToJson, jsonToCsv, parseCsv } from './parser'

describe('CsvJsonConverter', () => {
  it('parses quoted commas, escaped quotes, and newlines inside quotes', () => {
    const rows = parseCsv('name,note\nAlice,"hello, ""world"""\nBob,"line 1\nline 2"', ',')

    expect(rows).toEqual([
      ['name', 'note'],
      ['Alice', 'hello, "world"'],
      ['Bob', 'line 1\nline 2'],
    ])
  })

  it('converts CSV with a header into objects and keeps cells as strings', () => {
    expect(
      csvToJson('id,name\n001,Alice\n002,Bob', {
        delimiter: ',',
        firstRowHeader: true,
      }),
    ).toEqual([
      { id: '001', name: 'Alice' },
      { id: '002', name: 'Bob' },
    ])
  })

  it('round-trips flat JSON values through CSV text', () => {
    const csv = jsonToCsv(
      '[{"name":"Alice","note":"hello, world"},{"name":"Bob","note":"line 1\\nline 2"}]',
      ',',
    )
    expect(csvToJson(csv, { delimiter: ',', firstRowHeader: true })).toEqual([
      { name: 'Alice', note: 'hello, world' },
      { name: 'Bob', note: 'line 1\nline 2' },
    ])
  })

  it('fills missing JSON keys with empty CSV cells', () => {
    expect(jsonToCsv('[{"name":"Alice","city":"Bogota"},{"name":"Bob"}]', ',')).toBe(
      'name,city\nAlice,Bogota\nBob,',
    )
  })

  it('shows a readable error for malformed CSV instead of crashing', () => {
    render(<CsvJsonConverter />)
    fireEvent.change(screen.getByLabelText('CSV input'), {
      target: { value: 'name,note\nAlice,"unterminated' },
    })
    expect(screen.getByText('Error')).toBeTruthy()
    expect(screen.getByText(/unterminated quoted csv field/i)).toBeTruthy()
  })

  it('supports JSON to CSV mode in the interface', () => {
    render(<CsvJsonConverter />)
    fireEvent.click(screen.getByRole('button', { name: 'JSON to CSV' }))
    fireEvent.change(screen.getByLabelText('JSON input'), {
      target: { value: '[{"a":"x,y","b":"z"}]' },
    })
    expect(screen.getByText('CSV output')).toBeTruthy()
    expect(screen.getByText('a,b\n"x,y",z')).toBeTruthy()
  })
})
