import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed'
export type TicketCategory = 'inquiry' | 'complaint' | 'suggestion' | 'technical' | 'billing' | 'question_report' | 'other'

export interface TicketAttachment {
  id: number
  url: string
  original_name: string | null
  mime_type: string | null
  size: number
  created_at: string
}

export interface Ticket {
  id: number
  subject: string
  description: string
  status: TicketStatus
  category: TicketCategory
  replies_count?: number
  last_reply_at?: string | null
  created_at: string
  replies?: TicketReply[]
  attachments?: TicketAttachment[]
}

export interface TicketReply {
  id: number
  contact_id: number
  body: string
  is_staff: boolean
  author?: { id: number, name: string } | null
  attachments?: TicketAttachment[]
  created_at: string
}

export const ticketsService = {
  /** GET /v2/tickets - list current user's tickets */
  list: (params?: Record<string, string | number | boolean | undefined>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/tickets`, { params })
  },

  /** GET /v2/tickets/{id} - ticket detail with replies */
  show: (id: number | string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/tickets/${id}`)
  },

  /**
   * POST /v2/tickets — accepts optional image attachments; if any, the
   * request becomes multipart/form-data automatically.
   */
  create: (payload: {
    subject: string
    description: string
    category?: TicketCategory
    attachments?: File[]
  }) => {
    const axios = createAxiosInstance()
    if (payload.attachments?.length) {
      const fd = new FormData()
      fd.append('subject', payload.subject)
      fd.append('description', payload.description)
      if (payload.category) fd.append('category', payload.category)
      payload.attachments.forEach((f, i) => fd.append(`attachments[${i}]`, f))
      return axios.post(`/${VERSION}/tickets`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    return axios.post(`/${VERSION}/tickets`, {
      subject: payload.subject,
      description: payload.description,
      category: payload.category
    })
  },

  /** POST /v2/tickets/{id}/replies — same multipart story for attachments. */
  reply: (id: number | string, body: string, attachments?: File[]) => {
    const axios = createAxiosInstance()
    if (attachments?.length) {
      const fd = new FormData()
      fd.append('body', body)
      attachments.forEach((f, i) => fd.append(`attachments[${i}]`, f))
      return axios.post(`/${VERSION}/tickets/${id}/replies`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    return axios.post(`/${VERSION}/tickets/${id}/replies`, { body })
  },

  /** POST /v2/tickets/{id}/close */
  close: (id: number | string) => {
    const axios = createAxiosInstance()
    return axios.post(`/${VERSION}/tickets/${id}/close`)
  }
}
