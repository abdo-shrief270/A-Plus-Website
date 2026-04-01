import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAxios } from '../composables/useAxios'
import type { Question, QuestionSubmissionResult, PaginatedData } from '../types/question-bank'

/**
 * Questions Store
 * Handles various question lists, single question details, and submission (answering).
 */
export const useQuestionsStore = defineStore('questions', () => {
  const axios = useAxios()

  // State
  const trendingQuestions = ref<Question[]>([])
  const recentQuestions = ref<Question[]>([])
  const searchResults = ref<Question[]>([])
  const currentQuestion = ref<Question | null>(null)
  
  const trendingPagination = ref<Omit<PaginatedData<Question>, 'data'> | null>(null)
  const recentPagination = ref<Omit<PaginatedData<Question>, 'data'> | null>(null)
  const searchPagination = ref<Omit<PaginatedData<Question>, 'data'> | null>(null)

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * GET /questions/trending
   */
  const fetchTrending = async (params: { page?: number; per_page?: number } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await axios.get<PaginatedData<Question>>('/questions/trending', { params })
      trendingQuestions.value = result.data
      trendingPagination.value = {
        current_page: result.current_page,
        per_page: result.per_page,
        total: result.total,
        last_page: result.last_page
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
  const fetchRecent = async (params: { page?: number; per_page?: number } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await axios.get<PaginatedData<Question>>('/questions/recent', { params })
      recentQuestions.value = result.data
      recentPagination.value = {
        current_page: result.current_page,
        per_page: result.per_page,
        total: result.total,
        last_page: result.last_page
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
  const searchQuestions = async (params: { q: string; per_page?: number; page?: number }) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await axios.get<PaginatedData<Question>>('/questions/search', { params })
      searchResults.value = result.data
      searchPagination.value = {
        current_page: result.current_page,
        per_page: result.per_page,
        total: result.total,
        last_page: result.last_page
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
      const data = await axios.get<Question>(`/questions/${id}`)
      currentQuestion.value = data
      return data
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
  const fetchCategoryQuestions = async (categoryId: number | string, params: { paginate?: boolean; per_page?: number; page?: number } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await axios.get<PaginatedData<Question> | Question[]>(`/categories/${categoryId}/questions`, { params })
      return result
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch category questions'
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
      const result = await axios.get<Question[]>(`/articles/${articleId}/questions`)
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
  const submitAnswer = async (payload: { question_id: number; answer_id: number }) => {
    isLoading.value = true
    error.value = null
    try {
      // Axial interceptor automatically handles data extraction and auth headers
      const result = await axios.post<QuestionSubmissionResult>('/questions/answer', payload)
      return result
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
    currentQuestion,
    trendingPagination,
    recentPagination,
    searchPagination,
    isLoading,
    error,
    
    // Actions
    fetchTrending,
    fetchRecent,
    searchQuestions,
    fetchQuestionById,
    fetchCategoryQuestions,
    fetchArticleQuestions,
    submitAnswer
  }
})
