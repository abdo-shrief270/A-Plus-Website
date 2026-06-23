import { studentsService } from '@/services/api/students.service'
import { subscriptionsService } from '@/services/api/plans.service'
import { useAuthStore } from '@/stores/auth'

interface ActiveSubscription {
  id: number
  starts_at: string | null
  ends_at: string | null
  plan: {
    id: number
    name: string
    type: 'subscription' | 'pack' | string
    points: number
    duration_days: number | null
  }
}

interface SubscriptionRow {
  id: number
  status?: string
  starts_at?: string | null
  ends_at?: string | null
  plan: {
    id: number
    name: string
    type: 'subscription' | 'pack' | string
    points?: number | null
    duration_days?: number | null
  }
}

interface WalletState {
  points: number // wallet balance (رصيد النقاط) — spent when answering
  score: number // league score (نقاطي) — earned on correct answers
  hasUnlimited: boolean
  loaded: boolean
  loading: boolean
  activeSubscription: ActiveSubscription | null
  totalSubscriptions: number
  activePackCount: number
}

const initial: WalletState = {
  points: 0,
  score: 0,
  hasUnlimited: false,
  loaded: false,
  loading: false,
  activeSubscription: null,
  totalSubscriptions: 0,
  activePackCount: 0
}

export const useStudentWallet = () => {
  const authStore = useAuthStore()
  const state = useState<WalletState>('aplus-student-wallet', () => ({ ...initial }))

  const studentId = computed<number | null>(() => {
    const u = authStore.getUser as ({ student?: { id?: number | null } | null } | null)
    return u?.student?.id ?? null
  })

  async function refresh() {
    if (!authStore.isStudent || !studentId.value) {
      state.value = { ...initial }
      return
    }
    state.value.loading = true
    try {
      const [profileRes, subsRes] = await Promise.all([
        studentsService.getStudentProfile(studentId.value),
        subscriptionsService.list({ per_page: 100 }).catch(() => ({ data: { data: [] } }))
      ])

      const profileBody = profileRes.data?.data ?? profileRes.data ?? {}
      const student = profileBody.student ?? profileBody
      state.value.points = Number(student.total_points ?? 0)
      state.value.score = Number(student.total_score ?? 0)
      state.value.hasUnlimited = Boolean(student.has_unlimited_points)

      const subsBody = subsRes.data?.data ?? subsRes.data ?? {}
      const subs: SubscriptionRow[] = subsBody?.data ?? (Array.isArray(subsBody) ? subsBody : [])

      state.value.totalSubscriptions = subs.length
      state.value.activePackCount = subs.filter(s => s.status === 'active' && s.plan?.type === 'pack').length

      const activeSub = subs.find(s => s.status === 'active' && s.plan?.type === 'subscription')
      state.value.activeSubscription = activeSub
        ? {
            id: activeSub.id,
            starts_at: activeSub.starts_at ?? null,
            ends_at: activeSub.ends_at ?? null,
            plan: {
              id: activeSub.plan.id,
              name: activeSub.plan.name,
              type: activeSub.plan.type,
              points: Number(activeSub.plan.points ?? 0),
              duration_days: activeSub.plan.duration_days ?? null
            }
          }
        : null

      state.value.loaded = true
    } catch (err) {
      console.error('Failed to load student wallet', err)
    } finally {
      state.value.loading = false
    }
  }

  /**
   * Update the wallet balance from a known value (e.g. the `balance` returned
   * by the answer endpoint) so the navbar counter stays live without a refresh.
   */
  function setPoints(points: number) {
    if (Number.isFinite(points)) {
      state.value.points = points
    }
  }

  /** Update the league score from a known value (e.g. answer/complete response). */
  function setScore(score: number) {
    if (Number.isFinite(score)) {
      state.value.score = score
    }
  }

  /**
   * Apply both totals from any point-changing API response in one call.
   * Ignores nullish fields so partial payloads are safe.
   */
  function applyTotals(payload: { balance?: number | null, total_score?: number | null }) {
    if (payload?.balance != null) setPoints(payload.balance)
    if (payload?.total_score != null) setScore(payload.total_score)
  }

  return {
    state: readonly(state),
    refresh,
    setPoints,
    setScore,
    applyTotals
  }
}
