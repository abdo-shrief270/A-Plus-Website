/**
 * Format a number with Arabic-Egyptian digits and thousands separators.
 * `null`/`undefined`/`NaN`/invalid collapse to a formatted zero (`'٠'`) so
 * callers can pipe API values straight into the template, and the glyphs stay
 * consistent with real zeros (Arabic-Indic, not a Latin "0").
 */
export function formatNumber(value: number | string | null | undefined): string {
  const n = typeof value === 'number' ? value : Number(value)
  const safe = Number.isFinite(n) ? n : 0
  return new Intl.NumberFormat('ar-EG').format(safe)
}
