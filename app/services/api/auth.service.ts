import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const authService = {
    /** POST /v2/auth/username/check */
    checkUsername: (user_name: string) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/username/check`, { user_name })
    },

    /** POST /v2/auth/login/check */
    loginCheck: (user_name: string) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/login/check`, { user_name })
    },

    /** POST /v2/auth/login */
    login: (user_name: string, password: string) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/login`, { user_name, password })
    },

    /** POST /v2/auth/register/student */
    registerStudent: (payload: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/register/student`, payload)
    },

    /** POST /v2/auth/register/parent */
    registerParent: (payload: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/register/parent`, payload)
    },

    /** POST /v2/auth/otp/send */
    sendOtp: (payload: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/otp/send`, payload)
    },

    /** POST /v2/auth/otp/verify */
    verifyOtp: (token: string, otp: string, type?: string) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/otp/verify`, { token, otp, type })
    },

    /** POST /v2/auth/password/reset - find user, returns masked phone/email */
    resetPassword: (payload: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/password/reset`, payload)
    },

    /** POST /v2/auth/password/change */
    changePassword: (token: string, password: string, password_confirmation: string) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/password/change`, { token, password, password_confirmation })
    },

    /** GET /v2/auth/me */
    me: () => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/auth/me`)
    },

    /** POST /v2/auth/profile */
    updateProfile: (payload: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/profile`, payload)
    },

    /** POST /v2/auth/logout */
    logout: () => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/logout`)
    },

    /** GET /v2/auth/devices */
    devices: () => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/auth/devices`)
    },

    /** POST /v2/auth/devices/{id} */
    revokeDevice: (deviceId: number | string) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/auth/devices/${deviceId}`)
    }
}
