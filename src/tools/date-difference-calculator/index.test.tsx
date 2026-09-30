import { describe, expect, it } from 'vitest'
import { dateDifference } from './index'

describe('dateDifference', () => {
  it('handles leap-day range', () => {
    expect(dateDifference('2024-02-28', '2024-03-01')).toMatchObject({ totalDays: 2 })
  })
  it('returns zero for the same date', () => {
    expect(dateDifference('2024-03-01', '2024-03-01')).toMatchObject({ totalDays: 0 })
  })
  it('can include the end date', () => {
    expect(dateDifference('2024-02-28', '2024-03-01', true)).toMatchObject({ totalDays: 3 })
  })
  it('counts weekdays only', () => {
    expect(dateDifference('2024-03-01', '2024-03-04', false, true)).toMatchObject({ totalDays: 1 })
  })
  it('handles reversed dates explicitly', () => {
    expect(dateDifference('2024-03-01', '2024-02-28')).toMatchObject({ reversed: true, totalDays: 2 })
  })
  it('rejects invalid dates', () => {
    expect(dateDifference('2024-02-31', '2024-03-01')).toBeNull()
  })
})
