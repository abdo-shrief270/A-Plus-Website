import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const studentsService = {
  /** GET /v2/enrollments - Get Enrollments List (قائمة الاشتراكات بالدورات) */
  getEnrollments: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/enrollments`, { params })
  },

  /** GET /v2/trending-courses - Get Trending Courses (الدورات الأكثر إقبالاً) */
  getTrendingCourses: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/trending-courses`, { params })
  },

  /** GET /v2/student-stats - Get Student Statistics Charts (رسوم بيانية لتقدم الطلاب) */
  getStudentStats: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/student-stats`, { params })
  },

  /** GET /v2/students - List Students (قائمة الطلاب) */
  getStudents: (params?: Record<string, any>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/students`, { params })
  },

  /** GET /v2/students/{student} - Get Student Profile (بيانات الطالب) */
  getStudentProfile: (studentId: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/students/${studentId}`)
  },

  /** PUT /v2/students/{student} - Update Student Profile (تعديل بيانات الطالب) */
  updateStudentProfile: (studentId: number | string, payload: any) => {
    const axios = createAxiosInstance()
    // Depending on backend support, this could be PUT or PATCH. Swagger says PUT.
    return axios.put(`/${VERSION}/students/${studentId}`, payload)
  },

  /** DELETE /v2/students/{student} - Request Student Deletion (طلب حذف حساب طالب) */
  requestStudentDeletion: (studentId: number | string, reason?: string) => {
    const axios = createAxiosInstance()
    return axios.delete(`/${VERSION}/students/${studentId}`, { params: { reason } })
  },

  /** POST /v2/students/import - Import Students from Excel/CSV (استيراد الطلاب من ملفات الجداول) */
  importStudents: (formData: FormData) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/students/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /** POST /v2/students/bulk - Bulk Create Students (إضافة مجموعة طلاب كبيانات JSON) */
  bulkCreateStudents: (payload: { students: any[] }) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/students/bulk`, payload)
  }
}
