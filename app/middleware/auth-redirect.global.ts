/**
 * Global routing rules:
 * - Guests can browse public pages freely but are bounced to /auth/login
 *   if they try to enter /dashboard.
 * - Authenticated users may freely browse the public landing & CMS pages
 *   (about, terms, privacy, contact, etc.). They are only bounced away
 *   from /auth/* (login/register) since they're already signed in.
 */
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('APlus-token')
  const isAuthed = !!token.value

  const inDashboard = to.path === '/dashboard' || to.path.startsWith('/dashboard/')
  const inAuth = to.path.startsWith('/auth')

  if (isAuthed && inAuth) {
    return navigateTo('/dashboard')
  }

  if (!isAuthed && inDashboard) {
    return navigateTo('/auth/login')
  }
})
