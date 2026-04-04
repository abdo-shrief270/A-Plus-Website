<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-gray-950">
    <!-- Session Header -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div class="container mx-auto px-4 h-24 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <BButton
            variant="ghost"
            color="neutral"
            size="sm"
            class="rounded-xl"
            @click="confirmExit"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-x-mark"
                class="w-5 h-5"
              />
            </template>
          </BButton>

          <div class="hidden md:block">
            <h1 class="text-xl font-black text-gray-900 dark:text-white line-clamp-1">
              {{ store.currentPracticeExam?.title }}
            </h1>
            <div class="flex items-center gap-2 mt-1">
              <UBadge
                color="primary"
                variant="soft"
                size="xs"
                class="font-black rounded-lg"
              >
                نموذج تجريبي
              </UBadge>
              <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                اختبار محاكي للواقع
              </span>
            </div>
          </div>
        </div>

        <!-- Timer & Progress -->
        <div class="flex flex-col items-center gap-2">
          <div
            class="flex items-center gap-3 px-6 py-2 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-colors"
            :class="timeRemaining < 300 ? 'border-red-500 text-red-600 animate-pulse' : 'border-gray-100 dark:border-gray-700 text-primary-600 dark:text-primary-400'"
          >
            <UIcon
              name="i-heroicons-clock"
              class="w-6 h-6"
            />
            <span class="text-2xl font-black tracking-tighter tabular-nums">
              {{ formattedTime }}
            </span>
          </div>
          <div class="w-32 md:w-64 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 transition-all duration-500"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
              التقدم الإجمالي
            </span>
            <span class="text-sm font-black text-gray-900 dark:text-white">
              {{ store.currentQuestionIndex + 1 }} / {{ totalQuestions }}
            </span>
          </div>
          <BButton
            color="primary"
            variant="solid"
            size="md"
            class="rounded-2xl px-6 font-black shadow-lg shadow-primary-500/20"
            @click="finishExam"
          >
            إنهاء الاختبار
          </BButton>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Question Content -->
        <main class="lg:col-span-9 space-y-8">
          <div
            v-if="store.currentQuestion"
            class="transition-all duration-300"
          >
            <QuestionItem
              :key="store.currentQuestion.id"
              :question="store.currentQuestion"
              @answered="onQuestionAnswered"
            />
          </div>

          <div
            v-else-if="store.isLoading"
            class="p-20 text-center"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4"
            />
            <p class="text-gray-500 font-bold">
              جاري تحميل السؤال التالي...
            </p>
          </div>

          <!-- Navigation Controls -->
          <div class="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
            <BButton
              variant="outline"
              color="neutral"
              size="lg"
              class="rounded-2xl px-8"
              :disabled="store.currentQuestionIndex === 0"
              @click="prevQuestion"
            >
              <template #leading>
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="w-5 h-5"
                />
              </template>
              السابق
            </BButton>

            <BButton
              v-if="store.currentQuestionIndex < totalQuestions - 1"
              color="primary"
              size="lg"
              class="rounded-2xl px-8"
              @click="nextQuestion"
            >
              التالي
              <template #trailing>
                <UIcon
                  name="i-heroicons-arrow-left"
                  class="w-5 h-5"
                />
              </template>
            </BButton>

            <BButton
              v-else
              color="success"
              size="lg"
              class="rounded-2xl px-8"
              @click="finishExam"
            >
              عرض النتائج النهائية
            </BButton>
          </div>
        </main>

        <!-- Sidebar Navigation -->
        <aside class="lg:col-span-3">
          <div class="sticky top-32 space-y-8">
            <div class="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
              <h3 class="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <UIcon
                  name="i-heroicons-squares-2x2"
                  class="w-5 h-5 text-primary-500"
                />
                خريطة الأسئلة
              </h3>

              <div class="grid grid-cols-5 gap-3">
                <button
                  v-for="i in totalQuestions"
                  :key="i"
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all border-2"
                  :class="getQuestionMapClasses(i - 1)"
                  @click="goToQuestion(i - 1)"
                >
                  {{ i }}
                </button>
              </div>

              <div class="mt-8 space-y-3 pt-6 border-t border-gray-50 dark:border-gray-800">
                <div class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase">
                  <div class="w-2 h-2 rounded-full bg-primary-500" />
                  الموقع الحالي
                </div>
                <div class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase">
                  <div class="w-2 h-2 rounded-full bg-green-500" />
                  تمت الإجابة
                </div>
                <div class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase">
                  <div class="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                  لم تتم الإجابة
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Final Results Modal -->
    <UModal v-model="showResultsModal">
      <div class="p-10 text-center">
        <div class="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-8">
          <UIcon
            name="i-heroicons-trophy"
            class="w-12 h-12 text-green-500"
          />
        </div>
        <h3 class="text-3xl font-black text-gray-900 dark:text-white mb-4">
          انتهى الاختبار!
        </h3>
        <p class="text-gray-500 font-medium mb-8">
          لقد أتممت الاختبار بنجاح. يمكنك الآن الانتقال لمراجعة أدائك التفصيلي.
        </p>

        <BButton
          color="primary"
          size="lg"
          class="rounded-2xl w-full"
          @click="router.push('/practice-exams')"
        >
          العودة للرئيسية
        </BButton>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { usePracticeExamsStore } from '@/stores/usePracticeExamsStore'

definePageMeta({ middleware: ['auth'] })

const router = useRouter()
const store = usePracticeExamsStore()
const showResultsModal = ref(false)
const route = useRoute()

const totalQuestions = computed(() => store.currentPracticeExam?.questions?.length || 0)
const progress = computed(() => ((store.currentQuestionIndex + 1) / totalQuestions.value) * 100)

const timeRemaining = ref(0)
let timerInterval: any = null

const formattedTime = computed(() => {
  const m = Math.floor(timeRemaining.value / 60)
  const s = timeRemaining.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      clearInterval(timerInterval)
      onTimeUp()
    }
  }, 1000)
}

const onTimeUp = () => {
  alert('انتهى الوقت!')
  finishExam()
}

const onQuestionAnswered = (result: any) => {
  if (store.currentQuestion) {
    store.setResult(store.currentQuestion.id, result)
  }
}

const nextQuestion = () => {
  if (store.currentQuestionIndex < totalQuestions.value - 1) {
    store.currentQuestionIndex++
  }
}

const prevQuestion = () => {
  if (store.currentQuestionIndex > 0) {
    store.currentQuestionIndex--
  }
}

const goToQuestion = (idx: number) => {
  store.currentQuestionIndex = idx
}

const finishExam = () => {
  clearInterval(timerInterval)
  showResultsModal.value = true
}

const confirmExit = () => {
  if (confirm('هل أنت متأكد من رغبتك في إنهاء الجلسة؟ لن يتم حفظ التقدم الحالي.')) {
    router.back()
  }
}

const getQuestionMapClasses = (idx: number) => {
  const q = store.currentPracticeExam?.questions?.[idx]
  const isActive = store.currentQuestionIndex === idx
  const isAnswered = q && store.results[q.id]

  if (isActive) return 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-500/10'
  if (isAnswered) return 'border-green-500 bg-green-50 text-green-600 dark:bg-green-500/10'
  return 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-400 group-hover:border-gray-300'
}

onMounted(async () => {
  const data = await store.startPracticeSession(route.params.id as string)
  timeRemaining.value = (data.duration_minutes || 60) * 60
  startTimer()
})

onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>
