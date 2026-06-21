/**
 * Central registry of in-memory API caches. Each useApi instance registers
 * its own purge function here, so logout (or any auth/scope change) can
 * call `purgeAllApiCaches()` to drop every cached response in one call.
 *
 * Caches are intentionally kept in memory — never localStorage — so that
 * (a) per-user data cannot leak across sessions on the same device, and
 * (b) cache size is bounded by page lifetime, not browser quota.
 */

type Purgeable = () => void

const caches = new Set<Purgeable>()

export function registerApiCache(purge: Purgeable) {
  caches.add(purge)
  return () => caches.delete(purge)
}

export function purgeAllApiCaches() {
  caches.forEach((purge) => {
    try {
      purge()
    } catch {
      // swallow — never let one bad cache block logout
    }
  })
}
