import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const studyPlanService = {
  /** GET /v2/study-plan - خطة الطالب الدراسية (تُنشأ تلقائياً) */
  get: () => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/study-plan`)
  },

  /** POST /v2/study-plan/regenerate - إعادة توزيع الدروس على الأيام */
  regenerate: () => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/study-plan/regenerate`)
  },

  /** GET /v2/lessons/{id} - تفاصيل الدرس بصفحاته (يحدّثه إلى قيد التنفيذ) */
  getLesson: (id: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/lessons/${id}`)
  },

  /** POST /v2/lessons/{id}/complete - إتمام الدرس */
  completeLesson: (id: number | string, payload: { time_spent_minutes?: number } = {}) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/lessons/${id}/complete`, payload)
  }
}
