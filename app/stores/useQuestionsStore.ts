import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import type { Question, QuestionSubmissionResult, Article, Course, Pagination } from '../types/question-bank'

/**
 * Questions Store
 * Handles various question lists, single question details, articles, and courses.
 */
export const useQuestionsStore = defineStore('questions', () => {
  const api = new useApi('questions', 'v2')

  // State
  const trendingQuestions = ref<Question[]>([])
  const recentQuestions = ref<Question[]>([])
  const searchResults = ref<Question[]>([])
  const categoryQuestions = ref<Question[]>([])
  const currentQuestion = ref<Question | null>(null)

  // Articles State
  const categoryArticles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  const articleQuestions = ref<Question[]>([])

  // Courses State
  const trendingCourses = ref<Course[]>([])

  // Category State
  const currentCategory = ref<Record<string, unknown> | null>(null)

  // Pagination State
  const trendingPagination = ref<Pagination>({ current_page: 1, per_page: 15, total: 0, last_page: 1 })
  const recentPagination = ref<Pagination>({ current_page: 1, per_page: 15, total: 0, last_page: 1 })
  const searchPagination = ref<Pagination>({ current_page: 1, per_page: 15, total: 0, last_page: 1 })
  const categoryPagination = ref<Pagination>({ current_page: 1, per_page: 15, total: 0, last_page: 1 })
  const articlePagination = ref<Pagination>({ current_page: 1, per_page: 15, total: 0, last_page: 1 })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * GET /questions/trending
   */
  const fetchTrending = async (params: { page?: number, per_page?: number } = {}, append = false) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.get(params, 'trending') as Record<string, unknown>
      const data = (result?.questions as Question[]) || []
      const paginationData = result?.pagination as Pagination

      if (append) {
        trendingQuestions.value = [...trendingQuestions.value, ...data]
      } else {
        trendingQuestions.value = data
      }

      if (paginationData) {
        trendingPagination.value = paginationData
      }
      return result
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Failed to fetch trending questions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET /questions/recent
   */
  const fetchRecent = async (params: { page?: number, per_page?: number } = {}, append = false) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.get(params, 'recent') as Record<string, unknown>
      const data = (result?.questions as Question[]) || []
      const paginationData = result?.pagination as Pagination

      if (append) {
        recentQuestions.value = [...recentQuestions.value, ...data]
      } else {
        recentQuestions.value = data
      }

      if (paginationData) {
        recentPagination.value = paginationData
      }
      return result
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Failed to fetch recent questions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET /questions/search
   */
  const searchQuestions = async (params: { q: string, per_page?: number, page?: number }, append = false) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.get(params, 'search') as Record<string, unknown>
      const data = (result?.questions as Question[]) || []
      const paginationData = result?.pagination as Pagination

      if (append) {
        searchResults.value = [...searchResults.value, ...data]
      } else {
        searchResults.value = data
      }

      if (paginationData) {
        searchPagination.value = paginationData
      }
      return result
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Search failed'
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
      const result = await api.show(id) as Record<string, unknown>
      const data = result?.question || result?.data || result
      currentQuestion.value = data as Question
      return data as Question
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Failed to fetch question details'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET /categories/{id}/questions
   */
  const fetchCategoryQuestions = async (categoryId: number | string, params: { paginate?: boolean, per_page?: number, page?: number } = {}, append = false) => {
    isLoading.value = true
    error.value = null
    try {
      const queryParams = { ...params }
      if (typeof queryParams.paginate === 'boolean') {
        queryParams.paginate = queryParams.paginate ? (1 as any) : (0 as any)
      }

      const categoryApi = new useApi(`categories/${categoryId}/questions`, 'v2')
      const result = await categoryApi.get(queryParams) as Record<string, unknown>

      const questions = (result?.questions as Question[]) || []
      const paginationData = result?.pagination as Pagination
      const categoryData = result?.category as Record<string, unknown>

      if (append) {
        categoryQuestions.value = [...categoryQuestions.value, ...questions]
      } else {
        categoryQuestions.value = questions
      }

      if (categoryData) currentCategory.value = categoryData

      if (paginationData) {
        categoryPagination.value = paginationData
      }
      return result
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Failed to fetch category questions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET /categories/{id}/articles
   */
  const fetchCategoryArticles = async (categoryId: number | string) => {
    isLoading.value = true
    error.value = null
    try {
      const categoryApi = new useApi(`categories/${categoryId}/articles`, 'v2')
      const result = await categoryApi.get() as Record<string, unknown>
      categoryArticles.value = (result?.articles as Article[]) || []
      return result
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Failed to fetch articles'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Articles Actions
   */
  const fetchArticleById = async (id: number | string) => {
    isLoading.value = true
    error.value = null
    try {
      const articleApi = new useApi('articles', 'v2')
      const result = await articleApi.show(id) as Record<string, unknown>
      const data = result?.article || result?.data || result
      currentArticle.value = data as Article
      // If questions are returned in the detail response (Section 5.1)
      if (result?.questions) {
        articleQuestions.value = result.questions as Question[]
      }
      return data
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Failed to fetch article details'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchArticleQuestions = async (articleId: number | string, params: { per_page?: number, page?: number } = {}, append = false) => {
    isLoading.value = true
    error.value = null
    try {
      const articleApi = new useApi(`articles/${articleId}/questions`, 'v2')
      const result = await articleApi.get(params) as Record<string, unknown>
      const questions = (result?.questions as Question[]) || []
      const paginationData = result?.pagination as Pagination

      if (append) {
        articleQuestions.value = [...articleQuestions.value, ...questions]
      } else {
        articleQuestions.value = questions
      }

      if (paginationData) {
        articlePagination.value = paginationData
      }
      return result
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Failed to fetch article questions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Courses Actions
   */
  const fetchTrendingCourses = async (params: { limit?: number } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const coursesApi = new useApi('trending-courses', 'v2')
      const result = await coursesApi.get(params) as unknown as Course[]
      trendingCourses.value = result || []
      return result
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Failed to fetch trending courses'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * POST /questions/answer
   */
  const submitAnswer = async (payload: { question_id: number, answer_id?: number, user_answer?: string }) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.post('answer', payload) as Record<string, unknown>
      return (result?.data || result) as QuestionSubmissionResult
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Failed to submit answer'
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
    currentQuestion,
    categoryArticles,
    currentArticle,
    articleQuestions,
    trendingCourses,
    currentCategory,
    trendingPagination,
    recentPagination,
    searchPagination,
    categoryPagination,
    articlePagination,
    isLoading,
    error,

    // Actions
    fetchTrending,
    fetchRecent,
    searchQuestions,
    fetchQuestionById,
    fetchCategoryQuestions,
    fetchCategoryArticles,
    fetchArticleById,
    fetchArticleQuestions,
    fetchTrendingCourses,
    submitAnswer
  }
})
