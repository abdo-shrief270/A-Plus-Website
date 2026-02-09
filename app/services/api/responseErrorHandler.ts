import { AxiosError } from 'axios'

export const responseErrorHandler = (error: unknown) => {
  if (error instanceof AxiosError && error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      errors: error.response.data?.errors || {},
      status: error.response.status
    }
  }

  return {
    message: 'An unexpected error occurred',
    errors: {},
    status: 500
  }
}
