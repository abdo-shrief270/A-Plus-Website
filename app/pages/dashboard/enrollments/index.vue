<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ authStore.isStudent ? 'تسجيلاتي' : 'الاشتراكات' }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ subtitle }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-path"
          :loading="loading"
          @click="fetchEnrollments"
        >
          تحديث
        </UButton>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          @click="enrollOpen = true"
        >
          {{ authStore.isStudent ? 'تسجيل في كورس' : 'اشتراك جديد' }}
        </UButton>
      </div>
    </div>

    <!-- Stat strip -->
    <div
      v-if="stats"
      class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <UIcon
            name="i-heroicons-clipboard-document-check"
            class="w-5 h-5 text-primary-600"
          />
        </div>
        <div>
          <p class="text-xs text-gray-500">
            الإجمالي
          </p>
          <p class="text-lg font-bold text-gray-900">
            {{ stats.total }}
          </p>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
          <UIcon
            name="i-heroicons-check-circle"
            class="w-5 h-5 text-success-600"
          />
        </div>
        <div>
          <p class="text-xs text-gray-500">
            نشط
          </p>
          <p class="text-lg font-bold text-gray-900">
            {{ stats.active }}
          </p>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
          <UIcon
            name="i-heroicons-clock"
            class="w-5 h-5 text-warning-600"
          />
        </div>
        <div>
          <p class="text-xs text-gray-500">
            معلّق
          </p>
          <p class="text-lg font-bold text-gray-900">
            {{ stats.pending }}
          </p>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-error-50 flex items-center justify-center">
          <UIcon
            name="i-heroicons-x-circle"
            class="w-5 h-5 text-error-600"
          />
        </div>
        <div>
          <p class="text-xs text-gray-500">
            منتهي/ملغي
          </p>
          <p class="text-lg font-bold text-gray-900">
            {{ stats.inactive }}
          </p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 mb-4 shadow-sm flex flex-col sm:flex-row gap-3">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        :placeholder="authStore.isStudent ? 'ابحث باسم الكورس...' : 'ابحث باسم الكورس أو الطالب...'"
        size="lg"
        class="flex-1"
      />
      <USelect
        v-model="statusFilter"
        :items="statusOptions"
        placeholder="الحالة"
        size="lg"
        class="sm:w-48"
      />
    </div>

    <!-- Loading -->
    <div
      v-if="loading && !rows.length"
      class="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!loading && !filteredRows.length && !searchQuery && !statusFilter"
      class="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <div class="w-20 h-20 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
        <UIcon
          name="i-heroicons-clipboard-document"
          class="w-10 h-10 text-primary-500"
        />
      </div>
      <h2 class="text-lg font-bold text-gray-900 mb-2">
        {{ authStore.isStudent ? 'لم تسجّل في أي كورس بعد' : 'لا توجد اشتراكات بعد' }}
      </h2>
      <p class="text-sm text-gray-500 mb-5">
        {{ authStore.isStudent
          ? 'ابدأ بتسجيلك في كورس لتفعيل المحاضرات والمحتوى.'
          : 'ابدأ بإضافة اشتراك في كورس لأحد أبنائك.' }}
      </p>
      <UButton
        color="primary"
        size="lg"
        icon="i-heroicons-plus"
        @click="enrollOpen = true"
      >
        {{ authStore.isStudent ? 'تسجيل في كورس' : 'اشتراك جديد' }}
      </UButton>
    </div>

    <!-- No filtered results -->
    <div
      v-else-if="!loading && !filteredRows.length"
      class="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-magnifying-glass"
        class="w-10 h-10 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500">
        لا توجد نتائج مطابقة للفلاتر الحالية.
      </p>
    </div>

    <!-- Table -->
    <div
      v-else
      class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50/80 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th
                v-if="!authStore.isStudent"
                class="px-5 py-3.5 text-right font-semibold"
              >
                الطالب
              </th>
              <th class="px-5 py-3.5 text-right font-semibold">
                الكورس
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                الحالة
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                تاريخ الاشتراك
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                ينتهي في
              </th>
              <th class="px-5 py-3.5 text-right font-semibold w-1" />
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="row in filteredRows"
              :key="row.id"
              class="hover:bg-gray-50/60 transition-colors"
            >
              <!-- Student -->
              <td
                v-if="!authStore.isStudent"
                class="px-5 py-3.5 whitespace-nowrap"
              >
                <component
                  :is="row.user?.student?.id ? 'NuxtLink' : 'div'"
                  :to="row.user?.student?.id ? `/dashboard/kids/${row.user.student.id}` : undefined"
                  class="flex items-center gap-3 group"
                  :class="row.user?.student?.id ? 'cursor-pointer' : ''"
                >
                  <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {{ initial(row.user?.name) }}
                  </div>
                  <div class="min-w-0">
                    <p
                      class="font-semibold text-gray-900 truncate"
                      :class="row.user?.student?.id ? 'group-hover:text-primary-700' : ''"
                    >
                      {{ row.user?.name || '—' }}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                      @{{ row.user?.user_name || '—' }}
                    </p>
                  </div>
                </component>
              </td>

              <!-- Course -->
              <td class="px-5 py-3.5">
                <component
                  :is="row.course?.id ? 'NuxtLink' : 'div'"
                  :to="row.course?.id ? `/dashboard/courses/${row.course.id}` : undefined"
                  class="flex items-center gap-3 min-w-[200px] group"
                  :class="row.course?.id ? 'cursor-pointer' : ''"
                >
                  <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 shrink-0 overflow-hidden">
                    <img
                      v-if="row.course?.image_path"
                      :src="row.course.image_path"
                      :alt="row.course.title"
                      class="w-full h-full object-cover"
                    >
                    <UIcon
                      v-else
                      name="i-heroicons-academic-cap"
                      class="w-5 h-5"
                    />
                  </div>
                  <div class="min-w-0">
                    <p
                      class="font-semibold text-gray-900 truncate"
                      :class="row.course?.id ? 'group-hover:text-primary-700' : ''"
                    >
                      {{ row.course?.title || '—' }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ levelLabel(row.course?.level) }}
                    </p>
                  </div>
                </component>
              </td>

              <!-- Status -->
              <td class="px-5 py-3.5 whitespace-nowrap">
                <UBadge
                  :color="statusColor(row.status)"
                  variant="soft"
                  size="sm"
                >
                  {{ statusLabel(row.status) }}
                </UBadge>
              </td>

              <!-- Enrolled -->
              <td class="px-5 py-3.5 whitespace-nowrap text-gray-700">
                {{ formatDate(row.enrolled_at || row.created_at) }}
              </td>

              <!-- Expires -->
              <td class="px-5 py-3.5 whitespace-nowrap text-gray-700">
                {{ row.expires_at ? formatDate(row.expires_at) : '—' }}
              </td>

              <!-- Actions -->
              <td class="px-5 py-3.5 whitespace-nowrap text-end">
                <UDropdownMenu
                  :items="rowActions(row)"
                  :content="{ align: 'end' }"
                >
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-vertical"
                    size="xs"
                  />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="meta && meta.last_page > 1"
        class="px-4 py-3 border-t border-gray-100 flex justify-center"
      >
        <UPagination
          v-model:page="page"
          :total="meta.total"
          :items-per-page="meta.per_page"
        />
      </div>
    </div>

    <!-- Quick enroll modal (role-aware) -->
    <DashboardCoursesEnrollStudentModal
      v-if="authStore.isStudent"
      v-model:open="enrollOpen"
      :course="null"
      @enrolled="onEnrolled"
    />
    <DashboardCoursesEnrollKidsModal
      v-else
      v-model:open="enrollOpen"
      :course="null"
      @enrolled="onEnrolled"
    />
  </div>
</template>

<script setup lang="ts">
import { enrollmentsService } from '@/services/api/courses.service'
import { useAuthStore } from '@/stores/auth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  title: 'الاشتراكات'
})
useSeoMeta({ title: 'الاشتراكات | A Plus' })

const authStore = useAuthStore()
const wallet = useStudentWallet()

const rows = ref<any[]>([])
const meta = ref<{ total: number, per_page: number, last_page: number } | null>(null)
const loading = ref(true)
const page = ref(1)
const searchQuery = ref('')
const statusFilter = ref<string | null>(null)

const enrollOpen = ref(false)

const statusOptions = [
  { label: 'كل الحالات', value: null },
  { label: 'نشط', value: 'active' },
  { label: 'معلّق', value: 'pending' },
  { label: 'منتهي', value: 'expired' },
  { label: 'ملغي', value: 'cancelled' }
]

const subtitle = computed(() => {
  const total = meta.value?.total
  if (total === undefined || total === null) {
    return authStore.isStudent ? 'الكورسات التي سجّلت فيها' : 'جميع اشتراكات أبنائك في الكورسات'
  }
  if (total === 0) return 'لا توجد تسجيلات حالياً'
  return authStore.isStudent ? `${total} تسجيل` : `${total} اشتراك`
})

const stats = computed(() => {
  if (!rows.value.length) return null
  return {
    total: meta.value?.total ?? rows.value.length,
    active: rows.value.filter(r => r.status === 'active').length,
    pending: rows.value.filter(r => r.status === 'pending').length,
    inactive: rows.value.filter(r => ['expired', 'cancelled'].includes(r.status)).length
  }
})

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return rows.value.filter((r) => {
    if (statusFilter.value && r.status !== statusFilter.value) return false
    if (!q) return true
    const hay = [r.user?.name, r.user?.user_name, r.course?.title]
      .filter(Boolean).join(' ').toLowerCase()
    return hay.includes(q)
  })
})

watch(page, () => fetchEnrollments())

onMounted(() => fetchEnrollments())

async function fetchEnrollments() {
  loading.value = true
  try {
    const res = await enrollmentsService.list({ page: page.value, per_page: 20 })
    const body = res.data?.data ?? res.data
    rows.value = body?.data ?? body ?? []
    meta.value = {
      total: body?.total ?? rows.value.length,
      per_page: body?.per_page ?? 20,
      last_page: body?.last_page ?? 1
    }
  } catch (err) {
    console.error('Failed to load enrollments', err)
    rows.value = []
  } finally {
    loading.value = false
  }
}

function onEnrolled(result: { total_created: number, total_skipped: number }) {
  if (result.total_created > 0) {
    page.value = 1
    fetchEnrollments()
    if (authStore.isStudent) wallet.refresh()
  }
}

function rowActions(row: any) {
  const courseId = row.course?.id
  const studentId = row.user?.student?.id
  const items: any[] = [
    {
      label: 'عرض الكورس',
      icon: 'i-heroicons-eye',
      disabled: !courseId,
      to: courseId ? `/dashboard/courses/${courseId}` : undefined
    }
  ]
  if (!authStore.isStudent) {
    items.push({
      label: 'عرض الطالب',
      icon: 'i-heroicons-user-circle',
      disabled: !studentId,
      to: studentId ? `/dashboard/kids/${studentId}` : undefined
    })
  }
  return [items]
}

function statusColor(status: string) {
  if (status === 'active') return 'success' as const
  if (status === 'pending') return 'warning' as const
  if (status === 'expired' || status === 'cancelled') return 'error' as const
  return 'neutral' as const
}

function statusLabel(status: string) {
  if (status === 'active') return 'نشط'
  if (status === 'pending') return 'معلّق'
  if (status === 'expired') return 'منتهي'
  if (status === 'cancelled') return 'ملغي'
  return status || '—'
}

function levelLabel(level?: string) {
  if (level === 'beginner') return 'مبتدئ'
  if (level === 'intermediate') return 'متوسط'
  if (level === 'advanced') return 'متقدم'
  return level || ''
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  } catch {
    return iso
  }
}

function initial(name?: string) {
  return (name?.trim()?.charAt(0) ?? 'ط').toUpperCase()
}
</script>
