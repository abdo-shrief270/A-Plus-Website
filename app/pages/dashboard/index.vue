<template>
  <!-- Students get a dedicated home; school/parent keep the admin dashboard. -->
  <DashboardStudentHome v-if="authStore.isStudent" />

  <div v-else>
    <!-- Welcome hero -->
    <div class="relative bg-gradient-to-l from-primary-600 to-primary-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-md mb-6">
      <div class="absolute top-0 left-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/4 blur-2xl" />
      <div class="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary-400/30 rounded-full translate-y-1/2 blur-2xl" />

      <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="flex items-center gap-4 min-w-0">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white/20 shrink-0">
            {{ initial(user?.name) }}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-medium text-white/80 mb-1">
              {{ greeting }}
            </p>
            <h1 class="text-2xl sm:text-3xl font-bold text-white truncate drop-shadow-sm">
              {{ user?.name || '—' }}
            </h1>
            <p class="text-sm text-white/90 mt-1">
              {{ roleSubtitle }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <UButton
            :to="labels.detailRoot"
            color="secondary"
            size="lg"
            icon="i-heroicons-user-plus"
          >
            {{ labels.addAction }}
          </UButton>
          <UButton
            to="/dashboard/courses"
            color="neutral"
            variant="solid"
            size="lg"
            icon="i-heroicons-academic-cap"
            class="bg-white/15 hover:bg-white/25 backdrop-blur ring-1 ring-white/30 text-white"
          >
            تصفح الكورسات
          </UButton>
        </div>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <div :class="['w-11 h-11 rounded-xl flex items-center justify-center', card.iconBg]">
            <UIcon
              :name="card.icon"
              :class="['w-5 h-5', card.iconColor]"
            />
          </div>
          <span
            v-if="card.delta"
            class="text-[11px] font-bold flex items-center gap-0.5"
            :class="card.deltaPositive ? 'text-success-600' : 'text-error-600'"
          >
            <UIcon
              :name="card.deltaPositive ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
              class="w-3.5 h-3.5"
            />
            {{ card.delta }}
          </span>
        </div>
        <p class="text-2xl font-bold text-gray-900">
          {{ statsLoading ? '...' : (card.value ?? '–') }}
        </p>
        <p class="text-xs text-gray-500 mt-1">
          {{ card.label }}
        </p>
      </div>
    </div>

    <!-- Quick actions -->
    <section class="mb-6">
      <h2 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
        إجراءات سريعة
      </h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.to"
          :to="action.to"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all p-4 flex items-center gap-3 group"
        >
          <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shrink-0', action.iconBg]">
            <UIcon
              :name="action.icon"
              :class="['w-5 h-5', action.iconColor]"
            />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
              {{ action.label }}
            </p>
            <p class="text-[11px] text-gray-500 truncate">
              {{ action.description }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Two column layout: recent + trending -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Left: recent students + enrollments -->
      <div class="lg:col-span-2 space-y-5">
        <!-- Recent students -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="font-bold text-gray-900 flex items-center gap-2">
              <UIcon
                name="i-heroicons-user-group"
                class="w-5 h-5 text-primary-600"
              />
              {{ labels.plural }} المضافون مؤخراً
            </h2>
            <NuxtLink
              :to="labels.detailRoot"
              class="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              عرض الكل
            </NuxtLink>
          </div>
          <div
            v-if="tablesLoading"
            class="py-10 text-center"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-6 h-6 text-primary-500 animate-spin"
            />
          </div>
          <div
            v-else-if="!students.length"
            class="py-10 text-center text-sm text-gray-500"
          >
            لا يوجد {{ labels.plural }} مضافين بعد.
          </div>
          <ul
            v-else
            class="divide-y divide-gray-100"
          >
            <li
              v-for="student in students"
              :key="student.id"
              class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors"
            >
              <NuxtLink
                :to="`${labels.detailRoot}/${student.id}`"
                class="flex items-center gap-3 flex-1 min-w-0 group"
              >
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                  :class="student.gender === 'female'
                    ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                    : 'bg-gradient-to-br from-primary-500 to-primary-700'"
                >
                  {{ initial(student.name) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-gray-900 truncate group-hover:text-primary-700">
                    {{ student.name || '—' }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    @{{ student.user_name }}
                    <span
                      v-if="student.exam_name"
                      class="mx-1"
                    >·</span>
                    <span v-if="student.exam_name">{{ student.exam_name }}</span>
                  </p>
                </div>
              </NuxtLink>
              <span class="text-xs text-gray-400 shrink-0">
                {{ formatDate(student.joined_at || student.created_at) }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Recent enrollments -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="font-bold text-gray-900 flex items-center gap-2">
              <UIcon
                name="i-heroicons-clipboard-document-check"
                class="w-5 h-5 text-primary-600"
              />
              أحدث التسجيلات
            </h2>
            <NuxtLink
              to="/dashboard/enrollments"
              class="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              عرض الكل
            </NuxtLink>
          </div>
          <div
            v-if="tablesLoading"
            class="py-10 text-center"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-6 h-6 text-primary-500 animate-spin"
            />
          </div>
          <div
            v-else-if="!enrollments.length"
            class="py-10 text-center text-sm text-gray-500"
          >
            لا توجد تسجيلات بعد.
          </div>
          <ul
            v-else
            class="divide-y divide-gray-100"
          >
            <li
              v-for="row in enrollments"
              :key="row.id"
              class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors"
            >
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  v-if="row.course?.image_path"
                  :src="row.course.image_path"
                  :alt="row.course.title ?? ''"
                  class="w-full h-full object-cover"
                >
                <UIcon
                  v-else
                  name="i-heroicons-academic-cap"
                  class="w-5 h-5 text-primary-600"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 truncate">
                  {{ row.course?.title || '—' }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ row.user?.name || '—' }}
                </p>
              </div>
              <UBadge
                :color="row.status === 'active' ? 'success' : (row.status === 'pending' ? 'warning' : 'error')"
                variant="soft"
                size="sm"
                class="shrink-0"
              >
                {{ statusLabel(row.status) }}
              </UBadge>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right: Trending courses -->
      <aside class="space-y-5">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <UIcon
              name="i-heroicons-fire"
              class="w-5 h-5 text-secondary-600"
            />
            <h2 class="font-bold text-gray-900">
              الأكثر رواجاً
            </h2>
          </div>
          <div
            v-if="statsLoading"
            class="py-10 text-center"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-6 h-6 text-primary-500 animate-spin"
            />
          </div>
          <div
            v-else-if="!courses.length"
            class="py-10 text-center text-sm text-gray-500"
          >
            لا توجد كورسات حالياً
          </div>
          <ul
            v-else
            class="divide-y divide-gray-100"
          >
            <li
              v-for="course in courses"
              :key="course.id"
              class="px-5 py-3 hover:bg-gray-50/60 transition-colors"
            >
              <NuxtLink
                :to="`/dashboard/courses/${course.id}`"
                class="block group"
              >
                <p class="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-primary-700 transition-colors mb-1.5">
                  {{ course.title || course.name }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500 flex items-center gap-1">
                    <UIcon
                      name="i-heroicons-users"
                      class="w-3.5 h-3.5"
                    />
                    {{ course.enrollments_count || 0 }} مشترك
                  </span>
                  <span class="text-sm font-bold text-primary-700">
                    {{ (course.price ?? 0) > 0 ? `${course.price} ر.س` : 'مجاني' }}
                  </span>
                </div>
              </NuxtLink>
            </li>
          </ul>
          <div class="px-5 py-3 border-t border-gray-100 bg-gray-50/40">
            <UButton
              to="/dashboard/courses"
              variant="ghost"
              color="primary"
              size="sm"
              block
              icon="i-heroicons-arrow-left"
              class="rtl:[&>span:first-child]:rotate-180"
            >
              تصفح كل الكورسات
            </UButton>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { dashboardService } from '@/services/api/dashboard.service'

interface DashboardStats {
  total_students?: number
  new_students_last_month?: number
  total_courses?: number
  active_enrollments?: number
  new_enrollments_this_week?: number
  active_subscriptions?: number
}

interface TrendingCourse {
  id: number
  title?: string | null
  name?: string | null
  enrollments_count?: number | null
  price?: number | null
}

interface RecentStudent {
  id: number
  name?: string | null
  user_name?: string | null
  gender?: string | null
  exam_name?: string | null
  joined_at?: string | null
  created_at?: string | null
}

interface RecentEnrollment {
  id: number
  status?: string | null
  user?: { name?: string | null } | null
  course?: { title?: string | null, image_path?: string | null } | null
}

interface DashboardBundle {
  stats?: DashboardStats | null
  trending_courses?: TrendingCourse[]
  recent_students?: RecentStudent[]
  recent_enrollments?: RecentEnrollment[]
}

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role']
})

useSeoMeta({ title: 'لوحة التحكم | A Plus' })

const authStore = useAuthStore()
const labels = useEntityLabels()
const user = computed(() => authStore.getUser)

const statsData = ref<DashboardStats | null>(null)
const courses = ref<TrendingCourse[]>([])
const students = ref<RecentStudent[]>([])
const enrollments = ref<RecentEnrollment[]>([])

const statsLoading = ref(true)
const tablesLoading = ref(true)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 5) return 'مساء الخير'
  if (hour < 12) return 'صباح الخير'
  if (hour < 18) return 'مساء النور'
  return 'مساء الخير'
})

const roleSubtitle = computed(() => {
  if (authStore.isSchool) return 'لوحة تحكم المدرسة — متابعة الطلاب والتسجيلات'
  if (authStore.isParent) return 'لوحة متابعة ولي الأمر — متابعة أبنائك ودوراتهم'
  return 'لوحة التحكم'
})

const statCards = computed(() => [
  {
    label: `إجمالي ${labels.value.plural}`,
    value: statsData.value?.total_students,
    icon: 'i-heroicons-user-group',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
    delta: statsData.value?.new_students_last_month
      ? `+${statsData.value.new_students_last_month} هذا الشهر`
      : null,
    deltaPositive: true
  },
  {
    label: 'الكورسات النشطة',
    value: statsData.value?.total_courses,
    icon: 'i-heroicons-academic-cap',
    iconBg: 'bg-success-50',
    iconColor: 'text-success-600'
  },
  {
    label: 'تسجيلات نشطة',
    value: statsData.value?.active_enrollments,
    icon: 'i-heroicons-clipboard-document-check',
    iconBg: 'bg-secondary-50',
    iconColor: 'text-secondary-600',
    delta: statsData.value?.new_enrollments_this_week
      ? `+${statsData.value.new_enrollments_this_week} هذا الأسبوع`
      : null,
    deltaPositive: true
  },
  {
    label: 'اشتراكات نشطة',
    value: statsData.value?.active_subscriptions,
    icon: 'i-heroicons-credit-card',
    iconBg: 'bg-info-50',
    iconColor: 'text-info-600'
  }
])

const quickActions = computed(() => [
  {
    label: `إدارة ${labels.value.plural}`,
    description: `قائمة ${labels.value.plural} وملفاتهم`,
    to: labels.value.detailRoot,
    icon: 'i-heroicons-users',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600'
  },
  {
    label: 'الكورسات',
    description: 'تصفح وأشرك في كورسات',
    to: '/dashboard/courses',
    icon: 'i-heroicons-academic-cap',
    iconBg: 'bg-success-50',
    iconColor: 'text-success-600'
  },
  {
    label: 'التسجيلات',
    description: 'حالة جميع التسجيلات',
    to: '/dashboard/enrollments',
    icon: 'i-heroicons-clipboard-document-check',
    iconBg: 'bg-secondary-50',
    iconColor: 'text-secondary-600'
  },
  {
    label: 'الاشتراكات',
    description: 'باقات النقاط والاشتراكات',
    to: '/dashboard/subscriptions',
    icon: 'i-heroicons-credit-card',
    iconBg: 'bg-warning-50',
    iconColor: 'text-warning-600'
  }
])

// Students render <DashboardStudentHome>; only school/parent need this bundle.
onMounted(() => {
  if (!authStore.isStudent) loadDashboard()
})

async function loadDashboard() {
  statsLoading.value = true
  tablesLoading.value = true
  try {
    const res = await dashboardService.bundle()
    const data = (res.data?.data ?? res.data ?? {}) as DashboardBundle

    statsData.value = data.stats ?? null
    courses.value = data.trending_courses ?? []
    students.value = data.recent_students ?? []
    enrollments.value = data.recent_enrollments ?? []
  } catch (err) {
    console.error('Dashboard load error', err)
  } finally {
    statsLoading.value = false
    tablesLoading.value = false
  }
}

function statusLabel(status?: string | null) {
  if (status === 'active') return 'نشط'
  if (status === 'pending') return 'معلّق'
  if (status === 'expired') return 'منتهي'
  if (status === 'cancelled') return 'ملغي'
  return status || '—'
}

function initial(name?: string | null) {
  return (name?.trim()?.charAt(0) ?? 'A').toUpperCase()
}

function formatDate(iso?: string | null) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('ar-EG', {
      month: 'short', day: 'numeric'
    })
  } catch {
    return ''
  }
}
</script>
