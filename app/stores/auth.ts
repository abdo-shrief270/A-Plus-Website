import { defineStore } from 'pinia'
import CryptoJS from 'crypto-js'
import type { User, AuthResponse } from '@/types/auth'

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'aplus-secret-2026'

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    getUser: state => state.user,
    getToken: (state) => {
      const token = useCookie('APlus-token')
      return state.token || token.value
    },
    isLoggedIn: (state) => {
      const token = useCookie('APlus-token')
      return !!state.token || !!token.value
    },
    // type is the raw field from v2 API: student | parent | school
    getUserType: state => state.user?.type || null,
    isStudent: state => state.user?.type === 'student',
    isParent: state => state.user?.type === 'parent',
    isSchool: state => state.user?.type === 'school',
    // Alias kept for backward compatibility with role-based middleware
    getUserRole: state => state.user?.type || null
  },

  actions: {
    async storeUser(data: AuthResponse) {
      return new Promise((resolve, reject) => {
        try {
          // Unwrapped or wrapped response payloads
          const user = (data as any).user || data.data?.user
          const token = (data as any).token || data.data?.token

          if (!user || !token) {
            throw new Error('Invalid user or token data')
          }

          // Store encrypted user data in localStorage
          const encryptedUserData = CryptoJS.AES.encrypt(
            JSON.stringify(user),
            SECRET_KEY
          ).toString()

          // Token in cookie (7 days)
          const tokenCookie = useCookie('APlus-token', { maxAge: 60 * 60 * 24 * 7 })
          tokenCookie.value = token

          // Type stored unencrypted in cookie for middleware use (no sensitive data)
          const typeCookie = useCookie('APlus-type', { maxAge: 60 * 60 * 24 * 7 })
          typeCookie.value = user.type

          if (import.meta.client) {
            localStorage.setItem('APlus-user', encryptedUserData)
          }

          this.user = Object.freeze(user) as User
          this.token = token
          resolve(true)
        } catch (error) {
          console.error('Error in storeUser:', error)
          reject(error)
        }
      })
    },

    async fetchUser() {
      if (this.user?.name) return this.user
      if (import.meta.server) return null

      const encryptedUserData = localStorage.getItem('APlus-user')
      const tokenCookie = useCookie('APlus-token')

      if (!tokenCookie.value || !encryptedUserData) {
        await this.logoutUser()
        return null
      }

      try {
        const decryptedData = CryptoJS.AES.decrypt(
          encryptedUserData,
          SECRET_KEY
        ).toString(CryptoJS.enc.Utf8)

        if (!decryptedData) throw new Error('Failed to decrypt user data')

        this.user = Object.freeze(JSON.parse(decryptedData)) as User
        this.token = tokenCookie.value
        return this.user
      } catch (error) {
        console.error('Decryption failed:', error)
        await this.logoutUser()
        return null
      }
    },

    async logoutUser() {
      return new Promise((resolve) => {
        if (import.meta.client) {
          localStorage.removeItem('APlus-user')
        }

        const tokenCookie = useCookie('APlus-token')
        const typeCookie = useCookie('APlus-type')
        tokenCookie.value = null
        typeCookie.value = null

        this.user = null
        this.token = null

        navigateTo('/auth/login')
        resolve(true)
      })
    }
  }
})
