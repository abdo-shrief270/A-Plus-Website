<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          مراجعة الأخطاء
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          أعد حل الأسئلة التي أخطأت بها سابقاً — الإجابة الصحيحة تزيلها من القائمة نهائياً
        </p>
      </div>
      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-path"
        :loading="loading"
        @click="load"
      >
        تحديث
      </UButton>
    </div>

    <!-- Loading -->
    <div
      v-if="loading && !queue.length"
      class="flex items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <template v-else>
      <!-- Session summary tiles -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p class="text-2xl font-black text-primary-700">
            {{ formatNumber(remainingInSession) }}
          </p>
          <p class="text-[11px] text-gray-500 mt-1">
            متبقي اليوم
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p class="text-2xl font-black text-success-600">
            {{ formatNumber(fixedCount) }}
          </p>
          <p class="text-[11px] text-gray-500 mt-1">
            تم إصلاحها ✅
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p class="text-2xl font-black text-warning-600">
            {{ formatNumber(stillWrongCount) }}
          </p>
          <p class="text-[11px] text-gray-500 mt-1">
            تعود غداً 🔁
          </p>
        </div>
      </div>

      <!-- Done / empty state -->
      <div
        v-if="!currentQuestion"
        class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
      >
        <template v-if="fixedCount + stillWrongCount > 0">
          <div class="text-5xl mb-4">
            🎉
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            أنهيت مراجعة اليوم!
          </h3>
          <p class="text-sm text-gray-500 mb-1">
            أصلحت {{ formatNumber(fixedCount) }} سؤالاً
            <template v-if="stillWrongCount > 0">
              — و{{ formatNumber(stillWrongCount) }} سيعود للمراجعة غداً
            </template>
          </p>
        </template>
        <template v-else>
          <UIcon
            name="i-heroicons-check-badge"
            class="w-14 h-14 text-success-400 mx-auto mb-3"
          />
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            لا توجد أسئلة مستحقة للمراجعة
          </h3>
          <p
            v-if="summary && summary.resting_count > 0"
            class="text-sm text-gray-500"
          >
            لديك {{ formatNumber(summary.resting_count) }} سؤال قيد الانتظار —
            سيكون جاهزاً للمراجعة {{ nextDueLabel }}
          </p>
          <p
            v-else
            class="text-sm text-gray-500"
          >
            رائع! لا توجد أخطاء بحاجة لمراجعة. تابع الحل في بنك الأسئلة.
          </p>
        </template>
        <UButton
          to="/dashboard/question-bank"
          color="primary"
          icon="i-heroicons-bolt"
          class="mt-5"
        >
          الذهاب لبنك الأسئلة
        </UButton>
      </div>

      <!-- Current question -->
      <template v-else>
        <div class="flex items-center justify-between mb-4">
          <p class="text-xs font-bold text-gray-500">
            السؤال {{ sessionIndex + 1 }} من {{ sessionTotal }}
          </p>
          <div class="h-1.5 flex-1 mx-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-l from-primary-500 to-primary-400 transition-all"
              :style="{ width: `${sessionTotal ? Math.round(((sessionIndex) / sessionTotal) * 100) : 0}%` }"
            />
          </div>
        </div>

        <QuestionItem
          :key="currentQuestion.id"
          :question="currentQuestion"
          @answered="onAnswered"
        />

        <div
          v-if="answeredCurrent"
          class="flex justify-center mt-6"
        >
          <UButton
            color="primary"
            size="lg"
            trailing-icon="i-heroicons-arrow-left"
            @click="next"
          >
            {{ sessionIndex + 1 < sessionTotal ? 'السؤال التالي' : 'إنهاء المراجعة' }}
          </UButton>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import QuestionItem from '@/components/question/QuestionItem.vue'
import { reviewService } from '@/services/api/review.service'
import { formatNumber } from '@/utils/number'
import type { Question, QuestionSubmissionResult } from '@/types/question-bank'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'مراجعة الأخطاء' })
useSeoMeta({ title: 'مراجعة الأخطاء | A Plus' })

interface ReviewSummary {
  due_count: number
  resting_count: number
  next_due_at: string | null
  cooldown_hours: number
}

const loading = ref(true)
const queue = ref<Question[]>([])
const summary = ref<ReviewSummary | null>(null)

const sessionIndex = ref(0)
const sessionTotal = ref(0)
const fixedCount = ref(0)
const stillWrongCount = ref(0)
const answeredCurrent = ref(false)

const currentQuestion = computed<Question | null>(() => queue.value[sessionIndex.value] ?? null)
const remainingInSession = computed(() => Math.max(0, sessionTotal.value - sessionIndex.value - (answeredCurrent.value ? 1 : 0)))

async function load() {
  loading.value = true
  try {
    const res = await reviewService.getQueue({ per_page: 50 })
    const data = res.data?.data ?? {}
    queue.value = data.questions ?? []
    summary.value = data.summary ?? null
    sessionIndex.value = 0
    sessionTotal.value = queue.value.length
    fixedCount.value = 0
    stillWrongCount.value = 0
    answeredCurrent.value = false
  } catch (err) {
    console.error('Failed to load review queue', err)
    queue.value = []
  } finally {
    loading.value = false
  }
}

function onAnswered(result: QuestionSubmissionResult) {
  answeredCurrent.value = true
  if (result.is_correct) fixedCount.value++
  else stillWrongCount.value++
}

function next() {
  answeredCurrent.value = false
  sessionIndex.value++
}

const nextDueLabel = computed(() => {
  if (!summary.value?.next_due_at) return 'لاحقاً'
  const diff = new Date(summary.value.next_due_at).getTime() - Date.now()
  if (diff <= 0) return 'الآن — اضغط تحديث'
  const hours = Math.ceil(diff / 3600000)
  if (hours < 24) return `خلال ${hours} ساعة تقريباً`
  return `خلال ${Math.ceil(hours / 24)} يوم`
})

onMounted(load)
</script>
