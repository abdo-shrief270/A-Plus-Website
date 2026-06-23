import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const practiceExamService = {
  /** GET /v2/practice-exams */
  list: (params?: Record<string, string | number | boolean | undefined>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/practice-exams`, { params })
  },

  /** GET /v2/practice-exams/{id} */
  detail: (id: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/practice-exams/${id}`)
  }
}
