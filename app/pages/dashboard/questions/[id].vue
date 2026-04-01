<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <UButton
        icon="i-heroicons-arrow-right"
        color="neutral"
        variant="ghost"
        class="rtl:-scale-x-100"
        @click="$router.back()"
      />
      <div>
        <h1
          class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
        >
          السؤال #{{ questionId }}
          <UBadge
            v-if="question?.difficulty"
            :color="getDifficultyColor(question.difficulty)"
            variant="subtle"
          >
            {{ question.difficulty }}
          </UBadge>
        </h1>
        <p class="text-sm text-gray-500 mt-1 flex items-center gap-2">
          <span v-if="question?.subject">{{
            question.subject.name_ar || question.subject.name
          }}</span>
          <span
            v-if="question?.category"
            class="text-gray-300 dark:text-gray-600"
          >•</span>
          <span v-if="question?.category">{{
            question.category.name_ar || question.category.name
          }}</span>
        </p>
      </div>
    </div>

    <!-- loading state -->
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
      v-else-if="!question"
      class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
    >
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-16 h-16 mx-auto text-yellow-500 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        السؤال غير موجود
      </h3>
      <p class="text-gray-500">
        لا يمكن العثور على هذا السؤال، ربما تم حذفه أو ليس لديك صلاحية للوصول
        إليه.
      </p>
      <UButton
        to="/dashboard/exams"
        class="mt-6"
        color="neutral"
        variant="soft"
      >
        العودة للمراحل
      </UButton>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <!-- Question Content Container -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
      >
        <!-- Question Text/Media -->
        <div class="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
          <div
            class="prose dark:prose-invert max-w-none text-lg leading-relaxed text-gray-900 dark:text-gray-100 font-medium"
            v-html="question.question_text || question.content"
          />

          <!-- Render media if attached (images/audio) -->
          <div
            v-if="question.media_url || question.image"
            class="mt-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-2"
          >
            <img
              :src="question.media_url || question.image"
              alt="مرفق السؤال"
              class="max-w-full h-auto mx-auto rounded-lg"
            >
          </div>
        </div>

        <!-- Answers Section -->
        <div class="p-6 md:p-8 bg-gray-50/50 dark:bg-gray-800/50">
          <h4
            class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"
          >
            <UIcon
              name="i-heroicons-queue-list"
              class="w-5 h-5"
            />
            اختر الإجابة الصحيحة
          </h4>

          <div
            v-if="question.answers && question.answers.length > 0"
            class="space-y-3"
          >
            <label
              v-for="(answer, index) in question.answers"
              :key="answer.id"
              class="flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-white dark:hover:bg-gray-800 group"
              :class="[
                selectedAnswerId === answer.id
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 shadow-sm'
                  : 'border-transparent bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700',
                isSubmitted && answer.is_correct
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : '',
                isSubmitted
                  && selectedAnswerId === answer.id
                  && !answer.is_correct
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : ''
              ]"
            >
              <div class="flex items-center h-6">
                <input
                  v-model="selectedAnswerId"
                  type="radio"
                  :name="'question_' + question.id"
                  :value="answer.id"
                  :disabled="isSubmitted || isSubmitting"
                  class="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
              </div>
              <div class="flex-1">
                <div
                  class="text-gray-900 dark:text-white"
                  :class="{ 'font-medium': selectedAnswerId === answer.id }"
                >
                  {{ answer.answer_text || answer.content }}
                </div>
                <!-- Optional answer image/media -->
                <img
                  v-if="answer.media_url || answer.image"
                  :src="answer.media_url || answer.image"
                  class="mt-2 rounded-lg max-h-32 object-contain"
                >
              </div>

              <!-- Indicators after submission -->
              <div
                v-if="isSubmitted"
                class="shrink-0 h-6 flex items-center"
              >
                <UIcon
                  v-if="answer.is_correct"
                  name="i-heroicons-check-circle"
                  class="w-6 h-6 text-emerald-500"
                />
                <UIcon
                  v-if="selectedAnswerId === answer.id && !answer.is_correct"
                  name="i-heroicons-x-circle"
                  class="w-6 h-6 text-red-500"
                />
              </div>
            </label>
          </div>

          <!-- Free Text Answer Fallback (if no choices provided) -->
          <div v-else>
            <UTextarea
              v-model="textAnswer"
              :disabled="isSubmitted || isSubmitting"
              placeholder="اكتب إجابتك هنا..."
              :rows="4"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-between">
        <UButton
          size="xl"
          :loading="isSubmitting"
          :disabled="isSubmitted || (!selectedAnswerId && !textAnswer)"
          class="min-w-[150px] justify-center"
          @click="submitAnswer"
        >
          {{ isSubmitted ? "تم الإرسال" : "تأكيد الإجابة" }}
        </UButton>

        <!-- Dynamic feedback alert -->
        <div
          v-if="isSubmitted"
          class="flex items-center gap-2 animate-fade-in"
        >
          <UBadge
            v-if="isCorrectResult"
            color="success"
            size="lg"
            variant="subtle"
            class="px-4 py-2 text-base"
          >
            <UIcon
              name="i-heroicons-star"
              class="w-5 h-5 mr-1"
            />
            إجابة صحيحة! أحسنت!
          </UBadge>
          <UBadge
            v-else
            color="error"
            size="lg"
            variant="subtle"
            class="px-4 py-2 text-base"
          >
            <UIcon
              name="i-heroicons-exclamation-circle"
              class="w-5 h-5 mr-1"
            />
            إجابة خاطئة. حاول مرة أخرى.
          </UBadge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { questionsService } from '@/services/api/questions.service'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const route = useRoute()
const questionId = route.params.id as string

const loading = ref(true)
const question = ref<any>(null)

const selectedAnswerId = ref<number | null>(null)
const textAnswer = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const isCorrectResult = ref(false)

onMounted(async () => {
  try {
    const res = await questionsService.getQuestionDetails(questionId)
    const data = res.data?.data || res.data
    question.value = data?.question || data

    useSeoMeta({ title: `السؤال #${questionId} | A Plus` })
  } catch (error) {
    console.error('Failed to load question details', error)
  } finally {
    loading.value = false
  }
})

async function submitAnswer() {
  if (!selectedAnswerId.value && !textAnswer.value) return

  isSubmitting.value = true
  try {
    const payload: any = { question_id: parseInt(questionId) }
    if (selectedAnswerId.value) payload.answer_id = selectedAnswerId.value
    if (textAnswer.value) payload.answer_text = textAnswer.value

    const res = await questionsService.submitAnswer(payload)

    // Evaluate if backend returns correctness, or check against question answers array locally if exposed
    const responseData = res.data?.data || res.data
    isCorrectResult.value = responseData?.is_correct === true

    // If backend doesn't return exact correctness in response but we have valid local data exposing it
    if (responseData?.is_correct === undefined && selectedAnswerId.value) {
      const chosen = question.value.answers?.find(
        (a: any) => a.id === selectedAnswerId.value
      )
      isCorrectResult.value = chosen?.is_correct === true
    }

    isSubmitted.value = true

    if (isCorrectResult.value) {
      showToast('ممتاز', 'إجابتك صحيحة!', 'success')
    } else {
      showToast('تنبيه', 'الإجابة خاطئة', 'warning')
    }
  } catch (error: any) {
    console.error('Failed to submit answer', error)
    showToast(
      'خطأ',
      error.response?.data?.message || 'حدث خطأ أثناء إرسال الإجابة',
      'error'
    )
  } finally {
    isSubmitting.value = false
  }
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
