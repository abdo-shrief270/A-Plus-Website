<template>
  <div>
    <!-- Top -->
    <div class="flex items-center gap-3 mb-6">
      <UButton
        to="/dashboard/revision"
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-right"
        class="rtl:[&>span:first-child]:rotate-180"
        square
      />
      <div>
        <p class="text-xs text-gray-500">
          <NuxtLink
            to="/dashboard/revision"
            class="hover:text-primary-600"
          >
            المراجعة
          </NuxtLink>
          <span class="mx-1">›</span>
          <span>{{ article?.title || `قطعة #${id}` }}</span>
        </p>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
          {{ article?.title || 'قطعة المراجعة' }}
        </h1>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Not found -->
    <div
      v-else-if="!article"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-document-text"
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500">
        لم يتم العثور على هذه القطعة.
      </p>
    </div>

    <div
      v-else
      class="space-y-5"
    >
      <!-- Article body -->
      <article class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div class="flex items-center gap-2 mb-4 flex-wrap">
          <UBadge
            v-if="article.category?.name"
            color="primary"
            variant="soft"
          >
            {{ article.category.name }}
          </UBadge>
          <span class="text-xs text-gray-500">
            {{ questions.length }} سؤال مرتبط
          </span>
        </div>

        <div
          class="prose prose-base max-w-none text-gray-900 leading-relaxed"
          dir="rtl"
          v-html="article.content"
        />
      </article>

      <!-- Linked questions -->
      <section
        v-if="questions.length"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div class="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <UIcon
            name="i-heroicons-clipboard-document-list"
            class="w-5 h-5 text-primary-600"
          />
          <h2 class="font-bold text-gray-900">
            أسئلة على هذه القطعة
          </h2>
        </div>
        <div class="divide-y divide-gray-100">
          <NuxtLink
            v-for="q in questions"
            :key="q.id"
            :to="`/dashboard/question-bank/${q.id}`"
            class="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors group"
          >
            <div class="w-9 h-9 rounded-lg bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center shrink-0 transition-colors">
              <UIcon
                name="i-heroicons-question-mark-circle"
                class="w-4 h-4 text-primary-600"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-semibold text-gray-900 line-clamp-2 leading-relaxed"
                v-html="q.text"
              />
              <div class="flex items-center gap-2 mt-1">
                <UBadge
                  :color="difficultyColor(q.difficulty)"
                  variant="soft"
                  size="sm"
                >
                  {{ difficultyLabel(q.difficulty) }}
                </UBadge>
                <span
                  class="text-[10px] text-gray-400 font-mono"
                  dir="ltr"
                >
                  #{{ q.id }}
                </span>
              </div>
            </div>
            <UIcon
              name="i-heroicons-arrow-left"
              class="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors"
            />
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { questionsService } from '@/services/api/questions.service'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'قطعة المراجعة' })

const route = useRoute()
const id = computed(() => Number(route.params.id))

const loading = ref(true)
const article = ref<any | null>(null)
const questions = ref<any[]>([])

watch(id, () => {
  loadArticle()
})

async function loadArticle() {
  loading.value = true
  try {
    const res = await questionsService.getArticleDetails(id.value)
    const data = res.data?.data ?? res.data ?? {}
    article.value = data.article ?? null
    questions.value = data.questions ?? []
  } catch (err) {
    console.error('Failed to load article', err)
    article.value = null
    questions.value = []
  } finally {
    loading.value = false
  }
}

function difficultyLabel(d?: string) {
  if (d === 'easy') return 'سهل'
  if (d === 'medium') return 'متوسط'
  if (d === 'hard') return 'صعب'
  return d || 'غير محدد'
}

function difficultyColor(d?: string): 'success' | 'warning' | 'error' | 'neutral' {
  if (d === 'easy') return 'success'
  if (d === 'medium') return 'warning'
  if (d === 'hard') return 'error'
  return 'neutral'
}

onMounted(loadArticle)
</script>
