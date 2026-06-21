import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export type SecurityMethod = 'email' | 'sms' | 'whatsapp'
export type SecurityPurpose = 'verify_email' | 'verify_phone' | 'verify_whatsapp' | 'enable_2fa' | 'disable_2fa'

export interface SecurityStatus {
  two_factor_enabled: boolean
  email_verified: boolean
  phone_verified: boolean
  whatsapp_verified: boolean
  email: string | null
  phone: string | null
  masked_email: string | null
  masked_phone: string | null
}

export const securityService = {
  /** GET /v2/auth/security */
  status: () => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/auth/security`)
  },

  /** POST /v2/auth/security/otp - sends OTP to user's email or phone */
  sendOtp: (method: SecurityMethod) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/auth/security/otp`, { method })
  },

  /** POST /v2/auth/security/confirm - verify OTP and apply action */
  confirm: (payload: { token: string, otp: string, purpose: SecurityPurpose }) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/auth/security/confirm`, payload)
  }
}
