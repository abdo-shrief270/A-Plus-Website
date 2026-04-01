<template>
  <NuxtLink
    :to="`/questions/${question.id}`"
    class="group block"
  >
    <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 flex flex-col sm:flex-row gap-6">
      <!-- Question Content -->
      <div class="flex-grow">
        <div class="flex items-center gap-3 mb-3">
          <UBadge
            :color="getDifficultyColor(question.difficulty)"
            variant="subtle"
            size="xs"
            class="rounded-lg px-2 font-bold"
          >
            {{ getDifficultyLabel(question.difficulty) }}
          </UBadge>
          <div class="flex items-center gap-1.5 text-xs text-gray-400 font-medium border-r border-gray-100 dark:border-gray-800 pr-3 mr-1">
            <UIcon
              name="i-heroicons-tag"
              class="w-3.5 h-3.5 text-secondary-500"
            />
            <span>{{ question.type?.name || 'سؤال' }}</span>
          </div>
          <div
            v-if="question.is_new"
            class="mr-auto"
          >
            <UBadge
              color="primary"
              variant="solid"
              size="xs"
              class="rounded-lg px-2 animate-pulse"
            >
              جديد
            </UBadge>
          </div>
        </div>

        <h3 class="text-lg font-bold text-gray-800 dark:text-white line-clamp-3 leading-relaxed mb-4 group-hover:text-primary-600 transition-colors">
          {{ question.text }}
        </h3>

        <!-- Context Context -->
        <div
          v-if="question.belongs_to"
          class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-400"
        >
          <div
            v-if="question.belongs_to.exam"
            class="flex items-center gap-1"
          >
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-4 h-4 text-primary-400"
            />
            <span>{{ question.belongs_to.exam.name }}</span>
          </div>
          <div
            v-if="question.belongs_to.category"
            class="flex items-center gap-1"
          >
            <UIcon
              name="i-heroicons-folder"
              class="w-4 h-4 text-secondary-400"
            />
            <span>{{ question.belongs_to.category.name }}</span>
          </div>
        </div>
      </div>

      <!-- Actions/Meta -->
      <div class="flex sm:flex-col items-center justify-between sm:justify-center gap-4 sm:border-r border-gray-50 dark:border-gray-800 sm:pr-6 sm:min-w-[140px]">
        <div class="text-center hidden sm:block">
          <div class="text-2xl font-black text-gray-900 dark:text-white">
            #{{ question.id }}
          </div>
          <div class="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            رمز السؤال
          </div>
        </div>
        <UButton
          color="primary"
          variant="soft"
          icon="i-heroicons-pencil-square"
          class="rounded-xl w-full sm:w-auto font-bold"
        >
          حل السؤال
        </UButton>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Question } from '~/types/question-bank'

defineProps<{
  question: Question
}>()

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
</script>
