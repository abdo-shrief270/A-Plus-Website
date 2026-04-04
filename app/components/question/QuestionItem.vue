<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:border-primary-500/30"
    :class="{ 'opacity-80 pointer-events-none': isLoading }"
  >
    <!-- Header -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-50 dark:border-gray-800"
    >
      <div class="flex items-center gap-3 text-right">
        <UBadge
          :color="difficultyColor"
          variant="subtle"
          size="xs"
          class="rounded-xl px-3 font-black uppercase tracking-wider text-[10px]"
        >
          {{ difficultyLabel }}
        </UBadge>
        <div class="flex items-center gap-2 text-xs font-bold text-gray-400">
          <UIcon
            name="i-heroicons-tag"
            class="w-4 h-4 text-primary-400"
          />
          {{ question.type?.name || 'MCQ' }}
        </div>
      </div>
      <div
        v-if="scoreEarned > 0"
        class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 font-black animate-bounce"
      >
        <UIcon
          name="i-heroicons-sparkles"
          class="w-5 h-5"
        />
        +{{ scoreEarned }} نقطة
      </div>
    </div>

    <!-- Question Text -->
    <div class="mb-10 text-xl md:text-2xl font-black text-gray-800 dark:text-white leading-relaxed text-right dir-rtl">
      {{ question.text }}
    </div>

    <!-- Question Image -->
    <div
      v-if="question.image_path"
      class="mb-10 relative group"
    >
      <div
        class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"
      />
      <img
        :src="question.image_path"
        class="relative w-full rounded-3xl border border-white/10 shadow-2xl object-cover h-auto max-h-[400px]"
        alt="Question Image"
      >
    </div>

    <!-- Comparison Section -->
    <div
      v-if="question.comparison"
      class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
    >
      <div
        v-for="(val, key) in question.comparison"
        :key="key"
        class="p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex flex-col items-center text-center"
      >
        <div class="text-sm font-black text-primary-500 mb-3 uppercase tracking-widest">
          {{ key === 'value_1' ? 'القيمة الأولى' : 'القيمة الثانية' }}
        </div>
        <div
          v-if="val.text"
          class="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4"
        >
          {{ val.text }}
        </div>
        <img
          v-if="val.image_path"
          :src="val.image_path"
          class="rounded-xl max-h-40 object-contain shadow-sm"
          alt="Comparison value"
        >
      </div>
    </div>

    <!-- Answers Section -->
    <div class="space-y-4 mb-10">
      <div
        v-for="ans in question.answers"
        :key="ans.id"
        class="group relative cursor-pointer"
        @click="selectAnswer(ans.id)"
      >
        <!-- Correct Indicator Overlay -->
        <div
          v-if="isSubmitted && ans.id === correctAnswerId"
          class="absolute -left-3 -right-3 -top-1 -bottom-1 border-2 border-green-500 rounded-2xl pointer-events-none z-10 animate-pulse"
        />

        <div
          class="relative flex items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden"
          :class="getAnswerClasses(ans.id)"
        >
          <!-- Background logic for feedback -->
          <div
            v-if="isSubmitted && selectedAnswerId === ans.id"
            class="absolute inset-0 opacity-10"
            :class="isCorrect ? 'bg-green-500' : 'bg-red-500'"
          />

          <div class="flex items-center gap-4 relative z-10 w-full text-right dir-rtl">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors border-2"
              :class="getIndicatorClasses(ans.id)"
            >
              {{ String.fromCharCode(65 + (ans.order || 1) - 1) }}
            </div>
            <div class="flex-grow text-lg font-bold">
              {{ ans.text }}
            </div>
            <UIcon
              v-if="isSubmitted && ans.id === correctAnswerId"
              name="i-heroicons-check-badge"
              class="w-6 h-6 text-green-500"
            />
            <UIcon
              v-if="isSubmitted && selectedAnswerId === ans.id && !isCorrect"
              name="i-heroicons-x-circle"
              class="w-6 h-6 text-red-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Submission State -->
    <div class="flex justify-start pt-6 border-t border-gray-50 dark:border-gray-800">
      <UButton
        v-if="!isSubmitted"
        color="primary"
        size="xl"
        class="px-10 rounded-2xl font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all w-full md:w-auto"
        :loading="isLoading"
        :disabled="!selectedAnswerId"
        @click="submit"
      >
        تأكيد الإجابة
      </UButton>

      <div
        v-else
        class="flex flex-col gap-8 w-full"
      >
        <div
          class="p-4 rounded-2xl flex items-center justify-center gap-3 font-black text-lg"
          :class="isCorrect ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200/50' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200/50'"
        >
          <UIcon
            :name="isCorrect ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
            class="w-8 h-8"
          />
          {{ isCorrect ? 'إجابة عبقرية! استمر في الإبداع.' : 'للأسف الإجابة خاطئة. حاول في الأسئلة القادمة!' }}
        </div>

        <!-- Explanation Section -->
        <div
          v-if="question.explanation && question.explanation.text"
          class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 text-right dir-rtl"
        >
          <div class="flex items-center gap-3 mb-6 text-primary-500 font-black">
            <UIcon
              name="i-heroicons-light-bulb"
              class="w-6 h-6"
            />
            شرح الحل
          </div>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-6 whitespace-pre-wrap">
            {{ question.explanation.text }}
          </p>

          <img
            v-if="question.explanation.image_path"
            :src="question.explanation.image_path"
            class="rounded-2xl max-h-[300px] object-contain mb-6 shadow-lg border border-white/10 mx-auto"
            alt="Explanation"
          >

          <div
            v-if="question.explanation.video_url"
            class="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <iframe
              :src="getEmbedUrl(question.explanation.video_url)"
              class="absolute inset-0 w-full h-full"
              allowfullscreen
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/question-bank'
import { useQuestionsStore } from '~/stores/useQuestionsStore'

const props = defineProps<{
  question: Question
}>()

const emit = defineEmits(['answered'])

const isLoading = ref(false)
const isSubmitted = ref(false)
const selectedAnswerId = ref<number | null>(null)
const isCorrect = ref(false)
const scoreEarned = ref(0)
const correctAnswerId = ref<number | null>(null)

const difficultyColor = computed<'primary' | 'warning' | 'error' | 'neutral'>(() => {
  switch (props.question.difficulty) {
    case 'easy': return 'primary'
    case 'medium': return 'warning'
    case 'hard': return 'error'
    default: return 'neutral'
  }
})

const difficultyLabel = computed(() => {
  switch (props.question.difficulty) {
    case 'easy': return 'سهل'
    case 'medium': return 'متوسط'
    case 'hard': return 'صعب'
    default: return props.question.difficulty
  }
})

const selectAnswer = (id: number) => {
  if (isSubmitted.value) return
  selectedAnswerId.value = id
}

const getAnswerClasses = (id: number) => {
  if (isSubmitted.value) {
    if (id === correctAnswerId.value) return 'border-green-500 bg-green-50/50 dark:bg-green-500/10'
    if (id === selectedAnswerId.value && !isCorrect.value) return 'border-red-500 bg-red-50/50 dark:bg-red-500/10'
    return 'border-gray-100 dark:border-gray-800 opacity-60'
  }

  if (selectedAnswerId.value === id) {
    return 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900 border-opacity-100'
  }

  return 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
}

const getIndicatorClasses = (id: number) => {
  if (isSubmitted.value) {
    if (id === correctAnswerId.value) return 'bg-green-500 border-green-500 text-white'
    if (id === selectedAnswerId.value && !isCorrect.value) return 'bg-red-500 border-red-500 text-white'
    return 'border-gray-200 dark:border-gray-700 text-gray-300'
  }

  if (selectedAnswerId.value === id) {
    return 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20 scale-110'
  }

  return 'border-gray-200 dark:border-gray-700 text-gray-400 group-hover:border-primary-400 group-hover:text-primary-500'
}

const reset = () => {
  selectedAnswerId.value = null
  isSubmitted.value = false
  isCorrect.value = false
  scoreEarned.value = 0
  correctAnswerId.value = null
}

const submit = async () => {
  if (!selectedAnswerId.value || isLoading.value) return

  isLoading.value = true
  const questionStore = useQuestionsStore()
  try {
    const result = await questionStore.submitAnswer({
      question_id: props.question.id,
      answer_id: selectedAnswerId.value
    })

    isCorrect.value = result.is_correct
    scoreEarned.value = result.score_earned
    correctAnswerId.value = result.correct_answer || (result.is_correct ? selectedAnswerId.value : null)

    isSubmitted.value = true
    emit('answered', result)
  } catch (err) {
    console.error('Submission failed', err)
  } finally {
    isLoading.value = false
  }
}

defineExpose({ reset, isSubmitted, isCorrect })

const getEmbedUrl = (url: string) => {
  if (!url) return ''
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/')
  }
  if (url.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'youtube.com/embed/')
  }
  return url
}
</script>

<style scoped>
.dir-rtl {
  direction: rtl;
}
</style>
