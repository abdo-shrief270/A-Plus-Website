<template>
  <div>
    <!-- Top bar -->
    <div class="flex items-center gap-3 mb-6">
      <UButton
        to="/dashboard/question-bank"
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-right"
        class="rtl:[&>span:first-child]:rotate-180"
        square
      />
      <div class="min-w-0">
        <p class="text-xs text-gray-500">
          <NuxtLink
            to="/dashboard/question-bank"
            class="hover:text-primary-600"
          >
            بنك الأسئلة
          </NuxtLink>
          <span class="mx-1">›</span>
          <span class="truncate">
            {{ category?.name || `تصنيف #${id}` }}
          </span>
        </p>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 truncate">
          {{ category?.name || 'تفاصيل التصنيف' }}
        </h1>
        <p
          v-if="category?.description"
          class="text-xs text-gray-500 mt-0.5 line-clamp-2"
        >
          {{ category.description }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loadingArticles && loadingQuestions && !articles.length && !questions.length"
      class="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <div
      v-else
      class="space-y-5"
    >
      <!-- Articles section -->
      <section
        v-if="articles.length || loadingArticles"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      >
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-l from-secondary-50/40 to-white">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-secondary-50 border border-secondary-100 flex items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-document-text"
                class="w-5 h-5 text-secondary-600"
              />
            </div>
            <div class="min-w-0">
              <h2 class="text-base font-bold text-gray-900">
                القطع
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ formatNumber(articles.length) }} قطعة • اضغط لمراجعة المحتوى وحلّ أسئلته
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="loadingArticles && !articles.length"
          class="py-10 text-center"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-6 h-6 text-primary-500 animate-spin"
          />
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4"
        >
          <NuxtLink
            v-for="art in articles"
            :key="art.id"
            :to="`/dashboard/revision/article/${art.id}`"
            class="block bg-gradient-to-l from-gray-50 to-white border border-gray-100 hover:border-secondary-300 hover:shadow-sm rounded-xl p-4 transition-all group"
          >
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-white border border-secondary-100 flex items-center justify-center shrink-0 group-hover:bg-secondary-50 transition-colors">
                <UIcon
                  name="i-heroicons-document-text"
                  class="w-5 h-5 text-secondary-600"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 line-clamp-2 leading-relaxed">
                  {{ art.title }}
                </p>
                <p class="text-[11px] text-gray-500 mt-1">
                  {{ formatNumber(art.questions_count || 0) }} سؤال مرتبط
                </p>
              </div>
              <UIcon
                name="i-heroicons-arrow-left"
                class="w-4 h-4 text-gray-300 group-hover:text-secondary-600 transition-colors mt-1"
              />
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Questions section -->
      <section class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-l from-primary-50/40 to-white flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-clipboard-document-list"
                class="w-5 h-5 text-primary-600"
              />
            </div>
            <div class="min-w-0">
              <h2 class="text-base font-bold text-gray-900">
                الأسئلة
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ pagination ? `${formatNumber(pagination.total)} سؤال` : 'تصفّح وحلّ أسئلة هذا التصنيف' }}
              </p>
            </div>
          </div>
          <UButton
            v-if="questions.length"
            color="error"
            variant="soft"
            size="sm"
            icon="i-heroicons-arrow-path"
            :loading="resetting"
            @click="resetOpen = true"
          >
            إعادة تعيين الإجابات
          </UButton>
        </div>

        <div
          v-if="loadingQuestions && !questions.length"
          class="py-10 text-center"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-6 h-6 text-primary-500 animate-spin"
          />
        </div>

        <div
          v-else-if="!questions.length"
          class="py-12 text-center"
        >
          <UIcon
            name="i-heroicons-clipboard-document-list"
            class="w-10 h-10 text-gray-300 mx-auto mb-2"
          />
          <p class="text-sm text-gray-500">
            لا توجد أسئلة في هذا التصنيف بعد.
          </p>
        </div>

        <div
          v-else
          class="divide-y divide-gray-100"
        >
          <NuxtLink
            v-for="(q, idx) in questions"
            :key="q.id"
            :to="`/dashboard/question-bank/${q.id}`"
            class="flex items-start gap-3 px-5 py-4 hover:bg-gray-50/60 transition-colors group"
          >
            <div class="w-9 h-9 rounded-lg bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center shrink-0 transition-colors text-primary-700 font-bold text-sm">
              {{ formatNumber(((pagination?.current_page || 1) - 1) * (pagination?.per_page || 12) + idx + 1) }}
            </div>
            <div class="flex-1 min-w-0">
              <div
                class="prose prose-sm max-w-none text-gray-900 line-clamp-3 leading-relaxed [&>p]:my-0 [&_p]:my-0 [&_pre]:my-1 [&_code]:text-[12px] [&_img]:inline-block [&_img]:align-middle [&_img]:max-h-12 [&_img]:max-w-full [&_img]:mx-1 [&_a]:text-primary-700"
                v-html="renderMarkdown(q.text)"
              />
              <span
                class="text-[11px] text-gray-400 font-mono mt-1 inline-block"
                dir="ltr"
              >
                #{{ q.id }}
              </span>
            </div>
            <UIcon
              name="i-heroicons-arrow-left"
              class="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors mt-1"
            />
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination && pagination.last_page > 1"
          class="px-4 py-3 border-t border-gray-100 flex items-center justify-center gap-2"
        >
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-chevron-right"
            :disabled="currentPage <= 1 || loadingQuestions"
            @click="goToPage(currentPage - 1)"
          />
          <span class="text-sm text-gray-600 px-3">
            صفحة {{ currentPage }} من {{ pagination.last_page }}
          </span>
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-chevron-left"
            :disabled="currentPage >= pagination.last_page || loadingQuestions"
            @click="goToPage(currentPage + 1)"
          />
        </div>
      </section>
    </div>

    <!-- Reset saved answers confirm -->
    <UModal v-model:open="resetOpen">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            إعادة تعيين الإجابات
          </h3>
          <p class="text-sm text-gray-600 mb-6">
            سيتم مسح إجاباتك المحفوظة في هذا التصنيف فقط (لن يتم خصم النقاط المكتسبة). هل تريد المتابعة؟
          </p>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="soft"
              @click="resetOpen = false"
            >
              إلغاء
            </UButton>
            <UButton
              color="error"
              :loading="resetting"
              @click="confirmReset"
            >
              إعادة التعيين
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { questionsService } from '@/services/api/questions.service'
import { renderMarkdown } from '@/utils/markdown'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'تصنيف' })

interface CategoryInfo {
  id: number
  name: string
  description?: string | null
}
interface ArticleItem {
  id: number
  title: string
  questions_count?: number
}
interface QuestionItem {
  id: number
  text: string
}
interface Pagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

const route = useRoute()
const id = computed(() => Number(route.params.id))

const category = ref<CategoryInfo | null>(null)
const articles = ref<ArticleItem[]>([])
const questions = ref<QuestionItem[]>([])
const pagination = ref<Pagination | null>(null)

const loadingArticles = ref(false)
const loadingQuestions = ref(false)
const currentPage = ref(1)

const resetOpen = ref(false)
const resetting = ref(false)

watch(id, () => {
  currentPage.value = 1
  load()
})

async function confirmReset() {
  resetting.value = true
  try {
    await questionsService.resetCategoryAnswers(id.value)
    resetOpen.value = false
    showToast('تم إعادة تعيين إجابات هذا التصنيف', undefined, 'success')
    await loadQuestions(currentPage.value)
  } catch {
    showToast('تعذّر إعادة التعيين', undefined, 'error')
  } finally {
    resetting.value = false
  }
}

async function loadArticles() {
  loadingArticles.value = true
  try {
    const res = await questionsService.getCategoryArticles(id.value)
    const data = res.data?.data ?? res.data ?? {}
    if (data.category) category.value = data.category
    articles.value = data.articles ?? []
  } catch (err) {
    console.error('Failed to load articles', err)
    articles.value = []
  } finally {
    loadingArticles.value = false
  }
}

async function loadQuestions(page = 1) {
  loadingQuestions.value = true
  try {
    const res = await questionsService.getCategoryQuestions(id.value, { page, per_page: 15 })
    const data = res.data?.data ?? res.data ?? {}
    if (data.category && !category.value) category.value = data.category
    questions.value = data.questions ?? []
    pagination.value = data.pagination ?? null
    currentPage.value = data.pagination?.current_page ?? page
  } catch (err) {
    console.error('Failed to load questions', err)
    questions.value = []
    pagination.value = null
  } finally {
    loadingQuestions.value = false
  }
}

function load() {
  loadArticles()
  loadQuestions(currentPage.value)
}

function goToPage(p: number) {
  loadQuestions(p)
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('ar-EG').format(n)
}

onMounted(load)
</script>
