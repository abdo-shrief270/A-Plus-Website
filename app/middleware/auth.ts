export default defineNuxtRouteMiddleware((to, from) => {
    // Use useCookie instead of store in middleware
    const token = useCookie('APlus-token')

    if (!token.value) {
        return navigateTo('/login')
    }
})
