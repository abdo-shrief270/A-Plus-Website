import { ref, type Ref } from 'vue'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { getApi } from '@/services/api/instance'
import { showToast } from '@/utils/helpers/toast.helper'
import { registerApiCache } from '@/utils/apiCache'
import type { Meta } from '@/types/api'

const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

interface CacheEntry<T> {
  timestamp: number
  records: T[]
  meta: Meta
  summary: unknown
}

const DEFAULT_META: Meta = {
  current_page: 1,
  total: 0,
  last_page: 1,
  per_page: 15
}

function stableKey(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value !== 'object') return String(value)
  if (Array.isArray(value)) return `[${value.map(stableKey).join(',')}]`
  const obj = value as Record<string, unknown>
  const sorted = Object.keys(obj).sort()
  return `{${sorted.map(k => `${k}:${stableKey(obj[k])}`).join(',')}}`
}

/**
 * Generic CRUD helper around the singleton axios instance.
 *
 * Conventions:
 *  - Caches are in-memory only (see utils/apiCache.ts) and key-stable
 *    regardless of param order.
 *  - Every request supports cancellation via a per-instance AbortController;
 *    calling `cancel()` aborts in-flight requests started after the previous
 *    cancel.
 *  - All mutating methods (`create`, `update`, `remove`, `changeStatus`)
 *    invalidate the cache rather than trying to surgically patch it; that
 *    avoids subtle drift between cached and server state.
 */
export class useApi<T = unknown> {
  baseUrl: string
  loading: Ref<boolean>
  creating: Ref<boolean>
  editing: Ref<boolean>
  deleting: Ref<boolean>
  error: Ref<unknown>
  records: Ref<T[]>
  record: Ref<T | Record<string, never>>
  meta: Ref<Meta>
  summary: Ref<unknown>
  axiosInstance: AxiosInstance

  private cache = new Map<string, CacheEntry<T>>()
  private controller: AbortController | null = null
  private unregister: () => void

  constructor(resource: string, api_version: string = 'v3') {
    const config = useRuntimeConfig()
    const base = config.public.apiBaseUrl
    this.baseUrl = api_version ? `/${api_version}/${resource}` : `/${resource}`
    void base // baseURL is set on the axios instance; baseUrl here is the path

    this.loading = ref(false)
    this.creating = ref(false)
    this.editing = ref(false)
    this.deleting = ref(false)
    this.error = ref(null)
    this.records = ref<T[]>([]) as Ref<T[]>
    this.record = ref<T | Record<string, never>>({}) as Ref<T | Record<string, never>>
    this.meta = ref<Meta>({ ...DEFAULT_META })
    this.summary = ref<unknown>({})
    this.axiosInstance = getApi()
    this.unregister = registerApiCache(() => this.clearCache())
  }

  /** Cancel any in-flight request started since the previous cancel. */
  cancel() {
    this.controller?.abort()
    this.controller = null
  }

  /** Drop every cached entry for this resource. */
  clearCache() {
    this.cache.clear()
  }

  /** Releases the cache registration. Call this from `onScopeDispose` if needed. */
  dispose() {
    this.cancel()
    this.clearCache()
    this.unregister()
  }

  private cacheKey(path: string, params: unknown) {
    return `${path}?${stableKey(params)}`
  }

  private nextSignal(): AbortSignal {
    this.controller = new AbortController()
    return this.controller.signal
  }

  private buildConfig(params?: unknown, extra?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      params: params ?? undefined,
      signal: this.nextSignal(),
      ...extra
    }
  }

  private extractList(data: unknown): { records: T[], meta: Meta, summary: unknown, raw: unknown } {
    const wrapper = (data as { data?: unknown })?.data ?? data
    const records = (wrapper as { records?: T[] })?.records
      ?? (Array.isArray(wrapper) ? wrapper as T[] : [])
    const meta = (wrapper as { meta?: Meta })?.meta ?? DEFAULT_META
    const summary = (wrapper as { summary?: unknown })?.summary ?? {}
    return { records, meta, summary, raw: wrapper }
  }

  async get(params?: unknown, path: string = ''): Promise<unknown> {
    const url = path ? `${this.baseUrl}/${path}` : this.baseUrl
    this.loading.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.get(url, this.buildConfig(params))
      const { records, meta, summary, raw } = this.extractList(data)
      this.records.value = records
      this.meta.value = { ...DEFAULT_META, ...meta }
      this.summary.value = summary
      return raw
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.loading.value = false
    }
  }

  async getCached(params?: unknown, path: string = ''): Promise<unknown> {
    const key = this.cacheKey(path, params)
    const entry = this.cache.get(key)

    if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
      this.records.value = entry.records
      this.meta.value = entry.meta
      this.summary.value = entry.summary
      return { records: entry.records, meta: entry.meta, summary: entry.summary }
    }

    const fresh = await this.get(params, path)
    this.cache.set(key, {
      timestamp: Date.now(),
      records: [...this.records.value],
      meta: { ...this.meta.value },
      summary: this.summary.value
    })
    return fresh
  }

  async show(id: number | string, params?: unknown): Promise<unknown> {
    this.loading.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.get(`${this.baseUrl}/${id}`, this.buildConfig(params))
      return (data as { data?: unknown })?.data ?? data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.loading.value = false
    }
  }

  async create(payload: unknown): Promise<unknown> {
    this.creating.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.post(`${this.baseUrl}/create`, payload, this.buildConfig())
      this.error.value = { success: true }
      const message = (data as { message?: string })?.message
      if (message) showToast('نجح', message, 'success')

      const created = (data as { data?: T })?.data
      if (created) this.records.value = [created, ...this.records.value]
      this.clearCache()
      return data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.creating.value = false
    }
  }

  async update(id: number | string, payload: unknown): Promise<unknown> {
    this.editing.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.post(`${this.baseUrl}/update/${id}`, payload, this.buildConfig())
      this.error.value = { success: true }
      const message = (data as { message?: string })?.message
      if (message) showToast('نجح', message, 'success')

      const updated = (data as { data?: Partial<T> })?.data
      if (updated) {
        const idx = this.records.value.findIndex(r => (r as { id?: number | string })?.id === id)
        if (idx !== -1) {
          this.records.value[idx] = { ...this.records.value[idx] as object, ...updated as object } as T
        }
      }
      this.clearCache()
      return data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.editing.value = false
    }
  }

  async changeStatus(id: number | string, payload: unknown): Promise<unknown> {
    this.editing.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.post(`${this.baseUrl}/change-status/${id}`, payload, this.buildConfig())
      this.error.value = { success: true }
      const message = (data as { message?: string })?.message
      if (message) showToast('نجح', message, 'success')
      this.clearCache()
      return data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.editing.value = false
    }
  }

  async remove(id: number | string): Promise<unknown> {
    this.deleting.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.post(`${this.baseUrl}/delete/${id}`, undefined, this.buildConfig())
      this.error.value = { success: true }
      const message = (data as { message?: string })?.message
      if (message) showToast('نجح', message, 'success')
      this.records.value = this.records.value.filter(r => (r as { id?: number | string })?.id !== id)
      this.clearCache()
      return data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.deleting.value = false
    }
  }

  async post(endpoint: string, payload: unknown): Promise<unknown> {
    this.loading.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.post(`${this.baseUrl}/${endpoint}`, payload, this.buildConfig())
      return data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.loading.value = false
    }
  }
}
