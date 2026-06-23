import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export interface Notification {
  id: string
  title: string
  description: string | null
  link: string | null
  color: string
  icon: string
  read_at: string | null
  created_at: string
}

export const notificationsService = {
  /** GET /v2/notifications - list latest notifications + unread_count */
  list: (params?: Record<string, string | number | boolean | undefined>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/notifications`, { params })
  },

  /** POST /v2/notifications/{id}/read */
  markRead: (id: string) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/notifications/${id}/read`)
  },

  /** POST /v2/notifications/read-all */
  markAllRead: () => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/notifications/read-all`)
  }
}
