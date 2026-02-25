<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6 flex items-center gap-3">
        <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-right" @click="$router.back()" />
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          السؤال
        </h1>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-primary-500 animate-spin" />
      </div>

      <div v-else-if="question" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <!-- Question text -->
        <p class="text-lg font-semibold text-gray-900 dark:text-white mb-4 leading-relaxed">
          {{ question.text || question.content }}
        </p>

        <!-- Question image -->
        <img
          v-if="question.image_path"
          :src="question.image_path"
          alt="صورة السؤال"
          class="rounded-xl mb-5 max-h-64 object-contain"
        >

        <!-- Badges -->
        <div class="flex flex-wrap gap-2 mb-6">
          <UBadge v-if="question.subject_name" color="primary" variant="soft">
            {{ question.subject_name }}
          </UBadge>
          <UBadge v-if="question.difficulty" color="warning" variant="soft">
            {{ question.difficulty }}
          </UBadge>
          <UBadge v-if="question.type_name" color="neutral" variant="soft">
            {{ question.type_name }}
          </UBadge>
        </div>

        <!-- Choices -->
        <div v-if="question.answers?.length" class="space-y-3 mb-6">
          <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">
            الخيارات:
          </h3>
          <div
            v-for="(answer, idx) in question.answers"
            :key="idx"
            class="flex items-start gap-3 p-4 rounded-xl border transition-colors"
            :class="answer.is_correct
              ? 'border-success-400 bg-success-50 dark:bg-success-900/20'
              : 'border-gray-200 dark:border-gray-600'"
          >
            <span
              class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              :class="answer.is_correct ? 'bg-success-500 text-white' : 'bg-gray-200 text-gray-700'"
            >
              {{ ['أ', 'ب', 'ج', 'د'][idx] }}
            </span>
            <p class="text-gray-800 dark:text-gray-200 pt-0.5">
              {{ answer.text || answer.content }}
            </p>
            <UIcon
              v-if="answer.is_correct"
              name="i-heroicons-check-circle"
              class="w-5 h-5 text-success-500 mr-auto flex-shrink-0"
            />
          </div>
        </div>

        <!-- Explanation -->
        <div v-if="question.explanation" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <h3 class="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
            <UIcon name="i-heroicons-light-bulb" class="w-5 h-5" />
            الشرح
          </h3>
          <p class="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
            {{ question.explanation }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { questionService } from '@/services/api/question.service'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const loading = ref(true)
const question = ref<any>(null)

useSeoMeta({
  title: computed(() => question.value ? 'سؤال | A Plus' : 'تفاصيل السؤال | A Plus')
})

onMounted(async () => {
  try {
    const res = await questionService.detail(route.params.id as string)
    question.value = res.data?.data?.question
  } catch {
    //
  } finally {
    loading.value = false
  }
})
</script>
