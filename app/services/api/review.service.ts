import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const reviewService = {
  /** GET /v2/review/queue - أسئلة الأخطاء المستحقة للمراجعة */
  getQueue: (params?: Record<string, unknown>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/review/queue`, { params })
  }
}
