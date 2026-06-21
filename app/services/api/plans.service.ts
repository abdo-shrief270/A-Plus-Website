import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const plansService = {
  /** GET /v2/plans - List active plans (الباقات) */
  list: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/plans`, { params })
  },

  /** GET /v2/plans/{plan} */
  show: (id: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/plans/${id}`)
  }
}

export const subscriptionsService = {
  /** GET /v2/subscriptions - Auto-scoped by role */
  list: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/subscriptions`, { params })
  },

  /**
   * POST /v2/subscriptions - Subscribe multiple students to a plan.
   * Returns { total_created, total_skipped, created, skipped }.
   */
  create: (payload: { plan_id: number, student_ids: number[] }) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/subscriptions`, payload)
  }
}
