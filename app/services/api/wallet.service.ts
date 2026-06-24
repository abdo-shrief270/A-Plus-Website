import createAxiosInstance from '@/services/api/instance'

const VERSION = 'v2'

export const walletService = {
  /** GET /v2/wallet/transactions - سجل النقاط (paginated ledger) */
  transactions: (params?: Record<string, string | number | undefined>) => {
    const axios = createAxiosInstance()
    return axios.get(`/${VERSION}/wallet/transactions`, { params })
  }
}
