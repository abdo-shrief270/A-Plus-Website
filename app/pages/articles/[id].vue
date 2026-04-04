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
              {{ questionsStore.currentArticle?.title || 'تصفح النص' }}
            </h1>
            <div class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              نص قرائي متقدم
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
            {{ questionsStore.articleQuestions.length }} أسئلة
          </UBadge>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto space-y-12">
        <!-- Article Passage -->
        <ArticleBox
          v-if="questionsStore.currentArticle"
          :article="questionsStore.currentArticle"
        />

        <div
          v-else-if="questionsStore.isLoading"
          class="h-96 rounded-[2.5rem] bg-white dark:bg-gray-900 animate-pulse"
        />

        <!-- Questions Section -->
        <div>
          <div class="flex items-center justify-between mb-8 px-4">
            <h3 class="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <div class="w-2 h-8 bg-primary-500 rounded-full" />
              التحليل والأسئلة
            </h3>
            <span class="text-xs font-black text-primary-400 tracking-widest uppercase">
              اجب بدقة بناءً على النص
            </span>
          </div>

          <div class="space-y-6">
            <QuestionCard
              v-for="question in questionsStore.articleQuestions"
              :key="question.id"
              :question="question"
            />

            <div
              v-if="!questionsStore.isLoading && questionsStore.articleQuestions.length === 0"
              class="text-center py-20 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800"
            >
              <UIcon
                name="i-heroicons-face-frown"
                class="w-12 h-12 text-gray-300 mb-4 mx-auto"
              />
              <p class="text-gray-400 font-bold italic">
                لا توجد أسئلة مرتبطة بهذا النص حالياً.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuestionsStore } from '@/stores/useQuestionsStore'
import ArticleBox from '@/components/question/ArticleBox.vue'
import QuestionCard from '~/components/question/QuestionCard.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const articleId = computed(() => route.params.id as string)

const questionsStore = useQuestionsStore()

onMounted(async () => {
  await Promise.all([
    questionsStore.fetchArticleById(articleId.value),
    questionsStore.fetchArticleQuestions(articleId.value)
  ])
})
</script>
