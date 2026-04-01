<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-gray-950">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
      <div class="container mx-auto px-4 h-20 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/exams"
            class="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
          >
            <UIcon
              name="i-heroicons-arrow-right"
              class="w-5 h-5"
            />
          </NuxtLink>
          <div>
            <h1 class="text-xl font-black text-gray-900 dark:text-white line-clamp-1">
              {{ examsStore.currentExam?.name || 'تفاصيل الاختبار' }}
            </h1>
            <div class="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <span>بنك الأسئلة</span>
              <UIcon
                name="i-heroicons-chevron-left"
                class="w-3 h-3"
              />
              <span class="text-primary-500 font-medium">{{ examsStore.currentExam?.name }}</span>
            </div>
          </div>
        </div>

        <div class="hidden sm:flex items-center gap-3">
          <UButton
            color="primary"
            variant="soft"
            icon="i-heroicons-share"
            label="مشاركة"
            size="sm"
            class="rounded-xl"
          />
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-8">
      <div
        v-if="examsStore.isLoading"
        class="flex flex-col items-center justify-center py-32"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-12 h-12 text-primary-500 animate-spin mb-4"
        />
        <span class="text-gray-500 animate-pulse">جاري تحميل الأقسام والمواد...</span>
      </div>

      <div
        v-else
        class="flex flex-col lg:flex-row gap-8"
      >
        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-80 flex-shrink-0">
          <div class="sticky top-28 space-y-6">
            <div class="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20">
              <div
                class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4"
              >
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-7 h-7 text-white"
                />
              </div>
              <h2 class="text-lg font-bold mb-2">
                {{ examsStore.currentExam?.name }}
              </h2>
              <p class="text-primary-100 text-sm leading-relaxed opacity-90">
                {{ examsStore.currentExam?.description || 'تصفح الأقسام والمواد المتاحة للبدء في التدريب والتحضير للاختبار.' }}
              </p>
            </div>

            <!-- Navigation Sections -->
            <div class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              <div class="p-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-list-bullet"
                    class="w-4 h-4 text-primary-500"
                  />
                  أقسام الاختبار
                </h3>
              </div>

              <div class="p-2">
                <div
                  v-for="section in examsStore.sections"
                  :key="section.id"
                  class="mb-1"
                >
                  <div
                    class="p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer group flex items-center justify-between"
                    @click="toggleSection(section.id)"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                        <UIcon
                          name="i-heroicons-folder"
                          class="w-4 h-4"
                        />
                      </div>
                      <span class="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary-600 transition-colors">
                        {{ section.name }}
                      </span>
                    </div>
                    <UIcon
                      name="i-heroicons-chevron-down"
                      class="w-4 h-4 text-gray-400 transition-transform duration-300"
                      :class="{ 'rotate-180': expandedSections.includes(section.id) }"
                    />
                  </div>

                  <!-- Categories list -->
                  <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <div
                      v-if="expandedSections.includes(section.id)"
                      class="mt-1 mr-4 space-y-1"
                    >
                      <NuxtLink
                        v-for="category in section.categories"
                        :key="category.id"
                        :to="`/categories/${category.id}/questions`"
                        class="flex items-center justify-between p-2.5 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group/cat"
                      >
                        <div class="flex items-center gap-2">
                          <div class="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/cat:bg-primary-500 transition-colors" />
                          <span>{{ category.name }}</span>
                        </div>
                        <UBadge
                          v-if="category.questions_count"
                          color="neutral"
                          variant="soft"
                          size="xs"
                          class="rounded-md"
                        >
                          {{ category.questions_count }}
                        </UBadge>
                      </NuxtLink>
                    </div>
                  </Transition>
                </div>

                <!-- Fallback if no sections -->
                <div
                  v-if="examsStore.sections.length === 0"
                  class="p-8 text-center"
                >
                  <p class="text-xs text-gray-400">
                    لا توجد أقسام متاحة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content (Subjects) -->
        <main class="flex-grow">
          <div class="mb-8">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
              المواد الدراسية
            </h2>
            <p class="text-gray-500 text-sm">
              اختر مادة للبدء في تصفح الأسئلة والاختبارات التدريبية المخصصة لها.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NuxtLink
              v-for="subject in examsStore.subjects"
              :key="subject.id"
              :to="`/subjects/${subject.id}/questions`"
              class="group"
            >
              <div class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center text-white shadow-lg shadow-secondary-500/20 group-hover:rotate-12 transition-transform">
                    <UIcon
                      name="i-heroicons-book-open"
                      class="w-7 h-7"
                    />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                      {{ subject.name }}
                    </h3>
                    <p class="text-xs text-secondary-500 font-medium">
                      {{ subject.questions_count || 0 }} سؤال متاح
                    </p>
                  </div>
                </div>
                <div class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-300 group-hover:bg-primary-500 group-hover:text-white transition-all">
                  <UIcon
                    name="i-heroicons-arrow-left"
                    class="w-5 h-5"
                  />
                </div>
              </div>
            </NuxtLink>

            <div
              v-if="examsStore.subjects.length === 0"
              class="col-span-full py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 border-dashed"
            >
              <UIcon
                name="i-heroicons-document-magnifying-glass"
                class="w-12 h-12 text-gray-200 mb-2"
              />
              <p class="text-gray-400">
                لا توجد مواد مباشرة لهذا الاختبار حالياً
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamsStore } from '@/stores/useExamsStore'

// Public page, no auth middleware
definePageMeta({ layout: 'default' })

const route = useRoute()
const examId = computed(() => route.params.id as string)

const examsStore = useExamsStore()
const expandedSections = ref<number[]>([])

const toggleSection = (id: number) => {
  const index = expandedSections.value.indexOf(id)
  if (index > -1) {
    expandedSections.value.splice(index, 1)
  } else {
    expandedSections.value.push(id)
  }
}

useSeoMeta({
  title: computed(() => `${examsStore.currentExam?.name || 'تفاصيل الاختبار'} | A Plus`),
  description: computed(() => `استعرض أقسام ومواد ${examsStore.currentExam?.name} في بنك الأسئلة A Plus.`)
})

onMounted(async () => {
  await Promise.all([
    examsStore.fetchExamById(examId.value),
    examsStore.fetchExamSubjects(examId.value),
    examsStore.fetchExamSections(examId.value)
  ])

  // Auto-expand first section if available
  if (examsStore.sections && examsStore.sections.length > 0) {
    expandedSections.value.push(examsStore.sections[0].id)
  }
})
</script>
