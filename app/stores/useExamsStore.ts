import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import type { Exam, PaginatedData, Section } from '../types/question-bank'

interface ExamsResponse {
  exams: Exam[]
  data?: Exam[]
  current_page?: number
  per_page?: number
  total?: number
  last_page?: number
}

interface ExamDetailsResponse {
  exam: Exam
}

interface SectionsResponse {
  sections: Section[]
}

interface SubjectsResponse {
  subjects: any[]
}

/**
 * Exams Store
 * Manages study stages/exams and their hiearchical sections.
 */
export const useExamsStore = defineStore('exams', () => {
  const api = new useApi('exams', 'v2')

  const exams = ref<Exam[]>([])
  const currentExam = ref<Exam | null>(null)
  const sections = ref<Section[]>([])
  const subjects = ref<any[]>([])
  const pagination = ref<Omit<PaginatedData<Exam>, 'data'> | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch all exams with optional search and pagination
   */
  const fetchExams = async (params: { search?: string, per_page?: number, page?: number } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.get(params) as any

      // Handle wrapper: { exams: [] }
      if (result && result.exams) {
        exams.value = result.exams
        pagination.value = null
      } else if (result && result.data) {
        // Fallback for paginated structures if they exist
        exams.value = result.data
        pagination.value = {
          current_page: result.current_page || 1,
          per_page: result.per_page || 15,
          total: result.total || 0,
          last_page: result.last_page || 1
        }
      } else {
        exams.value = Array.isArray(result) ? (result as unknown as Exam[]) : []
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch exams'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch single exam details
   */
  const fetchExamById = async (id: number | string) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.show(id) as any
      // Handle wrapper: { exam: {} }
      const data = result?.exam || (result as unknown as Exam)
      currentExam.value = data
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch exam details'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch sections for a specific exam
   */
  const fetchExamSections = async (id: number | string) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.get(null, `${id}/sections`) as any
      // Handle wrapper: { sections: [] }
      const data = result?.sections || (result as unknown as Section[])
      sections.value = Array.isArray(data) ? data : []
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch sections'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch subjects for a specific exam
   */
  const fetchExamSubjects = async (id: number | string) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.get(null, `${id}/subjects`) as any
      const data = result?.subjects || (result as unknown as any[])
      subjects.value = Array.isArray(data) ? data : []
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch subjects'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    exams,
    currentExam,
    sections,
    subjects,
    pagination,
    isLoading,
    error,

    // Actions
    fetchExams,
    fetchExamById,
    fetchExamSections,
    fetchExamSubjects
  }
})
