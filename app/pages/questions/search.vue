<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-gray-950">
    <!-- Search Header -->
    <div class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
      <div class="container mx-auto px-4 py-6">
        <div class="max-w-3xl mx-auto">
          <div class="flex items-center gap-4 mb-6">
            <NuxtLink
              to="/exams"
              class="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
            >
              <UIcon
                name="i-heroicons-arrow-right"
                class="w-5 h-5"
              />
            </NuxtLink>
            <h1 class="text-2xl font-black text-gray-900 dark:text-white">
              البحث المتقدم
            </h1>
          </div>

          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-300" />
            <div class="relative flex gap-2">
              <UInput
                v-model="searchQuery"
                placeholder="ابحث عن سؤال... (مثلاً: قوانين الحركة، التفاضل)"
                size="xl"
                icon="i-heroicons-magnifying-glass"
                class="flex-1"
                :ui="{
                  base: 'rounded-2xl border-none ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900 text-lg py-4',
                  icon: { trailing: { pointer: '' } }
                }"
                @keyup.enter="handleSearch"
              />
              <UButton
                size="xl"
                color="primary"
                class="rounded-2xl px-8 font-bold"
                :loading="questionsStore.isLoading"
                @click="handleSearch"
              >
                بحث
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="container mx-auto px-4 py-12">
      <div
        v-if="questionsStore.isLoading && questionsStore.searchResults.length === 0"
        class="flex flex-col items-center justify-center py-24"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-12 h-12 text-primary-500 animate-spin mb-4"
        />
        <span class="text-gray-500 animate-pulse font-medium">نبحث في آلاف الأسئلة...</span>
      </div>

      <div
        v-else-if="searched && questionsStore.searchResults.length === 0"
        class="text-center py-32 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm max-w-3xl mx-auto"
      >
        <div class="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon
            name="i-heroicons-magnifying-glass-slash"
            class="w-10 h-10 text-gray-300"
          />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          لا توجد نتائج لـ "{{ lastQuery }}"
        </h3>
        <p class="text-gray-500 max-w-sm mx-auto">
          جرب كلمات بحث مختلفة أو تأكد من صحة الإملاء، يمكنك أيضاً تصفح الأقسام مباشرة.
        </p>
      </div>

      <div
        v-else-if="!searched"
        class="text-center py-32"
      >
        <div class="max-w-md mx-auto">
          <UIcon
            name="i-heroicons-sparkles"
            class="w-16 h-16 text-primary-200 dark:text-primary-900 mx-auto mb-6"
          />
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ابدأ رحلة البحث عن التميز
          </h2>
          <p class="text-gray-500 mb-8">
            يمكنك البحث بنص السؤال أو الكلمات المفتاحية المتعلقة بالمادة الدراسية.
          </p>
          <div class="flex flex-wrap justify-center gap-2">
            <span class="text-xs text-gray-400 w-full mb-2 uppercase tracking-widest font-black">اقتراحات شائعة</span>
            <UButton
              v-for="suggest in suggestions"
              :key="suggest"
              variant="soft"
              color="neutral"
              size="xs"
              class="rounded-full px-4"
              @click="searchQuery = suggest; handleSearch()"
            >
              {{ suggest }}
            </UButton>
          </div>
        </div>
      </div>

      <div
        v-else
        class="max-w-4xl mx-auto"
      >
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            نتائج البحث ({{ questionsStore.searchPagination?.total || 0 }})
          </h3>
          <div class="text-sm text-gray-500">
            البحث عن: <span class="text-primary-500 font-bold">"{{ lastQuery }}"</span>
          </div>
        </div>

        <div class="space-y-6">
          <QuestionCard
            v-for="question in questionsStore.searchResults"
            :key="question.id"
            :question="question"
          />
        </div>

        <!-- Pagination -->
        <div
          v-if="questionsStore.searchPagination && questionsStore.searchPagination.last_page > 1"
          class="mt-12 flex justify-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <UPagination
            v-model="currentPage"
            :total="questionsStore.searchPagination.total"
            :page-count="questionsStore.searchPagination.per_page"
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
  title: 'البحث في بنك الأسئلة | A Plus',
  description: 'ابحث عن أي سؤال في بنك الأسئلة A Plus. حل آلاف التدريبات في مختلف المواد الدراسية.'
})

const questionsStore = useQuestionsStore()
const searchQuery = ref('')
const lastQuery = ref('')
const searched = ref(false)
const currentPage = ref(1)

const suggestions = ['الرياضيات', 'الكيمياء', 'الأحياء', 'الفيزياء', 'البلاغة']

async function handleSearch() {
  const query = searchQuery.value.trim()
  if (!query || query.length < 2) {
    useToast().add({
      title: 'خطأ في البحث',
      description: 'يرجى إدخال كلمة بحث من حرفين على الأقل',
      color: 'error'
    })
    return
  }

  searched.value = true
  lastQuery.value = query
  currentPage.value = 1
  await questionsStore.searchQuestions({ q: query, page: 1, per_page: 15 })
}

watch(currentPage, async (val) => {
  if (lastQuery.value) {
    await questionsStore.searchQuestions({ q: lastQuery.value, page: val, per_page: 15 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>
