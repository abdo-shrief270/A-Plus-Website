<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-gray-950">
    <!-- Header Section -->
    <div class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/exams"
            class="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
          >
            <UIcon
              name="i-heroicons-arrow-right"
              class="w-5 h-5"
            />
          </NuxtLink>
          <div>
            <h1 class="text-xl font-black text-gray-900 dark:text-white">
              {{ questionsStore.currentSubject?.name || 'أسئلة المادة' }}
            </h1>
            <p class="text-xs text-gray-500 font-medium line-clamp-1">
              تصفح الأسئلة المتاحة في هذه المادة الدراسية
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="container mx-auto px-4 py-8">
      <div
        v-if="questionsStore.isLoading && questionsStore.subjectQuestions.length === 0"
        class="flex flex-col items-center justify-center py-24"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-12 h-12 text-primary-500 animate-spin mb-4"
        />
        <span class="text-gray-500 animate-pulse font-medium">جاري تحميل الأسئلة...</span>
      </div>

      <div
        v-else-if="questionsStore.subjectQuestions.length === 0"
        class="text-center py-32 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm max-w-4xl mx-auto"
      >
        <div class="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon
            name="i-heroicons-folder-open"
            class="w-10 h-10 text-gray-300"
          />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          لا توجد أسئلة في هذه المادة بعد
        </h3>
        <p class="text-gray-500 max-w-sm mx-auto">
          نحن نعمل على إضافة المزيد من الأسئلة لهذه المادة قريباً.
        </p>
      </div>

      <div
        v-else
        class="max-w-4xl mx-auto"
      >
        <div class="space-y-6">
          <QuestionCard
            v-for="question in questionsStore.subjectQuestions"
            :key="question.id"
            :question="question"
          />
        </div>

        <!-- Pagination -->
        <div
          v-if="questionsStore.subjectPagination && questionsStore.subjectPagination.last_page > 1"
          class="mt-12 flex justify-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <UPagination
            v-model="currentPage"
            :total="questionsStore.subjectPagination.total"
            :page-count="questionsStore.subjectPagination.per_page"
            class="rtl"
            :ui="{
              list: 'flex items-center gap-1'
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuestionsStore } from '@/stores/useQuestionsStore'

// Public page
definePageMeta({ layout: 'default' })

const route = useRoute()
const questionsStore = useQuestionsStore()

const { currentPage } = usePagination({
  onPageChange: (page) => {
    questionsStore.fetchSubjectQuestions(route.params.id as string, {
      paginate: true,
      page,
      per_page: 15
    })
  }
})

useSeoMeta({
  title: computed(() => `${questionsStore.currentSubject?.name || 'أسئلة المادة'} | A Plus`),
  description: computed(() => `تصفح الأسئلة المتاحة في مادة ${questionsStore.currentSubject?.name || ''}`)
})

onMounted(() => {
  questionsStore.fetchSubjectQuestions(route.params.id as string, {
    paginate: true,
    page: currentPage.value,
    per_page: 15
  })
})
</script>
