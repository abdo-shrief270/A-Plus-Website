<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6 flex items-center gap-3">
        <NuxtLink to="/practice-exams">
          <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-right" />
        </NuxtLink>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ practiceExam?.name || 'نموذج اختبار' }}
        </h1>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-primary-500 animate-spin" />
      </div>

      <div v-else class="space-y-4">
        <NuxtLink
          v-for="(q, idx) in practiceExam?.questions || []"
          :key="q.id"
          :to="`/questions/${q.id}`"
        >
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer">
            <div class="flex items-start gap-3">
              <span class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                {{ idx + 1 }}
              </span>
              <p class="text-gray-900 dark:text-white font-medium mt-1">
                {{ q.text || q.content }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { practiceExamService } from '@/services/api/practiceExam.service'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const loading = ref(true)
const practiceExam = ref<any>(null)

useSeoMeta({
  title: computed(() => `${practiceExam.value?.name || 'نموذج'} | A Plus`)
})

onMounted(async () => {
  try {
    const res = await practiceExamService.detail(route.params.id as string)
    practiceExam.value = res.data?.data?.practice_exam
  } catch {
    //
  } finally {
    loading.value = false
  }
})
</script>
