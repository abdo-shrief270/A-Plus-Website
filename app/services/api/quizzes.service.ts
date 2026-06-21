import createAxiosInstance from '@/services/api/instance'
import type { QuizConfig } from '@/types/quiz'

const VERSION = 'v2'

export const quizzesService = {
  /** GET /v2/quizzes/pool-count - عدد الأسئلة المتاحة للاختيارات الحالية */
  getPoolCount: (params: Record<string, unknown>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/quizzes/pool-count`, { params })
  },

  /** GET /v2/quizzes/active - الجلسة الجارية إن وجدت */
  getActiveSession: () => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/quizzes/active`)
  },

  /** GET /v2/quizzes - سجل الاختبارات */
  getSessions: (params?: Record<string, unknown>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/quizzes`, { params })
  },

  /** POST /v2/quizzes - بدء اختبار جديد */
  createSession: (payload: QuizConfig) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/quizzes`, payload)
  },

  /** GET /v2/quizzes/{id} - تفاصيل الجلسة بأسئلتها */
  getSession: (id: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/quizzes/${id}`)
  },

  /** POST /v2/quizzes/{id}/answer - إرسال إجابة */
  submitAnswer: (id: number | string, payload: { question_id: number, answer_id: number }) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/quizzes/${id}/answer`, payload)
  },

  /** POST /v2/quizzes/{id}/complete - إنهاء الاختبار */
  completeSession: (id: number | string) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/quizzes/${id}/complete`)
  },

  /** POST /v2/quizzes/{id}/abandon - إلغاء الاختبار */
  abandonSession: (id: number | string) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/quizzes/${id}/abandon`)
  },

  /** GET /v2/daily-challenge - حالة تحدي اليوم والستريك */
  getDailyChallenge: () => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/daily-challenge`)
  },

  /** POST /v2/daily-challenge - بدء (أو استئناف) تحدي اليوم */
  startDailyChallenge: () => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/daily-challenge`)
  },

  /** GET /v2/exam-simulation - إعدادات محاكاة الاختبار */
  getSimulationInfo: () => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/exam-simulation`)
  },

  /** POST /v2/exam-simulation - بدء محاكاة الاختبار */
  startSimulation: () => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/exam-simulation`)
  },

  /** POST /v2/practice-exams/{id}/simulate - تشغيل نموذج كاختبار محاكاة */
  simulateModel: (modelId: number | string) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/practice-exams/${modelId}/simulate`)
  }
}
