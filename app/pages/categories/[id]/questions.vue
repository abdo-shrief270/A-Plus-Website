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
              {{ questionsStore.currentCategory?.name || 'أسئلة القسم' }}
            </h1>
            <p class="text-xs text-gray-500 font-medium line-clamp-1">
              {{ questionsStore.currentCategory?.description || 'تصفح الأسئلة المتاحة في هذا القسم' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="container mx-auto px-4 py-8">
      <div
        v-if="questionsStore.isLoading && questionsStore.categoryQuestions.length === 0"
        class="flex flex-col items-center justify-center py-24"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-12 h-12 text-primary-500 animate-spin mb-4"
        />
        <span class="text-gray-500 animate-pulse font-medium">جاري تحميل الأسئلة...</span>
      </div>

      <div
        v-else-if="questionsStore.categoryQuestions.length === 0"
        class="text-center py-32 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm max-w-4xl mx-auto"
      >
        <div class="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon
            name="i-heroicons-folder-open"
            class="w-10 h-10 text-gray-300"
          />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          لا توجد أسئلة في هذا القسم بعد
        </h3>
        <p class="text-gray-500 max-w-sm mx-auto">
          نحن نعمل على إضافة المزيد من الأسئلة لهذا القسم قريباً.
        </p>
      </div>

      <div
        v-else
        class="max-w-4xl mx-auto"
      >
        <!-- Stats Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500">
              <UIcon
                name="i-heroicons-list-bullet"
                class="w-6 h-6"
              />
            </div>
            <div>
              <span class="block text-sm text-gray-500 font-medium leading-none mb-1">إجمالي الأسئلة</span>
              <span class="block text-xl font-black text-gray-900 dark:text-white leading-none">
                {{ questionsStore.categoryPagination.total }} سؤال
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-500">
            <span>عرض الصفحة {{ questionsStore.categoryPagination.current_page }} من {{ questionsStore.categoryPagination.last_page }}</span>
          </div>
        </div>

        <div class="relative min-h-[400px]">
          <div
            v-if="questionsStore.isLoading"
            class="absolute inset-0 z-10 bg-white/50 dark:bg-gray-950/50 backdrop-blur-[1px] flex items-center justify-center rounded-3xl"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-10 h-10 text-primary-500 animate-spin"
            />
          </div>

          <div class="space-y-6">
            <QuestionCard
              v-for="question in questionsStore.categoryQuestions"
              :key="question.id"
              :question="question"
            />
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="questionsStore.categoryPagination.last_page > 1"
          class="mt-12 flex justify-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <UPagination
            v-model="currentPage"
            :total="Number(questionsStore.categoryPagination.total)"
            :items-per-page="Number(questionsStore.categoryPagination.per_page) || 15"
            :max="5"
            show-first
            show-last
            class="justify-center"
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
const router = useRouter()
const questionsStore = useQuestionsStore()

// Local state for the current page, initialized from the URL or default to 1
const currentPage = ref(Number(route.query.page) || 1)

// Method to fetch questions for a specific page
const loadPage = async (page: number) => {
  await questionsStore.fetchCategoryQuestions(route.params.id as string, {
    paginate: true,
    page: page,
    per_page: 15
  })
}

// Watch for internal page changes (e.g. user clicks pagination)
watch(currentPage, (newPage, oldPage) => {
  if (newPage === oldPage) return

  // Update the URL to reflect the new page
  router.push({
    query: { ...route.query, page: newPage.toString() }
  })

  // Trigger the API call
  loadPage(newPage)

  // Scroll to top for better UX
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Sync local page state when URL changes (e.g. browser back button)
watch(() => route.query.page, (newVal) => {
  const pageFromUrl = Number(newVal) || 1
  if (pageFromUrl !== currentPage.value) {
    currentPage.value = pageFromUrl
  }
})

// Final sync from store to ensure UI matches server state (guarded)
watch(() => questionsStore.categoryPagination.current_page, (newPage) => {
  const storePage = Number(newPage)
  if (storePage && storePage !== currentPage.value && !questionsStore.isLoading) {
    currentPage.value = storePage
  }
})

useSeoMeta({
  title: computed(() => `${questionsStore.currentCategory?.name || 'أسئلة القسم'} | A Plus`),
  description: computed(() => questionsStore.currentCategory?.description || 'تصفح الأسئلة المتاحة في هذا القسم')
})

onMounted(() => {
  questionsStore.fetchCategoryQuestions(route.params.id as string, {
    paginate: true,
    page: currentPage.value,
    per_page: 15
  })
})
</script>
