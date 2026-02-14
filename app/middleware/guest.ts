export default defineNuxtRouteMiddleware((to, from) => {
  // Use useCookie instead of store in middleware
  const token = useCookie('APlus-token')
  const userDataEncrypted = useCookie('APlus-user')

  if (token.value && userDataEncrypted.value) {
    // User is logged in, redirect based on role
    try {
      const userData = JSON.parse(userDataEncrypted.value)
      const userRole = userData.role?.toLowerCase()

      switch (userRole) {
        case 'student':
          return navigateTo('/')
        case 'teacher':
        case 'parent':
          return navigateTo('/dashboard')
        default:
          return navigateTo('/')
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }
})
