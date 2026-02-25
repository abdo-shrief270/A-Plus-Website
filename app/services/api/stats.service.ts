import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const statsService = {
    /** GET /v2/stats — platform stats scoped by JWT (school/parent) */
    platformStats: () => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/stats`)
    },

    /** GET /v2/student-stats?period=week|month|3months|year */
    studentStats: (period: 'week' | 'month' | '3months' | 'year' = 'month') => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/student-stats`, { params: { period } })
    },

    /** GET /v2/trending-courses */
    trendingCourses: (limit: number = 10) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/trending-courses`, { params: { limit } })
    },

    /** GET /v2/enrollments (Subscriptions) */
    enrollments: (page: number = 1) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/enrollments`, { params: { page } })
    }
}
