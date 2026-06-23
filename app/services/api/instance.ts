import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios'
import { handleResponseErrors } from './errorHandler'
import { showToast } from '@/utils/helpers/toast.helper'
import { useDeviceInfo } from '@/composables/useDeviceInfo'

let cachedInstance: AxiosInstance | null = null
let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error || !token) reject(error)
    else resolve(token)
  })
  pendingQueue = []
}

function buildInstance(): AxiosInstance {
  const config = useRuntimeConfig()
  const deviceHeaders = import.meta.client ? useDeviceInfo().getHeaders() : {}

  const instance = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Language': 'ar',
      ...deviceHeaders
    }
  })

  instance.interceptors.request.use((cfg) => {
    const token = useCookie('APlus-token').value
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
  })

  instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const original = error.config as AxiosRequestConfig & { _retry?: boolean } | undefined
      const status = error.response?.status
      const responseData = error.response?.data as { reason?: string, message?: string } | undefined

      // Device-related 401s never benefit from a token refresh — go straight
      // to a clean logout with a reason-specific toast.
      const deviceReasons = new Set([
        'device_taken_over',
        'device_pending_approval',
        'device_blocked',
        'device_not_registered',
        'device_id_required'
      ])
      if (status === 401 && responseData?.reason && deviceReasons.has(responseData.reason)) {
        const titles: Record<string, string> = {
          device_taken_over: 'تم تسجيل الدخول من جهاز آخر',
          device_pending_approval: 'الجهاز بانتظار التفعيل',
          device_blocked: 'الجهاز محظور',
          device_not_registered: 'الجهاز غير مسجل',
          device_id_required: 'تعذّر التعرّف على الجهاز'
        }
        showToast(
          titles[responseData.reason] || 'تم إنهاء الجلسة',
          responseData.message || 'تم إنهاء جلستك على هذا الجهاز.',
          'warning',
          7000
        )
        try {
          const { useAuthStore } = await import('@/stores/auth')
          await useAuthStore().logoutUser()
        } catch {
          // already navigating away — fine.
        }
        return Promise.reject(error)
      }

      const isAuthEndpoint = isRefreshAuthEndpoint(original?.url)
      const backendMessage = responseData?.message
      // A guest (no session cookie) has nothing to refresh or log out. This
      // matters on public pages (landing, catalog) that legitimately call
      // public endpoints — a stray 401 there must never wipe state or bounce
      // the visitor to /auth/login.
      const hasSession = !!useCookie('APlus-token').value

      // Attempt token refresh exactly once per failed request, before triggering logout.
      // Skipped for auth endpoints (login/refresh/logout) — those bubble straight
      // through so the user sees the real backend message.
      if (status === 401 && original && !original._retry && !isAuthEndpoint && hasSession) {
        original._retry = true

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingQueue.push({
              resolve: (token) => {
                original.headers = { ...(original.headers || {}), Authorization: `Bearer ${token}` }
                resolve(instance(original))
              },
              reject
            })
          })
        }

        isRefreshing = true
        try {
          const newToken = await tryRefreshToken(instance)
          if (!newToken) throw new Error('Token refresh failed')

          flushQueue(null, newToken)
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` }
          return instance(original)
        } catch (refreshErr) {
          flushQueue(refreshErr, null)
          // Refresh failed → cookie wipe + redirect, but show backend message first.
          if (backendMessage) showToast('خطأ', backendMessage, 'error')
          handleResponseErrors(error)
          return Promise.reject(error)
        } finally {
          isRefreshing = false
        }
      }

      // Surface the backend message when there's an active session OR the
      // failing call is part of the auth flow (login/register/otp/password/...).
      // The latter ensures guests on auth pages see why their submit failed
      // (wrong password, invalid OTP, device under review, etc.). A guest's
      // stray 401 on a public browse endpoint stays silent (no message, no
      // redirect) — the page handles its own empty/fallback state.
      if (backendMessage && (hasSession || isAuthEndpoint)) {
        showToast('خطأ', backendMessage, 'error')
      }
      // Redirect/logout side-effects only for a real session, and never for
      // auth endpoints (don't bounce a user off the login page on a bad submit).
      if (hasSession && !isAuthEndpoint) {
        handleResponseErrors(error)
      }

      return Promise.reject(error)
    }
  )

  return instance
}

/**
 * True for public auth endpoints — login, registration, OTP, password reset,
 * username check, refresh, logout. We don't try a token refresh for these,
 * and we don't trigger the cookie-wipe / redirect on their 401s either:
 * the user is already in the auth flow and the backend message ("wrong
 * password", "device pending approval", etc.) is what they need to see.
 */
function isRefreshAuthEndpoint(url?: string) {
  if (!url) return false
  return /\/auth\/(login|register|otp|password|username|refresh|logout)/.test(url)
}

async function tryRefreshToken(instance: AxiosInstance): Promise<string | null> {
  try {
    const { data } = await instance.get('/v2/auth/refresh-token')
    const newToken: string | undefined = data?.data?.token || data?.token
    if (!newToken) return null
    useCookie('APlus-token', { maxAge: 60 * 60 * 24 * 7 }).value = newToken
    return newToken
  } catch {
    return null
  }
}

/**
 * Returns the singleton axios instance. Built lazily on first call so it
 * runs inside Nuxt's runtime context (where useRuntimeConfig/useCookie work).
 */
export function getApi(): AxiosInstance {
  if (!cachedInstance) cachedInstance = buildInstance()
  return cachedInstance
}

/**
 * Backwards-compatible factory. Returns the singleton — kept so legacy
 * call sites keep working, but new code should import { getApi } and call it.
 */
export default function createAxiosInstance(): AxiosInstance {
  return getApi()
}
