<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          صفحة المراجعة
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          راجع القطع والمقالات التعليمية المُرتبطة بالاختبارات قبل الحل
        </p>
      </div>
      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-path"
        :loading="loadingMetrics || loadingBookmarks"
        @click="refreshAll"
      >
        تحديث
      </UButton>
    </div>

    <!-- Smart review due banner -->
    <NuxtLink
      v-if="reviewDueCount > 0"
      to="/dashboard/review"
      class="flex items-center gap-4 bg-gradient-to-l from-warning-50 to-white rounded-2xl border border-warning-200 p-4 mb-5 shadow-sm hover:shadow-md transition-shadow group"
    >
      <div class="w-11 h-11 rounded-xl bg-warning-100 flex items-center justify-center shrink-0">
        <UIcon
          name="i-heroicons-arrow-path-rounded-square"
          class="w-5 h-5 text-warning-600"
        />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold text-gray-900">
          لديك {{ formatNumber(reviewDueCount) }} سؤال مستحق للمراجعة
        </p>
        <p class="text-[11px] text-gray-500 mt-0.5">
          أعد حل أخطائك السابقة لتثبيت المعلومة — الإجابة الصحيحة تزيلها نهائياً
        </p>
      </div>
      <UIcon
        name="i-heroicons-arrow-left"
        class="w-4 h-4 text-gray-300 group-hover:text-warning-600 transition-colors"
      />
    </NuxtLink>

    <!-- Revision metrics (student only) -->
    <section
      v-if="authStore.isStudent && metrics"
      class="mb-5 space-y-5"
    >
      <!-- Big numbers row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-gradient-to-l from-primary-50 to-white rounded-2xl border border-primary-100 p-4 shadow-sm">
          <p class="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5">
            <UIcon
              name="i-heroicons-chart-pie"
              class="w-3.5 h-3.5 text-primary-600"
            />
            التقدّم في الاختبار
          </p>
          <p class="text-2xl font-bold text-primary-700">
            {{ metrics.totals.progress }}%
          </p>
          <div class="mt-2 h-2 bg-primary-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 transition-all"
              :style="{ width: `${metrics.totals.progress}%` }"
            />
          </div>
          <p class="text-[11px] text-gray-500 mt-1.5">
            {{ formatNumber(metrics.totals.answered) }} / {{ formatNumber(metrics.totals.total_questions) }}
          </p>
        </div>

        <div class="bg-gradient-to-l from-success-50 to-white rounded-2xl border border-success-100 p-4 shadow-sm">
          <p class="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-3.5 h-3.5 text-success-600"
            />
            دقّة الإجابة
          </p>
          <p class="text-2xl font-bold text-success-700">
            {{ metrics.totals.accuracy }}%
          </p>
          <div class="mt-2 h-2 bg-success-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-success-500 transition-all"
              :style="{ width: `${metrics.totals.accuracy}%` }"
            />
          </div>
          <p class="text-[11px] text-gray-500 mt-1.5">
            {{ formatNumber(metrics.totals.correct) }} صحيح •
            {{ formatNumber(metrics.totals.incorrect) }} خطأ
          </p>
        </div>

        <div class="bg-gradient-to-l from-warning-50 to-white rounded-2xl border border-warning-100 p-4 shadow-sm">
          <p class="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5">
            <UIcon
              name="i-heroicons-bolt"
              class="w-3.5 h-3.5 text-warning-600"
            />
            عدد المحاولات
          </p>
          <p class="text-2xl font-bold text-warning-700">
            {{ formatNumber(metrics.totals.attempts) }}
          </p>
          <p class="text-[11px] text-gray-500 mt-1.5">
            تشمل إعادة الحل لنفس السؤال
          </p>
        </div>

        <div class="bg-gradient-to-l from-secondary-50 to-white rounded-2xl border border-secondary-100 p-4 shadow-sm">
          <p class="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5">
            <UIcon
              name="i-heroicons-star"
              class="w-3.5 h-3.5 text-secondary-600"
            />
            رصيد النقاط
          </p>
          <p class="text-2xl font-bold text-secondary-700 flex items-center gap-1">
            <UIcon
              v-if="walletState.hasUnlimited"
              name="i-mdi-infinity"
              class="w-7 h-7 text-secondary-600"
            />
            <span v-else>
              {{ formatNumber(metrics.totals.points) }}
            </span>
          </p>
          <p class="text-[11px] text-gray-500 mt-1.5">
            {{ formatNumber(metrics.bookmarks_count) }} سؤال محفوظ
          </p>
        </div>
      </div>

      <!-- Per-section breakdown -->
      <div
        v-for="section in metrics.sections"
        :key="`metrics-${section.id}`"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      >
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-l from-primary-50/40 to-white">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                <UIcon
                  name="i-heroicons-rectangle-stack"
                  class="w-5 h-5 text-primary-600"
                />
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-bold text-gray-900 truncate">
                  {{ section.name }}
                </h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ formatNumber(section.answered) }} / {{ formatNumber(section.total) }} •
                  دقّة {{ section.accuracy }}%
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success-50 text-success-700 font-bold">
                <UIcon
                  name="i-heroicons-check"
                  class="w-3 h-3"
                />
                {{ section.progress }}%
              </span>
            </div>
          </div>
          <div class="mt-3 h-2 bg-primary-100/60 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 transition-all"
              :style="{ width: `${section.progress}%` }"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          <NuxtLink
            v-for="cat in section.categories"
            :key="cat.id"
            :to="`/dashboard/question-bank/category/${cat.id}`"
            class="block bg-gradient-to-l from-gray-50 to-white border border-gray-100 hover:border-primary-300 hover:shadow-sm rounded-xl p-4 transition-all group"
          >
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-white border border-primary-100 flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors">
                <UIcon
                  name="i-heroicons-folder"
                  class="w-5 h-5 text-primary-600"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-1.5">
                  <p class="text-sm font-bold text-gray-900 truncate">
                    {{ cat.name }}
                  </p>
                  <span class="text-[11px] font-bold text-primary-700 shrink-0">
                    {{ cat.progress }}%
                  </span>
                </div>
                <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    class="h-full bg-gradient-to-l from-primary-500 to-primary-400 transition-all"
                    :style="{ width: `${cat.progress}%` }"
                  />
                </div>
                <div class="flex items-center gap-2 text-[11px] text-gray-500 flex-wrap">
                  <span>
                    {{ formatNumber(cat.answered) }} / {{ formatNumber(cat.total) }} سؤال
                  </span>
                  <span
                    v-if="cat.answered > 0"
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success-50 text-success-700 font-bold"
                  >
                    دقّة {{ cat.accuracy }}%
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent attempts -->
      <div
        v-if="metrics.recent.length"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-l from-info-50/40 to-white flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-info-50 border border-info-100 flex items-center justify-center shrink-0">
            <UIcon
              name="i-heroicons-clock"
              class="w-5 h-5 text-info-600"
            />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900">
              آخر المحاولات
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">
              نظرة سريعة على آخر 5 أسئلة حاولتها
            </p>
          </div>
        </div>
        <div class="divide-y divide-gray-100">
          <NuxtLink
            v-for="r in metrics.recent"
            :key="`${r.question_id}-${r.at}`"
            :to="`/dashboard/question-bank/${r.question_id}`"
            class="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
          >
            <div
              :class="[
                'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                r.is_correct ? 'bg-success-50 group-hover:bg-success-100' : 'bg-error-50 group-hover:bg-error-100'
              ]"
            >
              <UIcon
                :name="r.is_correct ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                :class="['w-4 h-4', r.is_correct ? 'text-success-600' : 'text-error-600']"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900">
                سؤال #{{ r.question_id }}
              </p>
              <p class="text-[11px] text-gray-500 mt-0.5">
                {{ relativeTime(r.at) }}
                <span
                  v-if="r.is_correct && r.score_earned > 0"
                  class="text-success-700 font-bold mr-1"
                >
                  +{{ r.score_earned }} نقطة
                </span>
              </p>
            </div>
            <UIcon
              name="i-heroicons-arrow-left"
              class="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors"
            />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Bookmarked questions (student only) -->
    <section
      v-if="authStore.isStudent"
      class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-5"
    >
      <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-l from-warning-50/40 to-white flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-11 h-11 rounded-xl bg-warning-50 border border-warning-100 flex items-center justify-center shrink-0">
            <UIcon
              name="i-heroicons-bookmark-solid"
              class="w-5 h-5 text-warning-600"
            />
          </div>
          <div class="min-w-0">
            <h2 class="text-base font-bold text-gray-900">
              محفوظاتي
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ bookmarksTotal !== null ? `${formatNumber(bookmarksTotal)} سؤال محفوظ` : 'الأسئلة التي حفظتها للمراجعة لاحقاً' }}
            </p>
          </div>
        </div>
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-path"
          size="xs"
          :loading="loadingBookmarks"
          square
          @click="loadBookmarks(true)"
        />
      </div>

      <div
        v-if="loadingBookmarks && !bookmarks.length"
        class="py-10 text-center"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-6 h-6 text-warning-500 animate-spin"
        />
      </div>

      <div
        v-else-if="!bookmarks.length"
        class="py-10 text-center px-6"
      >
        <UIcon
          name="i-heroicons-bookmark"
          class="w-10 h-10 text-gray-300 mx-auto mb-2"
        />
        <p class="text-sm text-gray-500">
          لم تحفظ أي سؤال بعد. اضغط على أيقونة الإشارة في أي سؤال لإضافته هنا.
        </p>
      </div>

      <div
        v-else
        class="divide-y divide-gray-100"
      >
        <NuxtLink
          v-for="q in bookmarks"
          :key="q.id"
          :to="`/dashboard/question-bank/${q.id}`"
          class="flex items-start gap-3 px-5 py-4 hover:bg-warning-50/30 transition-colors group"
        >
          <div class="w-9 h-9 rounded-lg bg-warning-50 group-hover:bg-warning-100 flex items-center justify-center shrink-0 transition-colors">
            <UIcon
              name="i-heroicons-bookmark-solid"
              class="w-4 h-4 text-warning-600"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div
              class="text-sm font-semibold text-gray-900 line-clamp-2 leading-relaxed [&_p]:my-0 [&_img]:inline-block [&_img]:align-middle [&_img]:max-h-12 [&_img]:max-w-full [&_img]:mx-1"
              dir="rtl"
              v-html="renderMarkdown(q.text)"
            />
            <div class="flex items-center gap-2 mt-1.5 min-w-0">
              <span
                v-if="q.breadcrumb?.category"
                class="text-[11px] text-gray-500 shrink-0 max-w-[40%] truncate"
              >
                <UIcon
                  name="i-heroicons-folder"
                  class="w-3 h-3 inline align-middle"
                /> {{ q.breadcrumb.category.name }}
              </span>
              <!-- The row links to the question, so the article chip must
                   swallow its own click to navigate to the article instead. -->
              <button
                v-if="q.breadcrumb?.article"
                type="button"
                class="text-[11px] text-secondary-700 min-w-0 truncate inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-secondary-50 hover:bg-secondary-100 hover:text-secondary-800 transition-colors"
                :title="q.breadcrumb.article.title"
                @click.prevent.stop="navigateTo(`/dashboard/revision/article/${q.breadcrumb.article.id}`)"
              >
                <UIcon
                  name="i-heroicons-document-text"
                  class="w-3 h-3 shrink-0"
                />
                <span class="truncate">{{ q.breadcrumb.article.title }}</span>
              </button>
              <span
                class="text-[11px] text-gray-400 font-mono mr-auto shrink-0"
                dir="ltr"
              >
                #{{ q.id }}
              </span>
            </div>
          </div>
          <UIcon
            name="i-heroicons-arrow-left"
            class="w-4 h-4 text-gray-300 group-hover:text-warning-600 transition-colors mt-1"
          />
        </NuxtLink>
      </div>

      <div
        v-if="bookmarksHasMore"
        class="px-4 py-3 border-t border-gray-100 flex justify-center"
      >
        <UButton
          color="warning"
          variant="soft"
          size="sm"
          icon="i-heroicons-plus"
          :loading="loadingBookmarks"
          @click="loadBookmarks(false)"
        >
          عرض المزيد
        </UButton>
      </div>
    </section>

    <!-- Empty state when the student has no metrics yet -->
    <div
      v-if="authStore.isStudent && !loadingMetrics && !metrics"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-chart-bar"
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500">
        لا توجد إحصائيات لعرضها بعد. ابدأ بحلّ بعض الأسئلة لتظهر هنا.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { questionsService } from '@/services/api/questions.service'
import { renderMarkdown } from '@/utils/markdown'
import { formatNumber } from '@/utils/number'
import { useAuthStore } from '@/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'المراجعة' })
useSeoMeta({ title: 'صفحة المراجعة | A Plus' })

const authStore = useAuthStore()
const wallet = useStudentWallet()
const walletState = wallet.state

// Metrics
interface MetricsCategory {
  id: number
  name: string
  total: number
  answered: number
  correct: number
  accuracy: number
  progress: number
}
interface MetricsSection {
  id: number
  name: string
  total: number
  answered: number
  correct: number
  accuracy: number
  progress: number
  categories: MetricsCategory[]
}
interface MetricsBundle {
  exam: { id: number, name: string } | null
  totals: {
    total_questions: number
    answered: number
    correct: number
    incorrect: number
    attempts: number
    accuracy: number
    progress: number
    points: number
  }
  sections: MetricsSection[]
  recent: { question_id: number, is_correct: boolean, score_earned: number, at: string }[]
  bookmarks_count: number
}

const metrics = ref<MetricsBundle | null>(null)
const loadingMetrics = ref(false)

async function loadMetrics() {
  loadingMetrics.value = true
  try {
    const res = await questionsService.getRevisionMetrics()
    metrics.value = (res.data?.data ?? res.data) as MetricsBundle
  } catch (err) {
    console.error('Failed to load revision metrics', err)
    metrics.value = null
  } finally {
    loadingMetrics.value = false
  }
}

function relativeTime(iso?: string) {
  if (!iso) return ''
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'الآن'
  if (min < 60) return `منذ ${min} د`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `منذ ${hr} س`
  const days = Math.floor(hr / 24)
  if (days < 30) return `منذ ${days} ي`
  return new Date(iso).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
}

// Bookmarks
interface BookmarkedQuestion {
  id: number
  text: string
  breadcrumb?: {
    section?: { id: number, name: string } | null
    category?: { id: number, name: string } | null
    article?: { id: number, title: string } | null
  } | null
}

const bookmarks = ref<BookmarkedQuestion[]>([])
const bookmarksTotal = ref<number | null>(null)
const bookmarksPage = ref(1)
const bookmarksLastPage = ref(1)
const loadingBookmarks = ref(false)

const bookmarksHasMore = computed(() =>
  bookmarksLastPage.value > bookmarksPage.value
)

async function loadBookmarks(reset: boolean) {
  if (loadingBookmarks.value) return
  loadingBookmarks.value = true
  try {
    const nextPage = reset ? 1 : bookmarksPage.value + 1
    const res = await questionsService.listBookmarks({ page: nextPage, per_page: 12 })
    const data = res.data?.data ?? res.data ?? {}
    const items: BookmarkedQuestion[] = data.questions ?? []
    bookmarks.value = reset ? items : [...bookmarks.value, ...items]
    bookmarksTotal.value = data.pagination?.total ?? bookmarks.value.length
    bookmarksPage.value = data.pagination?.current_page ?? nextPage
    bookmarksLastPage.value = data.pagination?.last_page ?? nextPage
  } catch (err) {
    console.error('Failed to load bookmarks', err)
    if (reset) bookmarks.value = []
  } finally {
    loadingBookmarks.value = false
  }
}

// Smart-review due counter for the banner
const reviewDueCount = ref(0)

async function loadReviewDue() {
  try {
    const { reviewService } = await import('@/services/api/review.service')
    const res = await reviewService.getQueue({ per_page: 1 })
    reviewDueCount.value = res.data?.data?.summary?.due_count ?? 0
  } catch {
    reviewDueCount.value = 0
  }
}

function refreshAll() {
  if (!authStore.isStudent) return
  loadMetrics()
  loadBookmarks(true)
  wallet.refresh()
  loadReviewDue()
}

onMounted(() => {
  refreshAll()
})
</script>
