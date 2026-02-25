import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const examService = {
    /** GET /v2/exams */
    list: (params?: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/exams`, { params })
    },

    /** GET /v2/exams/{id} */
    detail: (id: number | string) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/exams/${id}`)
    },

    /** GET /v2/exams/{id}/subjects */
    subjects: (id: number | string) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/exams/${id}/subjects`)
    },

    /** GET /v2/exams/{id}/sections */
    sections: (id: number | string) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/exams/${id}/sections`)
    }
}
