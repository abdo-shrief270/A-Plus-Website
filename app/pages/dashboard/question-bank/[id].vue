<template>
  <div>
    <!-- Top bar -->
    <div class="flex items-center gap-3 mb-6">
      <UButton
        to="/dashboard/question-bank"
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-right"
        class="rtl:[&>span:first-child]:rotate-180"
        square
      />
      <div class="min-w-0">
        <p class="text-xs text-gray-500">
          <NuxtLink
            to="/dashboard/question-bank"
            class="hover:text-primary-600"
          >
            بنك الأسئلة
          </NuxtLink>
          <span class="mx-1 text-gray-300">›</span>
          <span>سؤال #{{ id }}</span>
        </p>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
          سؤال #{{ id }}
        </h1>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Not found -->
    <div
      v-else-if="!question"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-question-mark-circle"
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500">
        لم يتم العثور على هذا السؤال.
      </p>
    </div>

    <div
      v-else
      class="space-y-5"
    >
      <!-- Question card -->
      <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <!-- Breadcrumb chips -->
        <div
          v-if="breadcrumb?.section || breadcrumb?.category || breadcrumb?.article"
          class="flex items-center gap-1.5 flex-wrap mb-3 text-xs"
        >
          <span
            v-if="breadcrumb.section"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 font-bold"
          >
            <UIcon
              name="i-heroicons-rectangle-stack"
              class="w-3.5 h-3.5"
            />
            {{ breadcrumb.section.name }}
          </span>
          <UIcon
            v-if="breadcrumb.section && breadcrumb.category"
            name="i-heroicons-chevron-left"
            class="w-3.5 h-3.5 text-gray-300"
          />
          <NuxtLink
            v-if="breadcrumb.category"
            :to="`/dashboard/question-bank/category/${breadcrumb.category.id}`"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 font-bold hover:bg-primary-50 hover:text-primary-700 transition-colors"
          >
            <UIcon
              name="i-heroicons-folder"
              class="w-3.5 h-3.5"
            />
            {{ breadcrumb.category.name }}
          </NuxtLink>
          <UIcon
            v-if="breadcrumb.article"
            name="i-heroicons-chevron-left"
            class="w-3.5 h-3.5 text-gray-300"
          />
          <NuxtLink
            v-if="breadcrumb.article"
            :to="`/dashboard/revision/article/${breadcrumb.article.id}`"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-50 text-secondary-700 font-bold hover:bg-secondary-100 transition-colors max-w-[260px]"
          >
            <UIcon
              name="i-heroicons-document-text"
              class="w-3.5 h-3.5 shrink-0"
            />
            <span class="truncate">{{ breadcrumb.article.title }}</span>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2 flex-wrap mb-4">
          <UBadge
            v-if="question.difficulty"
            :color="difficultyColor(question.difficulty)"
            variant="soft"
            size="sm"
          >
            {{ difficultyLabel(question.difficulty) }}
          </UBadge>
          <span
            v-if="question.is_new"
            class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-100 text-secondary-700"
          >
            جديد
          </span>
          <div class="ms-auto flex items-center gap-2">
            <UButton
              v-if="authStore.isStudent"
              :color="bookmarked ? 'warning' : 'neutral'"
              :variant="bookmarked ? 'soft' : 'ghost'"
              :icon="bookmarked ? 'i-heroicons-bookmark-solid' : 'i-heroicons-bookmark'"
              size="sm"
              :loading="togglingBookmark"
              :title="bookmarked ? 'إزالة من المحفوظات' : 'حفظ السؤال'"
              square
              @click="toggleBookmark"
            />
            <!-- Report a problem with this question -->
            <UButton
              color="error"
              variant="ghost"
              icon="i-heroicons-flag"
              size="sm"
              title="الإبلاغ عن مشكلة في السؤال"
              square
              @click="reportOpen = true"
            />
            <!-- Explanation icon (always visible when explanation exists) -->
            <UButton
              v-if="hasExplanation"
              color="warning"
              variant="soft"
              icon="i-heroicons-light-bulb"
              size="sm"
              title="عرض الشرح"
              @click="explanationOpen = true"
            >
              الشرح
            </UButton>
          </div>
        </div>

        <div
          class="prose prose-base max-w-none text-gray-900 leading-relaxed mb-5 [&_p]:my-2 [&_pre]:rounded-lg [&_pre]:bg-gray-50 [&_pre]:p-3 [&_code]:text-[13px] [&_table]:my-3 [&_table]:border-collapse [&_th]:border [&_td]:border [&_th]:p-2 [&_td]:p-2 [&_img]:inline-block [&_img]:align-middle [&_img]:max-w-full [&_img]:max-h-32 [&_img]:my-1 [&_img]:mx-1"
          dir="rtl"
          v-html="renderMarkdown(question.text)"
        />

        <!-- Comparison images/values (optional) -->
        <div
          v-if="question.comparison"
          class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5"
        >
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p class="text-xs font-bold text-gray-500 mb-2">
              القيمة الأولى
            </p>
            <p
              v-if="question.comparison.value_1.text"
              class="text-sm text-gray-900"
            >
              {{ question.comparison.value_1.text }}
            </p>
            <img
              v-if="question.comparison.value_1.image"
              :src="question.comparison.value_1.image"
              alt="value 1"
              class="max-w-full rounded-lg"
            >
          </div>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p class="text-xs font-bold text-gray-500 mb-2">
              القيمة الثانية
            </p>
            <p
              v-if="question.comparison.value_2.text"
              class="text-sm text-gray-900"
            >
              {{ question.comparison.value_2.text }}
            </p>
            <img
              v-if="question.comparison.value_2.image"
              :src="question.comparison.value_2.image"
              alt="value 2"
              class="max-w-full rounded-lg"
            >
          </div>
        </div>

        <!-- Answer choices -->
        <div class="space-y-2.5">
          <button
            v-for="(a, idx) in question.answers"
            :key="a.id"
            type="button"
            :disabled="submitted"
            :class="[
              'w-full flex items-center gap-3 p-4 rounded-xl border text-right transition-all',
              answerClass(a.id),
              submitted ? 'cursor-not-allowed' : 'cursor-pointer hover:border-primary-300 hover:bg-primary-50/40'
            ]"
            @click="selectedAnswerId = a.id"
          >
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0', answerBadgeClass(a.id)]">
              {{ ['أ', 'ب', 'ج', 'د', 'هـ'][idx] || (idx + 1) }}
            </div>
            <span
              class="flex-1 text-sm text-gray-900 [&_p]:my-0 [&_code]:text-[12px] [&_img]:inline-block [&_img]:align-middle [&_img]:max-w-full [&_img]:max-h-20 [&_img]:mx-1"
              v-html="renderMarkdown(a.text)"
            />
            <UIcon
              v-if="submitted && a.id === correctAnswerId"
              name="i-heroicons-check-circle"
              class="w-5 h-5 text-success-600 shrink-0"
            />
            <UIcon
              v-else-if="submitted && a.id === selectedAnswerId && a.id !== correctAnswerId"
              name="i-heroicons-x-circle"
              class="w-5 h-5 text-error-600 shrink-0"
            />
          </button>
        </div>

        <!-- Result banner -->
        <div
          v-if="submitted"
          :class="[
            'mt-5 rounded-xl p-4 flex items-start gap-3',
            isCorrect ? 'bg-success-50 border border-success-200' : 'bg-error-50 border border-error-200'
          ]"
        >
          <UIcon
            :name="isCorrect ? 'i-heroicons-trophy' : 'i-heroicons-exclamation-triangle'"
            :class="[
              'w-6 h-6 shrink-0 mt-0.5',
              isCorrect ? 'text-success-600' : 'text-error-600'
            ]"
          />
          <div class="flex-1 min-w-0">
            <p
              :class="[
                'font-bold',
                isCorrect ? 'text-success-700' : 'text-error-700'
              ]"
            >
              {{ isCorrect ? 'إجابة صحيحة!' : 'إجابة غير صحيحة' }}
            </p>
            <p
              v-if="isCorrect && scoreEarned > 0"
              class="text-sm text-success-700 mt-0.5"
            >
              لقد ربحت {{ scoreEarned }} نقطة 🎉
            </p>
            <p
              v-else-if="!isCorrect"
              class="text-sm text-error-700 mt-0.5"
            >
              راجع الشرح أدناه لفهم الإجابة الصحيحة.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <UButton
            v-if="!submitted"
            color="primary"
            size="lg"
            :loading="submitting"
            :disabled="!selectedAnswerId"
            icon="i-heroicons-paper-airplane"
            class="sm:w-auto w-full"
            @click="submitAnswer"
          >
            تأكيد الإجابة
          </UButton>
          <UButton
            v-else
            color="neutral"
            variant="soft"
            size="lg"
            icon="i-heroicons-arrow-path"
            class="sm:w-auto w-full"
            @click="reset"
          >
            حل مرة أخرى
          </UButton>

          <div class="flex items-center gap-2">
            <UButton
              v-if="question.previous_question_id"
              :to="`/dashboard/question-bank/${question.previous_question_id}`"
              color="neutral"
              variant="soft"
              icon="i-heroicons-chevron-right"
            >
              السابق
            </UButton>
            <UButton
              v-if="question.next_question_id"
              :to="`/dashboard/question-bank/${question.next_question_id}`"
              color="primary"
              variant="soft"
              trailing-icon="i-heroicons-chevron-left"
            >
              التالي
            </UButton>
          </div>
        </div>
      </section>
    </div>

    <!-- Explanation modal -->
    <UModal
      v-model:open="explanationOpen"
      :ui="{ content: 'sm:max-w-2xl' }"
    >
      <template #content>
        <div class="bg-white rounded-2xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-warning-50 border border-warning-100 flex items-center justify-center shrink-0">
                <UIcon
                  name="i-heroicons-light-bulb"
                  class="w-5 h-5 text-warning-600"
                />
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-bold text-gray-900 truncate">
                  شرح السؤال
                </h3>
                <p class="text-xs text-gray-500 truncate">
                  راجع الفكرة والخطوات قبل الحل
                </p>
              </div>
            </div>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="sm"
              @click="explanationOpen = false"
            />
          </div>

          <div class="px-6 pt-4 pb-5 max-h-[70vh] overflow-y-auto">
            <div
              v-if="!question?.explanation?.text && !question?.explanation?.video_url"
              class="py-8 text-center text-sm text-gray-500"
            >
              لا يوجد شرح متاح لهذا السؤال.
            </div>

            <div
              v-else
              class="flex items-center gap-2 mb-4"
            >
              <button
                v-for="t in explanationTabs"
                :key="t.value"
                type="button"
                :class="[
                  'flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-bold transition-colors',
                  activeExplanationTab === t.value
                    ? 'bg-warning-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-warning-50 hover:text-warning-700 border border-gray-100'
                ]"
                @click="activeExplanationTab = t.value"
              >
                <UIcon
                  :name="t.icon"
                  class="w-4 h-4"
                />
                {{ t.label }}
              </button>
            </div>

            <!-- Text panel -->
            <div
              v-if="activeExplanationTab === 'text'"
              class="min-h-[120px] space-y-4"
            >
              <!-- Correct answer block -->
              <div
                v-if="loadingCorrectAnswer && !correctAnswer"
                class="rounded-xl bg-gray-50 border border-gray-100 p-4 flex items-center gap-2 text-sm text-gray-500"
              >
                <UIcon
                  name="i-heroicons-arrow-path"
                  class="w-4 h-4 animate-spin"
                />
                جارٍ جلب الإجابة الصحيحة...
              </div>
              <div
                v-else-if="correctAnswer"
                class="rounded-xl bg-success-50 border border-success-200 p-4"
              >
                <p class="text-xs font-bold text-success-700 mb-1.5 flex items-center gap-1.5">
                  <UIcon
                    name="i-heroicons-check-circle"
                    class="w-4 h-4"
                  />
                  الإجابة الصحيحة
                </p>
                <div
                  class="text-sm font-bold text-success-900 [&_p]:my-0 [&_img]:inline-block [&_img]:align-middle [&_img]:max-w-full [&_img]:max-h-20 [&_img]:mx-1"
                  dir="rtl"
                  v-html="renderMarkdown(correctAnswer.text)"
                />
              </div>

              <div
                v-if="question?.explanation?.text"
                class="prose prose-sm max-w-none text-gray-800 leading-relaxed [&_p]:my-2 [&_pre]:rounded-lg [&_pre]:bg-gray-50 [&_pre]:p-3 [&_img]:inline-block [&_img]:align-middle [&_img]:max-w-full [&_img]:max-h-40 [&_img]:my-1 [&_img]:mx-1"
                dir="rtl"
                v-html="renderMarkdown(question.explanation.text)"
              />
              <div
                v-else-if="!correctAnswer && !loadingCorrectAnswer"
                class="py-8 text-center text-sm text-gray-500"
              >
                لا يوجد شرح نصي لهذا السؤال.
              </div>
            </div>

            <!-- Video panel -->
            <div v-else-if="activeExplanationTab === 'video'">
              <div
                v-if="question?.explanation?.video_url"
                class="aspect-video rounded-xl overflow-hidden bg-black"
              >
                <iframe
                  :src="question.explanation.video_url"
                  class="w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
              </div>
              <div
                v-else
                class="py-8 text-center text-sm text-gray-500"
              >
                لا يوجد فيديو شرح لهذا السؤال.
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
            <UButton
              color="neutral"
              variant="ghost"
              @click="explanationOpen = false"
            >
              إغلاق
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Report this question -->
    <DashboardTicketsNewTicketModal
      v-model:open="reportOpen"
      :prefill="reportPrefill"
      lock-category
      @created="onReportCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { questionsService } from '@/services/api/questions.service'
import { renderMarkdown } from '@/utils/markdown'
import { useAuthStore } from '@/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'تفاصيل السؤال' })

const authStore = useAuthStore()

const route = useRoute()
const id = computed(() => Number(route.params.id))

interface Answer { id: number, text: string }
interface QuestionDetail {
  id: number
  text: string
  difficulty?: string
  is_new?: boolean
  comparison?: {
    value_1: { text?: string, image?: string }
    value_2: { text?: string, image?: string }
  }
  explanation?: { text?: string, video_url?: string }
  answers: Answer[]
  previous_question_id?: number | null
  next_question_id?: number | null
  type?: { id: number, name: string }
  breadcrumb?: {
    section?: { id: number, name: string } | null
    category?: { id: number, name: string } | null
    article?: { id: number, title: string } | null
  } | null
  is_bookmarked?: boolean
}

const loading = ref(true)
const question = ref<QuestionDetail | null>(null)
const selectedAnswerId = ref<number | null>(null)
const submitting = ref(false)
const submitted = ref(false)
const isCorrect = ref(false)
const scoreEarned = ref(0)
const correctAnswerId = ref<number | null>(null)
const explanationOpen = ref(false)

interface CorrectAnswer { id: number, text: string }
const correctAnswer = ref<CorrectAnswer | null>(null)
const loadingCorrectAnswer = ref(false)

const bookmarked = ref(false)
const togglingBookmark = ref(false)

const reportOpen = ref(false)

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

const reportPrefill = computed(() => {
  if (!question.value) return null
  const trail = [
    breadcrumb.value?.section?.name,
    breadcrumb.value?.category?.name
  ].filter(Boolean).join(' › ')
  const snippet = stripHtml(question.value.text || '').slice(0, 200)
  const lines = [
    `الإبلاغ عن مشكلة في السؤال #${question.value.id}`,
    trail ? `المسار: ${trail}` : null,
    snippet ? `\nنص السؤال:\n${snippet}` : null,
    '\nالملاحظة (اشرح المشكلة):'
  ].filter(Boolean)
  return {
    subject: `بخصوص السؤال #${question.value.id}`,
    description: lines.join('\n'),
    category: 'question_report' as const
  }
})

function onReportCreated() {
  reportOpen.value = false
}

async function toggleBookmark() {
  if (!question.value || togglingBookmark.value) return
  togglingBookmark.value = true
  // Optimistic flip — server response confirms or reverts.
  const previous = bookmarked.value
  bookmarked.value = !previous
  try {
    const res = await questionsService.toggleBookmark(question.value.id)
    const data = res.data?.data ?? res.data ?? {}
    bookmarked.value = !!data.bookmarked
  } catch (err) {
    console.error('Failed to toggle bookmark', err)
    bookmarked.value = previous
  } finally {
    togglingBookmark.value = false
  }
}

type ExplanationTab = 'text' | 'video'
const activeExplanationTab = ref<ExplanationTab>('text')

const explanationTabs = computed<{ value: ExplanationTab, label: string, icon: string }[]>(() => {
  const tabs: { value: ExplanationTab, label: string, icon: string }[] = []
  // Always offer the text tab — it hosts the correct-answer block too, so it
  // stays useful even when only the video is present (and vice versa).
  tabs.push({ value: 'text', label: 'النص', icon: 'i-heroicons-document-text' })
  if (question.value?.explanation?.video_url) {
    tabs.push({ value: 'video', label: 'الفيديو', icon: 'i-heroicons-play-circle' })
  }
  return tabs
})

// The lightbulb is offered any time the question has answers (the modal will
// always be able to fetch the correct answer) or has explanation content.
const hasExplanation = computed(() =>
  !!(question.value?.explanation?.text || question.value?.explanation?.video_url || (question.value?.answers?.length ?? 0) > 0)
)

const breadcrumb = computed(() => question.value?.breadcrumb ?? null)

// Open the modal on whichever tab actually has content for this question.
// Also lazy-load the correct answer so the explanation block can show it
// without bloating the initial question detail payload.
watch(explanationOpen, async (open) => {
  if (!open) return
  const valid = explanationTabs.value.map(t => t.value)
  if (!valid.includes(activeExplanationTab.value)) {
    activeExplanationTab.value = valid[0] ?? 'text'
  }
  if (correctAnswer.value || loadingCorrectAnswer.value || !question.value) return
  loadingCorrectAnswer.value = true
  try {
    const res = await questionsService.getCorrectAnswer(question.value.id)
    const data = res.data?.data ?? res.data ?? null
    correctAnswer.value = data && data.id ? { id: data.id, text: data.text } : null
  } catch (err) {
    console.error('Failed to fetch correct answer', err)
    correctAnswer.value = null
  } finally {
    loadingCorrectAnswer.value = false
  }
})

watch(id, () => {
  reset()
  loadQuestion()
})

async function loadQuestion() {
  loading.value = true
  try {
    const res = await questionsService.getQuestionDetails(id.value)
    const data = res.data?.data ?? res.data ?? {}
    question.value = data.question ?? null
    bookmarked.value = !!question.value?.is_bookmarked
  } catch (err) {
    console.error('Failed to load question', err)
    question.value = null
    bookmarked.value = false
  } finally {
    loading.value = false
  }
}

function reset() {
  selectedAnswerId.value = null
  submitted.value = false
  isCorrect.value = false
  scoreEarned.value = 0
  correctAnswerId.value = null
  explanationOpen.value = false
  correctAnswer.value = null
}

async function submitAnswer() {
  if (!selectedAnswerId.value || !question.value) return
  submitting.value = true
  try {
    const res = await questionsService.submitAnswer({
      question_id: question.value.id,
      answer_id: selectedAnswerId.value
    })
    const data = res.data?.data ?? res.data ?? {}
    isCorrect.value = !!data.is_correct
    scoreEarned.value = data.score_earned ?? 0
    correctAnswerId.value = isCorrect.value ? selectedAnswerId.value : (data.correct_answer ?? null)
    submitted.value = true
  } catch (err) {
    console.error('Failed to submit answer', err)
  } finally {
    submitting.value = false
  }
}

function answerClass(answerId: number): string {
  if (!submitted.value) {
    return selectedAnswerId.value === answerId
      ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-300'
      : 'border-gray-200 bg-white'
  }
  if (answerId === correctAnswerId.value) {
    return 'border-success-400 bg-success-50'
  }
  if (answerId === selectedAnswerId.value && answerId !== correctAnswerId.value) {
    return 'border-error-400 bg-error-50'
  }
  return 'border-gray-200 bg-white opacity-70'
}

function answerBadgeClass(answerId: number): string {
  if (!submitted.value) {
    return selectedAnswerId.value === answerId
      ? 'bg-primary-600 text-white'
      : 'bg-gray-100 text-gray-700'
  }
  if (answerId === correctAnswerId.value) return 'bg-success-600 text-white'
  if (answerId === selectedAnswerId.value) return 'bg-error-600 text-white'
  return 'bg-gray-100 text-gray-500'
}

function difficultyLabel(d?: string) {
  if (d === 'easy') return 'سهل'
  if (d === 'medium') return 'متوسط'
  if (d === 'hard') return 'صعب'
  return d || 'غير محدد'
}

function difficultyColor(d?: string): 'success' | 'warning' | 'error' | 'neutral' {
  if (d === 'easy') return 'success'
  if (d === 'medium') return 'warning'
  if (d === 'hard') return 'error'
  return 'neutral'
}

onMounted(loadQuestion)
</script>
