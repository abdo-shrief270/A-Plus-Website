<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          الخطة الدراسية
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          دروسك موزّعة على الأيام حتى موعد اختبارك
        </p>
      </div>
      <UButton
        v-if="plan?.available"
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-path"
        :loading="regenerating"
        @click="regenerate"
      >
        إعادة توزيع
      </UButton>
    </div>

    <!-- Loading -->
    <div
      v-if="loading && !plan"
      class="flex items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Unavailable -->
    <div
      v-else-if="plan && !plan.available"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-calendar-days"
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500 mb-4">
        {{ plan.message }}
      </p>
      <UButton
        v-if="plan.reason === 'missing_exam'"
        to="/dashboard/profile"
        color="primary"
      >
        تحديث الملف الشخصي
      </UButton>
    </div>

    <template v-else-if="plan?.summary">
      <!-- Summary -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-l from-primary-50 to-white rounded-2xl border border-primary-100 p-4">
          <p class="text-xs text-gray-500 mb-1.5">
            نسبة الإنجاز
          </p>
          <p class="text-2xl font-bold text-primary-700">
            {{ plan.summary.completion_percentage }}%
          </p>
          <div class="mt-2 h-2 bg-primary-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 transition-all"
              :style="{ width: `${plan.summary.completion_percentage}%` }"
            />
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p class="text-xs text-gray-500 mb-1.5">
            مكتملة
          </p>
          <p class="text-2xl font-bold text-success-600">
            {{ plan.summary.completed }} <span class="text-sm text-gray-400">/ {{ plan.summary.total_lessons }}</span>
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p class="text-xs text-gray-500 mb-1.5">
            مستحقة اليوم
          </p>
          <p class="text-2xl font-bold text-warning-600">
            {{ plan.summary.due_today }}
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p class="text-xs text-gray-500 mb-1.5">
            أيام حتى الاختبار
          </p>
          <p class="text-2xl font-bold text-gray-700">
            {{ plan.summary.days_until_exam ?? '—' }}
          </p>
        </div>
      </div>

      <!-- Overdue reminder banner -->
      <div
        v-if="(plan.summary.overdue ?? 0) > 0"
        class="flex items-center gap-3 bg-gradient-to-l from-warning-50 to-white rounded-2xl border border-warning-200 p-4 mb-5 shadow-sm"
      >
        <div class="w-11 h-11 rounded-xl bg-warning-100 flex items-center justify-center shrink-0">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-5 h-5 text-warning-600"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-gray-900">
            لديك {{ formatNumber(plan.summary.overdue) }} درس متأخر
          </p>
          <p class="text-[11px] text-gray-500 mt-0.5">
            دروس مجدولة في أيام سابقة لم تفتحها بعد — أكملها حتى لا تتراكم عليك.
          </p>
        </div>
      </div>

      <!-- Weeks → days → lessons -->
      <div class="space-y-5">
        <section
          v-for="week in plan.days"
          :key="week.label"
          :class="[
            'bg-white rounded-2xl border shadow-sm overflow-hidden',
            week.is_current ? 'border-primary-300 ring-1 ring-primary-200' : 'border-gray-100'
          ]"
        >
          <!-- Week header (toggles) -->
          <button
            type="button"
            class="w-full px-5 py-4 flex items-center gap-3 text-right transition-colors"
            :class="week.is_current ? 'bg-primary-50/60' : 'bg-gray-50/60 hover:bg-gray-50'"
            @click="toggleWeek(week.label)"
          >
            <div
              :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                week.is_current ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-400 border border-gray-100'
              ]"
            >
              <UIcon
                name="i-heroicons-calendar-days"
                class="w-5 h-5"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-black text-gray-900">{{ week.label }}</span>
                <span
                  v-if="week.is_current"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-primary-500 text-white font-bold"
                >الأسبوع الحالي</span>
              </div>
              <p
                v-if="week.start_date"
                class="text-[11px] text-gray-500 mt-0.5"
              >
                {{ formatRange(week.start_date, week.end_date) }}
              </p>
            </div>
            <div class="text-left shrink-0">
              <p class="text-xs font-bold text-gray-700">
                {{ week.completed_lessons }}/{{ week.total_lessons }} درس
              </p>
              <div class="mt-1 h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary-500 transition-all"
                  :style="{ width: `${week.total_lessons ? Math.round(week.completed_lessons / week.total_lessons * 100) : 0}%` }"
                />
              </div>
            </div>
            <UIcon
              :name="isWeekOpen(week) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
              class="w-5 h-5 text-gray-400 shrink-0"
            />
          </button>

          <!-- Days within the week -->
          <div
            v-if="isWeekOpen(week)"
            class="border-t border-gray-100 divide-y divide-gray-100"
          >
            <div
              v-for="day in week.days"
              :key="day.date"
              class="p-4"
            >
              <div class="flex items-center gap-2 mb-2 px-1">
                <UIcon
                  :name="day.is_today ? 'i-heroicons-star' : (day.is_past ? 'i-heroicons-check-circle' : 'i-heroicons-calendar')"
                  :class="['w-4 h-4', day.is_today ? 'text-primary-600' : (day.is_past ? 'text-success-500' : 'text-gray-400')]"
                />
                <span class="text-xs font-bold text-gray-700">{{ formatDay(day) }}</span>
                <span class="text-[11px] text-gray-400">{{ day.lessons.length }} درس</span>
                <span
                  v-if="day.is_today"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-primary-500 text-white font-bold mr-auto"
                >اليوم</span>
              </div>

              <div class="space-y-2">
                <component
                  :is="lesson.is_locked ? 'div' : NuxtLinkComponent"
                  v-for="lesson in day.lessons"
                  :key="lesson.lesson_id"
                  :to="lesson.is_locked ? undefined : `/dashboard/lessons/${lesson.lesson_id}`"
                  :class="[
                    'flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors group',
                    lesson.is_locked
                      ? 'border-gray-100 bg-gray-50/60 cursor-not-allowed opacity-75'
                      : 'border-gray-100 hover:border-primary-200 hover:bg-gray-50'
                  ]"
                >
                  <div
                    class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    :style="{ backgroundColor: lesson.is_locked ? '#9ca3af22' : (lesson.color || '#10B981') + '22' }"
                  >
                    <UIcon
                      :name="lesson.is_locked ? 'i-heroicons-lock-closed' : 'i-heroicons-book-open'"
                      class="w-4 h-4"
                      :style="{ color: lesson.is_locked ? '#9ca3af' : (lesson.color || '#10B981') }"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-bold truncate"
                      :class="lesson.is_locked ? 'text-gray-500' : 'text-gray-900'"
                    >
                      {{ lesson.title }}
                    </p>
                    <p class="text-[11px] text-gray-400 mt-0.5">
                      <template v-if="lesson.is_locked">
                        <UIcon
                          name="i-heroicons-lock-closed"
                          class="w-3 h-3 inline align-middle"
                        /> يُفتح يوم {{ formatLockDay(day.date) }}
                      </template>
                      <template v-else-if="lesson.duration_minutes">
                        <UIcon
                          name="i-heroicons-clock"
                          class="w-3 h-3 inline align-middle"
                        /> {{ lesson.duration_minutes }} دقيقة
                      </template>
                    </p>
                  </div>
                  <span
                    v-if="!lesson.is_locked"
                    :class="[
                      'text-[11px] px-2.5 py-1 rounded-full font-bold shrink-0',
                      statusStyle[lesson.status]
                    ]"
                  >
                    {{ statusLabel[lesson.status] }}
                  </span>
                  <UIcon
                    v-if="!lesson.is_locked"
                    name="i-heroicons-arrow-left"
                    class="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors"
                  />
                </component>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { studyPlanService } from '@/services/api/studyPlan.service'
import { showToast } from '@/utils/helpers/toast.helper'
import { formatNumber } from '@/utils/number'
import type { StudyPlan, StudyPlanDay, StudyPlanWeek, LessonStatus } from '@/types/lesson'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'الخطة الدراسية' })
useSeoMeta({ title: 'الخطة الدراسية | A Plus' })

// Resolve the real NuxtLink component object here (in setup) — binding the
// string 'NuxtLink' to <component :is> can fall back to a plain <nuxtlink>
// element that renders no <a> and never navigates.
const NuxtLinkComponent = resolveComponent('NuxtLink')

const loading = ref(true)
const regenerating = ref(false)
const plan = ref<StudyPlan | null>(null)

// Which weeks are expanded. Seeded to the current week after load.
const openWeeks = ref(new Set<string>())
function toggleWeek(label: string) {
  if (openWeeks.value.has(label)) openWeeks.value.delete(label)
  else openWeeks.value.add(label)
  openWeeks.value = new Set(openWeeks.value)
}
function isWeekOpen(week: StudyPlanWeek) {
  return openWeeks.value.has(week.label)
}

const statusLabel: Record<LessonStatus, string> = {
  pending: 'لم يبدأ',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتمل'
}
const statusStyle: Record<LessonStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-warning-50 text-warning-700',
  completed: 'bg-success-50 text-success-700'
}

async function load() {
  loading.value = true
  try {
    const res = await studyPlanService.get()
    plan.value = res.data?.data ?? null
    seedOpenWeeks()
  } catch (err) {
    console.error('Failed to load study plan', err)
    plan.value = null
  } finally {
    loading.value = false
  }
}

// Open the current week by default (fallback: the first week).
function seedOpenWeeks() {
  const weeks = plan.value?.days ?? []
  const current = weeks.find(w => w.is_current) ?? weeks[0]
  openWeeks.value = new Set(current ? [current.label] : [])
}

async function regenerate() {
  regenerating.value = true
  try {
    const res = await studyPlanService.regenerate()
    if (res.data?.status === 422) {
      showToast('تنبيه', res.data?.message || 'تعذّر إعادة التوزيع', 'warning')
      return
    }
    plan.value = res.data?.data ?? plan.value
    seedOpenWeeks()
    showToast('تم', 'أُعيد توزيع الدروس على الأيام المتبقية', 'success')
  } catch (err) {
    console.error('Failed to regenerate plan', err)
  } finally {
    regenerating.value = false
  }
}

function formatDay(day: StudyPlanDay) {
  if (day.date === 'unscheduled') return 'غير مجدول'
  return new Date(day.date).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatLockDay(date: string) {
  if (date === 'unscheduled') return '—'
  return new Date(date).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatRange(start: string | null, end: string | null) {
  if (!start) return ''
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  const s = new Date(start).toLocaleDateString('ar-EG', opts)
  if (!end || end === start) return s
  return `${s} - ${new Date(end).toLocaleDateString('ar-EG', opts)}`
}

onMounted(load)
</script>
