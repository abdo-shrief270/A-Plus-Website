import { ref, computed } from 'vue'
import type { Ref } from 'vue'

interface PaginationLike {
  current_page: number
  last_page: number
}

interface PaginatedResult<T> {
  questions?: T[]
  data?: T[]
  pagination?: PaginationLike
  meta?: PaginationLike
}

export function useInfiniteScroll<T>(fetchFn: (page: number) => Promise<PaginatedResult<T>>) {
  const items = ref<T[]>([]) as Ref<T[]>
  const currentPage = ref(1)
  const lastPage = ref(1)
  const isLoading = ref(false)
  const error = ref<unknown>(null)

  const hasMore = computed(() => currentPage.value < lastPage.value)

  const loadMore = async () => {
    if (isLoading.value || !hasMore.value) return
    isLoading.value = true
    try {
      const nextPage = currentPage.value + 1
      const result = await fetchFn(nextPage)

      const newItems = result?.questions || result?.data || []
      items.value = [...items.value, ...newItems]

      const pagination = result?.pagination || result?.meta
      if (pagination) {
        currentPage.value = pagination.current_page
        lastPage.value = pagination.last_page
      }
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const reset = (initialItems: T[] = [], pagination?: PaginationLike) => {
    items.value = initialItems
    if (pagination) {
      currentPage.value = pagination.current_page || 1
      lastPage.value = pagination.last_page || 1
    } else {
      currentPage.value = 1
      lastPage.value = 1
    }
  }

  return {
    items,
    currentPage,
    lastPage,
    isLoading,
    error,
    hasMore,
    loadMore,
    reset
  }
}
