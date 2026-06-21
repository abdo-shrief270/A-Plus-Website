<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          تحليل الأداء
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          تابع تطوّر دقّتك واعرف نقاط ضعفك لتتدرّب عليها
        </p>
      </div>
      <div class="flex items-center bg-gray-100 rounded-xl p-1">
        <button
          v-for="d in dayOptions"
          :key="d.value"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
            days === d.value ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          ]"
          @click="setDays(d.value)"
        >
          {{ d.label }}
        </button>
      </div>
    </div>

    <div
      v-if="loading && !data"
      class="flex items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <template v-else-if="data">
      <!-- Totals -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p class="text-2xl font-black text-primary-700">
            {{ formatNumber(data.totals.answered) }}
          </p>
          <p class="text-[11px] text-gray-500 mt-1">
            إجابات
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p class="text-2xl font-black text-success-600">
            {{ formatNumber(data.totals.correct) }}
          </p>
          <p class="text-[11px] text-gray-500 mt-1">
            صحيحة
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p
            :class="['text-2xl font-black', data.totals.accuracy >= 50 ? 'text-success-600' : 'text-error-500']"
          >
            {{ data.totals.accuracy }}%
          </p>
          <p class="text-[11px] text-gray-500 mt-1">
            الدقّة
          </p>
        </div>
      </div>

      <!-- Accuracy trend (CSS bar chart) -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 class="text-base font-bold text-gray-900 mb-4">
          اتجاه الدقّة اليومية
        </h2>
        <div
          v-if="hasTrendData"
          class="flex items-end gap-1.5 h-40"
        >
          <div
            v-for="(t, i) in data.accuracy_trend"
            :key="i"
            class="flex-1 flex flex-col items-center justify-end h-full group relative"
          >
            <div
              class="w-full rounded-t-md transition-all"
              :class="t.accuracy === null ? 'bg-gray-100' : (t.accuracy >= 50 ? 'bg-success-400' : 'bg-error-300')"
              :style="{ height: t.accuracy === null ? '4px' : `${Math.max(4, t.accuracy)}%` }"
            />
            <!-- tooltip -->
            <div class="absolute -top-9 hidden group-hover:block bg-gray-900 text-white text-[10px] rounded-lg px-2 py-1 whitespace-nowrap z-10">
              {{ t.accuracy === null ? 'لا نشاط' : t.accuracy + '%' }} · {{ t.answered }} سؤال
            </div>
          </div>
        </div>
        <div
          v-else
          class="py-12 text-center text-sm text-gray-400"
        >
          لا توجد بيانات كافية بعد. ابدأ بحلّ الأسئلة لتظهر هنا.
        </div>
        <div class="flex justify-between text-[10px] text-gray-400 mt-2">
          <span>{{ formatDate(data.accuracy_trend[0]?.date) }}</span>
          <span>{{ formatDate(data.accuracy_trend[data.accuracy_trend.length - 1]?.date) }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weakest -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-l from-error-50/40 to-white flex items-center gap-2">
            <UIcon
              name="i-heroicons-arrow-trending-down"
              class="w-5 h-5 text-error-500"
            />
            <h2 class="text-base font-bold text-gray-900">
              أضعف التصنيفات
            </h2>
          </div>
          <div
            v-if="!data.categories.weakest.length"
            class="py-10 text-center text-sm text-gray-400"
          >
            تحتاج {{ minAttempts }} محاولات على الأقل لكل تصنيف لعرض التحليل.
          </div>
          <div
            v-else
            class="divide-y divide-gray-50"
          >
            <div
              v-for="cat in data.categories.weakest"
              :key="cat.category_id"
              class="flex items-center gap-3 px-5 py-3.5"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 truncate">
                  {{ cat.name }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <div class="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
                    <div
                      class="h-full bg-error-400"
                      :style="{ width: `${cat.accuracy}%` }"
                    />
                  </div>
                  <span class="text-[11px] font-bold text-error-500">{{ cat.accuracy }}%</span>
                  <span class="text-[10px] text-gray-400">{{ cat.answered }} سؤال</span>
                </div>
              </div>
              <UButton
                color="primary"
                variant="soft"
                size="xs"
                icon="i-heroicons-bolt"
                @click="practiceCategory(cat.category_id)"
              >
                تدرّب
              </UButton>
            </div>
          </div>
        </div>

        <!-- Strongest -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-l from-success-50/40 to-white flex items-center gap-2">
            <UIcon
              name="i-heroicons-arrow-trending-up"
              class="w-5 h-5 text-success-500"
            />
            <h2 class="text-base font-bold text-gray-900">
              أقوى التصنيفات
            </h2>
          </div>
          <div
            v-if="!data.categories.strongest.length"
            class="py-10 text-center text-sm text-gray-400"
          >
            لا توجد بيانات كافية بعد.
          </div>
          <div
            v-else
            class="divide-y divide-gray-50"
          >
            <div
              v-for="cat in data.categories.strongest"
              :key="cat.category_id"
              class="flex items-center gap-3 px-5 py-3.5"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 truncate">
                  {{ cat.name }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <div class="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
                    <div
                      class="h-full bg-success-400"
                      :style="{ width: `${cat.accuracy}%` }"
                    />
                  </div>
                  <span class="text-[11px] font-bold text-success-600">{{ cat.accuracy }}%</span>
                  <span class="text-[10px] text-gray-400">{{ cat.answered }} سؤال</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { performanceService } from '@/services/api/performance.service'
import { formatNumber } from '@/utils/number'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'تحليل الأداء' })
useSeoMeta({ title: 'تحليل الأداء | A Plus' })

interface CategoryStat {
  category_id: number
  name: string
  section: string
  answered: number
  accuracy: number
}
interface PerformanceData {
  accuracy_trend: { date: string, answered: number, correct: number, accuracy: number | null }[]
  categories: { weakest: CategoryStat[], strongest: CategoryStat[], evaluated_count: number }
  totals: { answered: number, correct: number, accuracy: number }
}

const minAttempts = 3
const dayOptions = [
  { value: 7, label: 'أسبوع' },
  { value: 14, label: 'أسبوعين' },
  { value: 30, label: 'شهر' }
]

const loading = ref(true)
const days = ref(14)
const data = ref<PerformanceData | null>(null)

const hasTrendData = computed(() => data.value?.accuracy_trend.some(t => t.accuracy !== null) ?? false)

async function load() {
  loading.value = true
  try {
    const res = await performanceService.get(days.value)
    data.value = res.data?.data ?? null
  } catch (err) {
    console.error('Failed to load performance', err)
    data.value = null
  } finally {
    loading.value = false
  }
}

function setDays(d: number) {
  if (days.value === d) return
  days.value = d
  load()
}

function practiceCategory(categoryId: number) {
  // Prefill the quiz builder with this category + wrong-answers source.
  navigateTo({ path: '/dashboard/quizzes', query: { category: categoryId, source: 'wrong' } })
}

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })
}

onMounted(load)
</script>
