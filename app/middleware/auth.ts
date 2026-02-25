export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('APlus-token')

  if (!token.value) {
    return navigateTo('/auth/login')
  }
})
