import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const dashboardService = {
  /**
   * GET /v2/dashboard - bundled dashboard data (stats + recent students +
   * recent enrollments + recent subscriptions + trending courses).
   * Auto-scoped per role (parent/school/student).
   */
  bundle: () => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/dashboard`)
  }
}
