import { ref, computed, watch } from 'vue'
import type { Pagination } from '~/types/question-bank'

interface PaginationOptions {
  perPage?: number
  /** Called whenever the current page changes (e.g. to refetch). */
  onPageChange?: (page: number) => void
}

/**
 * Accepts either a perPage number (legacy) or an options object with an
 * `onPageChange` callback that fires whenever the page changes.
 */
export function usePagination(arg: number | PaginationOptions = 15) {
  const options: PaginationOptions = typeof arg === 'number' ? { perPage: arg } : arg
  const currentPage = ref(1)
  const perPage = ref(options.perPage ?? 15)
  const total = ref(0)
  const lastPage = ref(1)

  if (options.onPageChange) {
    watch(currentPage, page => options.onPageChange!(page))
  }

  const setPagination = (meta: Pagination) => {
    currentPage.value = meta.current_page
    perPage.value = meta.per_page
    total.value = meta.total
    lastPage.value = meta.last_page
  }

  const hasNext = computed(() => currentPage.value < lastPage.value)
  const hasPrev = computed(() => currentPage.value > 1)

  const nextPage = () => {
    if (hasNext.value) currentPage.value++
  }

  const prevPage = () => {
    if (hasPrev.value) currentPage.value--
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= lastPage.value) {
      currentPage.value = page
    }
  }

  return {
    currentPage,
    perPage,
    total,
    lastPage,
    hasNext,
    hasPrev,
    setPagination,
    nextPage,
    prevPage,
    goToPage
  }
}
