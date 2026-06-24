<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <p class="text-xs text-gray-500 mb-1">
          الاختبار الحالي
        </p>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ examName || 'بنك الأسئلة' }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          تصفّح الأقسام والتصنيفات التابعة لاختبارك واختر ما تود مراجعته أو حلّه
        </p>
      </div>
      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-path"
        :loading="loading"
        @click="loadSections"
      >
        تحديث
      </UButton>
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

    <!-- No exam assigned -->
    <div
      v-else-if="!examId"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-academic-cap"
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <h2 class="text-base font-bold text-gray-900 mb-1">
        لم يتم تحديد اختبار لحسابك
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        اختَر اختبارك من الملف الشخصي لنفتح لك بنك الأسئلة المناسب.
      </p>
      <UButton
        to="/dashboard/profile"
        color="primary"
        variant="soft"
        icon="i-heroicons-cog-6-tooth"
      >
        تحديث بيانات الاختبار
      </UButton>
    </div>

    <!-- Error -->
    <ErrorState
      v-else-if="loadError"
      title="تعذّر تحميل بنك الأسئلة"
      :retrying="loading"
      @retry="loadSections"
    />

    <!-- No sections -->
    <div
      v-else-if="!sections.length"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-folder-open"
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500">
        لا توجد أقسام متاحة لهذا الاختبار حالياً.
      </p>
    </div>

    <!-- Sections + categories -->
    <div
      v-else
      class="space-y-5"
    >
      <section
        v-for="section in sections"
        :key="section.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      >
        <!-- Section header -->
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-l from-primary-50/40 to-white flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-rectangle-stack"
                class="w-5 h-5 text-primary-600"
              />
            </div>
            <div class="min-w-0">
              <h2 class="text-base font-bold text-gray-900 truncate">
                {{ section.name }}
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ (section.categories || []).length }} تصنيف •
                {{ formatNumber(sectionTotalQuestions(section)) }} سؤال
              </p>
            </div>
          </div>
        </div>

        <!-- Category cards -->
        <div
          v-if="(section.categories || []).length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4"
        >
          <button
            v-for="cat in section.categories"
            :key="cat.id"
            type="button"
            class="text-right bg-gradient-to-l from-gray-50 to-white border border-gray-100 hover:border-primary-300 hover:shadow-sm rounded-xl p-4 transition-all group"
            @click="onCategoryClick(cat, section)"
          >
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-white border border-primary-100 flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors">
                <UIcon
                  name="i-heroicons-folder"
                  class="w-5 h-5 text-primary-600"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 truncate">
                  {{ cat.name }}
                </p>
                <p
                  v-if="cat.description"
                  class="text-[11px] text-gray-500 mt-0.5 line-clamp-2"
                >
                  {{ cat.description }}
                </p>
                <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold">
                    <UIcon
                      name="i-heroicons-question-mark-circle"
                      class="w-3 h-3"
                    />
                    {{ formatNumber(cat.questions_count || 0) }} سؤال
                  </span>
                  <span
                    v-if="(cat.articles_count || 0) > 0"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-50 text-secondary-700 text-[10px] font-bold"
                  >
                    <UIcon
                      name="i-heroicons-document-text"
                      class="w-3 h-3"
                    />
                    {{ formatNumber(cat.articles_count || 0) }} قطعة
                  </span>
                  <span
                    v-if="cat.is_locked"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold"
                  >
                    <UIcon
                      name="i-heroicons-lock-closed"
                      class="w-3 h-3"
                    />
                    الخطة المدفوعة
                  </span>
                </div>
              </div>
              <UIcon
                :name="cat.is_locked ? 'i-heroicons-lock-closed' : 'i-heroicons-arrow-left'"
                class="w-4 h-4 transition-colors mt-1"
                :class="cat.is_locked ? 'text-amber-500' : 'text-gray-300 group-hover:text-primary-600'"
              />
            </div>
          </button>
        </div>

        <div
          v-else
          class="px-6 py-8 text-center text-sm text-gray-500"
        >
          لا توجد تصنيفات تحت هذا القسم بعد.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { examsService } from '@/services/api/exams.service'
import { useAuthStore } from '@/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'بنك الأسئلة' })
useSeoMeta({ title: 'بنك الأسئلة | A Plus' })

interface Category {
  id: number
  name: string
  description?: string | null
  questions_count?: number
  articles_count?: number
  has_articles?: boolean
  is_locked?: boolean
}

interface Section {
  id: number
  name: string
  categories: Category[]
}

const authStore = useAuthStore()

const sections = ref<Section[]>([])
const loading = ref(false)
const loadError = ref(false)

const examId = computed<number | null>(() => {
  const u = authStore.getUser as { student?: { exam_id?: number | null } } | null
  return u?.student?.exam_id ?? null
})

const examName = computed<string>(() => {
  const u = authStore.getUser as { student?: { exam_name?: string, exam?: { name?: string } } } | null
  return u?.student?.exam_name ?? u?.student?.exam?.name ?? ''
})

async function loadSections() {
  if (!examId.value) {
    // Cached user blob may pre-date the login fix that includes student.exam_id
    await authStore.refreshUser()
  }
  if (!examId.value) {
    sections.value = []
    return
  }
  loading.value = true
  loadError.value = false
  try {
    const res = await examsService.getExamSections(examId.value)
    const data = res.data?.data ?? res.data ?? {}
    sections.value = data.sections ?? []
  } catch (err) {
    console.error('Failed to load sections', err)
    sections.value = []
    loadError.value = true
  } finally {
    loading.value = false
  }
}

function sectionTotalQuestions(section: Section): number {
  return (section.categories || []).reduce((sum, c) => sum + Number(c.questions_count || 0), 0)
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('ar-EG').format(n)
}

function onCategoryClick(cat: Category, _section: Section) {
  // Trial users: locked categories route to the subscription page instead.
  if (cat.is_locked) {
    navigateTo('/dashboard/subscriptions')
    return
  }
  navigateTo(`/dashboard/question-bank/category/${cat.id}`)
}

onMounted(loadSections)
</script>
