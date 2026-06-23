import { enrollmentsService } from '@/services/api/courses.service'
import { useAuthStore } from '@/stores/auth'

interface EnrollmentRow {
  status?: string
  course_id?: number | string | null
  course?: { id?: number | string | null } | null
}

interface EnrollmentsState {
  /** Course IDs the student currently has an `active` enrollment in. */
  activeCourseIds: number[]
  loaded: boolean
  loading: boolean
}

const initial: EnrollmentsState = {
  activeCourseIds: [],
  loaded: false,
  loading: false
}

export const useStudentEnrollments = () => {
  const authStore = useAuthStore()
  const state = useState<EnrollmentsState>('aplus-student-enrollments', () => ({ ...initial }))

  async function refresh() {
    if (!authStore.isStudent) {
      state.value = { ...initial }
      return
    }
    state.value.loading = true
    try {
      const res = await enrollmentsService.list({ per_page: 200 })
      const body = res.data?.data ?? res.data ?? {}
      const rows: EnrollmentRow[] = body?.data ?? (Array.isArray(body) ? body : [])
      state.value.activeCourseIds = rows
        .filter(r => r.status === 'active')
        .map(r => Number(r.course_id ?? r.course?.id))
        .filter(n => Number.isFinite(n))
      state.value.loaded = true
    } catch (err) {
      console.error('Failed to load student enrollments', err)
      state.value.activeCourseIds = []
    } finally {
      state.value.loading = false
    }
  }

  function isEnrolled(courseId: number | string | null | undefined): boolean {
    if (courseId == null) return false
    return state.value.activeCourseIds.includes(Number(courseId))
  }

  async function ensureLoaded() {
    if (!state.value.loaded && !state.value.loading) {
      await refresh()
    }
  }

  return {
    state: readonly(state),
    refresh,
    ensureLoaded,
    isEnrolled
  }
}
