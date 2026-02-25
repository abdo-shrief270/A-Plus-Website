import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const questionService = {
    /** GET /v2/questions/trending */
    trending: (params?: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/questions/trending`, { params })
    },

    /** GET /v2/questions/recent */
    recent: (params?: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/questions/recent`, { params })
    },

    /** GET /v2/questions/search */
    search: (q: string, params?: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/questions/search`, { params: { q, ...params } })
    },

    /** GET /v2/questions/{id} */
    detail: (id: number | string) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/questions/${id}`)
    },

    /** GET /v2/subjects/{id}/questions */
    bySubject: (subjectId: number | string, params?: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/subjects/${subjectId}/questions`, { params })
    },

    /** GET /v2/categories/{id}/questions */
    byCategory: (categoryId: number | string, params?: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/categories/${categoryId}/questions`, { params })
    }
}
