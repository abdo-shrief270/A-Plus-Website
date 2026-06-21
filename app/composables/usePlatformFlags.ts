import { settingsService } from '@/services/api/settings.service'

interface PlatformFlags {
  payments_enabled: boolean
  ai_explanations_enabled: boolean
  loaded: boolean
}

/**
 * Server-driven feature flags (from /v2/settings), fetched once per session
 * and shared via Nuxt state so any component can gate UI on them.
 */
export function usePlatformFlags() {
  const flags = useState<PlatformFlags>('aplus-platform-flags', () => ({
    payments_enabled: false,
    ai_explanations_enabled: false,
    loaded: false
  }))

  async function ensureLoaded() {
    if (flags.value.loaded) return
    try {
      const res = await settingsService.getSettings()
      const data = res.data?.data ?? {}
      flags.value = {
        payments_enabled: Boolean(data.payments_enabled),
        ai_explanations_enabled: Boolean(data.ai_explanations_enabled),
        loaded: true
      }
    } catch {
      flags.value.loaded = true
    }
  }

  return { flags, ensureLoaded }
}
