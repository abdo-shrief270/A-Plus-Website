import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const studentService = {
    /** GET /v2/students */
    list: (params?: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/students`, { params })
    },

    /** GET /v2/students/{id} */
    detail: (id: number | string) => {
        const axios = createAxiosInstance()
        return axios.get(`/${VERSION}/students/${id}`)
    },

    /** PUT /v2/students/{id} */
    update: (id: number | string, payload: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.put(`/${VERSION}/students/${id}`, payload)
    },

    /** DELETE /v2/students/{id} */
    destroy: (id: number | string, reason?: string) => {
        const axios = createAxiosInstance()
        return axios.delete(`/${VERSION}/students/${id}`, { data: { reason } })
    },

    /** POST /v2/students — single student create (school) */
    create: (payload: Record<string, any>) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/students`, payload)
    },

    /** POST /v2/students/bulk — bulk JSON array */
    bulkCreate: (students: Record<string, any>[]) => {
        const axios = createAxiosInstance()
        return axios.post(`/${VERSION}/students/bulk`, { students })
    },

    /** POST /v2/students/import — file upload (CSV/Excel) */
    importFile: (file: File) => {
        const axios = createAxiosInstance()
        const formData = new FormData()
        formData.append('file', file)
        return axios.post(`/${VERSION}/students/import`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }
}
