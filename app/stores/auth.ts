import { defineStore } from 'pinia'
import type { User, AuthResponse } from '@/types/auth'
import { purgeAllApiCaches } from '@/utils/apiCache'

const USER_STORAGE_KEY = 'APlus-user'
const TOKEN_COOKIE = 'APlus-token'
const TYPE_COOKIE = 'APlus-type'
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

interface AuthState {
  user: User | null
  token: string | null
}

/**
 * Auth store. Token lives in a cookie (so it's sent on SSR), user lives in
 * localStorage as plain JSON. We deliberately do not encrypt the user blob:
 * any key shipped to the browser is public, so client-side encryption is
 * security theater. Real protection comes from HTTPS + HttpOnly cookies on
 * the backend; if backend support lands, switch token to a server-set
 * HttpOnly cookie and remove the cookie writes here.
 */
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    getUser: state => state.user,
    getToken: (state) => {
      const token = useCookie<string | null>(TOKEN_COOKIE)
      return state.token || token.value
    },
    isLoggedIn: (state) => {
      const token = useCookie<string | null>(TOKEN_COOKIE)
      return !!state.token || !!token.value
    },
    getUserType: state => state.user?.type || null,
    isStudent: state => state.user?.type === 'student',
    isParent: state => state.user?.type === 'parent',
    isSchool: state => state.user?.type === 'school',
    getUserRole: state => state.user?.type || null
  },

  actions: {
    async storeUser(data: AuthResponse | { user?: User, token?: string, requires_2fa?: boolean }) {
      const flat = data as { user?: User, token?: string }
      const wrapped = (data as AuthResponse).data
      const user = flat.user || wrapped?.user
      const token = flat.token || wrapped?.token

      if (!user || !token) {
        throw new Error('Invalid auth response: missing user or token')
      }

      useCookie(TOKEN_COOKIE, { maxAge: TOKEN_MAX_AGE }).value = token
      useCookie(TYPE_COOKIE, { maxAge: TOKEN_MAX_AGE }).value = user.type

      if (import.meta.client) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      }

      this.user = Object.freeze(user) as User
      this.token = token
      return true
    },

    async fetchUser() {
      if (this.user?.name) return this.user
      if (import.meta.server) return null

      const stored = localStorage.getItem(USER_STORAGE_KEY)
      const tokenCookie = useCookie<string | null>(TOKEN_COOKIE)

      if (!tokenCookie.value || !stored) {
        await this.logoutUser()
        return null
      }

      try {
        this.user = Object.freeze(JSON.parse(stored)) as User
        this.token = tokenCookie.value
        return this.user
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        await this.logoutUser()
        return null
      }
    },

    /**
     * Pull the latest user from /v2/auth/me and replace the cached blob.
     * Use this when the locally-cached user is missing fields that the
     * backend has since added (e.g. the `student` relation for students
     * who logged in before login responses started eager-loading it).
     */
    async refreshUser(): Promise<User | null> {
      try {
        const { authService } = await import('@/services/api/auth.service')
        const res = await authService.me()
        const data = res.data?.data ?? res.data ?? {}
        const user = (data.user ?? data) as User | undefined
        if (!user) return this.user
        if (import.meta.client) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
        }
        this.user = Object.freeze(user) as User
        return this.user
      } catch (error) {
        console.warn('refreshUser failed', error)
        return this.user
      }
    },

    async logoutUser() {
      const { authService } = await import('@/services/api/auth.service')

      try {
        await authService.logout()
      } catch (error) {
        // Token may already be expired; proceed with local cleanup regardless.
        console.warn('Backend logout failed, proceeding with local cleanup', error)
      }

      if (import.meta.client) {
        localStorage.removeItem(USER_STORAGE_KEY)
        // Drop every cached API response so the next user can't see this user's data.
        purgeAllApiCaches()
      }

      useCookie<string | null>(TOKEN_COOKIE).value = null
      useCookie<string | null>(TYPE_COOKIE).value = null

      this.user = null
      this.token = null

      await navigateTo('/auth/login')
      return true
    }
  }
})
