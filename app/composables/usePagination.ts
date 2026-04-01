import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface UsePaginationOptions {
  /**
   * Callback to fetch data when page changes.
   */
  onPageChange?: (page: number) => void | Promise<void>
  /**
   * Default page if not in query.
   */
  defaultPage?: number
  /**
   * Whether to scroll to top on page change.
   */
  scrollToTop?: boolean
}

/**
 * usePagination
 * Synchronizes a page ref with the URL 'page' query parameter.
 */
export const usePagination = (options: UsePaginationOptions = {}) => {
  const route = useRoute()
  const router = useRouter()

  const {
    onPageChange,
    defaultPage = 1,
    scrollToTop = true
  } = options

  // Initialize from query param or default
  const currentPage = ref(Number(route.query.page) || defaultPage)

  // Watch for internal page changes (e.g. from UPagination)
  // and update the URL query
  watch(currentPage, (newPage, oldPage) => {
    if (newPage === oldPage) return

    // Update URL query
    router.push({
      query: {
        ...route.query,
        page: newPage.toString()
      }
    })

    // Execute callback
    if (onPageChange) {
      onPageChange(newPage)
    }

    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  // Watch for external URL changes (e.g. browser back button)
  // and sync back to the ref
  watch(() => route.query.page, (newQueryPage) => {
    const pageVal = Number(newQueryPage) || defaultPage
    if (pageVal !== currentPage.value) {
      currentPage.value = pageVal
      // Note: the watch(currentPage) above will trigger onPageChange
    }
  })

  return {
    currentPage
  }
}
