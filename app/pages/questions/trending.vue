<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6 flex items-center gap-3">
        <NuxtLink to="/">
          <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-right" />
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          الأسئلة الرائجة
        </h1>
      </div>

      <!-- Question Cards -->
      <div v-if="loading" class="flex justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-primary-500 animate-spin" />
      </div>

      <div v-else>
        <div class="space-y-4 mb-6">
          <NuxtLink
            v-for="q in questions"
            :key="q.id"
            :to="`/questions/${q.id}`"
          >
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer">
              <p class="text-gray-900 dark:text-white font-medium mb-3">
                {{ q.text || q.content }}
              </p>
              <div v-if="q.image_path" class="mb-3">
                <img :src="q.image_path" alt="صورة السؤال" class="rounded-lg max-h-32 object-contain">
              </div>
              <div class="flex items-center gap-2">
                <UBadge v-if="q.subject_name" color="primary" variant="soft" size="xs">
                  {{ q.subject_name }}
                </UBadge>
                <UBadge v-if="q.difficulty" color="warning" variant="soft" size="xs">
                  {{ q.difficulty }}
                </UBadge>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center gap-4">
          <UButton
            :disabled="pagination.current_page <= 1"
            color="neutral"
            variant="outline"
            icon="i-heroicons-chevron-right"
            @click="changePage(pagination.current_page - 1)"
          />
          <span class="text-sm text-gray-600 dark:text-gray-400">
            صفحة {{ pagination.current_page }} من {{ pagination.last_page }}
          </span>
          <UButton
            :disabled="pagination.current_page >= pagination.last_page"
            color="neutral"
            variant="outline"
            icon="i-heroicons-chevron-left"
            @click="changePage(pagination.current_page + 1)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { questionService } from '@/services/api/question.service'

definePageMeta({ middleware: ['auth'] })
useSeoMeta({ title: 'أسئلة رائجة | A Plus' })

const loading = ref(true)
const questions = ref<any[]>([])
const pagination = ref({ current_page: 1, last_page: 1, per_page: 15, total: 0 })

async function fetchPage(page = 1) {
  loading.value = true
  try {
    const res = await questionService.trending({ page, per_page: 15 })
    const d = res.data?.data
    questions.value = d?.questions || []
    if (d?.pagination) pagination.value = d.pagination
  } catch {
    //
  } finally {
    loading.value = false
  }
}

function changePage(page: number) {
  fetchPage(page)
  window.scrollTo(0, 0)
}

onMounted(() => fetchPage())
</script>
