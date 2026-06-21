<template>
  <div>
    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Not found -->
    <div
      v-else-if="!session"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-question-mark-circle"
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500 mb-4">
        لم يتم العثور على هذا الاختبار.
      </p>
      <UButton
        to="/dashboard/quizzes"
        color="primary"
        variant="soft"
      >
        العودة لاختباراتي
      </UButton>
    </div>

    <!-- Abandoned -->
    <div
      v-else-if="session.status === 'abandoned'"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-x-circle"
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500 mb-4">
        تم إلغاء هذا الاختبار.
      </p>
      <UButton
        to="/dashboard/quizzes"
        color="primary"
        icon="i-heroicons-plus"
      >
        اختبار جديد
      </UButton>
    </div>

    <!-- ============ PLAYER ============ -->
    <template v-else-if="session.status === 'in_progress'">
      <!-- Sticky header -->
      <div class="sticky top-0 z-20 -mx-4 px-4 py-3 bg-white/85 backdrop-blur-xl border-b border-gray-100 mb-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <span class="text-sm font-black text-gray-900">
              {{ session.mode === 'tutor' ? 'وضع التوجيه' : 'وضع الاختبار' }}
            </span>
            <span class="text-xs text-gray-500">
              {{ answeredCount }} / {{ session.question_count }}
            </span>
          </div>

          <!-- Timer -->
          <div
            v-if="session.deadline_at"
            :class="[
              'flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-sm',
              timer.isCritical.value
                ? 'bg-error-50 text-error-600 animate-pulse'
                : 'bg-primary-50 text-primary-700'
            ]"
          >
            <UIcon
              name="i-heroicons-clock"
              class="w-4 h-4"
            />
            {{ timer.formatted.value }}
          </div>

          <UButton
            color="error"
            variant="soft"
            size="sm"
            @click="finishModalOpen = true"
          >
            إنهاء الاختبار
          </UButton>
        </div>

        <!-- Progress dots -->
        <div class="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
          <button
            v-for="(q, idx) in session.questions"
            :key="q.question.id"
            type="button"
            :disabled="!canJumpTo(idx)"
            :class="[
              'w-8 h-8 rounded-lg text-[11px] font-black shrink-0 transition-all border',
              idx === currentIndex
                ? 'bg-primary-500 border-primary-500 text-white shadow-md scale-110'
                : isAnswered(q)
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-400',
              !canJumpTo(idx) ? 'opacity-40 cursor-not-allowed' : 'hover:border-primary-300'
            ]"
            @click="goTo(idx)"
          >
            {{ idx + 1 }}
          </button>
        </div>
      </div>

      <!-- Current question -->
      <QuizQuestionCard
        v-if="currentQuestion"
        :session-question="currentQuestion"
        :mode="session.mode"
        state="play"
        :feedback="feedbackByQuestion[currentQuestion.question.id] ?? null"
        :submitting="submitting"
        @answer="onAnswer"
      />

      <!-- Navigation -->
      <div class="flex items-center justify-between mt-6">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-right"
          :disabled="currentIndex === 0"
          @click="goTo(currentIndex - 1)"
        >
          السابق
        </UButton>
        <UButton
          v-if="currentIndex < (session.questions?.length ?? 0) - 1"
          color="primary"
          trailing-icon="i-heroicons-arrow-left"
          :disabled="!canLeaveCurrent"
          @click="goTo(currentIndex + 1)"
        >
          التالي
        </UButton>
        <UButton
          v-else
          color="success"
          trailing-icon="i-heroicons-flag"
          @click="finishModalOpen = true"
        >
          إنهاء الاختبار
        </UButton>
      </div>

      <!-- Finish confirm modal -->
      <UModal v-model:open="finishModalOpen">
        <template #content>
          <div class="p-6 text-center">
            <UIcon
              name="i-heroicons-flag"
              class="w-12 h-12 text-primary-500 mx-auto mb-3"
            />
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              إنهاء الاختبار؟
            </h3>
            <p class="text-sm text-gray-500 mb-6">
              <template v-if="unansweredCount > 0">
                لديك {{ unansweredCount }} سؤال بدون إجابة — سيُحتسب كمتجاهَل.
              </template>
              <template v-else>
                أجبت على جميع الأسئلة. هل تريد عرض النتيجة؟
              </template>
            </p>
            <div class="flex items-center justify-center gap-3">
              <UButton
                color="primary"
                :loading="finishing"
                @click="finishQuiz"
              >
                نعم، أنهِ الاختبار
              </UButton>
              <UButton
                color="neutral"
                variant="soft"
                @click="finishModalOpen = false"
              >
                متابعة الحل
              </UButton>
            </div>
          </div>
        </template>
      </UModal>
    </template>

    <!-- ============ RESULTS ============ -->
    <template v-else>
      <ConfettiOverlay
        ref="confettiRef"
        :active="false"
      />

      <!-- Score card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div class="px-6 py-8 bg-gradient-to-l from-primary-50/40 to-white text-center">
          <div
            :class="[
              'w-28 h-28 mx-auto rounded-full border-8 flex items-center justify-center mb-4',
              scoreBand.ring
            ]"
          >
            <span :class="['text-3xl font-black', scoreBand.text]">
              {{ Math.round(session.score_percent ?? 0) }}%
            </span>
          </div>
          <h2 class="text-xl font-black text-gray-900 mb-1">
            {{ scoreBand.title }}
          </h2>
          <p class="text-sm text-gray-500">
            {{ session.status === 'expired' ? 'انتهى وقت الاختبار تلقائياً.' : scoreBand.subtitle }}
          </p>

          <!-- Config chips -->
          <div class="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span
              v-if="session.practice_exam"
              class="text-[11px] px-2.5 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 font-bold"
            >
              <UIcon
                name="i-heroicons-document-text"
                class="w-3 h-3 inline align-middle"
              /> {{ session.practice_exam.title }}
            </span>
            <span
              v-else-if="session.is_simulation"
              class="text-[11px] px-2.5 py-1 rounded-full bg-info-50 border border-info-100 text-info-700 font-bold"
            >
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-3 h-3 inline align-middle"
              /> محاكاة شاملة
            </span>
            <span
              v-else-if="session.is_daily_challenge"
              class="text-[11px] px-2.5 py-1 rounded-full bg-secondary-50 border border-secondary-100 text-secondary-700 font-bold"
            >
              🔥 التحدي اليومي
            </span>
            <span class="text-[11px] px-2.5 py-1 rounded-full bg-white border border-gray-100 text-gray-600 font-bold">
              {{ session.mode === 'tutor' ? 'وضع التوجيه' : 'وضع الاختبار' }}
            </span>
            <span
              v-if="!session.is_simulation"
              class="text-[11px] px-2.5 py-1 rounded-full bg-white border border-gray-100 text-gray-600 font-bold"
            >
              {{ sourceLabel(session.source) }}
            </span>
            <span
              v-if="timeTaken"
              class="text-[11px] px-2.5 py-1 rounded-full bg-white border border-gray-100 text-gray-600 font-bold"
            >
              <UIcon
                name="i-heroicons-clock"
                class="w-3 h-3 inline align-middle"
              />
              {{ timeTaken }}
            </span>
          </div>
        </div>

        <!-- Stat tiles -->
        <div class="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100 border-t border-gray-100">
          <div class="py-5 text-center">
            <p class="text-2xl font-black text-success-600">
              {{ session.correct_count }}
            </p>
            <p class="text-[11px] text-gray-500 mt-1">
              صحيحة
            </p>
          </div>
          <div class="py-5 text-center">
            <p class="text-2xl font-black text-error-500">
              {{ session.incorrect_count }}
            </p>
            <p class="text-[11px] text-gray-500 mt-1">
              خاطئة
            </p>
          </div>
          <div class="py-5 text-center">
            <p class="text-2xl font-black text-gray-400">
              {{ session.skipped_count }}
            </p>
            <p class="text-[11px] text-gray-500 mt-1">
              متجاهَلة
            </p>
          </div>
        </div>
      </div>

      <!-- Section breakdown (simulation only) -->
      <div
        v-if="session.section_breakdown && session.section_breakdown.length"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
      >
        <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-l from-info-50/40 to-white">
          <h3 class="text-base font-bold text-gray-900">
            الأداء حسب القسم
          </h3>
        </div>
        <div class="p-4 space-y-3">
          <div
            v-for="sec in session.section_breakdown"
            :key="sec.section_id"
          >
            <div class="flex items-center justify-between text-sm mb-1.5">
              <span class="font-bold text-gray-700">{{ sec.name }}</span>
              <span class="text-gray-500">
                {{ sec.correct }}/{{ sec.total }}
                <span
                  :class="[
                    'font-black mr-1',
                    sec.accuracy >= 50 ? 'text-success-600' : 'text-error-500'
                  ]"
                >{{ sec.accuracy }}%</span>
              </span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                :class="[
                  'h-full transition-all',
                  sec.accuracy >= 50 ? 'bg-success-500' : 'bg-error-400'
                ]"
                :style="{ width: `${sec.accuracy}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 mb-8 flex-wrap">
        <UButton
          v-if="session.challenge_code"
          :to="`/dashboard/challenges/${session.challenge_code}`"
          color="secondary"
          icon="i-heroicons-user-group"
        >
          نتائج التحدّي
        </UButton>
        <UButton
          to="/dashboard/quizzes"
          color="primary"
          icon="i-heroicons-plus"
        >
          اختبار جديد
        </UButton>
        <UButton
          color="neutral"
          variant="soft"
          :icon="reviewOpen ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
          @click="reviewOpen = !reviewOpen"
        >
          {{ reviewOpen ? 'إخفاء المراجعة' : 'مراجعة الأسئلة' }}
        </UButton>
      </div>

      <!-- Review -->
      <div
        v-if="reviewOpen"
        class="space-y-5"
      >
        <QuizQuestionCard
          v-for="q in session.questions"
          :key="q.question.id"
          :session-question="q"
          :mode="session.mode"
          state="review"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { quizzesService } from '@/services/api/quizzes.service'
import { useQuizTimer } from '@/composables/useQuizTimer'
import QuizQuestionCard from '@/components/quiz/QuizQuestionCard.vue'
import ConfettiOverlay from '@/components/common/ConfettiOverlay.vue'
import { showToast } from '@/utils/helpers/toast.helper'
import type { QuizSession, QuizSessionQuestion, QuizTutorFeedback } from '@/types/quiz'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'الاختبار' })
useSeoMeta({ title: 'الاختبار | A Plus' })

const route = useRoute()
const sessionId = route.params.id as string

// Captured in setup so live-points updates don't call useState() post-await.
const wallet = useStudentWallet()

const loading = ref(true)
const session = ref<QuizSession | null>(null)
const currentIndex = ref(0)
const submitting = ref(false)
const finishing = ref(false)
const finishModalOpen = ref(false)
const reviewOpen = ref(false)
const confettiRef = ref<InstanceType<typeof ConfettiOverlay> | null>(null)

/** Tutor feedback per question id, fed back into the card after each answer. */
const feedbackByQuestion = reactive<Record<number, QuizTutorFeedback>>({})

// ---- Timer (server deadline is the source of truth) ----
const deadlineAt = computed(() => session.value?.status === 'in_progress' ? session.value?.deadline_at ?? null : null)
const timer = useQuizTimer(deadlineAt, onTimeUp)

async function onTimeUp() {
  showToast('انتهى الوقت', 'تم إنهاء الاختبار تلقائياً', 'warning')
  await finishQuiz()
}

// ---- Load ----
// `reposition` jumps to the first unanswered question — only on the initial
// open/resume, not on background re-syncs (which would yank the student back).
async function loadSession(reposition = true) {
  loading.value = true
  try {
    const res = await quizzesService.getSession(sessionId)
    session.value = res.data?.data?.session ?? null
    if (reposition && session.value?.status === 'in_progress') {
      const idx = (session.value.questions ?? []).findIndex(q => !q.answered_at)
      currentIndex.value = idx === -1 ? 0 : idx
    }
  } catch (err) {
    console.error('Failed to load quiz session', err)
    session.value = null
  } finally {
    loading.value = false
  }
}

const currentQuestion = computed<QuizSessionQuestion | null>(() =>
  session.value?.questions?.[currentIndex.value] ?? null
)

const answeredCount = computed(() =>
  (session.value?.questions ?? []).filter(q => isAnswered(q)).length
)

const unansweredCount = computed(() =>
  (session.value?.question_count ?? 0) - answeredCount.value
)

function isAnswered(q: QuizSessionQuestion) {
  return !!q.answered_at || !!q.chosen_answer_id
}

// Tutor mode: must answer before moving forward (no peeking ahead).
const canLeaveCurrent = computed(() => {
  if (session.value?.mode === 'exam') return true
  return currentQuestion.value ? isAnswered(currentQuestion.value) : true
})

function canJumpTo(idx: number) {
  if (!session.value) return false
  if (session.value.mode === 'exam') return true
  // Tutor: only answered questions, current, or the next unanswered one
  const questions = session.value.questions ?? []
  if (idx <= currentIndex.value) return true
  const firstUnanswered = questions.findIndex(q => !isAnswered(q))
  return idx <= (firstUnanswered === -1 ? questions.length - 1 : firstUnanswered)
}

function goTo(idx: number) {
  if (!session.value?.questions) return
  if (idx < 0 || idx >= session.value.questions.length) return
  if (!canJumpTo(idx)) return
  currentIndex.value = idx
}

// ---- Answering ----
async function onAnswer(questionId: number, answerId: number) {
  if (!session.value || submitting.value) return
  submitting.value = true
  try {
    const res = await quizzesService.submitAnswer(session.value.id, {
      question_id: questionId,
      answer_id: answerId
    })
    const body = res.data

    // Session finalized server-side (deadline hit) → show results
    if (body?.status === 409) {
      await loadSession()
      return
    }

    const data = body?.data ?? {}
    const row = session.value.questions?.find(q => q.question.id === questionId)
    if (row) {
      row.chosen_answer_id = answerId
      row.answered_at = new Date().toISOString()
    }

    if (session.value.mode === 'tutor' && 'is_correct' in data) {
      feedbackByQuestion[questionId] = data as QuizTutorFeedback
    }
  } catch (err) {
    const resp = (err as { response?: { status?: number, data?: { status?: number } } })?.response
    if (resp?.status === 409 || resp?.data?.status === 409) {
      await loadSession()
    } else {
      console.error('Failed to submit answer', err)
    }
  } finally {
    submitting.value = false
  }
}

// ---- Finish ----
async function finishQuiz() {
  if (!session.value || finishing.value) return
  finishing.value = true
  finishModalOpen.value = false
  try {
    const res = await quizzesService.completeSession(session.value.id)
    session.value = res.data?.data?.session ?? session.value
    timer.stop()

    const bonus = res.data?.data?.daily_bonus_points
    if (bonus) {
      showToast('🔥 التحدي اليومي', `حصلت على +${bonus} نقطة في الدوري!`, 'success')
    }
    // Keep the navbar league counter live after a daily-challenge bonus.
    wallet.applyTotals({ total_score: res.data?.data?.total_score })

    if ((session.value?.score_percent ?? 0) >= 50) {
      nextTick(() => confettiRef.value?.fire?.())
    }
  } catch (err) {
    console.error('Failed to complete quiz', err)
  } finally {
    finishing.value = false
  }
}

// ---- Results display ----
const scoreBand = computed(() => {
  const score = session.value?.score_percent ?? 0
  if (score >= 85) return { ring: 'border-success-200 bg-success-50', text: 'text-success-600', title: 'ممتاز! أداء رائع', subtitle: 'استمر على هذا المستوى المبهر.' }
  if (score >= 50) return { ring: 'border-primary-200 bg-primary-50', text: 'text-primary-600', title: 'أحسنت!', subtitle: 'نتيجة جيدة — راجع الأخطاء لتتحسن أكثر.' }
  return { ring: 'border-error-200 bg-error-50', text: 'text-error-500', title: 'تحتاج مزيداً من التدريب', subtitle: 'راجع الشرح وأعد المحاولة بأسئلة مشابهة.' }
})

const timeTaken = computed(() => {
  if (!session.value?.started_at || !session.value?.completed_at) return null
  const ms = new Date(session.value.completed_at).getTime() - new Date(session.value.started_at).getTime()
  const min = Math.floor(ms / 60000)
  const sec = Math.round((ms % 60000) / 1000)
  return min > 0 ? `${min} د ${sec} ث` : `${sec} ث`
})

function sourceLabel(source: string) {
  return { random: 'عشوائي', unanswered: 'لم تُحل', wrong: 'أخطاء سابقة', bookmarked: 'المحفوظات' }[source] || source
}

const isInProgress = computed(() => session.value?.status === 'in_progress')

// Warn before in-app navigation away from a running exam. State is server-side
// so the exam keeps running and can be resumed — but we still warn so leaving
// is deliberate.
onBeforeRouteLeave(() => {
  if (isInProgress.value) {
    return window.confirm('الاختبار ما زال قيد التنفيذ والوقت مستمر. يمكنك استئنافه لاحقاً من صفحة اختباراتي. هل تريد المغادرة؟')
  }
  return true
})

// Warn on tab close / refresh (browser-native prompt). The exam does NOT
// pause — the server deadline keeps ticking — so this just prevents accidental
// loss of the current screen.
function onBeforeUnload(e: BeforeUnloadEvent) {
  if (isInProgress.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

// On returning to the tab (after it was hidden / connection dropped), re-fetch
// the session: the wall-clock timer recomputes from deadline_at, and if the
// exam expired while away the server finalizes it and we flip to results.
function onVisibilityChange() {
  if (!document.hidden && isInProgress.value) {
    loadSession(false) // re-sync timer/answers without moving the student
  }
}

onMounted(() => {
  loadSession()
  window.addEventListener('beforeunload', onBeforeUnload)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', onBeforeUnload)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>
