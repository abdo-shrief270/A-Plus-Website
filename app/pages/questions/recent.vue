<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-gray-950">
    <!-- Header Section -->
    <div class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
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
                أحدث الأسئلة
              </h1>
              <p class="text-xs text-gray-500 font-medium">
                آخر الإضافات إلى بنك الأسئلة والمواد الدراسية
              </p>
            </div>
          </div>

          <div class="hidden sm:flex items-center gap-2">
            <NuxtLink to="/questions/trending">
              <UButton
                color="neutral"
                variant="ghost"
                size="sm"
                class="rounded-lg"
              >
                الأكثر حلاً
              </UButton>
            </NuxtLink>
            <NuxtLink to="/questions/search">
              <UButton
                color="primary"
                variant="soft"
                size="sm"
                icon="i-heroicons-magnifying-glass"
                class="rounded-lg"
              >
                بحث متقدم
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <div
        v-if="questionsStore.isLoading"
        class="flex flex-col items-center justify-center py-24"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-12 h-12 text-primary-500 animate-spin mb-4"
        />
        <span class="text-gray-500 animate-pulse font-medium">جاري تحميل أحدث الأسئلة...</span>
      </div>

      <div
        v-else-if="questionsStore.recentQuestions.length === 0"
        class="text-center py-32 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <div class="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon
            name="i-heroicons-clock"
            class="w-10 h-10 text-gray-300"
          />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          لا توجد أسئلة جديدة حالياً
        </h3>
        <p class="text-gray-500 max-w-sm mx-auto">
          يتم تحديث بنك الأسئلة بانتظام، يرجى المحاولة مرة أخرى لاحقاً.
        </p>
      </div>

      <div
        v-else
        class="max-w-4xl mx-auto space-y-6"
      >
        <QuestionCard
          v-for="question in questionsStore.recentQuestions"
          :key="question.id"
          :question="question"
        />

        <!-- Pagination -->
        <div
          v-if="questionsStore.recentPagination && questionsStore.recentPagination.last_page > 1"
          class="mt-12 flex justify-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <UPagination
            v-model="currentPage"
            :total="questionsStore.recentPagination.total"
            :page-count="questionsStore.recentPagination.per_page"
            class="rtl"
            :ui="{
              list: 'flex items-center gap-1',
              base: 'rounded-lg font-bold',
              rounded: 'rounded-lg'
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
useSeoMeta({
  title: 'أحدث الأسئلة - آخر الإضافات لبنك الأسئلة | A Plus',
  description: 'كن أول من يحل أحدث الأسئلة المضافة لبنك الأسئلة A Plus. تدرب على أحدث النماذج والمواد الدراسية.'
})

const questionsStore = useQuestionsStore()
const currentPage = ref(1)

async function fetchRecent(page = 1) {
  await questionsStore.fetchRecent({ page, per_page: 15 })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(currentPage, (val) => {
  fetchRecent(val)
})

onMounted(() => {
  fetchRecent()
})
</script>
