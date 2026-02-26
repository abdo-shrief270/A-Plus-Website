import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { showToast } from '@/utils/helpers/toast.helper'
import type { LoginPayload, LoginCheckResponse, AuthResponse, StudentRegisterPayload, ParentRegisterPayload, CheckUsernamePayload, SendOtpPayload, VerifyOtpPayload } from '@/types/auth'

export const useAuthService = () => {
  const api = new useApi('auth', 'v2')
  const loading = ref(false)
  const error = ref<any>(null)

  const post = async <T = any>(endpoint: string, payload: any): Promise<T> => {
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

  const get = async <T = any>(endpoint: string): Promise<T> => {
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

  const loginCheck = (payload: Pick<LoginPayload, 'user_name'>) => post<LoginCheckResponse>('login/check', payload)
  const login = (payload: LoginPayload) => post<AuthResponse>('login', payload)
  const registerStudent = (payload: StudentRegisterPayload) => post<AuthResponse>('register/student', payload)
  const registerParent = (payload: ParentRegisterPayload) => post<AuthResponse>('register/parent', payload)
  const checkUsername = (payload: CheckUsernamePayload) => post<{ available: boolean }>('username/check', payload)
  const verifyAccounts = (payload: any) => post('verify-account', payload)
  const logout = (payload: any = {}) => post('logout', payload)

  // Custom OTP functions based on API docs V2
  const sendOtp = (payload: SendOtpPayload) => post<{ message: string, status: number }>('otp/send', payload)
  const verifyOtp = (payload: VerifyOtpPayload) => post<AuthResponse>('otp/verify', payload)

  const passwordSendOtp = (payload: { email: string }) => post('password/send-otp', payload)
  const passwordReset = (payload: any) => post('password/reset', payload)
  const resendOtp = (payload: { email: string }) => post('resend-otp', payload)
  const passwordVerifyOtp = (payload: any) => post('password/verify-otp', payload)
  const refreshToken = () => get('refresh-token')

  return {
    ...api,
    loading,
    error,
    loginCheck,
    login,
    registerStudent,
    registerParent,
    checkUsername,
    verifyAccounts,
    logout,
    sendOtp,
    verifyOtp,
    passwordSendOtp,
    passwordReset,
    resendOtp,
    passwordVerifyOtp,
    refreshToken
  }
}
