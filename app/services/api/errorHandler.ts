import type { AxiosError } from 'axios'

export function handleResponseErrors(error: AxiosError) {
  if (!error.response) {
    console.error('Network error:', error.message)
    return Promise.reject(new Error('Network Error'))
  }

  const { status } = error.response

  switch (status) {
    case 401:
      // Logout user
      useCookie('APlus-token').value = null
      navigateTo('/auth/login')
      break
    case 403:
      navigateTo('/unauthorized')
      break
    case 404:
      // Handle 404
      break
    case 423:
      return Promise.reject(new Error('Resource Locked'))
    default:
      console.error(`Unhandled error with status ${status}`)
  }

  return Promise.reject(error)
}
