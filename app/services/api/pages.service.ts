import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export interface CmsPage {
  id: number
  slug: string
  title: string
  content: string
  icon: string | null
  is_published: boolean
  updated_at?: string
}

export const pagesService = {
  /** GET /v2/pages — list of published pages (slug + title only) */
  list: () => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/pages`)
  },

  /** GET /v2/pages/{slug} — full page with content */
  bySlug: (slug: string) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/pages/${slug}`)
  }
}
