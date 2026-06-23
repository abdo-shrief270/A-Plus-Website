/**
 * Generate a strong password that satisfies the policy enforced everywhere
 * (8+ chars with at least one lowercase, uppercase, digit, and symbol).
 * Excludes ambiguous characters (0/O/1/l/I) for readability.
 */
export function generateStrongPassword(length = 14): string {
  const lower = 'abcdefghijkmnpqrstuvwxyz'
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const digits = '23456789'
  const symbols = '!@#$%^&*()-_=+'
  const all = lower + upper + digits + symbols

  const pick = (set: string) => set[Math.floor(Math.random() * set.length)]
  const chars = [pick(lower), pick(upper), pick(digits), pick(symbols)]

  const target = Math.max(8, length)
  while (chars.length < target) {
    chars.push(pick(all))
  }

  // Fisher–Yates shuffle so the guaranteed chars aren't always at the front.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.join('')
}
