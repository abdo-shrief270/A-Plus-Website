/**
 * Single source of truth for currency display across the app.
 * Change SAR / ر.س here once and everywhere updates.
 */

const CURRENCY_CODE = 'SAR'
const CURRENCY_SYMBOL = 'ر.س'

export const useCurrency = () => {
  /**
   * Format a number with Saudi-Arabic digits + the currency symbol.
   * formatPrice(199) → "199 ر.س"
   * formatPrice(0)   → "مجاني"
   * formatPrice(null) → "—"
   */
  const formatPrice = (value: number | string | null | undefined, fallbackFree = true): string => {
    if (value === null || value === undefined || value === '') return '—'
    const n = typeof value === 'string' ? Number(value) : value
    if (!Number.isFinite(n)) return '—'
    if (n <= 0 && fallbackFree) return 'مجاني'
    const formatted = new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(n)
    return `${formatted} ${CURRENCY_SYMBOL}`
  }

  return {
    code: CURRENCY_CODE,
    symbol: CURRENCY_SYMBOL,
    formatPrice
  }
}
