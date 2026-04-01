<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-heroicons-arrow-right"
          color="neutral"
          variant="ghost"
          class="rtl:-scale-x-100"
          @click="$router.back()"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ subject?.name_ar || subject?.name || "تفاصيل المادة" }}
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            استعرض بنك الأسئلة الخاص بهذه المادة
          </p>
        </div>
      </div>
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
      v-else
      class="space-y-6"
    >
      <!-- Search & Filters (Mockup for now) -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="ابحث في الأسئلة..."
          class="w-full sm:max-w-md"
          size="lg"
        />
        <USelectMenu
          v-model="selectedCategory"
          :options="[]"
          placeholder="تصفية حسب الدرس"
          class="w-full sm:w-48"
          size="lg"
        />
      </div>

      <!-- Questions List -->
      <div
        v-if="questions.length === 0"
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center"
      >
        <UIcon
          name="i-heroicons-document-magnifying-glass"
          class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
        />
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
          لا توجد أسئلة
        </h3>
        <p class="text-gray-500">
          لم يتم إضافة أسئلة لهذه المادة بعد، أو لا توجد نتائج للبحث.
        </p>
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <NuxtLink
          v-for="question in questions"
          :key="question.id"
          :to="`/dashboard/questions/${question.id}`"
          class="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-md group"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-3">
                <UBadge
                  :color="getDifficultyColor(question.difficulty)"
                  variant="subtle"
                  size="sm"
                >
                  {{ question.difficulty || "متوسط" }}
                </UBadge>
                <UBadge
                  v-if="question.type"
                  color="neutral"
                  variant="soft"
                  size="sm"
                >
                  {{ question.type }}
                </UBadge>
              </div>

              <h3
                class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2"
              >
                {{
                  question.question_text
                    || question.content
                    || "نص السؤال غير متوفر"
                }}
              </h3>

              <div class="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <UIcon
                    name="i-heroicons-check-circle"
                    class="w-4 h-4"
                  />
                  {{ question.answers_count || 0 }} إجابات
                </span>
                <span
                  v-if="question.category"
                  class="flex items-center gap-1"
                >
                  <UIcon
                    name="i-heroicons-folder"
                    class="w-4 h-4"
                  />
                  {{ question.category.name_ar || question.category.name }}
                </span>
              </div>
            </div>

            <UButton
              color="primary"
              variant="soft"
              icon="i-heroicons-chevron-left"
              class="rtl:rotate-180 shrink-0 mt-2"
            >
              التفاصيل
            </UButton>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination Mockup -->
      <div
        v-if="questions.length > 0"
        class="flex justify-center mt-8"
      >
        <UPagination
          v-model="page"
          :page-count="15"
          :total="meta?.total || questions.length"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { questionsService } from '@/services/api/questions.service'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const route = useRoute()
const subjectId = route.params.id as string

const loading = ref(true)
const subject = ref<any>(null)
const questions = ref<any[]>([])
const meta = ref<any>(null)

const searchQuery = ref('')
const selectedCategory = ref(null)
const page = ref(1)

onMounted(async () => {
  await fetchQuestions()
})

watch(page, () => {
  fetchQuestions()
})

async function fetchQuestions() {
  loading.value = true
  try {
    const res = await questionsService.getSubjectQuestions(subjectId, {
      page: page.value
      // Add more filters as needed by the API
    })

    // API logic to parse standard paginated response or flat array
    const data = res.data?.data || res.data
    questions.value = Array.isArray(data)
      ? data
      : data?.questions || data?.data || []
    meta.value = res.data?.meta || data?.meta || null
    subject.value = data?.subject || { name_ar: 'المادة ' + subjectId } // Fallback if API doesn't return subject details alongside questions

    useSeoMeta({
      title: `${subject.value?.name_ar || 'تفاصيل المادة'} | A Plus`
    })
  } catch (error) {
    console.error('Failed to load questions', error)
  } finally {
    loading.value = false
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'emerald'
    case 'hard':
      return 'red'
    case 'medium':
    default:
      return 'orange'
  }
}
</script>
