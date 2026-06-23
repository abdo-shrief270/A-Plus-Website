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
        class="p-8 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-center gap-3"
      >
        <UButton
          size="xl"
          color="primary"
          icon="i-heroicons-academic-cap"
          class="min-w-[220px] justify-center text-lg"
          :loading="startingSimulation"
          @click="startSimulation"
        >
          محاكاة الاختبار (مؤقّت)
        </UButton>
        <UButton
          size="xl"
          color="neutral"
          variant="soft"
          icon="i-heroicons-eye"
          class="min-w-[180px] justify-center text-lg"
          @click="startExam"
        >
          تصفّح بدون توقيت
        </UButton>
      </div>
      <p class="px-8 pb-6 -mt-2 text-center text-xs text-gray-400">
        المحاكاة تُسجَّل في سجلّ اختباراتك مع مؤقّت ونتيجة ومراجعة. التصفّح للاطلاع فقط دون حفظ.
      </p>
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
            color="neutral"
            variant="soft"
            class="shrink-0"
            @click="finishExam"
          >
            إنهاء التصفّح
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
              v-if="currentQuestion.breadcrumb?.category"
              color="neutral"
              variant="subtle"
            >
              {{ currentQuestion.breadcrumb.category.name }}
            </UBadge>
            <UBadge
              v-if="currentQuestion.difficulty"
              :color="getDifficultyColor(currentQuestion.difficulty)"
              variant="soft"
            >
              {{ difficultyLabel(currentQuestion.difficulty) }}
            </UBadge>
          </div>

          <div
            class="prose dark:prose-invert max-w-none text-xl leading-relaxed text-gray-900 dark:text-gray-100 font-medium [&_img]:inline-block [&_img]:align-middle [&_img]:max-h-32 [&_img]:mx-1"
            dir="rtl"
            v-html="renderMarkdown(currentQuestion.text)"
          />

          <div
            v-if="currentQuestion.image_path"
            class="mt-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50"
          >
            <img
              :src="currentQuestion.image_path"
              class="max-w-full h-auto mx-auto rounded-lg"
            >
          </div>
        </div>

        <div class="p-6 md:p-8 bg-gray-50/50 dark:bg-gray-800/50">
          <div
            v-if="currentQuestion.answers"
            class="space-y-3"
          >
            <button
              v-for="answer in currentQuestion.answers"
              :key="answer.id"
              type="button"
              :disabled="isRevealed(currentQuestion.id)"
              class="w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-right"
              :class="answerClass(currentQuestion.id, answer.id)"
              @click="selectAnswer(currentQuestion.id, answer.id)"
            >
              <div
                class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 text-xs font-black"
                :class="indicatorClass(currentQuestion.id, answer.id)"
              >
                <UIcon
                  v-if="isRevealed(currentQuestion.id) && answer.id === correctAnswers[currentQuestion.id]"
                  name="i-heroicons-check"
                  class="w-4 h-4"
                />
                <UIcon
                  v-else-if="isRevealed(currentQuestion.id) && answersMap[currentQuestion.id] === answer.id"
                  name="i-heroicons-x-mark"
                  class="w-4 h-4"
                />
              </div>
              <div class="flex-1">
                <div
                  class="text-gray-900 dark:text-white [&_img]:inline-block [&_img]:align-middle [&_img]:max-h-20 [&_img]:mx-1 [&_p]:my-0"
                  dir="rtl"
                  v-html="renderMarkdown(answer.text)"
                />
                <img
                  v-if="answer.image_path"
                  :src="answer.image_path"
                  class="mt-2 rounded-lg max-h-32 object-contain"
                >
              </div>
            </button>
          </div>
          <div v-else>
            <UTextarea
              v-model="textAnswersMap[currentQuestion.id]"
              placeholder="اكتب إجابتك هنا..."
              :rows="4"
              class="w-full"
            />
          </div>

          <!-- Explanation (shown after revealing the answer) -->
          <div
            v-if="isRevealed(currentQuestion.id) && (currentQuestion.explanation?.text || currentQuestion.explanation?.video_url)"
            class="mt-5 bg-primary-50/50 dark:bg-primary-900/10 rounded-2xl p-5 border border-primary-100 dark:border-primary-900/40 text-right"
            dir="rtl"
          >
            <div class="flex items-center gap-2 mb-3 text-primary-600 font-black text-sm">
              <UIcon
                name="i-heroicons-light-bulb"
                class="w-5 h-5"
              />
              شرح الحل
            </div>
            <div
              v-if="currentQuestion.explanation.text"
              class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed [&_img]:max-w-full [&_img]:rounded-xl"
              v-html="renderMarkdown(currentQuestion.explanation.text)"
            />
            <div
              v-if="currentQuestion.explanation.video_url"
              class="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200 mt-4"
            >
              <iframe
                :src="embedUrl(currentQuestion.explanation.video_url)"
                class="absolute inset-0 w-full h-full"
                allowfullscreen
              />
            </div>
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
          color="success"
          icon="i-heroicons-check"
          @click="finishExam"
        >
          إنهاء التصفّح
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
import { quizzesService } from '@/services/api/quizzes.service'
import { showToast } from '@/utils/helpers/toast.helper'
import { renderMarkdown } from '@/utils/markdown'
import type { PracticeExam, Question } from '@/types/question-bank'

// The detail endpoint may also expose card-style metadata not on the strict
// PracticeExam shape (name/description/duration/questions_count/passing_score).
type PracticeExamDetail = Partial<PracticeExam> & {
  id?: number
  name?: string
  description?: string
  duration?: number
  questions_count?: number
  passing_score?: number
  questions?: Question[]
}

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const route = useRoute()
const examId = route.params.id as string

// Run this model as a timed, persisted exam through the quiz engine.
const startingSimulation = ref(false)
async function startSimulation() {
  startingSimulation.value = true
  try {
    const res = await quizzesService.simulateModel(examId)
    const body = res.data as {
      status?: number
      message?: string
      errors?: Record<string, string[]>
      data?: { session?: { id?: number | string } }
    }
    if (body?.status === 409) {
      showToast('تنبيه', body?.message || 'لديك اختبار قيد التنفيذ — أنهه أولاً', 'warning')
      return
    }
    if (body?.status === 422) {
      const firstError = Object.values(body?.errors ?? {})[0]
      showToast('خطأ', Array.isArray(firstError) ? firstError[0] : (body?.message || 'تعذّر بدء المحاكاة'), 'error')
      return
    }
    const session = body?.data?.session
    if (session?.id) {
      navigateTo(`/dashboard/quizzes/${session.id}`)
    }
  } catch (err) {
    console.error('Failed to start model simulation', err)
  } finally {
    startingSimulation.value = false
  }
}

const loading = ref(true)
const exam = ref<PracticeExamDetail | null>(null)
const questions = ref<Question[]>([])

// Test taking states
const isStarted = ref(false)
const isFinished = ref(false)
const currentQuestionIndex = ref(0)

// Answers tracking: store selected Answer ID (for multiple choice) or text (for open)
const answersMap = ref<Record<string, number>>({})
const textAnswersMap = ref<Record<string, string>>({})

// Retained for the (timed) results template; browse mode leaves them at 0.
const timerSeconds = ref(0)
const spentSeconds = ref(0)

// Browse mode is a no-timer study walk-through: picking an answer reveals the
// correct one (fetched on demand) + the explanation. Maps qid → correct id.
const correctAnswers = ref<Record<string, number>>({})

function isRevealed(qid: number | string) {
  return correctAnswers.value[qid] !== undefined
}

async function selectAnswer(qid: number | string, answerId: number) {
  if (isRevealed(qid)) return
  answersMap.value[qid] = answerId
  try {
    const res = await questionsService.getCorrectAnswer(qid)
    const correctId = res.data?.data?.id ?? res.data?.id
    if (correctId != null) correctAnswers.value[qid] = correctId
  } catch (err) {
    console.error('Failed to fetch correct answer', err)
  }
}

function answerClass(qid: number | string, answerId: number) {
  if (isRevealed(qid)) {
    if (answerId === correctAnswers.value[qid]) return 'border-success-500 bg-success-50/60 dark:bg-success-900/20'
    if (answerId === answersMap.value[qid]) return 'border-error-400 bg-error-50/60 dark:bg-error-900/20'
    return 'border-transparent bg-white dark:bg-gray-800 opacity-60'
  }
  return answersMap.value[qid] === answerId
    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 shadow-sm'
    : 'border-transparent bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
}

function indicatorClass(qid: number | string, answerId: number) {
  if (isRevealed(qid)) {
    if (answerId === correctAnswers.value[qid]) return 'bg-success-500 border-success-500 text-white'
    if (answerId === answersMap.value[qid]) return 'bg-error-500 border-error-500 text-white'
    return 'border-gray-200 dark:border-gray-700 text-transparent'
  }
  return answersMap.value[qid] === answerId
    ? 'bg-primary-500 border-primary-500 text-white'
    : 'border-gray-300 dark:border-gray-600 text-transparent'
}

function embedUrl(url: string) {
  if (!url) return ''
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/')
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/')
  return url
}

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
    const data = (res.data?.data || res.data) as
      | PracticeExamDetail
      | { practice_exam?: PracticeExamDetail, exam?: PracticeExamDetail }
    exam.value = ('practice_exam' in data ? data.practice_exam : undefined)
      || ('exam' in data ? data.exam : undefined)
      || (data as PracticeExamDetail)

    useSeoMeta({ title: `${exam.value?.title || 'نماذج الاختبار'} | A Plus` })

    // Ensure questions array is available and flattened
    questions.value = exam.value.questions || []
  } catch (error) {
    console.error('Failed to load practice exam', error)
  } finally {
    loading.value = false
  }
})

// "تصفّح بدون توقيت" — no timer; just enter the study walk-through.
function startExam() {
  isStarted.value = true
}

// Exit browse back to the model intro. No scoring/submission — browsing is a
// read-only study mode (use "محاكاة الاختبار" for a graded, timed run).
function finishExam() {
  isStarted.value = false
  currentQuestionIndex.value = 0
  answersMap.value = {}
  correctAnswers.value = {}
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'success'
    case 'hard':
      return 'error'
    case 'medium':
    default:
      return 'warning'
  }
}

function difficultyLabel(difficulty: string) {
  const labels: Record<string, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' }
  return labels[difficulty?.toLowerCase()] || difficulty
}
</script>
