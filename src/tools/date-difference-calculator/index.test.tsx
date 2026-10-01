import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DateDifferenceCalculator, { dateDifference } from './index'

describe('dateDifference', () => {
  it('handles leap-day range', () => {
    expect(dateDifference('2024-02-28', '2024-03-01')).toMatchObject({
      totalDays: 2,
    })
  })

  it('returns zero for the same date', () => {
    expect(dateDifference('2024-03-01', '2024-03-01')).toMatchObject({
      totalDays: 0,
    })
  })

  it('can include the end date', () => {
    expect(dateDifference('2024-02-28', '2024-03-01', true)).toMatchObject({
      totalDays: 3,
      years: 0,
      months: 0,
      days: 3,
    })
  })

  it('counts weekdays only', () => {
    expect(dateDifference('2024-03-01', '2024-03-04', false, true)).toMatchObject({
      totalDays: 1,
    })
  })

  it('handles reversed dates explicitly', () => {
    expect(dateDifference('2024-03-01', '2024-02-28')).toMatchObject({
      reversed: true,
      totalDays: 2,
    })
  })

  it('keeps month decomposition anchored to the original day', () => {
    expect(dateDifference('2023-01-31', '2024-01-30')).toMatchObject({
      years: 0,
      months: 11,
      days: 30,
    })
    expect(dateDifference('2023-01-31', '2024-01-31')).toMatchObject({
      years: 1,
      months: 0,
      days: 0,
    })
    expect(dateDifference('2024-01-31', '2024-02-29')).toMatchObject({
      years: 0,
      months: 1,
      days: 0,
    })
  })

  it('lets an included end date carry across an annual boundary', () => {
    expect(dateDifference('2023-01-31', '2024-01-30', true)).toMatchObject({
      years: 1,
      months: 0,
      days: 0,
    })
  })

  it('forwards UI options and renders reversed-date feedback', () => {
    render(<DateDifferenceCalculator />)

    fireEvent.change(screen.getByLabelText('Start date'), {
      target: { value: '2024-03-04' },
    })
    fireEvent.change(screen.getByLabelText('End date'), {
      target: { value: '2024-03-01' },
    })
    fireEvent.click(screen.getByLabelText('Include end date'))
    fireEvent.click(screen.getByLabelText('Business days only (Mon–Fri)'))

    expect(
      screen.getByText(/dates were swapped so the earlier date is calculated first/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Total: 2 days/i)).toBeInTheDocument()
  })

  it('rejects invalid dates', () => {
    expect(dateDifference('2024-02-31', '2024-03-01')).toBeNull()
  })
})
