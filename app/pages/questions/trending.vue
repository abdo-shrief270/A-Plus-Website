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
                الأسئلة الشائعة
              </h1>
              <p class="text-xs text-gray-500 font-medium">
                أكثر الأسئلة حلاً وتفاعلاً على المنصة
              </p>
            </div>
          </div>

          <div class="hidden sm:flex items-center gap-2">
            <NuxtLink to="/questions/recent">
              <UButton
                color="neutral"
                variant="ghost"
                size="sm"
                class="rounded-lg"
              >
                الأحدث
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
        <span class="text-gray-500 animate-pulse font-medium">جاري المزامنة مع بنك الأسئلة...</span>
      </div>

      <div
        v-else-if="questionsStore.trendingQuestions.length === 0"
        class="text-center py-32 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <div class="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon
            name="i-heroicons-face-frown"
            class="w-10 h-10 text-gray-300"
          />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          لا توجد أسئلة رائجة حالياً
        </h3>
        <p class="text-gray-500 max-w-sm mx-auto">
          يبدو أننا نقوم بتحديث البيانات، يرجى العودة لاحقاً أو استكشاف أحدث الأسئلة.
        </p>
        <NuxtLink
          to="/questions/recent"
          class="mt-6 inline-block"
        >
          <UButton
            color="primary"
            variant="solid"
            class="rounded-xl px-6"
          >
            تصفح أحدث الأسئلة
          </UButton>
        </NuxtLink>
      </div>

      <div
        v-else
        class="max-w-4xl mx-auto space-y-6"
      >
        <QuestionCard
          v-for="question in questionsStore.trendingQuestions"
          :key="question.id"
          :question="question"
        />

        <!-- Pagination -->
        <div
          v-if="questionsStore.trendingPagination && questionsStore.trendingPagination.last_page > 1"
          class="mt-12 flex justify-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <UPagination
            v-model="currentPage"
            :total="questionsStore.trendingPagination.total"
            :page-count="questionsStore.trendingPagination.per_page"
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
useSeoMeta({
  title: 'الأسئلة الشائعة - تدرب على أكثر الأسئلة حلاً | A Plus',
  description: 'استكشف مجموعة من الأسئلة الأكثر حلاً وتفاعلاً في بنك الأسئلة A Plus. تدرب الآن وحسن مستواك الدراسي.'
})

const questionsStore = useQuestionsStore()

const { currentPage } = usePagination({
  onPageChange: page => questionsStore.fetchTrending({ page, per_page: 15 })
})

onMounted(() => {
  questionsStore.fetchTrending({ page: currentPage.value, per_page: 15 })
})
</script>
