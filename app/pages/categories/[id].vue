<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-gray-950 pb-20">
    <header class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
      <div class="container mx-auto px-4 h-20 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <BButton
            variant="ghost"
            color="neutral"
            size="sm"
            class="rounded-xl"
            @click="router.back()"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-arrow-right"
                class="w-5 h-5"
              />
            </template>
          </BButton>
          <div>
            <h1 class="text-xl font-black text-gray-900 dark:text-white line-clamp-1">
              {{ questionsStore.currentCategory?.name || 'تصفح القسم' }}
            </h1>
            <div class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              بنك الأسئلة المتطور
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UBadge
            color="primary"
            variant="soft"
            size="xs"
            class="rounded-lg px-3 font-black"
          >
            {{ questionsStore.categoryQuestions.length }} / {{ questionsStore.categoryPagination.total }} سؤال
          </UBadge>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-10">
      <!-- Category Header Card -->
      <div class="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[3rem] p-8 md:p-12 text-white mb-12 shadow-2xl shadow-primary-500/20 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

        <div class="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div class="w-24 h-24 rounded-[2rem] bg-white/20 backdrop-blur-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
            <UIcon
              name="i-heroicons-puzzle-piece"
              class="w-12 h-12"
            />
          </div>
          <div class="text-center md:text-right">
            <h2 class="text-3xl md:text-4xl font-black mb-4 tracking-tighter">
              {{ questionsStore.currentCategory?.name }}
            </h2>
            <p class="text-primary-100 text-lg font-medium max-w-2xl leading-relaxed opacity-90">
              {{ questionsStore.currentCategory?.description || 'استكشف مجموعة واسعة من الأسئلة المصنفة بدقة لمساعدتك على التفوق في هذا القسم.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Articles Section -->
      <div
        v-if="questionsStore.categoryArticles.length > 0"
        class="mb-16"
      >
        <div class="flex items-center justify-between mb-8 px-4">
          <h3 class="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div class="w-2 h-8 bg-secondary-500 rounded-full" />
            نصوص القراءة ذات الصلة
          </h3>
          <span class="text-xs font-black text-secondary-500 uppercase tracking-widest">{{ questionsStore.categoryArticles.length }} نصوص</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="article in questionsStore.categoryArticles"
            :key="article.id"
            :to="`/articles/${article.id}`"
            class="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-secondary-500/5 hover:-translate-y-1"
          >
            <div class="w-12 h-12 rounded-xl bg-secondary-50 dark:bg-secondary-500/10 flex items-center justify-center text-secondary-500 group-hover:scale-110 transition-transform">
              <UIcon
                name="i-heroicons-document-text"
                class="w-6 h-6"
              />
            </div>
            <div>
              <h4 class="font-black text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-secondary-600 transition-colors">
                {{ article.title }}
              </h4>
              <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                {{ article.content }}
              </p>
            </div>
            <div class="mt-auto pt-4 flex items-center justify-between border-t border-gray-50 dark:border-gray-800">
              <span class="text-[10px] font-black text-secondary-400 uppercase tracking-widest">{{ article.questions_count }} أسئلة</span>
              <UIcon
                name="i-heroicons-arrow-left"
                class="w-4 h-4 text-secondary-500 transform group-hover:translate-x-[-4px] transition-all"
              />
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Questions Section -->
      <div>
        <div class="flex items-center justify-between mb-10 px-4">
          <h3 class="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div class="w-2 h-8 bg-primary-500 rounded-full" />
            الأسئلة التدريبية
          </h3>
          <div class="flex items-center gap-2">
            <BButton
              variant="outline"
              color="neutral"
              size="sm"
              class="rounded-xl"
            >
              الفئة: الكل
            </BButton>
          </div>
        </div>

        <BInfiniteScroll
          :loading="questionsStore.isLoading"
          :has-more="hasMore"
          @load-more="loadMore"
        >
          <div class="space-y-6">
            <QuestionCard
              v-for="question in questionsStore.categoryQuestions"
              :key="question.id"
              :question="question"
            />
          </div>
        </BInfiniteScroll>

        <div
          v-if="!questionsStore.isLoading && questionsStore.categoryQuestions.length === 0"
          class="text-center py-24 bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800"
        >
          <div class="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-10 h-10 text-gray-200"
            />
          </div>
          <h4 class="text-xl font-black text-gray-900 dark:text-white mb-2">
            لا توجد أسئلة حالياً
          </h4>
          <p class="text-gray-400 font-medium">
            سيتم تحديث هذا القسم بمجموعة جديدة من الأسئلة قريباً.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuestionsStore } from '@/stores/useQuestionsStore'
import BInfiniteScroll from '@/components/BInfiniteScroll.vue'
import QuestionCard from '~/components/question/QuestionCard.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const catId = computed(() => route.params.id as string)

const questionsStore = useQuestionsStore()

const hasMore = computed(() => {
  const p = questionsStore.categoryPagination
  return p.current_page < p.last_page
})

const loadMore = async () => {
  if (questionsStore.isLoading || !hasMore.value) return
  await questionsStore.fetchCategoryQuestions(catId.value, {
    page: questionsStore.categoryPagination.current_page + 1,
    per_page: 15
  }, true)
}

onMounted(async () => {
  await Promise.all([
    questionsStore.fetchCategoryQuestions(catId.value),
    questionsStore.fetchCategoryArticles(catId.value)
  ])
})
</script>
