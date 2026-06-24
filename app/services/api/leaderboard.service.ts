import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const leaderboardService = {
  /** GET /v2/leaderboard?period=week|all&week_offset=N - لوحة المتصدرين */
  get: (period: 'week' | 'all' = 'week', weekOffset = 0) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/leaderboard`, {
      params: { period, week_offset: weekOffset }
    })
  }
}
