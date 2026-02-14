import { ref } from 'vue'
import type { AxiosInstance } from 'axios'
import createAxiosInstance from '@/services/api/instance'
import { showToast } from '@/utils/helpers/toast.helper'

const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

interface Meta {
  current_page: number
  total: number
  last_page: number
  per_page: number
}

export class useApi<T = any> {
  baseUrl: string
  loading: Ref<boolean>
  creating: Ref<boolean>
  editing: Ref<boolean>
  deleting: Ref<boolean>
  error: Ref<any>
  records: Ref<T[]>
  record: Ref<T | {}>
  meta: Ref<Meta>
  summary: Ref<any>
  axiosInstance: AxiosInstance
  lastCacheParams: any

  constructor(resource: string, api_version: string = 'v3') {
    const config = useRuntimeConfig()
    this.baseUrl = `${config.public.apiBaseUrl || import.meta.env.VITE_API_BASE_URL}/${api_version}/${resource}`
    this.loading = ref(false)
    this.creating = ref(false)
    this.editing = ref(false)
    this.deleting = ref(false)
    this.error = ref(null)
    this.records = ref<T[]>([])
    this.record = ref<T | {}>({})
    this.meta = ref<Meta>({
      current_page: 1,
      total: 0,
      last_page: 1,
      per_page: 15
    })
    this.summary = ref({})
    this.axiosInstance = createAxiosInstance()
  }

  getCacheKey(params: any) {
    return `cache_${this.baseUrl}_${JSON.stringify(params)}`
  }

  async get(params?: any) {
    this.loading.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.get(this.baseUrl, { params })
      this.records.value = data?.data?.records || data?.data || []
      this.meta.value = data?.data?.meta || {}
      this.summary.value = data?.data?.summary || {}
      this.lastCacheParams = params
      return data?.data || []
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.loading.value = false
    }
  }

  async getCached(params?: any) {
    const cacheKey = this.getCacheKey(params)
    const cachedData = localStorage.getItem(cacheKey)

    if (cachedData) {
      const parsedCache = JSON.parse(cachedData)
      if (Date.now() - parsedCache.timestamp < CACHE_DURATION) {
        this.records.value = parsedCache.data.records || []
        this.meta.value = parsedCache.data.meta || {}
        return parsedCache.data
      } else {
        localStorage.removeItem(cacheKey)
      }
    }

    const freshData = await this.get(params)
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ timestamp: Date.now(), data: freshData })
    )
    return freshData
  }

  async show(id: number | string, params?: any) {
    this.loading.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.get(`${this.baseUrl}/${id}`, params)
      return data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.loading.value = false
    }
  }

  async create(payload: any, cacheParams?: any) {
    this.creating.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.post(`${this.baseUrl}/create`, payload)
      this.error.value = { success: true }
      showToast('نجح', data?.message, 'success')

      if (cacheParams) {
        const cacheKey = this.getCacheKey(cacheParams)
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          parsed.data.records.unshift(data.data)
          parsed.data.meta.total += 1
          localStorage.setItem(cacheKey, JSON.stringify(parsed))
        }
      }

      this.records.value.unshift(data.data)
      return data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.creating.value = false
    }
  }

  async update(id: number | string, payload: any, cacheParams?: any) {
    this.editing.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.post(`${this.baseUrl}/update/${id}`, payload)
      this.error.value = { success: true }
      showToast('نجح', data?.message, 'success')

      const updatedItem = data?.data
      const usedParams = cacheParams || this.lastCacheParams

      if (usedParams) {
        const cacheKey = this.getCacheKey(usedParams)
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          const index = parsed.data.records.findIndex((record: any) => record.id === id)
          if (index !== -1) {
            parsed.data.records[index] = { ...parsed.data.records[index], ...updatedItem }
            localStorage.setItem(cacheKey, JSON.stringify(parsed))
          }
        }
      }

      const index = this.records.value.findIndex((record: any) => (record as any).id === id)
      if (index !== -1) {
        this.records.value[index] = { ...this.records.value[index], ...updatedItem }
      }

      return data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.editing.value = false
    }
  }

  async changeStatus(id: number | string, payload: any) {
    this.editing.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.post(`${this.baseUrl}/change-status/${id}`, payload)
      this.error.value = { success: true }
      showToast('نجح', data?.message, 'success')
      return data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.editing.value = false
    }
  }

  async remove(id: number | string, cacheParams?: any) {
    this.deleting.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.post(`${this.baseUrl}/delete/${id}`)
      this.error.value = { success: true }
      showToast('نجح', data?.message, 'success')

      this.records.value = this.records.value.filter((record: any) => (record as any).id !== id)

      const usedParams = cacheParams || this.lastCacheParams
      if (usedParams) {
        const cacheKey = this.getCacheKey(usedParams)
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          parsed.data.records = parsed.data.records.filter((record: any) => record.id !== id)
          parsed.data.meta.total = Math.max(0, parsed.data.meta.total - 1)
          localStorage.setItem(cacheKey, JSON.stringify(parsed))
        }
      }

      return data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.deleting.value = false
    }
  }

  async post(endpoint: string, payload: any) {
    this.loading.value = true
    this.error.value = null
    try {
      const { data } = await this.axiosInstance.post(`${this.baseUrl}/${endpoint}`, payload)
      return data
    } catch (err) {
      this.error.value = err
      throw err
    } finally {
      this.loading.value = false
    }
  }
}
