import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const settingsService = {
    /** GET /v2/settings - Get Platform Configuration Settings (إعدادات المنصة) */
    getSettings: (params?: Record<string, any>) => {
        const axios = createAxiosInstance()
        // Optional query parameter: ?group=... can be passed
        return axios.get(`/${VERSION}/settings`, { params })
    }
}
