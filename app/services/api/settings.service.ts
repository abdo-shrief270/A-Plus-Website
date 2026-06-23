import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const settingsService = {
  /** GET /v2/settings - Get Platform Configuration Settings (إعدادات المنصة) */
  getSettings: (params?: Record<string, string | number | boolean | undefined>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/settings`, { params })
  },

  /** GET /v2/settings/{key} - Single setting by its key (e.g. page_about) */
  getByKey: (key: string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/settings/${key}`)
  }
}
