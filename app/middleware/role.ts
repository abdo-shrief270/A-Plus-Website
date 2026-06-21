/**
 * Role middleware: lets every authenticated role (student, parent, school)
 * into the dashboard. Per-page nav and content are gated by role inside the
 * dashboard itself, not by routing.
 */
export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('APlus-token')
  const userType = useCookie('APlus-type')

  if (!token.value) {
    return navigateTo('/auth/login')
  }

  const type = userType.value?.toLowerCase()
  const allowed = ['student', 'parent', 'school']

  if (type && allowed.includes(type)) {
    return
  }

  return navigateTo('/auth/login')
})
