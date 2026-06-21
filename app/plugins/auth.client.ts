/**
 * Hydrate the Pinia auth store from localStorage on app boot.
 *
 * The store starts empty on every page load. Without this, role getters
 * (isParent / isStudent / isSchool) return false until something explicitly
 * calls authStore.fetchUser(), which made role-aware UI (sidebar, page
 * branches) render the wrong shape after a hard refresh.
 */
import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  if (!authStore.user) {
    await authStore.fetchUser()
  }
})
