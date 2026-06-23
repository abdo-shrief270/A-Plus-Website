import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const coursesService = {
  /** GET /v2/courses - List Courses (قائمة الكورسات) */
  list: (params?: Record<string, string | number | boolean | undefined>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/courses`, { params })
  },

  /** GET /v2/courses/{course} - Get Course Detail (تفاصيل كورس) */
  show: (id: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/courses/${id}`)
  }
}

export const enrollmentsService = {
  /** GET /v2/enrollments - Get Enrollments List */
  list: (params?: Record<string, string | number | boolean | undefined>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/enrollments`, { params })
  },

  /**
   * POST /v2/enrollments - Enroll multiple students into a course.
   * Returns { total_created, total_skipped, created, skipped }.
   */
  create: (payload: { course_id: number, student_ids: number[] }) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/enrollments`, payload)
  }
}
