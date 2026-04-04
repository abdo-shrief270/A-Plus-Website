import { ref, computed } from 'vue'
import type { Pagination } from '~/types/question-bank'

export function usePagination(defaultPerPage = 15) {
  const currentPage = ref(1)
  const perPage = ref(defaultPerPage)
  const total = ref(0)
  const lastPage = ref(1)

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
