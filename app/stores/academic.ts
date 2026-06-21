import { defineStore } from 'pinia'
import { examsService } from '@/services/api/exams.service'
import type { Exam, Section } from '@/types/question-bank'

interface AcademicState {
  exams: Exam[]
  currentExam: Exam | null
  subjectsByExam: Record<string, unknown[]>
  sectionsByExam: Record<string, Section[]>
  loadingExams: boolean
  loadingExam: boolean
  error: string | null
}

/**
 * Single store for the academic hierarchy: exams (study stages) → sections →
 * subjects. Keyed caches are scoped per-exam-id so we don't refetch on
 * navigation but can still drop a single entry on demand.
 *
 * Was previously split between `academic.ts` and `useExamsStore.ts` — those
 * duplicated state and disagreed on shape. Consolidated 2026-05-01.
 */
export const useAcademicStore = defineStore('academic', {
  state: (): AcademicState => ({
    exams: [],
    currentExam: null,
    subjectsByExam: {},
    sectionsByExam: {},
    loadingExams: false,
    loadingExam: false,
    error: null
  }),

  actions: {
    async fetchExams(forceRefresh = false): Promise<Exam[]> {
      if (this.exams.length > 0 && !forceRefresh) return this.exams

      this.loadingExams = true
      this.error = null
      try {
        const res = await examsService.getExams()
        const payload = res.data?.data || res.data
        const list: Exam[] = Array.isArray(payload)
          ? payload
          : (payload?.exams || payload?.data || [])
        this.exams = list
        return this.exams
      } catch (error) {
        const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        this.error = msg || 'Failed to fetch exams'
        return []
      } finally {
        this.loadingExams = false
      }
    },

    async fetchExamById(examId: number | string, forceRefresh = false): Promise<Exam | null> {
      const cached = this.exams.find(e => String(e.id) === String(examId))
      if (cached && !forceRefresh) {
        this.currentExam = cached
        return cached
      }

      this.loadingExam = true
      this.error = null
      try {
        const res = await examsService.getExamDetails(examId)
        const payload = res.data?.data || res.data
        const exam: Exam | null = payload?.exam || payload || null
        this.currentExam = exam
        return exam
      } catch (error) {
        const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        this.error = msg || 'Failed to fetch exam details'
        return null
      } finally {
        this.loadingExam = false
      }
    },

    async fetchSubjectsForExam(examId: number | string, forceRefresh = false): Promise<unknown[]> {
      const key = String(examId)
      if (this.subjectsByExam[key] && !forceRefresh) return this.subjectsByExam[key]

      try {
        const res = await examsService.getExamSubjects(examId)
        const payload = res.data?.data || res.data
        const list = Array.isArray(payload) ? payload : (payload?.subjects || [])
        this.subjectsByExam[key] = list
        return list
      } catch (error) {
        console.error(`Failed to fetch subjects for exam ${examId}:`, error)
        return []
      }
    },

    async fetchSectionsForExam(examId: number | string, forceRefresh = false): Promise<Section[]> {
      const key = String(examId)
      if (this.sectionsByExam[key] && !forceRefresh) return this.sectionsByExam[key]

      try {
        const res = await examsService.getExamSections(examId)
        const payload = res.data?.data || res.data
        const list: Section[] = Array.isArray(payload) ? payload : (payload?.sections || [])
        this.sectionsByExam[key] = list
        return list
      } catch (error) {
        console.error(`Failed to fetch sections for exam ${examId}:`, error)
        return []
      }
    }
  }
})
