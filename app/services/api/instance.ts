import axios, { type AxiosInstance } from 'axios'
import { handleResponseErrors } from './errorHandler'
import { showToast } from '@/utils/helpers/toast.helper'
import { useDeviceInfo } from '@/composables/useDeviceInfo'

export default function createAxiosInstance(): AxiosInstance {
  const config = useRuntimeConfig()
  const token = useCookie('APlus-token')

  // Get device headers (only available on client side)
  const deviceHeaders = import.meta.client ? useDeviceInfo().getHeaders() : {}

  const axiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl || import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Language': 'ar',
      ...(token.value && { Authorization: `Bearer ${token.value}` }),
      ...deviceHeaders
    }
  })

  // Response interceptor
  axiosInstance.interceptors.response.use(
    response => response,
    (error) => {
      handleResponseErrors(error)

      if (error?.response?.data?.message) {
        showToast('خطأ', error.response.data.message, 'error')
      }

      return Promise.reject(error)
    }
  )

  return axiosInstance
}
