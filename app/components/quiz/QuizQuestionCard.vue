<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-50">
      <div class="flex items-center gap-3">
        <span class="w-9 h-9 rounded-xl bg-primary-50 text-primary-700 text-sm font-black flex items-center justify-center">
          {{ sessionQuestion.order }}
        </span>
        <UBadge
          :color="difficultyColor"
          variant="subtle"
          size="xs"
          class="rounded-xl px-3 font-black text-[10px]"
        >
          {{ difficultyLabel }}
        </UBadge>
        <span
          v-if="sessionQuestion.question.type?.name"
          class="text-xs font-bold text-gray-400"
        >
          {{ sessionQuestion.question.type.name }}
        </span>
      </div>
      <div
        v-if="state === 'review'"
        class="flex items-center gap-1.5"
      >
        <UIcon
          :name="reviewIcon.icon"
          :class="['w-5 h-5', reviewIcon.color]"
        />
        <span :class="['text-xs font-bold', reviewIcon.color]">{{ reviewIcon.label }}</span>
      </div>
    </div>

    <!-- Question text -->
    <div
      class="mb-6 text-lg md:text-xl font-bold text-gray-900 leading-relaxed text-right [&_img]:inline-block [&_img]:align-middle [&_img]:max-h-24 [&_img]:mx-1 [&_p]:my-1"
      dir="rtl"
      v-html="renderMarkdown(sessionQuestion.question.text)"
    />

    <!-- Comparison -->
    <div
      v-if="sessionQuestion.question.comparison"
      class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
    >
      <div
        v-for="(val, key) in sessionQuestion.question.comparison"
        :key="key"
        class="p-5 rounded-2xl border-2 border-gray-100 bg-gray-50/50 flex flex-col items-center text-center"
      >
        <div class="text-xs font-black text-primary-500 mb-2 uppercase tracking-widest">
          {{ key === 'value_1' ? 'القيمة الأولى' : 'القيمة الثانية' }}
        </div>
        <div
          v-if="val?.text"
          class="text-base font-bold text-gray-700"
        >
          {{ val.text }}
        </div>
        <img
          v-if="val?.image"
          :src="val.image"
          class="rounded-xl max-h-32 object-contain shadow-sm mt-2"
          alt=""
        >
      </div>
    </div>

    <!-- Answers -->
    <div class="space-y-3 mb-6">
      <div
        v-for="(ans, idx) in sessionQuestion.question.answers"
        :key="ans.id"
        :class="['group relative', canSelect ? 'cursor-pointer' : '']"
        @click="select(ans.id)"
      >
        <div
          class="relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300"
          :class="answerClasses(ans.id)"
        >
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border-2 transition-colors shrink-0"
            :class="indicatorClasses(ans.id)"
          >
            {{ String.fromCharCode(65 + idx) }}
          </div>
          <div
            class="flex-grow text-base font-bold text-right [&_img]:inline-block [&_img]:align-middle [&_img]:max-h-16 [&_img]:mx-1 [&_p]:my-0"
            dir="rtl"
            v-html="renderMarkdown(ans.text)"
          />
          <UIcon
            v-if="revealed && ans.id === correctAnswerId"
            name="i-heroicons-check-badge"
            class="w-6 h-6 text-success-500 shrink-0"
          />
          <UIcon
            v-else-if="revealed && ans.id === chosenAnswerId && ans.id !== correctAnswerId"
            name="i-heroicons-x-circle"
            class="w-6 h-6 text-error-500 shrink-0"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div
      v-if="state === 'play'"
      class="pt-4 border-t border-gray-50"
    >
      <!-- Tutor: confirm button until answered -->
      <template v-if="mode === 'tutor'">
        <UButton
          v-if="!revealed"
          color="primary"
          size="lg"
          class="rounded-2xl font-black w-full md:w-auto px-10"
          :loading="submitting"
          :disabled="!localSelection"
          @click="confirm"
        >
          تأكيد الإجابة
        </UButton>

        <div
          v-else
          class="space-y-4"
        >
          <div
            class="p-4 rounded-2xl flex items-center justify-center gap-3 font-black"
            :class="feedback?.is_correct
              ? 'bg-success-50 text-success-700 border border-success-200/60'
              : 'bg-error-50 text-error-600 border border-error-200/60'"
          >
            <UIcon
              :name="feedback?.is_correct ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
              class="w-7 h-7"
            />
            {{ feedback?.is_correct ? 'إجابة صحيحة! أحسنت.' : 'إجابة خاطئة. راجع الشرح وتابع.' }}
          </div>
          <QuizExplanation
            v-if="feedback?.explanation?.text || feedback?.explanation?.video_url"
            :explanation="feedback.explanation"
          />
        </div>
      </template>

      <!-- Exam: silent select hint -->
      <p
        v-else
        class="text-[11px] text-gray-400 flex items-center gap-1.5"
      >
        <UIcon
          name="i-heroicons-information-circle"
          class="w-4 h-4"
        />
        {{ chosenAnswerId ? 'تم تسجيل إجابتك — يمكنك تغييرها قبل الإنهاء.' : 'اختر إجابة للمتابعة.' }}
      </p>
    </div>

    <!-- Review explanation -->
    <div
      v-else-if="state === 'review' && (sessionQuestion.explanation?.text || sessionQuestion.explanation?.video_url)"
      class="pt-4 border-t border-gray-50"
    >
      <QuizExplanation :explanation="sessionQuestion.explanation" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { renderMarkdown } from '@/utils/markdown'
import type { QuizSessionQuestion, QuizMode, QuizTutorFeedback } from '@/types/quiz'

const props = defineProps<{
  sessionQuestion: QuizSessionQuestion
  mode: QuizMode
  state: 'play' | 'review'
  /** Tutor-mode feedback returned by the answer endpoint (page passes it down). */
  feedback?: QuizTutorFeedback | null
  submitting?: boolean
}>()

const emit = defineEmits<{
  /** Page owns the API call. Tutor: fired on confirm. Exam: fired on each select. */
  answer: [questionId: number, answerId: number]
}>()

const localSelection = ref<number | null>(null)

// Reset transient selection when navigating between questions.
watch(() => props.sessionQuestion.question.id, () => {
  localSelection.value = null
})

const chosenAnswerId = computed(() =>
  props.mode === 'tutor' && props.state === 'play' && !props.sessionQuestion.answered_at
    ? localSelection.value
    : props.sessionQuestion.chosen_answer_id ?? localSelection.value
)

/** Correctness data is visible in review, or tutor mode once feedback arrived. */
const revealed = computed(() => {
  if (props.state === 'review') return true
  return props.mode === 'tutor' && (!!props.feedback || !!props.sessionQuestion.answered_at)
})

const correctAnswerId = computed(() =>
  props.feedback?.correct_answer_id ?? props.sessionQuestion.correct_answer_id ?? null
)

const canSelect = computed(() => props.state === 'play' && !revealed.value && !props.submitting)

function select(answerId: number) {
  if (!canSelect.value) return
  localSelection.value = answerId
  if (props.mode === 'exam') {
    emit('answer', props.sessionQuestion.question.id, answerId)
  }
}

function confirm() {
  if (!localSelection.value || props.submitting) return
  emit('answer', props.sessionQuestion.question.id, localSelection.value)
}

function answerClasses(id: number) {
  if (revealed.value) {
    if (id === correctAnswerId.value) return 'border-success-500 bg-success-50/50'
    if (id === chosenAnswerId.value) return 'border-error-400 bg-error-50/50'
    return 'border-gray-100 opacity-60'
  }
  if (chosenAnswerId.value === id) {
    return 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
  }
  return 'border-gray-100 bg-white hover:border-primary-200'
}

function indicatorClasses(id: number) {
  if (revealed.value) {
    if (id === correctAnswerId.value) return 'bg-success-500 border-success-500 text-white'
    if (id === chosenAnswerId.value) return 'bg-error-500 border-error-500 text-white'
    return 'border-gray-200 text-gray-300'
  }
  if (chosenAnswerId.value === id) {
    return 'bg-primary-500 border-primary-500 text-white shadow-md'
  }
  return 'border-gray-200 text-gray-400 group-hover:border-primary-300 group-hover:text-primary-500'
}

const difficultyColor = computed<'primary' | 'warning' | 'error' | 'neutral'>(() => {
  switch (props.sessionQuestion.question.difficulty) {
    case 'easy': return 'primary'
    case 'medium': return 'warning'
    case 'hard': return 'error'
    default: return 'neutral'
  }
})

const difficultyLabel = computed(() => {
  switch (props.sessionQuestion.question.difficulty) {
    case 'easy': return 'سهل'
    case 'medium': return 'متوسط'
    case 'hard': return 'صعب'
    default: return props.sessionQuestion.question.difficulty
  }
})

const reviewIcon = computed(() => {
  if (props.sessionQuestion.chosen_answer_id === null) {
    return { icon: 'i-heroicons-minus-circle', color: 'text-gray-400', label: 'لم تُجب' }
  }
  return props.sessionQuestion.is_correct
    ? { icon: 'i-heroicons-check-circle', color: 'text-success-600', label: 'صحيحة' }
    : { icon: 'i-heroicons-x-circle', color: 'text-error-500', label: 'خاطئة' }
})
</script>
