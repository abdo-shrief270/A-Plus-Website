import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import type { Question, QuestionSubmissionResult, PaginatedData } from '../types/question-bank'

interface QuestionsResponse {
  questions: Question[]
  pagination?: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

interface CategoryQuestionsResponse extends QuestionsResponse {
  category: any
}

interface SubjectQuestionsResponse extends QuestionsResponse {
  subject: any
}

interface QuestionDetailResponse {
  question: Question
}

/**
 * Questions Store
 * Handles various question lists, single question details, and submission (answering).
 */
export const useQuestionsStore = defineStore('questions', () => {
  const api = new useApi('questions', 'v2')

  // State
  const trendingQuestions = ref<Question[]>([])
  const recentQuestions = ref<Question[]>([])
  const searchResults = ref<Question[]>([])
  const categoryQuestions = ref<Question[]>([])
  const subjectQuestions = ref<Question[]>([])
  const currentQuestion = ref<Question | null>(null)
  const currentCategory = ref<any>(null)
  const currentSubject = ref<any>(null)

  const trendingPagination = ref<Omit<PaginatedData<Question>, 'data'>>({ current_page: 1, per_page: 15, total: 0, last_page: 1 })
  const recentPagination = ref<Omit<PaginatedData<Question>, 'data'>>({ current_page: 1, per_page: 15, total: 0, last_page: 1 })
  const searchPagination = ref<Omit<PaginatedData<Question>, 'data'>>({ current_page: 1, per_page: 15, total: 0, last_page: 1 })
  const categoryPagination = ref<Omit<PaginatedData<Question>, 'data'>>({ current_page: 1, per_page: 15, total: 0, last_page: 1 })
  const subjectPagination = ref<Omit<PaginatedData<Question>, 'data'>>({ current_page: 1, per_page: 15, total: 0, last_page: 1 })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * GET /questions/trending
   */
  const fetchTrending = async (params: { page?: number, per_page?: number } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.get(params, 'trending') as any
      const data = result?.questions || []
      const paginationData = result?.pagination

      trendingQuestions.value = data
      if (paginationData) {
        trendingPagination.value = {
          current_page: paginationData.current_page,
          per_page: paginationData.per_page,
          total: paginationData.total,
          last_page: paginationData.last_page
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch trending questions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET /questions/recent
   */
  const fetchRecent = async (params: { page?: number, per_page?: number } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.get(params, 'recent') as any
      const data = result?.questions || []
      const paginationData = result?.pagination

      recentQuestions.value = data
      if (paginationData) {
        recentPagination.value = {
          current_page: paginationData.current_page,
          per_page: paginationData.per_page,
          total: paginationData.total,
          last_page: paginationData.last_page
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch recent questions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET /questions/search
   */
  const searchQuestions = async (params: { q: string, per_page?: number, page?: number }) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.get(params, 'search') as any
      const data = result?.questions || []
      const paginationData = result?.pagination

      searchResults.value = data
      if (paginationData) {
        searchPagination.value = {
          current_page: paginationData.current_page,
          per_page: paginationData.per_page,
          total: paginationData.total,
          last_page: paginationData.last_page
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Search failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET /questions/{id}
   */
  const fetchQuestionById = async (id: number | string) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.show(id) as any
      // Handle various data wrapping scenarios
      const data = result?.question || result?.data || result
      currentQuestion.value = data as Question
      return data as Question
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch question details'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET /categories/{id}/questions
   */
  const fetchCategoryQuestions = async (categoryId: number | string, params: { paginate?: boolean, per_page?: number, page?: number } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const queryParams = { ...params }
      if (typeof queryParams.paginate === 'boolean') {
        queryParams.paginate = queryParams.paginate ? (1 as any) : (0 as any)
      }

      const categoryApi = new useApi(`categories/${categoryId}/questions`, 'v2')
      const result = await categoryApi.get(queryParams) as any

      // The interceptor might have already unwrapped 'data'
      // but we handle both cases for safety
      const questions = result?.questions || []
      const paginationData = result?.pagination
      const categoryData = result?.category

      categoryQuestions.value = questions
      if (categoryData) currentCategory.value = categoryData

      if (paginationData) {
        const total = Number(paginationData.total) || 0
        const perPage = Number(paginationData.per_page) || 15
        const lastPage = Number(paginationData.last_page) || Math.ceil(total / perPage) || 1
        const currentPageVal = Number(paginationData.current_page) || 1

        categoryPagination.value = {
          current_page: currentPageVal,
          per_page: perPage,
          total: total,
          last_page: lastPage
        }
      }
      return result
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch category questions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET /subjects/{id}/questions
   */
  const fetchSubjectQuestions = async (subjectId: number | string, params: { paginate?: boolean, per_page?: number, page?: number } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const queryParams = { ...params }
      if (typeof queryParams.paginate === 'boolean') {
        queryParams.paginate = queryParams.paginate ? (1 as any) : (0 as any)
      }

      const subjectApi = new useApi(`subjects/${subjectId}/questions`, 'v2')
      const result = await subjectApi.get(queryParams) as any
      const data = result?.questions || []
      const paginationData = result?.pagination
      const subjectData = result?.subject

      if (data) subjectQuestions.value = data
      if (subjectData) currentSubject.value = subjectData

      if (paginationData) {
        const total = Number(paginationData.total) || 0
        const perPage = Number(paginationData.per_page) || 15
        const lastPage = Number(paginationData.last_page) || Math.ceil(total / perPage) || 1

        subjectPagination.value = {
          current_page: Number(paginationData.current_page) || 1,
          per_page: perPage,
          total: total,
          last_page: lastPage
        }
      }
      return result
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch subject questions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET /articles/{id}/questions
   */
  const fetchArticleQuestions = async (articleId: number | string) => {
    isLoading.value = true
    error.value = null
    try {
      const articleApi = new useApi(`articles/${articleId}/questions`, 'v2')
      const result = await articleApi.get() as any
      return result
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch article questions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * POST /questions/answer
   * Authenticated endpoint to submit an answer.
   */
  const submitAnswer = async (payload: { question_id: number, answer_id: number }) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.post('answer', payload) as any
      return result?.data || result
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to submit answer'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    trendingQuestions,
    recentQuestions,
    searchResults,
    categoryQuestions,
    subjectQuestions,
    currentQuestion,
    currentCategory,
    currentSubject,
    trendingPagination,
    recentPagination,
    searchPagination,
    categoryPagination,
    subjectPagination,
    isLoading,
    error,

    // Actions
    fetchTrending,
    fetchRecent,
    searchQuestions,
    fetchQuestionById,
    fetchCategoryQuestions,
    fetchSubjectQuestions,
    fetchArticleQuestions,
    submitAnswer
  }
})
