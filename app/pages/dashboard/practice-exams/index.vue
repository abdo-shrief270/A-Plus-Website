<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          الاختبارات التجريبية
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          قائمة بالنماذج والاختبارات التجريبية المتاحة لتقييم مستواك
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="ابحث عن اختبار..."
        class="w-full sm:max-w-md"
        size="lg"
      />
    </div>

    <div
      v-if="loading"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary-500 animate-spin"
      />
    </div>

    <div
      v-else-if="practiceExams.length === 0"
      class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center"
    >
      <UIcon
        name="i-heroicons-document-text"
        class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        لا توجد اختبارات
      </h3>
      <p class="text-gray-500">
        لم يتم إضافة اختبارات تجريبية حتى الآن، أو لا توجد نتائج للبحث.
      </p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <NuxtLink
        v-for="exam in practiceExams"
        :key="exam.id"
        :to="`/dashboard/practice-exams/${exam.id}`"
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-lg group"
      >
        <div class="flex items-start justify-between mb-4">
          <div
            class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform"
          >
            <UIcon
              name="i-heroicons-document-text"
              class="w-6 h-6"
            />
          </div>
          <UBadge
            v-if="exam.duration"
            color="neutral"
            variant="soft"
            size="sm"
          >
            <UIcon
              name="i-heroicons-clock"
              class="w-3 h-3 mr-1"
            />
            {{ exam.duration }} دقيقة
          </UBadge>
        </div>

        <h3
          class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2 line-clamp-2"
        >
          {{ exam.title || exam.name || "اختبار تجريبي" }}
        </h3>

        <p class="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {{ exam.description || "قيّم مستواك من خلال هذا الاختبار الشامل." }}
        </p>

        <div
          class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-center gap-4 text-xs text-gray-500">
            <span
              v-if="exam.questions_count"
              class="flex items-center gap-1"
            >
              <UIcon
                name="i-heroicons-clipboard-document-list"
                class="w-4 h-4"
              />
              {{ exam.questions_count }} سؤال
            </span>
            <span
              v-if="exam.passing_score"
              class="flex items-center gap-1"
            >
              <UIcon
                name="i-heroicons-check-badge"
                class="w-4 h-4"
              />
              النجاح: {{ exam.passing_score }}%
            </span>
          </div>

          <UIcon
            name="i-heroicons-arrow-left"
            class="w-5 h-5 text-gray-400 group-hover:text-primary-500 rtl:-scale-x-100 transition-colors"
          />
        </div>
      </NuxtLink>
    </div>

    <!-- Pagination Mockup -->
    <div
      v-if="practiceExams.length > 0"
      class="flex justify-center mt-8"
    >
      <UPagination
        v-model="page"
        :page-count="15"
        :total="meta?.total || practiceExams.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { questionsService } from '@/services/api/questions.service'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })
useSeoMeta({ title: 'الاختبارات التجريبية | A Plus' })

const loading = ref(true)
const practiceExams = ref<any[]>([])
const meta = ref<any>(null)

const searchQuery = ref('')
const page = ref(1)

onMounted(async () => {
  await fetchExams()
})

watch(page, () => {
  fetchExams()
})

async function fetchExams() {
  loading.value = true
  try {
    const res = await questionsService.getPracticeExams({
      page: page.value,
      search: searchQuery.value || undefined
    })

    const data = res.data?.data || res.data
    practiceExams.value = Array.isArray(data)
      ? data
      : data?.practice_exams || data?.exams || []
    meta.value = res.data?.meta || data?.meta || null
  } catch (error) {
    console.error('Failed to load practice exams', error)
  } finally {
    loading.value = false
  }
}
</script>
