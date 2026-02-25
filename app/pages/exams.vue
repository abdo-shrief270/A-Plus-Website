<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-5xl mx-auto">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          الاختبارات
        </h1>
        <UInput v-model="search" placeholder="ابحث..." icon="i-heroicons-magnifying-glass" size="sm" class="w-60" />
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-primary-500 animate-spin" />
      </div>

      <div v-else-if="filteredExams.length === 0" class="text-center py-20 text-gray-400">
        لا توجد اختبارات
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <NuxtLink
          v-for="exam in filteredExams"
          :key="exam.id"
          :to="`/exams/${exam.id}`"
        >
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-6 h-6 text-primary-600" />
              </div>
              <UBadge color="primary" variant="soft">
                {{ exam.type || 'اختبار' }}
              </UBadge>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-1">
              {{ exam.name }}
            </h3>
            <p class="text-sm text-gray-500 mb-3">
              {{ exam.description || exam.year }}
            </p>
            <div class="flex items-center gap-3 text-xs text-gray-400">
              <span v-if="exam.subjects_count" class="flex items-center gap-1">
                <UIcon name="i-heroicons-book-open" class="w-3 h-3" />
                {{ exam.subjects_count }} مادة
              </span>
              <span v-if="exam.sections_count" class="flex items-center gap-1">
                <UIcon name="i-heroicons-squares-2x2" class="w-3 h-3" />
                {{ exam.sections_count }} قسم
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { examService } from '@/services/api/exam.service'

definePageMeta({ middleware: ['auth'] })
useSeoMeta({ title: 'الاختبارات | A Plus' })

const loading = ref(true)
const exams = ref<any[]>([])
const search = ref('')

const filteredExams = computed(() =>
  exams.value.filter(e =>
    !search.value || e.name?.toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(async () => {
  try {
    const res = await examService.list()
    exams.value = res.data?.data?.exams || []
  } catch {
    //
  } finally {
    loading.value = false
  }
})
</script>
