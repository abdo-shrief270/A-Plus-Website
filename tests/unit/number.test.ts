import { describe, it, expect } from 'vitest'
import { formatNumber } from '@/utils/number'

describe('formatNumber', () => {
  it('formats integers with Arabic-Egyptian digits + separators', () => {
    // ٱ١٬٢٣٤ — Arabic-Indic digits with a thousands separator.
    const out = formatNumber(1234)
    expect(out).toMatch(/[٠-٩]/) // contains Arabic-Indic digits
    expect(out).not.toBe('1234')
  })

  it('collapses null/undefined/NaN/invalid to a formatted zero (٠)', () => {
    expect(formatNumber(null)).toBe('٠')
    expect(formatNumber(undefined)).toBe('٠')
    expect(formatNumber(Number.NaN)).toBe('٠')
    expect(formatNumber('not-a-number')).toBe('٠')
    // consistent with a real zero
    expect(formatNumber(0)).toBe('٠')
  })

  it('coerces numeric strings', () => {
    expect(formatNumber('0')).toBe('٠')
    expect(formatNumber('42')).toBe('٤٢')
  })
})
