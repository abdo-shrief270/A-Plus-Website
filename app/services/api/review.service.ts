import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const reviewService = {
  /** GET /v2/review/queue - أسئلة الأخطاء المستحقة للمراجعة */
  getQueue: (params?: Record<string, unknown>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/review/queue`, { params })
  },

  /** GET /v2/review/settings - إعدادات مدة الانتظار */
  getSettings: () => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/review/settings`)
  },

  /** PUT /v2/review/settings - تحديث مدة الانتظار (ساعات/أيام) */
  updateSettings: (payload: { cooldown_value: number, cooldown_unit: 'hours' | 'days' }) => {
    const axios = createAxiosInstance()
    return axios.put(`/${VERSION}/review/settings`, payload)
  }
}
