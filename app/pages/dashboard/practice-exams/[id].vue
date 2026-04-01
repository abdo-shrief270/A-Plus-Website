<template>
  <div class="max-w-5xl mx-auto">
    <div
      v-if="loading"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary-500 animate-spin"
      />
    </div>

    <div
      v-else-if="!exam"
      class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
    >
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-16 h-16 mx-auto text-yellow-500 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        الاختبار غير موجود
      </h3>
      <p class="text-gray-500">
        لا يمكن العثور على هذا الاختبار، ربما تم حذفه أو ليس لديك صلاحية.
      </p>
      <UButton
        to="/dashboard/practice-exams"
        class="mt-6"
        color="neutral"
        variant="soft"
      >
        العودة للاختبارات
      </UButton>
    </div>

    <!-- Exam Intro State -->
    <div
      v-else-if="!isStarted"
      class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
    >
      <div
        class="p-8 text-center border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
      >
        <div
          class="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center mx-auto mb-6"
        >
          <UIcon
            name="i-heroicons-academic-cap"
            class="w-10 h-10"
          />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {{ exam.title || exam.name }}
        </h1>
        <p
          class="text-gray-500 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          {{
            exam.description || "استعد لتقييم مستواك في هذا الاختبار الشامل."
          }}
        </p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center"
        >
          <UIcon
            name="i-heroicons-clipboard-document-list"
            class="w-8 h-8 text-gray-400 mb-3 mx-auto"
          />
          <h4 class="font-bold text-gray-900 dark:text-white">
            عدد الأسئلة
          </h4>
          <p class="text-gray-500 mt-1">
            {{ exam.questions?.length || exam.questions_count || 0 }} سؤال
          </p>
        </div>
        <div
          class="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center"
        >
          <UIcon
            name="i-heroicons-clock"
            class="w-8 h-8 text-gray-400 mb-3 mx-auto"
          />
          <h4 class="font-bold text-gray-900 dark:text-white">
            المدة الزمنية
          </h4>
          <p class="text-gray-500 mt-1">
            {{ exam.duration || "غير محدد" }} دقيقة
          </p>
        </div>
        <div
          class="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center"
        >
          <UIcon
            name="i-heroicons-check-badge"
            class="w-8 h-8 text-gray-400 mb-3 mx-auto"
          />
          <h4 class="font-bold text-gray-900 dark:text-white">
            درجة النجاح
          </h4>
          <p class="text-gray-500 mt-1">
            {{ exam.passing_score || 50 }}%
          </p>
        </div>
      </div>

      <div
        class="p-8 border-t border-gray-100 dark:border-gray-700 flex justify-center"
      >
        <UButton
          size="xl"
          icon="i-heroicons-play"
          class="min-w-[200px] justify-center text-lg"
          @click="startExam"
        >
          ابدأ الاختبار الآن
        </UButton>
      </div>
    </div>

    <!-- Active Exam State -->
    <div
      v-else-if="!isFinished"
      class="space-y-6"
    >
      <!-- Exam Header / Timer -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-10 shadow-sm"
      >
        <div>
          <h2
            class="font-bold text-gray-900 dark:text-white text-lg line-clamp-1"
          >
            {{ exam.title || exam.name }}
          </h2>
          <p class="text-sm text-gray-500">
            سؤال {{ currentQuestionIndex + 1 }} من {{ questions.length }}
          </p>
        </div>

        <div class="flex items-center gap-6">
          <!-- Progress Bar -->
          <div class="w-48 hidden md:block">
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>التقدم</span>
              <span>{{ progressPercentage }}%</span>
            </div>
            <UProgress
              :value="progressPercentage"
              color="primary"
              class="h-2"
            />
          </div>

          <!-- Timer -->
          <div
            v-if="exam.duration"
            class="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-lg font-mono font-bold border border-red-100 dark:border-red-900/50"
          >
            <UIcon
              name="i-heroicons-clock"
              class="w-5 h-5"
            />
            <span class="text-lg">{{ formattedTimeRemaining }}</span>
          </div>

          <UButton
            color="red"
            variant="soft"
            class="shrink-0"
            @click="finishExam"
          >
            إنهاء الاختبار
          </UButton>
        </div>
      </div>

      <!-- Current Question Content -->
      <div
        v-if="currentQuestion"
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm transition-all"
      >
        <div class="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
          <!-- Subject/Category Badge -->
          <div class="mb-4 flex gap-2">
            <UBadge
              v-if="currentQuestion.subject"
              color="neutral"
              variant="subtle"
            >
              {{
                currentQuestion.subject.name_ar || currentQuestion.subject.name
              }}
            </UBadge>
            <UBadge
              v-if="currentQuestion.difficulty"
              :color="getDifficultyColor(currentQuestion.difficulty)"
              variant="soft"
            >
              {{ currentQuestion.difficulty }}
            </UBadge>
          </div>

          <div
            class="prose dark:prose-invert max-w-none text-xl leading-relaxed text-gray-900 dark:text-gray-100 font-medium"
            v-html="currentQuestion.question_text || currentQuestion.content"
          />

          <div
            v-if="currentQuestion.media_url || currentQuestion.image"
            class="mt-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50"
          >
            <img
              :src="currentQuestion.media_url || currentQuestion.image"
              class="max-w-full h-auto mx-auto rounded-lg"
            >
          </div>
        </div>

        <div class="p-6 md:p-8 bg-gray-50/50 dark:bg-gray-800/50">
          <div
            v-if="currentQuestion.answers"
            class="space-y-3"
          >
            <label
              v-for="answer in currentQuestion.answers"
              :key="answer.id"
              class="flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-white dark:hover:bg-gray-800 group"
              :class="
                answersMap[currentQuestion.id] === answer.id
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 shadow-sm'
                  : 'border-transparent bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
              "
            >
              <div class="flex items-center h-6">
                <input
                  v-model="answersMap[currentQuestion.id]"
                  type="radio"
                  :name="'q_' + currentQuestion.id"
                  :value="answer.id"
                  class="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
              </div>
              <div class="flex-1">
                <div
                  class="text-gray-900 dark:text-white"
                  :class="{
                    'font-medium': answersMap[currentQuestion.id] === answer.id
                  }"
                >
                  {{ answer.answer_text || answer.content }}
                </div>
                <img
                  v-if="answer.media_url || answer.image"
                  :src="answer.media_url || answer.image"
                  class="mt-2 rounded-lg max-h-32 object-contain"
                >
              </div>
            </label>
          </div>
          <div v-else>
            <UTextarea
              v-model="textAnswersMap[currentQuestion.id]"
              placeholder="اكتب إجابتك هنا..."
              :rows="4"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div
        class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
      >
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-right"
          class="rtl:-scale-x-100"
          :disabled="currentQuestionIndex === 0"
          @click="currentQuestionIndex--"
        >
          السؤال السابق
        </UButton>

        <!-- Quick Nav Dots -->
        <div class="hidden md:flex gap-1 overflow-x-auto px-4">
          <button
            v-for="(q, idx) in questions"
            :key="idx"
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
            :class="[
              currentQuestionIndex === idx
                ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800'
                : answersMap[q.id] || textAnswersMap[q.id]
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
            @click="currentQuestionIndex = idx"
          >
            {{ idx + 1 }}
          </button>
        </div>

        <UButton
          v-if="currentQuestionIndex < questions.length - 1"
          color="primary"
          icon="i-heroicons-arrow-left"
          class="rtl:-scale-x-100"
          @click="currentQuestionIndex++"
        >
          السؤال التالي
        </UButton>
        <UButton
          v-else
          color="emerald"
          icon="i-heroicons-check-circle"
          @click="finishExam"
        >
          اعتماد الدرجة وإنهاء
        </UButton>
      </div>
    </div>

    <!-- Results State -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
    >
      <div class="p-12 text-center text-gray-900 dark:text-white">
        <UIcon
          name="i-heroicons-check-badge"
          class="w-24 h-24 mx-auto text-emerald-500 mb-6"
        />
        <h2 class="text-3xl font-bold mb-2">
          تم إنهاء الاختبار بنجاح
        </h2>
        <p class="text-gray-500 mb-8 max-w-md mx-auto">
          سيتم الآن تصحيح إجاباتك وعرض النتيجة التفصيلية الخاصة بك لتقييم مستواك
          في هذه المادة.
        </p>

        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10"
        >
          <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
            <div class="text-sm text-gray-500 mb-1">
              الأسئلة المجابة
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{
                Object.keys(answersMap).length
                  + Object.keys(textAnswersMap).length
              }}
              / {{ questions.length }}
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
            <div class="text-sm text-gray-500 mb-1">
              الوقت المستغرق
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ formattedTimeSpent }}
            </div>
          </div>
          <div
            class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl col-span-2"
          >
            <div class="text-sm text-emerald-600 dark:text-emerald-400 mb-1">
              الدرجة المقدرة
            </div>
            <div
              class="text-2xl font-bold text-emerald-700 dark:text-emerald-300"
            >
              في انتظار التصحيح...
            </div>
          </div>
        </div>

        <UButton
          to="/dashboard/practice-exams"
          size="lg"
          icon="i-heroicons-arrow-right"
          class="rtl:-scale-x-100"
        >
          العودة إلى قائمة الاختبارات
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { questionsService } from '@/services/api/questions.service'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const route = useRoute()
const examId = route.params.id as string

const loading = ref(true)
const exam = ref<any>(null)
const questions = ref<any[]>([])

// Test taking states
const isStarted = ref(false)
const isFinished = ref(false)
const currentQuestionIndex = ref(0)

// Answers tracking: store selected Answer ID (for multiple choice) or text (for open)
const answersMap = ref<Record<string, number>>({})
const textAnswersMap = ref<Record<string, string>>({})

// Timer implementation
const timerSeconds = ref(0)
const spentSeconds = ref(0)
let timerInterval: any = null

const currentQuestion = computed(
  () => questions.value[currentQuestionIndex.value] || null
)

const progressPercentage = computed(() => {
  if (questions.value.length === 0) return 0
  const answered
    = Object.keys(answersMap.value).length
      + Object.keys(textAnswersMap.value).length
  return Math.round((answered / questions.value.length) * 100)
})

const formattedTimeRemaining = computed(() => {
  const m = Math.floor(timerSeconds.value / 60)
  const s = timerSeconds.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

const formattedTimeSpent = computed(() => {
  const m = Math.floor(spentSeconds.value / 60)
  const s = spentSeconds.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

onMounted(async () => {
  try {
    const res = await questionsService.getPracticeExamDetails(examId)
    const data = res.data?.data || res.data
    exam.value = data?.practice_exam || data?.exam || data

    useSeoMeta({ title: `${exam.value?.title || 'نماذج الاختبار'} | A Plus` })

    // Ensure questions array is available and flattened
    questions.value = exam.value.questions || []
  } catch (error) {
    console.error('Failed to load practice exam', error)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

function startExam() {
  isStarted.value = true
  // Initialize duration from API (assumes duration is in minutes)
  const durationInMinutes = exam.value.duration || 60
  timerSeconds.value = durationInMinutes * 60
  spentSeconds.value = 0

  timerInterval = setInterval(() => {
    spentSeconds.value++
    if (timerSeconds.value > 0) {
      timerSeconds.value--
    } else {
      // Time is up!
      finishExam()
    }
  }, 1000)
}

async function finishExam() {
  if (!confirm('هل أنت متأكد من إنهاء الاختبار وإرسال الإجابات؟')) return

  if (timerInterval) clearInterval(timerInterval)
  isFinished.value = true

  // Here we would dispatch all answers in `answersMap` & `textAnswersMap` to backend
  // For example:
  // Promise.all(Object.entries(answersMap.value).map(([qId, aId]) =>
  //   questionsService.submitAnswer({ question_id: qId, answer_id: aId })
  // ))
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'emerald'
    case 'hard':
      return 'red'
    case 'medium':
    default:
      return 'orange'
  }
}
</script>
