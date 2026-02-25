// Role middleware: ensures only school and parent can access /dashboard routes
export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('APlus-token')
  const userType = useCookie('APlus-type')

  if (!token.value) {
    return navigateTo('/auth/login')
  }

  const type = userType.value?.toLowerCase()

  // Students are redirected to their home page
  if (type === 'student') {
    return navigateTo('/')
  }

  // school and parent are allowed onto the dashboard
  if (type === 'school' || type === 'parent') {
    return
  }

  // Unknown role — back to login
  return navigateTo('/auth/login')
})
