import type { User } from '@/types/auth'

export const useRedirect = () => {
  const redirectByRole = (user: User) => {
    const type = user?.type?.toLowerCase()
    if (type === 'student') {
      return navigateTo('/dashboard/student')
    }
    // school and parent go to dashboard
    return navigateTo('/dashboard')
  }

  return { redirectByRole }
}
