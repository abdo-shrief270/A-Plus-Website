import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const performanceService = {
  /** GET /v2/performance - اتجاه الدقّة وأضعف/أقوى التصنيفات */
  get: (days = 14) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/performance`, { params: { days } })
  }
}
