import { defineStore } from 'pinia'
import { Cookie } from '@/utils/cookie'
import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || (() => {
    throw new Error('VITE_ENCRYPTION_KEY is not defined in .env')
})()

interface User {
    id: number
    name: string
    email: string
    lang: string
    [key: string]: any
}

interface AuthState {
    user: User | null
    token: string
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: ''
    }),

    getters: {
        getUser: (state) => state.user,

        getToken: (state) => {
            const token = state.token || Cookie.get('APlus-token')
            return token
        },

        isLoggedIn: (state) => {
            const loggedIn = state.token?.length > 0 || (Cookie.get('APlus-token')?.length ?? 0) > 0
            return loggedIn
        }
    },

    actions: {
        async storeUser(data: { user: User; token: string }) {
            return new Promise((resolve, reject) => {
                try {
                    if (!data?.user || !data?.token) {
                        throw new Error('Invalid user or token data')
                    }

                    const encryptedUserData = CryptoJS.AES.encrypt(
                        JSON.stringify(data.user),
                        SECRET_KEY
                    ).toString()

                    Cookie.set('APlus-token', data.token)
                    localStorage.setItem('APlus-user', encryptedUserData)
                    localStorage.setItem('b-language', data.user.lang)

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

            const encryptedUserData = localStorage.getItem('APlus-user')
            const token = this.getToken

            if (!token || !encryptedUserData) {
                await this.logoutUser()
                return null
            }

            try {
                const decryptedData = CryptoJS.AES.decrypt(encryptedUserData, SECRET_KEY).toString(CryptoJS.enc.Utf8)
                this.user = Object.freeze(JSON.parse(decryptedData)) as User
                return this.user
            } catch (error) {
                console.error('Decryption failed:', error)
                await this.logoutUser()
                return null
            }
        },

        logoutUser() {
            return new Promise((resolve) => {
                localStorage.removeItem('APlus-user')
                localStorage.removeItem('b-language')
                Cookie.remove('APlus-token')
                this.user = null
                this.token = ''
                navigateTo('/login')
                resolve(true)
            })
        }
    }
})
