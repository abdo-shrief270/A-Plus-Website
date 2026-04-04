import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const questionsService = {
  /** GET /v2/questions/trending - Get Trending Questions (الأسئلة الشائعة والأكثر حلاً) */
  getTrendingQuestions: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/questions/trending`, { params })
  },

  /** GET /v2/questions/recent - Get Recent Questions (أحدث الأسئلة المُضافة) */
  getRecentQuestions: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/questions/recent`, { params })
  },

  /** GET /v2/questions/search - Search Questions (البحث في بنك الأسئلة) */
  searchQuestions: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/questions/search`, { params })
  },

  /** GET /v2/questions/{question} - Get Question Details (تفاصيل السؤال) */
  getQuestionDetails: (questionId: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/questions/${questionId}`)
  },

  /** GET /v2/subjects/{subject}/questions - Get Questions by Subject (أسئلة مادة معينة) */
  getSubjectQuestions: (subjectId: number | string, params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/subjects/${subjectId}/questions`, { params })
  },

  /** GET /v2/categories/{category}/questions - Get Questions by Category (أسئلة تصنيف فرعي) */
  getCategoryQuestions: (categoryId: number | string, params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/categories/${categoryId}/questions`, { params })
  },

  /** GET /v2/categories/{id}/articles - Get Articles by Category (المقالات التابعة لتصنيف) */
  getCategoryArticles: (categoryId: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/categories/${categoryId}/articles`)
  },

  /** GET /v2/articles/{id} - Get Article Details (تفاصيل المقال) */
  getArticleDetails: (articleId: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/articles/${articleId}`)
  },

  /** GET /v2/articles/{id}/questions - Get Article Questions (أسئلة المقال) */
  getArticleQuestions: (articleId: number | string, params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/articles/${articleId}/questions`, { params })
  },

  /** GET /v2/practice-exams - Get Practice Exams (نماذج الامتحانات والاختبارات التجريبية) */
  getPracticeExams: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/practice-exams`, { params })
  },

  /** GET /v2/practice-exams/{practiceExam} - Get Practice Exam Details (تفاصيل النموذج التجريبي وأسئلته) */
  getPracticeExamDetails: (practiceExamId: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/practice-exams/${practiceExamId}`)
  },

  /** GET /v2/trending-courses - Get Trending Courses (الكورسات الرائجة) */
  getTrendingCourses: (params?: { limit?: number }) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/trending-courses`, { params })
  },

  /** POST /v2/questions/answer - Submit Question Answer (إرسال إجابة السؤال) */
  submitAnswer: (payload: { question_id: number | string, answer_id?: number | string, user_answer?: string }) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/questions/answer`, payload)
  }
}
