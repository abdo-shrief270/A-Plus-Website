<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        نماذج الاختبارات
      </h1>

      <div v-if="loading" class="flex justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-primary-500 animate-spin" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <NuxtLink
          v-for="pe in practiceExams"
          :key="pe.id"
          :to="`/practice-exams/${pe.id}`"
        >
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer">
            <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white mb-1">
              {{ pe.name || pe.title }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ pe.questions_count ?? '' }} سؤال
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { practiceExamService } from '@/services/api/practiceExam.service'

definePageMeta({ middleware: ['auth'] })
useSeoMeta({ title: 'نماذج اختبارات | A Plus' })

const loading = ref(true)
const practiceExams = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await practiceExamService.list()
    practiceExams.value = res.data?.data?.practice_exams || []
  } catch {
    //
  } finally {
    loading.value = false
  }
})
</script>
