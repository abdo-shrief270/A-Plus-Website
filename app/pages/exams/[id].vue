<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Back -->
      <div class="mb-6 flex items-center gap-3">
        <NuxtLink to="/exams">
          <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-right" />
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ examsStore.currentExam?.name || 'تفاصيل الاختبار' }}
        </h1>
      </div>

      <div v-if="examsStore.isLoading" class="flex justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-primary-500 animate-spin" />
      </div>

      <div v-else>
        <!-- Tabs -->
        <UTabs v-model="activeTab" :items="tabs" class="mb-6" />

        <!-- Subjects Tab -->
        <div v-if="activeTab === 0">
          <div v-if="examsStore.isLoading" class="flex justify-center py-10">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary-500 animate-spin" />
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuxtLink
              v-for="subject in examsStore.subjects"
              :key="subject.id"
              :to="`/subjects/${subject.id}/questions`"
            >
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <UIcon name="i-heroicons-book-open" class="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                      {{ subject.name }}
                    </h3>
                    <p class="text-xs text-gray-500">
                      {{ subject.questions_count ?? '' }} سؤال
                    </p>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Sections Tab -->
        <div v-if="activeTab === 1">
          <div v-if="examsStore.isLoading" class="flex justify-center py-10">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary-500 animate-spin" />
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuxtLink
              v-for="section in examsStore.sections"
              :key="section.id"
              :to="`/categories/${section.id}/questions`"
            >
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
                    <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5 text-warning-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                      {{ section.name }}
                    </h3>
                    <p class="text-xs text-gray-500">
                      {{ section.questions_count ?? '' }} سؤال
                    </p>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamsStore } from '@/stores/useExamsStore'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const examId = computed(() => route.params.id as string)

const examsStore = useExamsStore()
const activeTab = ref(0)

const tabs = [
  { label: 'المواد', icon: 'i-heroicons-book-open' },
  { label: 'الأقسام', icon: 'i-heroicons-squares-2x2' }
]

useSeoMeta({
  title: computed(() => `${examsStore.currentExam?.name || 'اختبار'} | A Plus`)
})

onMounted(async () => {
  await Promise.all([
    examsStore.fetchExamById(examId.value),
    examsStore.fetchExamSubjects(examId.value),
    examsStore.fetchExamSections(examId.value)
  ])
})
</script>
