// Guest middleware: redirects authenticated users (any role) into the dashboard.
export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('APlus-token')
  if (token.value) {
    return navigateTo('/dashboard')
  }
})
