<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          الاشتراكات
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
          @click="fetchSubs"
        >
          تحديث
        </UButton>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          @click="subOpen = true"
        >
          اشتراك جديد
        </UButton>
      </div>
    </div>

    <!-- Stat strip — student version (points-focused) -->
    <div
      v-if="authStore.isStudent"
      class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      <!-- Points -->
      <div class="bg-gradient-to-l from-secondary-50 to-primary-50 rounded-2xl border border-primary-100 p-4 shadow-sm flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
          <UIcon
            :name="walletState.hasUnlimited ? 'i-heroicons-sparkles' : 'i-heroicons-star'"
            :class="['w-5 h-5', walletState.hasUnlimited ? 'text-secondary-600' : 'text-primary-600']"
          />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500">
            نقاطك
          </p>
          <p class="text-lg font-bold text-gray-900 flex items-center gap-1">
            <UIcon
              v-if="walletState.hasUnlimited"
              name="i-mdi-infinity"
              class="w-5 h-5 text-secondary-600"
            />
            <span v-else>
              {{ formatNumber(walletState.points) }}
            </span>
          </p>
        </div>
      </div>

      <!-- Active subscription plan -->
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-success-50 flex items-center justify-center">
          <UIcon
            name="i-heroicons-calendar-days"
            class="w-5 h-5 text-success-600"
          />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500">
            الباقة الحالية
          </p>
          <p class="text-sm font-bold text-gray-900 truncate">
            {{ walletState.activeSubscription?.plan?.name || 'لا يوجد اشتراك نشط' }}
          </p>
        </div>
      </div>

      <!-- Days remaining -->
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-warning-50 flex items-center justify-center">
          <UIcon
            name="i-heroicons-clock"
            class="w-5 h-5 text-warning-600"
          />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500">
            متبقّي على الانتهاء
          </p>
          <p class="text-lg font-bold text-gray-900">
            {{ daysRemaining ?? '—' }}
            <span
              v-if="daysRemaining !== null"
              class="text-xs font-medium text-gray-500"
            >
              يوم
            </span>
          </p>
        </div>
      </div>

      <!-- Active packs -->
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-secondary-50 flex items-center justify-center">
          <UIcon
            name="i-heroicons-gift"
            class="w-5 h-5 text-secondary-600"
          />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500">
            حزم النقاط النشطة
          </p>
          <p class="text-lg font-bold text-gray-900">
            {{ walletState.activePackCount }}
          </p>
        </div>
      </div>
    </div>

    <!-- Stat strip — parent/school version -->
    <div
      v-else-if="stats"
      class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <UIcon
            name="i-heroicons-credit-card"
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
            ينتهي قريباً
          </p>
          <p class="text-lg font-bold text-gray-900">
            {{ stats.expiringSoon }}
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
        :placeholder="authStore.isStudent ? 'ابحث باسم الباقة...' : 'ابحث باسم الباقة أو الطالب...'"
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
          name="i-heroicons-credit-card"
          class="w-10 h-10 text-primary-500"
        />
      </div>
      <h2 class="text-lg font-bold text-gray-900 mb-2">
        {{ authStore.isStudent ? 'لم تشترك في أي باقة بعد' : 'لا توجد اشتراكات بعد' }}
      </h2>
      <p class="text-sm text-gray-500 mb-5">
        {{ authStore.isStudent ? 'ابدأ باشتراكك في باقة لتفعيل المزايا.' : 'ابدأ بإضافة اشتراك في باقة لأحد أبنائك.' }}
      </p>
      <UButton
        color="primary"
        size="lg"
        icon="i-heroicons-plus"
        @click="subOpen = true"
      >
        اشتراك جديد
      </UButton>
    </div>

    <!-- No results -->
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
                الباقة
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                النوع
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                الحالة
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                يبدأ
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                ينتهي
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                النقاط
              </th>
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
                  :is="row.student?.id ? 'NuxtLink' : 'div'"
                  :to="row.student?.id ? `/dashboard/kids/${row.student.id}` : undefined"
                  class="flex items-center gap-3 group"
                  :class="row.student?.id ? 'cursor-pointer' : ''"
                >
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    :class="row.student?.gender === 'female'
                      ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                      : 'bg-gradient-to-br from-primary-500 to-primary-700'"
                  >
                    {{ initial(row.student?.name) }}
                  </div>
                  <div class="min-w-0">
                    <p
                      class="font-semibold text-gray-900 truncate"
                      :class="row.student?.id ? 'group-hover:text-primary-700' : ''"
                    >
                      {{ row.student?.name || '—' }}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                      @{{ row.student?.user_name || '—' }}
                    </p>
                  </div>
                </component>
              </td>

              <!-- Plan -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3 min-w-[200px]">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                    :class="row.plan?.type === 'subscription' ? 'bg-primary-500' : 'bg-secondary-500'"
                  >
                    <UIcon
                      :name="row.plan?.type === 'subscription' ? 'i-heroicons-calendar-days' : 'i-heroicons-gift'"
                      class="w-5 h-5"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-gray-900 truncate">
                      {{ row.plan?.name || '—' }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ row.plan?.price ? `${row.plan.price} ر.س` : '—' }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Type -->
              <td class="px-5 py-3.5 whitespace-nowrap">
                <UBadge
                  :color="row.plan?.type === 'subscription' ? 'primary' : 'secondary'"
                  variant="soft"
                  size="sm"
                >
                  {{ planTypeLabel(row.plan?.type) }}
                </UBadge>
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

              <td class="px-5 py-3.5 whitespace-nowrap text-gray-700">
                {{ formatDate(row.starts_at) }}
              </td>

              <td class="px-5 py-3.5 whitespace-nowrap text-gray-700">
                {{ row.ends_at ? formatDate(row.ends_at) : 'مفتوح' }}
              </td>

              <td class="px-5 py-3.5 whitespace-nowrap text-gray-900 font-bold">
                {{ formatNumber(row.plan?.points || 0) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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

    <DashboardSubscriptionsSubscribeStudentModal
      v-if="authStore.isStudent"
      v-model:open="subOpen"
      :plan="null"
      @subscribed="onSubscribed"
    />
    <DashboardSubscriptionsSubscribeKidsModal
      v-else
      v-model:open="subOpen"
      :plan="null"
      @subscribed="onSubscribed"
    />
  </div>
</template>

<script setup lang="ts">
import { subscriptionsService } from '@/services/api/plans.service'
import { useAuthStore } from '@/stores/auth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  title: 'الاشتراكات'
})
useSeoMeta({ title: 'الاشتراكات | A Plus' })

const authStore = useAuthStore()
const wallet = useStudentWallet()
const walletState = wallet.state

const daysRemaining = computed<number | null>(() => {
  const ends = walletState.value.activeSubscription?.ends_at
  if (!ends) return null
  const ms = new Date(ends).getTime() - Date.now()
  if (Number.isNaN(ms)) return null
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
})

interface SubscriptionRow {
  id: number
  status: string
  starts_at?: string
  ends_at?: string | null
  student?: {
    id?: number
    name?: string
    user_name?: string
    gender?: 'male' | 'female' | string
  } | null
  plan?: {
    name?: string
    type?: string
    price?: number | string
    points?: number
  } | null
  [key: string]: unknown
}

const rows = ref<SubscriptionRow[]>([])
const meta = ref<{ total: number, per_page: number, last_page: number } | null>(null)
const loading = ref(true)
const page = ref(1)
const searchQuery = ref('')
const statusFilter = ref<string | null>(null)

const subOpen = ref(false)

const statusOptions = [
  { label: 'كل الحالات', value: null },
  { label: 'نشط', value: 'active' },
  { label: 'بانتظار التفعيل', value: 'pending' },
  { label: 'منتهي', value: 'expired' },
  { label: 'ملغي', value: 'cancelled' }
]

const subtitle = computed(() => {
  const total = meta.value?.total
  if (total === undefined || total === null) {
    return authStore.isStudent ? 'اشتراكاتك الحالية في الباقات' : 'اشتراكات أبنائك في الباقات'
  }
  if (total === 0) return 'لا توجد اشتراكات حالياً'
  return `${total} اشتراك`
})

const stats = computed(() => {
  if (!rows.value.length) return null
  const now = Date.now()
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  return {
    total: meta.value?.total ?? rows.value.length,
    active: rows.value.filter(r => r.status === 'active').length,
    expiringSoon: rows.value.filter((r) => {
      if (r.status !== 'active' || !r.ends_at) return false
      const ts = new Date(r.ends_at).getTime()
      return ts - now > 0 && ts - now <= sevenDays
    }).length,
    inactive: rows.value.filter(r => ['expired', 'cancelled'].includes(r.status)).length
  }
})

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return rows.value.filter((r) => {
    if (statusFilter.value && r.status !== statusFilter.value) return false
    if (!q) return true
    const hay = [r.student?.name, r.student?.user_name, r.plan?.name]
      .filter(Boolean).join(' ').toLowerCase()
    return hay.includes(q)
  })
})

watch(page, () => fetchSubs())

onMounted(() => {
  fetchSubs()
  if (authStore.isStudent) wallet.refresh()
})

async function fetchSubs() {
  loading.value = true
  try {
    const res = await subscriptionsService.list({ page: page.value, per_page: 20 })
    const body = res.data?.data ?? res.data
    rows.value = (body?.data ?? body ?? []) as SubscriptionRow[]
    meta.value = body?.meta ?? {
      total: body?.total ?? rows.value.length,
      per_page: body?.per_page ?? 20,
      last_page: body?.last_page ?? 1
    }
  } catch (err) {
    console.error('Failed to load subscriptions', err)
    rows.value = []
  } finally {
    loading.value = false
  }
}

function onSubscribed(result: { total_created: number, total_skipped: number }) {
  if (result.total_created > 0) {
    page.value = 1
    fetchSubs()
    if (authStore.isStudent) wallet.refresh()
  }
}

function statusColor(status: string) {
  if (status === 'active') return 'success' as const
  if (status === 'pending') return 'warning' as const
  if (status === 'expired') return 'error' as const
  if (status === 'cancelled') return 'error' as const
  return 'neutral' as const
}

function statusLabel(status: string) {
  if (status === 'active') return 'نشط'
  if (status === 'pending') return 'بانتظار التفعيل'
  if (status === 'expired') return 'منتهي'
  if (status === 'cancelled') return 'ملغي'
  return status || '—'
}

function planTypeLabel(type?: string) {
  if (type === 'subscription') return 'اشتراك'
  if (type === 'pack') return 'حزمة نقاط'
  return '—'
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

function formatNumber(n: number) {
  return new Intl.NumberFormat('ar-EG').format(n)
}

function initial(name?: string) {
  return (name?.trim()?.charAt(0) ?? 'ط').toUpperCase()
}
</script>
