import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAxios } from '../composables/useAxios'
import type { Exam, PaginatedData } from '../types/question-bank'

/**
 * Exams Store
 * Manages study stages/exams and their hiearchical sections.
 */
export const useExamsStore = defineStore('exams', () => {
  const axios = useAxios()

  const exams = ref<Exam[]>([])
  const currentExam = ref<Exam | null>(null)
  const sections = ref<any[]>([])
  const subjects = ref<any[]>([])
  const pagination = ref<Omit<PaginatedData<Exam>, 'data'> | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch all exams with optional search and pagination
   */
  const fetchExams = async (params: { search?: string; per_page?: number; page?: number } = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await axios.get<any>('/exams', { params })

      // Handle the wrapping observed in the API: { exams: [] }
      if (result && result.exams) {
        exams.value = result.exams as Exam[]
        pagination.value = null
      } else if (result && result.data) {
        exams.value = result.data as Exam[]
        pagination.value = {
          current_page: result.current_page,
          per_page: result.per_page,
          total: result.total,
          last_page: result.last_page
        }
      } else {
        exams.value = result as unknown as Exam[]
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
      const result = await axios.get<any>(`/exams/${id}`)
      // Handle the wrapping observed in the API: { exam: {} }
      const data = result?.exam || result
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
      const result = await axios.get<any>(`/exams/${id}/sections`)
      const data = result?.sections || result
      sections.value = data
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
      const result = await axios.get<any>(`/exams/${id}/subjects`)
      const data = result?.subjects || result
      subjects.value = data
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
