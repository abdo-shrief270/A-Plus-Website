import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const leaderboardService = {
  /** GET /v2/leaderboard?period=week|all - لوحة المتصدرين لدوري الطالب */
  get: (period: 'week' | 'all' = 'week') => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/leaderboard`, { params: { period } })
  }
}
