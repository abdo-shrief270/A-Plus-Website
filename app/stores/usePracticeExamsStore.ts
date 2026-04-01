import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAxios } from '../composables/useAxios'
import type { PracticeExam, PaginatedData } from '../types/question-bank'

/**
 * Practice Exams Store
 * Manages full practice test sessions and mock exams.
 */
export const usePracticeExamsStore = defineStore('practiceExams', () => {
  const axios = useAxios()

  // State
  const practiceExams = ref<PracticeExam[]>([])
  const currentPracticeExam = ref<PracticeExam | null>(null)
  const pagination = ref<Omit<PaginatedData<PracticeExam>, 'data'> | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * GET /practice-exams
   * List all mock tests and evaluation models.
   */
  const fetchPracticeExams = async (params: { 
    search?: string; 
    paginate?: boolean; 
    per_page?: number; 
    page?: number 
  } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await axios.get<PaginatedData<PracticeExam> | PracticeExam[]>('/practice-exams', { params })
      
      if (Array.isArray(result)) {
        practiceExams.value = result
        pagination.value = null
      } else {
        practiceExams.value = result.data
        pagination.value = {
          current_page: result.current_page,
          per_page: result.per_page,
          total: result.total,
          last_page: result.last_page
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch practice exams'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET /practice-exams/{id}
   * Starts a new practice session and retrieves questions.
   */
  const startPracticeSession = async (id: number | string) => {
    isLoading.value = true
    error.value = null
    try {
      // The API returns the full detail of the practice exam including its questions
      const data = await axios.get<PracticeExam>(`/practice-exams/${id}`)
      currentPracticeExam.value = data
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to start practice session'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    practiceExams,
    currentPracticeExam,
    pagination,
    isLoading,
    error,
    
    // Actions
    fetchPracticeExams,
    startPracticeSession
  }
})
