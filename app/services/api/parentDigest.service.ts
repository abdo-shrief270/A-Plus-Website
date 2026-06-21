import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const parentDigestService = {
  /** GET /v2/parent/weekly-summary - ملخص نشاط الأبناء الأسبوعي */
  weekly: (days = 7) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/parent/weekly-summary`, { params: { days } })
  }
}
