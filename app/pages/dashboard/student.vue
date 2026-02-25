<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        مرحباً، {{ authStore.getUser?.name }} 👋
      </h1>
      <p class="text-gray-500 mt-1">
        استعد لاختبارك القادم
      </p>
    </div>

    <!-- Period Filter -->
    <div class="flex gap-2 mb-6">
      <UButton
        v-for="p in periods"
        :key="p.value"
        :color="period === p.value ? 'primary' : 'neutral'"
        :variant="period === p.value ? 'solid' : 'outline'"
        size="sm"
        @click="period = p.value"
      >
        {{ p.label }}
      </UButton>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in statCards"
        :key="stat.label"
        class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-center justify-between mb-3">
          <div :class="`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`">
            <UIcon :name="stat.icon" :class="`w-5 h-5 ${stat.iconColor}`" />
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stat.value }}
        </p>
        <p class="text-sm text-gray-500 mt-1">
          {{ stat.label }}
        </p>
      </div>
    </div>

    <!-- Exams Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">
          الاختبارات المتاحة
        </h2>
        <NuxtLink to="/exams">
          <UButton variant="link" size="sm" trailing-icon="i-heroicons-arrow-left">
            عرض الكل
          </UButton>
        </NuxtLink>
      </div>
      <div class="p-5">
        <div v-if="examsLoading" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-400 animate-spin" />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NuxtLink
            v-for="exam in exams.slice(0, 3)"
            :key="exam.id"
            :to="`/exams/${exam.id}`"
          >
            <div class="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer">
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-primary-600" />
                </div>
                <UBadge color="primary" variant="soft" size="xs">
                  نشط
                </UBadge>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                {{ exam.name }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ exam.year || exam.description }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Trending Questions -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">
          أسئلة رائجة
        </h2>
        <NuxtLink to="/questions/trending">
          <UButton variant="link" size="sm" trailing-icon="i-heroicons-arrow-left">
            عرض الكل
          </UButton>
        </NuxtLink>
      </div>
      <div class="p-5">
        <div v-if="questionsLoading" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-400 animate-spin" />
        </div>
        <div v-else class="space-y-3">
          <NuxtLink
            v-for="q in trendingQuestions.slice(0, 5)"
            :key="q.id"
            :to="`/questions/${q.id}`"
          >
            <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div class="w-8 h-8 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-question-mark-circle" class="w-4 h-4 text-warning-600" />
              </div>
              <p class="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                {{ q.text || q.content }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { statsService } from '@/services/api/stats.service'
import { examService } from '@/services/api/exam.service'
import { questionService } from '@/services/api/question.service'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

useSeoMeta({
  title: 'لوحة الطالب | A Plus',
  description: 'لوحة الطالب على منصة A Plus'
})

const authStore = useAuthStore()
// Student only logic. Middlewares or useRedirect will handle root routing.

const period = ref<'week' | 'month' | '3months' | 'year'>('month')
const periods = [
  { label: 'أسبوع', value: 'week' as const },
  { label: 'شهر', value: 'month' as const },
  { label: '٣ أشهر', value: '3months' as const },
  { label: 'سنة', value: 'year' as const }
]

const statsData = ref<any>(null)
const exams = ref<any[]>([])
const trendingQuestions = ref<any[]>([])
const statsLoading = ref(false)
const examsLoading = ref(false)
const questionsLoading = ref(false)

const statCards = computed(() => [
  {
    label: 'الدرجة الكلية',
    value: statsData.value?.total_score ?? '–',
    icon: 'i-heroicons-star',
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600'
  },
  {
    label: 'الأسئلة المحلولة',
    value: statsData.value?.total_questions ?? '–',
    icon: 'i-heroicons-check-circle',
    iconBg: 'bg-success-100',
    iconColor: 'text-success-600'
  },
  {
    label: 'معدل الإجابة الصحيحة',
    value: statsData.value?.accuracy_rate ? `${statsData.value.accuracy_rate}%` : '–',
    icon: 'i-heroicons-chart-bar',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600'
  },
  {
    label: 'التقدم هذا الشهر',
    value: statsData.value?.monthly_progress ?? '–',
    icon: 'i-heroicons-arrow-trending-up',
    iconBg: 'bg-info-100',
    iconColor: 'text-info-600'
  }
])

async function fetchStats() {
  statsLoading.value = true
  try {
    const res = await statsService.studentStats(period.value)
    statsData.value = res.data?.data
  } catch {
    //
  } finally {
    statsLoading.value = false
  }
}

watch(period, fetchStats)

onMounted(async () => {
  fetchStats()

  examsLoading.value = true
  try {
    const res = await examService.list()
    exams.value = res.data?.data?.exams || []
  } catch {
    //
  } finally {
    examsLoading.value = false
  }

  questionsLoading.value = true
  try {
    const res = await questionService.trending({ per_page: 5 })
    trendingQuestions.value = res.data?.data?.questions || []
  } catch {
    //
  } finally {
    questionsLoading.value = false
  }
})
</script>
