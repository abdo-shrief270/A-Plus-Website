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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          السؤال #{{ questionId }}
          <UBadge
            v-if="question?.difficulty"
            :color="getDifficultyColor(question.difficulty)"
            variant="subtle"
          >
            {{ difficultyLabel(question.difficulty) }}
          </UBadge>
        </h1>
        <p
          v-if="question?.breadcrumb?.category || question?.breadcrumb?.section"
          class="text-sm text-gray-500 mt-1 flex items-center gap-2"
        >
          <span v-if="question.breadcrumb.section">{{ question.breadcrumb.section.name }}</span>
          <span
            v-if="question.breadcrumb.section && question.breadcrumb.category"
            class="text-gray-300 dark:text-gray-600"
          >•</span>
          <span v-if="question.breadcrumb.category">{{ question.breadcrumb.category.name }}</span>
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary-500 animate-spin"
      />
    </div>

    <!-- Not found -->
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
        لا يمكن العثور على هذا السؤال، ربما تم حذفه أو ليس لديك صلاحية للوصول إليه.
      </p>
      <UButton
        to="/dashboard/question-bank"
        class="mt-6"
        color="neutral"
        variant="soft"
      >
        العودة لبنك الأسئلة
      </UButton>
    </div>

    <!-- Question (reuses the shared answer flow: charging, points, explanation, AI) -->
    <QuestionItem
      v-else
      :key="question.id"
      :question="question"
    />
  </div>
</template>

<script setup lang="ts">
import QuestionItem from '@/components/question/QuestionItem.vue'
import { questionsService } from '@/services/api/questions.service'
import type { Question } from '@/types/question-bank'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const route = useRoute()
const questionId = route.params.id as string

const loading = ref(true)
const question = ref<Question | null>(null)

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

function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'success'
    case 'hard': return 'error'
    case 'medium':
    default: return 'warning'
  }
}

function difficultyLabel(difficulty: string) {
  return ({ easy: 'سهل', medium: 'متوسط', hard: 'صعب' } as Record<string, string>)[difficulty?.toLowerCase()] || difficulty
}
</script>
