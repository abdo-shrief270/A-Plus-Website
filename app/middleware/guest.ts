// Guest middleware: redirect authenticated users to their role's home
export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('APlus-token')
  const userType = useCookie('APlus-type')

  if (token.value) {
    const type = userType.value?.toLowerCase()
    if (type === 'student') {
      return navigateTo('/dashboard/student')
    }
    // parent and school go to dashboard
    return navigateTo('/dashboard')
  }
})
