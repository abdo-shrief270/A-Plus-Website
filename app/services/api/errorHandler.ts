import type { AxiosError } from 'axios'

/**
 * Side-effects for known status codes (cookie wipe, redirect).
 * The caller decides whether to call this — auth endpoints (login/refresh)
 * skip it because the user is already on the auth flow and we don't want to
 * blow away state mid-attempt.
 */
export function handleResponseErrors(error: AxiosError) {
  if (!error.response) {
    console.error('Network error:', error.message)
    return Promise.reject(new Error('Network Error'))
  }

  const { status } = error.response

  switch (status) {
    case 401:
      useCookie('APlus-token').value = null
      navigateTo('/auth/login')
      break
    case 403:
      navigateTo('/unauthorized')
      break
    case 404:
      break
    case 423:
      return Promise.reject(new Error('Resource Locked'))
    default:
      console.error(`Unhandled error with status ${status}`)
  }

  return Promise.reject(error)
}
