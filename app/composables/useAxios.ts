import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import Cookie from 'js-cookie'

/**
 * Customized Axios Instance for A-Plus Question Bank API v2
 * Handles:
 * - Base URL configuration (/api/v2)
 * - Bearer Token Injection from js-cookie ('auth_token')
 * - Automatic Data Extraction (returns response.data.data)
 * - Global Error Handling (401, 422)
 */
export const useAxios = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
  const apiV2URL = `${baseURL.replace(/\/$/, '')}/v2`

  const instance: AxiosInstance = axios.create({
    baseURL: apiV2URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  // Request Interceptor: Attach Authorization header if token exists
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = Cookie.get('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response Interceptor: Extract data from envelope and handle errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // The API returns { status, message, data }
      // This interceptor extracts response.data.data so the stores get the actual entity directly
      return response.data?.data ?? response.data
    },
    (error) => {
      if (error.response) {
        const { status, data } = error.response

        switch (status) {
          case 401:
            console.error('[API] Unauthorized - Token invalid or expired')
            // Handle unauthorized access globally if needed
            break
          case 422:
            console.error('[API] Validation Errors:', data.message || 'Check your input', data.errors || {})
            break
          case 500:
            console.error('[API] Server Error:', data.message || 'Internal Server Error')
            break
        }
      } else if (error.request) {
        console.error('[API] Network Error - No response received from server')
      } else {
        console.error('[API] Fetch Error:', error.message)
      }
      return Promise.reject(error)
    }
  )

  // Note: We cast to any because the interceptor changes the return type from AxiosResponse to the inner data
  return instance as AxiosInstance & {
    get<T = any>(url: string, config?: any): Promise<T>
    post<T = any>(url: string, data?: any, config?: any): Promise<T>
  }
}
