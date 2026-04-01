import { defineStore } from 'pinia'
import { examsService } from '@/services/api/exams.service'

interface AcademicState {
  exams: any[]
  subjectsByExam: Record<string, any[]>
  sectionsByExam: Record<string, any[]>
  loadingExams: boolean
}

export const useAcademicStore = defineStore('academic', {
  state: (): AcademicState => ({
    exams: [],
    subjectsByExam: {},
    sectionsByExam: {},
    loadingExams: false
  }),

  actions: {
    async fetchExams(forceRefresh = false) {
      if (this.exams.length > 0 && !forceRefresh) return this.exams

      this.loadingExams = true
      try {
        const res = await examsService.getExams()
        const payload = res.data?.data || res.data
        this.exams = Array.isArray(payload) ? payload : (payload?.exams || [])
        return this.exams
      } catch (error) {
        console.error('Failed to fetch exams:', error)
        return []
      } finally {
        this.loadingExams = false
      }
    },

    async fetchSubjectsForExam(examId: number | string, forceRefresh = false) {
      if (this.subjectsByExam[examId] && !forceRefresh) {
        return this.subjectsByExam[examId]
      }

      try {
        const res = await examsService.getExamSubjects(examId)
        const payload = res.data?.data || res.data
        this.subjectsByExam[examId] = Array.isArray(payload) ? payload : (payload?.subjects || [])
        return this.subjectsByExam[examId]
      } catch (error) {
        console.error(`Failed to fetch subjects for exam ${examId}:`, error)
        return []
      }
    },

    async fetchSectionsForExam(examId: number | string, forceRefresh = false) {
      if (this.sectionsByExam[examId] && !forceRefresh) {
        return this.sectionsByExam[examId]
      }

      try {
        const res = await examsService.getExamSections(examId)
        const payload = res.data?.data || res.data
        this.sectionsByExam[examId] = Array.isArray(payload) ? payload : (payload?.sections || [])
        return this.sectionsByExam[examId]
      } catch (error) {
        console.error(`Failed to fetch sections for exam ${examId}:`, error)
        return []
      }
    }
  }
})
