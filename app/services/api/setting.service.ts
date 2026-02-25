import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const settingService = {
    /** GET /v2/settings */
    all: () => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/settings`)
    },

    /** GET /v2/settings/groups */
    groups: () => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/settings/groups`)
    },

    /** GET /v2/settings/{key} */
    byKey: (key: string) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/settings/${key}`)
    }
}
