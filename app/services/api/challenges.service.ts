import createAxiosInstance from '@/services/api/instance'
import type { QuizConfig } from '@/types/quiz'

const VERSION = 'v2'

export const challengesService = {
  /** POST /v2/challenges - إنشاء تحدٍ بمجموعة أسئلة مجمّدة + رمز دعوة */
  create: (payload: QuizConfig) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/challenges`, payload)
  },

  /** POST /v2/challenges/join - الانضمام بالرمز */
  join: (code: string) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/challenges/join`, { code })
  },

  /** GET /v2/challenges/{code} - نتائج التحدي */
  results: (code: string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/challenges/${code}`)
  }
}
