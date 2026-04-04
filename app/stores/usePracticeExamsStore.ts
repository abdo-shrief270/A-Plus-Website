import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '../composables/useApi'
import type { PracticeExam, Pagination, Question } from '../types/question-bank'

/**
 * Practice Exams Store
 * Manages full practice test sessions and mock exams.
 */
export const usePracticeExamsStore = defineStore('practiceExams', () => {
  const api = new useApi('practice-exams', 'v2')

  // State
  const practiceExams = ref<PracticeExam[]>([])
  const currentPracticeExam = ref<PracticeExam | null>(null)
  const pagination = ref<Pagination | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Session State
  const currentQuestionIndex = ref(0)
  const userAnswers = ref<Record<number, number | string>>({}) // question_id -> answer_id or text
  const timeRemaining = ref(0) // in seconds
  const isSessionActive = ref(false)
  const results = ref<Record<number, { is_correct: boolean; score_earned: number; correct_answer?: number }>>({})

  const currentQuestion = computed(() => {
    return currentPracticeExam.value?.questions?.[currentQuestionIndex.value] || null
  })

  /**
   * GET /practice-exams
   */
  const fetchPracticeExams = async (params: {
    search?: string;
    paginate?: boolean;
    per_page?: number;
    page?: number;
  } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.get(params) as Record<string, unknown>

      if (Array.isArray(result)) {
        practiceExams.value = result as unknown as PracticeExam[]
        pagination.value = null
      } else {
        practiceExams.value = (result.practice_exams || result.data) as PracticeExam[]
        pagination.value = (result.pagination || result) as Pagination
      }
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Failed to fetch practice exams'
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
      const result = await api.show(id) as Record<string, unknown>
      const data = (result?.practice_exam || result?.data || result) as PracticeExam
      currentPracticeExam.value = data
      
      // Initialize session
      currentQuestionIndex.value = 0
      userAnswers.value = {}
      results.value = {}
      timeRemaining.value = (data.duration_minutes || 0) * 60
      isSessionActive.value = true
      
      return data
    } catch (err: unknown) {
      error.value = (err as any).response?.data?.message || 'Failed to start practice session'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const setAnswer = (questionId: number, answer: number | string) => {
    userAnswers.value[questionId] = answer
  }

  const setResult = (questionId: number, result: { is_correct: boolean; score_earned: number; correct_answer?: number }) => {
    results.value[questionId] = result
  }

  const endSession = () => {
    isSessionActive.value = false
    // Finalize state if needed
  }

  return {
    // State
    practiceExams,
    currentPracticeExam,
    pagination,
    isLoading,
    error,
    currentQuestionIndex,
    userAnswers,
    timeRemaining,
    isSessionActive,
    results,
    currentQuestion,

    // Actions
    fetchPracticeExams,
    startPracticeSession,
    setAnswer,
    setResult,
    endSession
  }
})
