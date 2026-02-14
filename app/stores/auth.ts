import { defineStore } from 'pinia'
import CryptoJS from 'crypto-js'
import type { User, AuthResponse } from '@/types/auth'

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || (() => {
  throw new Error('VITE_ENCRYPTION_KEY is not defined in .env')
})()

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
    getUserRole: state => state.user?.role?.toLowerCase() || null,
    isStudent: state => state.user?.role?.toLowerCase() === 'student',
    isTeacher: state => state.user?.role?.toLowerCase() === 'teacher',
    isParent: state => state.user?.role?.toLowerCase() === 'parent'
  },

  actions: {
    async storeUser(data: AuthResponse) {
      return new Promise((resolve, reject) => {
        try {
          if (!data?.user || !data?.token) {
            throw new Error('Invalid user or token data')
          }

          const encryptedUserData = CryptoJS.AES.encrypt(
            JSON.stringify(data.user),
            SECRET_KEY
          ).toString()

          // Use Nuxt useCookie composable
          const tokenCookie = useCookie('APlus-token', { maxAge: 60 * 60 * 24 * 7 }) // 7 days
          tokenCookie.value = data.token

          if (import.meta.client) {
            localStorage.setItem('APlus-user', encryptedUserData)
            localStorage.setItem('b-language', data.user.lang)
          }

          this.user = Object.freeze(data.user) as User
          this.token = data.token
          resolve(true)
        } catch (error) {
          console.error('Error in storeUser:', error)
          reject(error)
        }
      })
    },

    async fetchUser() {
      if (this.user?.name) {
        return this.user
      }

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
          localStorage.removeItem('b-language')
        }

        const tokenCookie = useCookie('APlus-token')
        tokenCookie.value = null

        this.user = null
        this.token = null

        navigateTo('/login')
        resolve(true)
      })
    }
  }
})
