export const useRedirect = () => {
  const redirectByRole = (user: any) => {
    if (!user) {
      return navigateTo('/login')
    }

    const userRole = user.role?.toLowerCase()

    switch (userRole) {
      case 'student':
        return navigateTo('/')
      case 'teacher':
      case 'parent':
        return navigateTo('/dashboard')
      default:
        return navigateTo('/')
    }
  }

  return {
    redirectByRole
  }
}
