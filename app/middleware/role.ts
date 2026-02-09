export default defineNuxtRouteMiddleware((to, from) => {
    // Use useCookie instead of store in middleware
    const token = useCookie('APlus-token')
    const userDataEncrypted = useCookie('APlus-user')

    if (!token.value) {
        return navigateTo('/login')
    }

    if (!userDataEncrypted.value) {
        return navigateTo('/login')
    }

    try {
        const userData = JSON.parse(userDataEncrypted.value)
        const userRole = userData.role?.toLowerCase()

        // Only teachers and parents can access dashboard
        if (userRole === 'student') {
            return navigateTo('/')
        }

        // Allow teachers and parents
        if (userRole === 'teacher' || userRole === 'parent') {
            return
        }

        // Unknown role, redirect to home
        return navigateTo('/')
    }
    catch (error) {
        console.error('Error parsing user data:', error)
        return navigateTo('/login')
    }
})
