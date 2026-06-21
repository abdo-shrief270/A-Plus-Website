import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentKind = 'enrollment' | 'subscription' | 'other'

export interface Payment {
  id: number
  transaction_id: string
  amount: number
  currency: string
  description: string | null
  status: PaymentStatus
  payment_method: string | null
  paid_at: string | null
  metadata?: Record<string, any> | null
  enrollment_id: number | null
  subscription_id: number | null
  kind: PaymentKind
  created_at: string
  updated_at?: string
}

export const paymentsService = {
  /** GET /v2/payments */
  list: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/payments`, { params })
  },

  /** GET /v2/payments/{id} */
  show: (id: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/payments/${id}`)
  },

  /** POST /v2/payments/{id}/confirm */
  confirm: (id: number | string, payment_method = 'visa') => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/payments/${id}/confirm`, { payment_method })
  },

  /** POST /v2/payments/{id}/cancel */
  cancel: (id: number | string) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/payments/${id}/cancel`)
  }
}
