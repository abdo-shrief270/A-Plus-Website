<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-gray-950 pb-20">
    <!-- Context Header -->
    <div class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 overflow-hidden">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-arrow-right"
              class="rounded-xl"
              @click="$router.back()"
            />
            <div class="flex items-center gap-2 text-xs font-medium text-gray-400 overflow-hidden whitespace-nowrap">
              <template v-if="questionsStore.currentQuestion?.belongs_to">
                <span class="hover:text-primary-500 cursor-default truncate">{{ questionsStore.currentQuestion.belongs_to.exam?.name }}</span>
                <UIcon
                  name="i-heroicons-chevron-left"
                  class="w-3 h-3 flex-shrink-0"
                />
                <span class="hover:text-primary-500 cursor-default truncate">{{ questionsStore.currentQuestion.belongs_to.section?.name }}</span>
                <UIcon
                  name="i-heroicons-chevron-left"
                  class="w-3 h-3 flex-shrink-0"
                />
                <span class="text-gray-900 dark:text-white font-bold truncate">{{ questionsStore.currentQuestion.belongs_to.category?.name }}</span>
              </template>
              <template v-else>
                <span class="text-gray-900 dark:text-white font-bold">تفاصيل السؤال</span>
              </template>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UBadge
              v-if="questionsStore.currentQuestion?.difficulty"
              :color="getDifficultyColor(questionsStore.currentQuestion.difficulty)"
              variant="subtle"
              class="rounded-lg font-bold"
            >
              {{ getDifficultyLabel(questionsStore.currentQuestion.difficulty) }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div
        v-if="questionsStore.isLoading && !questionsStore.currentQuestion"
        class="flex flex-col items-center justify-center py-32"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-12 h-12 text-primary-500 animate-spin mb-4"
        />
        <span class="text-gray-500 animate-pulse font-medium">جاري تجهيز السؤال...</span>
      </div>

      <div
        v-else-if="questionsStore.currentQuestion"
        class="max-w-4xl mx-auto"
      >
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Question Area -->
          <div class="lg:col-span-8 space-y-6">
            <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
              <!-- Type Indicator -->
              <div class="absolute top-0 right-0 px-4 py-1 bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 text-[10px] font-black uppercase tracking-widest rounded-bl-xl border-b border-l border-secondary-100 dark:border-secondary-800">
                {{ questionsStore.currentQuestion.type?.name || 'سؤال' }}
              </div>

              <!-- Comparison Mode -->
              <div
                v-if="questionsStore.currentQuestion.comparison"
                class="mb-8"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10 hidden md:flex">
                    <div class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-black italic shadow-lg">
                      VS
                    </div>
                  </div>

                  <div class="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700">
                    <div class="text-xs font-black text-gray-400 mb-2 uppercase">
                      القيمة الأولى
                    </div>
                    <p class="text-gray-900 dark:text-white font-bold mb-4">
                      {{ questionsStore.currentQuestion.comparison.value_1.text }}
                    </p>
                    <img
                      v-if="questionsStore.currentQuestion.comparison.value_1.image_path"
                      :src="questionsStore.currentQuestion.comparison.value_1.image_path"
                      class="rounded-lg w-full max-h-40 object-contain"
                    >
                  </div>

                  <div class="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700">
                    <div class="text-xs font-black text-gray-400 mb-2 uppercase">
                      القيمة الثانية
                    </div>
                    <p class="text-gray-900 dark:text-white font-bold mb-4">
                      {{ questionsStore.currentQuestion.comparison.value_2.text }}
                    </p>
                    <img
                      v-if="questionsStore.currentQuestion.comparison.value_2.image_path"
                      :src="questionsStore.currentQuestion.comparison.value_2.image_path"
                      class="rounded-lg w-full max-h-40 object-contain"
                    >
                  </div>
                </div>
              </div>

              <!-- Standard Question Text -->
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed mb-6">
                {{ questionsStore.currentQuestion.text }}
              </h2>

              <!-- Question Image -->
              <div
                v-if="questionsStore.currentQuestion.image_path"
                class="mb-8 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 p-2 border border-gray-100 dark:border-gray-800"
              >
                <img
                  :src="questionsStore.currentQuestion.image_path"
                  class="w-full max-h-[400px] object-contain rounded-xl"
                  alt="Question Image"
                >
              </div>

              <!-- Answer Choices -->
              <div class="space-y-4">
                <div
                  v-for="(answer, index) in sortedAnswers"
                  :key="answer.id"
                  class="relative group cursor-pointer"
                  @click="!isSubmitted && (selectedAnswer = answer.id)"
                >
                  <div
                    class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200"
                    :class="[
                      selectedAnswer === answer.id ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-900/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-900',
                      isSubmitted && answer.id === result?.correct_answer?.id ? 'border-success-500 bg-success-50/30 dark:bg-success-900/10' : '',
                      isSubmitted && selectedAnswer === answer.id && !result?.is_correct ? 'border-error-500 bg-error-50/30 dark:bg-error-900/10' : ''
                    ]"
                  >
                    <div
                      class="w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors"
                      :class="[
                        selectedAnswer === answer.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-gray-600',
                        isSubmitted && answer.id === result?.correct_answer?.id ? 'bg-success-500 text-white' : '',
                        isSubmitted && selectedAnswer === answer.id && !result?.is_correct ? 'bg-error-500 text-white' : ''
                      ]"
                    >
                      {{ String.fromCharCode(65 + index) }}
                    </div>
                    <div class="flex-grow">
                      <p class="text-gray-800 dark:text-gray-200 font-bold leading-relaxed">
                        {{ answer.text }}
                      </p>
                      <img
                        v-if="answer.image_path"
                        :src="answer.image_path"
                        class="mt-2 rounded-lg max-h-24 object-contain"
                      >
                    </div>

                    <UIcon
                      v-if="isSubmitted && answer.id === result?.correct_answer?.id"
                      name="i-heroicons-check-circle"
                      class="w-6 h-6 text-success-500"
                    />
                    <UIcon
                      v-else-if="isSubmitted && selectedAnswer === answer.id && !result?.is_correct"
                      name="i-heroicons-x-circle"
                      class="w-6 h-6 text-error-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Action Bar -->
              <div class="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-50 dark:border-gray-800">
                <div
                  v-if="isSubmitted"
                  class="flex items-center gap-3"
                >
                  <div
                    :class="result?.is_correct ? 'text-success-600' : 'text-error-600'"
                    class="flex items-center gap-2 font-black"
                  >
                    <UIcon
                      :name="result?.is_correct ? 'i-heroicons-check-badge' : 'i-heroicons-exclamation-triangle'"
                      class="w-6 h-6"
                    />
                    {{ result?.is_correct ? 'إجابة صحيحة تهانينا!' : 'للأسف، إجابة خاطئة' }}
                  </div>
                </div>
                <div
                  v-else
                  class="text-sm text-gray-400 font-bold"
                >
                  اختر الإجابة الصحيحة ثم اضغط على زر الإرسال
                </div>

                <div class="flex items-center gap-3 w-full sm:w-auto">
                  <UButton
                    v-if="!isSubmitted"
                    color="primary"
                    size="xl"
                    class="rounded-2xl px-12 font-black w-full"
                    :disabled="!selectedAnswer"
                    :loading="submitting"
                    @click="handleAnswer"
                  >
                    تأكيد الإجابة
                  </UButton>
                  <UButton
                    v-else
                    color="neutral"
                    variant="soft"
                    size="xl"
                    class="rounded-2xl px-8 font-bold w-full"
                    icon="i-heroicons-arrow-path"
                    @click="resetState"
                  >
                    حاول مرة أخرى
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Explanation Section -->
            <transition
              enter-active-class="transition duration-500 ease-out"
              enter-from-class="transform translate-y-4 opacity-0"
              enter-to-class="transform translate-y-0 opacity-100"
            >
              <div
                v-if="isSubmitted && questionsStore.currentQuestion.explanation"
                class="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50 dark:border-gray-800">
                  <div class="w-10 h-10 rounded-xl bg-secondary-50 dark:bg-secondary-900/20 flex items-center justify-center">
                    <UIcon
                      name="i-heroicons-academic-cap"
                      class="w-6 h-6 text-secondary-500"
                    />
                  </div>
                  <div>
                    <h3 class="text-lg font-black text-gray-900 dark:text-white">
                      شرح تفصيلي
                    </h3>
                    <p class="text-xs text-gray-400">
                      افهم طريقة الحل الصحيحة
                    </p>
                  </div>
                </div>

                <div class="prose dark:prose-invert max-w-none">
                  <p
                    class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                    v-html="formattedExplanation"
                  />
                </div>

                <div
                  v-if="questionsStore.currentQuestion.explanation.image_path"
                  class="mt-6 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                >
                  <img
                    :src="questionsStore.currentQuestion.explanation.image_path"
                    class="w-full object-contain"
                  >
                </div>

                <div
                  v-if="questionsStore.currentQuestion.explanation.video_url"
                  class="mt-8"
                >
                  <UButton
                    color="error"
                    variant="soft"
                    size="lg"
                    class="rounded-2xl"
                    icon="i-heroicons-play-circle"
                    :to="questionsStore.currentQuestion.explanation.video_url"
                    target="_blank"
                  >
                    شاهد شرح الفيديو
                  </UButton>
                </div>
              </div>
            </transition>
          </div>

          <!-- Sidebar Context -->
          <div class="lg:col-span-4 space-y-6">
            <div class="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20 sticky top-24">
              <h3 class="text-sm font-black uppercase tracking-widest text-primary-200 mb-4">
                معلومات السؤال
              </h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span class="text-primary-100 text-sm">رمز السؤال</span>
                  <span class="font-black">#{{ questionsStore.currentQuestion.id }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span class="text-primary-100 text-sm">الصعوبة</span>
                  <span class="font-black">{{ getDifficultyLabel(questionsStore.currentQuestion.difficulty) }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span class="text-primary-100 text-sm">النوع</span>
                  <span class="font-black">{{ questionsStore.currentQuestion.type?.name || 'MCQ' }}</span>
                </div>
              </div>

              <div class="mt-8">
                <UButton
                  color="white"
                  variant="solid"
                  size="lg"
                  class="w-full rounded-2xl font-black text-primary-600"
                  icon="i-heroicons-share"
                >
                  مشاركة السؤال
                </UButton>
              </div>
            </div>

            <!-- Helpful Tips -->
            <div class="bg-secondary-50 dark:bg-secondary-900/10 rounded-3xl p-6 border border-secondary-100 dark:border-secondary-800">
              <h4 class="text-secondary-600 dark:text-secondary-400 font-black mb-2 flex items-center gap-2">
                <UIcon
                  name="i-heroicons-light-bulb"
                  class="w-5 h-5"
                />
                نصيحة سريعة
              </h4>
              <p class="text-sm text-secondary-800 dark:text-secondary-300 leading-relaxed">
                عند مواجهة سؤال صعب، حاول استبعاد الخيارات الخاطئة الواضحة أولاً لزيادة فرصك في اختيار الإجابة الصحيحة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuestionsStore } from '@/stores/useQuestionsStore'

// Public page
definePageMeta({ layout: 'default' })

const route = useRoute()
const questionsStore = useQuestionsStore()
const selectedAnswer = ref<number | null>(null)
const isSubmitted = ref(false)
const submitting = ref(false)
const result = ref<any>(null)

useSeoMeta({
  title: computed(() => questionsStore.currentQuestion ? `سؤال #${questionsStore.currentQuestion.id} | A Plus` : 'تفاصيل السؤال | A Plus'),
  description: 'حل وتدرب على أسئلة بنك الأسئلة A Plus مع شرح تفصيلي لكل سؤال.'
})

const sortedAnswers = computed(() => {
  if (!questionsStore.currentQuestion?.answers) return []
  return [...questionsStore.currentQuestion.answers].sort((a, b) => (a.order || 0) - (b.order || 0))
})

const formattedExplanation = computed(() => {
  return questionsStore.currentQuestion?.explanation?.text?.replace(/\n/g, '<br>') || ''
})

const getDifficultyColor = (diff: string) => {
  switch (diff?.toLowerCase()) {
    case 'easy': return 'primary'
    case 'medium': return 'warning'
    case 'hard': return 'error'
    default: return 'neutral'
  }
}

const getDifficultyLabel = (diff: string) => {
  switch (diff?.toLowerCase()) {
    case 'easy': return 'سهل'
    case 'medium': return 'متوسط'
    case 'hard': return 'صعب'
    default: return diff
  }
}

async function handleAnswer() {
  if (!selectedAnswer.value) return

  submitting.value = true
  try {
    const res = await questionsStore.submitAnswer({
      question_id: questionsStore.currentQuestion!.id,
      answer_id: selectedAnswer.value
    })
    result.value = res
    isSubmitted.value = true
  } catch (err) {
    useToast().add({
      title: 'خطأ',
      description: 'تعذر إرسال الإجابة، يرجى المحاولة مرة أخرى',
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}

function resetState() {
  selectedAnswer.value = null
  isSubmitted.value = false
  result.value = null
}

onMounted(async () => {
  await questionsStore.fetchQuestionById(route.params.id as string)
})
</script>
