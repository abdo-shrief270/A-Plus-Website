/**
 * Format a number with Arabic-Egyptian digits and thousands separators.
 * `null`/`undefined`/`NaN` collapse to `'0'` so callers can pipe API values
 * straight into the template without needing nullish-coalescing each time.
 */
export function formatNumber(value: number | string | null | undefined): string {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return '0'
  return new Intl.NumberFormat('ar-EG').format(n)
}
