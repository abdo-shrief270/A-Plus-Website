import type { User } from '@/types/auth'

export const useRedirect = () => {
  const redirectByRole = (_user: User) => {
    // All roles land on /dashboard. The dashboard index renders the right home
    // per role (StudentHome for students, the admin dashboard for school/parent).
    return navigateTo('/dashboard')
  }

  return { redirectByRole }
}
