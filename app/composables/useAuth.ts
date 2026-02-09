import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { showToast } from '@/utils/helpers/toast.helper'

export const useAuthService = () => {
    const api = new useApi('auth')
    const loading = ref(false)
    const error = ref(null)

    const post = async (endpoint: string, payload: any) => {
        loading.value = true
        error.value = null
        try {
            const { data } = await api.axiosInstance.post(`${api.baseUrl}/${endpoint}`, payload)
            if (data?.message) {
                showToast('نجح', data.message, 'success')
            }
            return data
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    const get = async (endpoint: string) => {
        loading.value = true
        error.value = null
        try {
            const { data } = await api.axiosInstance.get(`${api.baseUrl}/${endpoint}`)
            return data
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    const login = (payload: any) => post('login', payload)
    const register = (payload: any) => post('register', payload)
    const verifyAccounts = (payload: any) => post('verify-account', payload)
    const logout = (payload: any) => post('logout', payload)
    const passwordSendOtp = (payload: any) => post('password/send-otp', payload)
    const passwordReset = (payload: any) => post('password/reset', payload)
    const resendOtp = (payload: any) => post('resend-otp', payload)
    const passwordVerifyOtp = (payload: any) => post('password/verify-otp', payload)
    const refreshToken = () => get('refresh-token')

    return {
        ...api,
        loading,
        error,
        login,
        register,
        verifyAccounts,
        logout,
        passwordSendOtp,
        passwordReset,
        resendOtp,
        passwordVerifyOtp,
        refreshToken
    }
}
