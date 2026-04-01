import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const examsService = {
  /** GET /v2/exams - Get All Exams (قائمة الامتحانات/المراحل الدراسية) */
  getExams: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/exams`, { params })
  },

  /** GET /v2/exams/{exam} - Get Exam Details (تفاصيل الامتحان/المرحلة) */
  getExamDetails: (examId: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/exams/${examId}`)
  },

  /** GET /v2/exams/{exam}/subjects - Get Exam Subjects (المواد التابعة للامتحان) */
  getExamSubjects: (examId: number | string, params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/exams/${examId}/subjects`, { params })
  },

  /** GET /v2/exams/{exam}/sections - Get Exam Sections (أقسام الامتحان) */
  getExamSections: (examId: number | string, params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/exams/${examId}/sections`, { params })
  }
}
