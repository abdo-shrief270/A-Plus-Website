export interface Meta {
  current_page: number
  total: number
  last_page: number
  per_page: number
  from?: number
  to?: number
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data: T
  meta?: Meta
  errors?: Record<string, string[]>
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}
