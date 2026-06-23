<template>
  <div>
    <!-- Hero: greeting + points -->
    <div class="relative bg-gradient-to-l from-primary-600 to-primary-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-md mb-6">
      <div class="absolute top-0 left-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/4 blur-2xl" />
      <div class="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary-400/30 rounded-full translate-y-1/2 blur-2xl" />

      <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="flex items-center gap-4 min-w-0">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white/20 shrink-0">
            {{ initial(user?.name) }}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-medium text-white/80 mb-1">
              {{ greeting }}
            </p>
            <h1 class="text-2xl sm:text-3xl font-bold text-white truncate drop-shadow-sm">
              {{ user?.name || '—' }}
            </h1>
            <p class="text-sm text-white/90 mt-1">
              واصل تقدّمك نحو التفوّق ✨
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <div class="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center ring-1 ring-white/20">
            <p class="text-2xl font-black text-white flex items-center gap-1 justify-center">
              <UIcon
                v-if="walletState.hasUnlimited"
                name="i-mdi-infinity"
                class="w-6 h-6"
              />
              <span v-else>{{ formatNumber(walletState.points) }}</span>
            </p>
            <p class="text-[11px] text-white/80 mt-0.5">
              رصيدي
            </p>
          </div>
          <div class="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center ring-1 ring-white/20">
            <p class="text-2xl font-black text-white">
              {{ formatNumber(walletState.score) }}
            </p>
            <p class="text-[11px] text-white/80 mt-0.5">
              نقاطي
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No exam set -->
    <div
      v-if="!hasExam"
      class="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-academic-cap"
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <h3 class="text-lg font-bold text-gray-900 mb-1">
        حدّد اختبارك للبدء
      </h3>
      <p class="text-sm text-gray-500 mb-5">
        اختر الاختبار وتاريخه من ملفك الشخصي لتظهر لك خطة دراسية مخصّصة.
      </p>
      <UButton
        to="/dashboard/profile"
        color="primary"
        icon="i-heroicons-user"
      >
        تحديث الملف الشخصي
      </UButton>
    </div>

    <template v-else>
      <!-- Primary action cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <!-- Continue study plan -->
        <NuxtLink
          to="/dashboard/plan"
          class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all p-6"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
              <UIcon
                name="i-heroicons-calendar-days"
                class="w-6 h-6 text-primary-600"
              />
            </div>
            <UIcon
              name="i-heroicons-arrow-left"
              class="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors"
            />
          </div>
          <h3 class="text-base font-bold text-gray-900 mb-1">
            خطتي الدراسية
          </h3>
          <p
            v-if="plan?.summary"
            class="text-xs text-gray-500"
          >
            <template v-if="plan.summary.due_today > 0">
              لديك {{ plan.summary.due_today }} درس مستحق اليوم
            </template>
            <template v-else>
              أنجزت {{ plan.summary.completion_percentage }}% — تابع التقدّم
            </template>
          </p>
          <div
            v-if="plan?.summary"
            class="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-primary-500 transition-all"
              :style="{ width: `${plan.summary.completion_percentage}%` }"
            />
          </div>
        </NuxtLink>

        <!-- Daily challenge -->
        <div class="bg-gradient-to-l from-secondary-50 to-white rounded-2xl border border-secondary-200 shadow-sm p-6 flex flex-col">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-secondary-500 flex flex-col items-center justify-center text-white shadow">
              <span class="text-base leading-none">🔥</span>
              <span class="text-xs font-black leading-tight">{{ daily?.streak ?? 0 }}</span>
            </div>
          </div>
          <h3 class="text-base font-bold text-gray-900 mb-1">
            التحدي اليومي
          </h3>
          <p class="text-xs text-gray-500 mb-4 flex-1">
            <template v-if="dailyDone">
              أنجزت تحدي اليوم ✅ — سلسلة {{ daily?.streak }} يوم
            </template>
            <template v-else>
              {{ daily?.config?.question_count ?? 10 }} أسئلة سريعة + نقاط للدوري
            </template>
          </p>
          <UButton
            v-if="dailyInProgress"
            :to="`/dashboard/quizzes/${daily?.today?.id}`"
            color="warning"
            block
            icon="i-heroicons-play"
          >
            متابعة
          </UButton>
          <UButton
            v-else-if="!dailyDone"
            color="secondary"
            block
            icon="i-heroicons-fire"
            :loading="startingDaily"
            @click="startDaily"
          >
            ابدأ التحدي
          </UButton>
          <UButton
            v-else
            to="/dashboard/leaderboard"
            color="neutral"
            variant="soft"
            block
            icon="i-heroicons-trophy"
          >
            ترتيبي في الدوري
          </UButton>
        </div>
      </div>

      <!-- Nudges row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <!-- Due reviews -->
        <NuxtLink
          to="/dashboard/review"
          class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-warning-200 transition-all p-4 flex items-center gap-3"
        >
          <div class="w-11 h-11 rounded-xl bg-warning-50 flex items-center justify-center shrink-0">
            <UIcon
              name="i-heroicons-arrow-path-rounded-square"
              class="w-5 h-5 text-warning-600"
            />
          </div>
          <div class="min-w-0">
            <p class="text-lg font-black text-gray-900 leading-tight">
              {{ formatNumber(reviewDue) }}
            </p>
            <p class="text-[11px] text-gray-500">
              أخطاء للمراجعة
            </p>
          </div>
        </NuxtLink>

        <!-- League rank -->
        <NuxtLink
          to="/dashboard/leaderboard"
          class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-primary-200 transition-all p-4 flex items-center gap-3"
        >
          <div class="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <UIcon
              name="i-heroicons-trophy"
              class="w-5 h-5 text-primary-600"
            />
          </div>
          <div class="min-w-0">
            <p class="text-lg font-black text-gray-900 leading-tight">
              {{ rank ? `#${rank}` : '—' }}
            </p>
            <p class="text-[11px] text-gray-500 truncate">
              {{ leagueName || 'الدوري' }}
            </p>
          </div>
        </NuxtLink>

        <!-- Weak category -->
        <button
          v-if="weakest"
          type="button"
          class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-error-200 transition-all p-4 flex items-center gap-3 text-right w-full"
          @click="practiceWeak"
        >
          <div class="w-11 h-11 rounded-xl bg-error-50 flex items-center justify-center shrink-0">
            <UIcon
              name="i-heroicons-arrow-trending-down"
              class="w-5 h-5 text-error-500"
            />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-gray-900 leading-tight truncate">
              {{ weakest.name }}
            </p>
            <p class="text-[11px] text-error-500">
              {{ weakest.accuracy }}% — تدرّب الآن
            </p>
          </div>
        </button>
        <NuxtLink
          v-else
          to="/dashboard/performance"
          class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-primary-200 transition-all p-4 flex items-center gap-3"
        >
          <div class="w-11 h-11 rounded-xl bg-info-50 flex items-center justify-center shrink-0">
            <UIcon
              name="i-heroicons-chart-bar"
              class="w-5 h-5 text-info-600"
            />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-gray-900 leading-tight">
              تحليل الأداء
            </p>
            <p class="text-[11px] text-gray-500">
              تابع دقّتك ونقاط ضعفك
            </p>
          </div>
        </NuxtLink>
      </div>

      <!-- Explore shortcuts -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 class="text-sm font-bold text-gray-700 mb-3">
          استكشف
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <NuxtLink
            v-for="s in shortcuts"
            :key="s.to"
            :to="s.to"
            class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all text-center"
          >
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', s.bg]">
              <UIcon
                :name="s.icon"
                :class="['w-5 h-5', s.color]"
              />
            </div>
            <span class="text-xs font-bold text-gray-700">{{ s.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { studyPlanService } from '@/services/api/studyPlan.service'
import { quizzesService } from '@/services/api/quizzes.service'
import { reviewService } from '@/services/api/review.service'
import { performanceService } from '@/services/api/performance.service'
import { leaderboardService } from '@/services/api/leaderboard.service'
import { formatNumber } from '@/utils/number'
import { showToast } from '@/utils/helpers/toast.helper'
import type { StudyPlan } from '@/types/lesson'
import type { DailyChallengeStatus } from '@/types/quiz'

const authStore = useAuthStore()
const wallet = useStudentWallet()
const walletState = wallet.state

const user = computed(() => authStore.getUser)
const hasExam = computed(() => !!(authStore.getUser as { student?: { exam_id?: number } })?.student?.exam_id)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'صباح الخير'
  if (hour < 18) return 'مساء النور'
  return 'مساء الخير'
})

function initial(name?: string | null) {
  return name?.charAt(0)?.toUpperCase() ?? 'A'
}

// ---- Aggregated data ----
const plan = ref<StudyPlan | null>(null)
const daily = ref<DailyChallengeStatus | null>(null)
const reviewDue = ref(0)
const rank = ref<number | null>(null)
const leagueName = ref('')
const weakest = ref<{ category_id: number, name: string, accuracy: number } | null>(null)
const startingDaily = ref(false)

const dailyDone = computed(() => {
  const s = daily.value?.today?.status
  return s === 'completed' || s === 'expired'
})
const dailyInProgress = computed(() => daily.value?.today?.status === 'in_progress')

const shortcuts = [
  { label: 'بنك الأسئلة', to: '/dashboard/question-bank', icon: 'i-heroicons-clipboard-document-list', bg: 'bg-primary-50', color: 'text-primary-600' },
  { label: 'اختباراتي', to: '/dashboard/quizzes', icon: 'i-heroicons-puzzle-piece', bg: 'bg-secondary-50', color: 'text-secondary-600' },
  { label: 'الكورسات', to: '/dashboard/courses', icon: 'i-heroicons-academic-cap', bg: 'bg-success-50', color: 'text-success-600' },
  { label: 'المتصدرين', to: '/dashboard/leaderboard', icon: 'i-heroicons-trophy', bg: 'bg-warning-50', color: 'text-warning-600' }
]

async function startDaily() {
  startingDaily.value = true
  try {
    const res = await quizzesService.startDailyChallenge()
    const session = res.data?.data?.session
    if (res.data?.status === 409) {
      showToast('تنبيه', res.data?.message || 'لديك اختبار قيد التنفيذ', 'warning')
      return
    }
    if (session?.id) navigateTo(`/dashboard/quizzes/${session.id}`)
  } catch (err) {
    console.error('Failed to start daily challenge', err)
  } finally {
    startingDaily.value = false
  }
}

function practiceWeak() {
  if (!weakest.value) return
  navigateTo({ path: '/dashboard/quizzes', query: { category: weakest.value.category_id, source: 'wrong' } })
}

async function loadAll() {
  if (!hasExam.value) return
  // Each call is independent; failures degrade gracefully.
  studyPlanService.get().then(r => (plan.value = r.data?.data ?? null)).catch(() => {})
  quizzesService.getDailyChallenge().then(r => (daily.value = r.data?.data ?? null)).catch(() => {})
  reviewService.getQueue({ per_page: 1 }).then(r => (reviewDue.value = r.data?.data?.summary?.due_count ?? 0)).catch(() => {})
  leaderboardService.get('week').then((r) => {
    const d = r.data?.data
    rank.value = d?.me?.rank ?? null
    leagueName.value = d?.league?.name ?? ''
  }).catch(() => {})
  performanceService.get(14).then((r) => {
    weakest.value = r.data?.data?.categories?.weakest?.[0] ?? null
  }).catch(() => {})
}

onMounted(async () => {
  if (!hasExam.value) await authStore.refreshUser()
  wallet.refresh()
  loadAll()
})
</script>
