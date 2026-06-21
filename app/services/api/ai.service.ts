import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const aiService = {
  /** POST /v2/questions/{id}/ai-explanation - شرح بالذكاء الاصطناعي (مخزّن) */
  explain: (questionId: number | string) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/questions/${questionId}/ai-explanation`)
  }
}
