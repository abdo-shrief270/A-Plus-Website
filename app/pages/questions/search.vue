<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          البحث في الأسئلة
        </h1>
        <div class="flex gap-3">
          <UInput
            v-model="searchQuery"
            placeholder="أدخل كلمة البحث..."
            size="lg"
            icon="i-heroicons-magnifying-glass"
            class="flex-1"
            @keyup.enter="doSearch"
          />
          <UButton size="lg" :loading="loading" @click="doSearch">
            بحث
          </UButton>
        </div>
      </div>

      <div v-if="searched && !loading && questions.length === 0" class="text-center py-20 text-gray-400">
        <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 mx-auto mb-3" />
        <p>لا توجد نتائج لـ "{{ lastQuery }}"</p>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-primary-500 animate-spin" />
      </div>

      <div v-if="!loading && questions.length > 0">
        <p class="text-sm text-gray-500 mb-4">
          {{ pagination.total }} نتيجة لـ "{{ lastQuery }}"
        </p>
        <div class="space-y-4 mb-6">
          <NuxtLink
            v-for="q in questions"
            :key="q.id"
            :to="`/questions/${q.id}`"
          >
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer">
              <p class="text-gray-900 dark:text-white font-medium">
                {{ q.text || q.content }}
              </p>
            </div>
          </NuxtLink>
        </div>
        <div class="flex items-center justify-center gap-4">
          <UButton :disabled="pagination.current_page <= 1" color="neutral" variant="outline" icon="i-heroicons-chevron-right" @click="changePage(pagination.current_page - 1)" />
          <span class="text-sm text-gray-600 dark:text-gray-400">صفحة {{ pagination.current_page }} من {{ pagination.last_page }}</span>
          <UButton :disabled="pagination.current_page >= pagination.last_page" color="neutral" variant="outline" icon="i-heroicons-chevron-left" @click="changePage(pagination.current_page + 1)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { questionService } from '@/services/api/question.service'

definePageMeta({ middleware: ['auth'] })
useSeoMeta({ title: 'بحث الأسئلة | A Plus' })

const searchQuery = ref('')
const lastQuery = ref('')
const loading = ref(false)
const searched = ref(false)
const questions = ref<any[]>([])
const pagination = ref({ current_page: 1, last_page: 1, total: 0 })

async function doSearch(page = 1) {
  if (!searchQuery.value.trim()) return
  loading.value = true
  lastQuery.value = searchQuery.value
  searched.value = true
  try {
    const res = await questionService.search(searchQuery.value, { page })
    questions.value = res.data?.data?.questions || []
    if (res.data?.data?.pagination) pagination.value = res.data.data.pagination
  } catch {
    //
  } finally {
    loading.value = false
  }
}

function changePage(page: number) { doSearch(page); window.scrollTo(0, 0) }
</script>
