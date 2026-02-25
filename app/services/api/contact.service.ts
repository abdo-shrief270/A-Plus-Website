import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const contactService = {
    /** POST /v2/contact */
    send: (payload: { name: string; email: string; message: string; phone?: string }) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/contact`, payload)
    }
}
