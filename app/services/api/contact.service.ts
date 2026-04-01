import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const contactService = {
    /** POST /v2/contact - Submit Contact Form (نموذج اتصل بنا) */
    submitContactForm: (payload: any) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/contact`, payload)
    }
}
