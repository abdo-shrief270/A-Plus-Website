export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('APlus-token')

  if (!token.value) {
    return navigateTo('/auth/login')
  }
})
