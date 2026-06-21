<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          سجل المدفوعات
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ subtitle }}
        </p>
      </div>
      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-path"
        :loading="loading"
        @click="fetchPayments"
      >
        تحديث
      </UButton>
    </div>

    <!-- Stat cards -->
    <div
      v-if="stats"
      class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
          <UIcon
            name="i-heroicons-check-circle"
            class="w-5 h-5 text-success-600"
          />
        </div>
        <div>
          <p class="text-xs text-gray-500">
            مدفوع
          </p>
          <p class="text-lg font-bold text-gray-900">
            {{ formatAmount(stats.paid) }} ر.س
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
            قيد الدفع
          </p>
          <p class="text-lg font-bold text-gray-900">
            {{ formatAmount(stats.pending) }} ر.س
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
            ملغي/فاشل
          </p>
          <p class="text-lg font-bold text-gray-900">
            {{ stats.failedCount }}
          </p>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <UIcon
            name="i-heroicons-receipt-percent"
            class="w-5 h-5 text-primary-600"
          />
        </div>
        <div>
          <p class="text-xs text-gray-500">
            إجمالي العمليات
          </p>
          <p class="text-lg font-bold text-gray-900">
            {{ stats.total }}
          </p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 mb-4 shadow-sm flex flex-col sm:flex-row gap-3">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="ابحث برقم العملية أو الوصف..."
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
      v-if="loading && !payments.length"
      class="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!loading && !filtered.length && !searchQuery && !statusFilter"
      class="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <div class="w-20 h-20 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
        <UIcon
          name="i-heroicons-credit-card"
          class="w-10 h-10 text-primary-500"
        />
      </div>
      <h2 class="text-lg font-bold text-gray-900 mb-2">
        لا توجد عمليات دفع بعد
      </h2>
      <p class="text-sm text-gray-500">
        ستظهر هنا أي عملية دفع تتم لكورس أو باقة.
      </p>
    </div>

    <!-- No results -->
    <div
      v-else-if="!loading && !filtered.length"
      class="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-magnifying-glass"
        class="w-10 h-10 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500">
        لا توجد نتائج مطابقة.
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
              <th class="px-5 py-3.5 text-right font-semibold">
                المعاملة
              </th>
              <th class="px-5 py-3.5 text-right font-semibold">
                الوصف
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                المبلغ
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                طريقة الدفع
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                الحالة
              </th>
              <th class="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                التاريخ
              </th>
              <th class="px-5 py-3.5 text-right font-semibold w-1" />
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="p in filtered"
              :key="p.id"
              class="hover:bg-gray-50/60 transition-colors"
            >
              <td class="px-5 py-3.5 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div :class="['w-9 h-9 rounded-lg flex items-center justify-center shrink-0', kindBg(p.kind)]">
                    <UIcon
                      :name="kindIcon(p.kind)"
                      :class="['w-4 h-4', kindColor(p.kind)]"
                    />
                  </div>
                  <span
                    class="text-xs font-mono text-gray-700"
                    dir="ltr"
                  >
                    {{ p.transaction_id }}
                  </span>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <p class="font-semibold text-gray-900 truncate max-w-[280px]">
                  {{ p.description || '—' }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ kindLabel(p.kind) }}
                </p>
              </td>
              <td class="px-5 py-3.5 whitespace-nowrap font-bold text-gray-900">
                {{ formatAmount(p.amount) }} {{ p.currency || 'SAR' }}
              </td>
              <td class="px-5 py-3.5 whitespace-nowrap text-gray-700 capitalize">
                {{ methodLabel(p.payment_method) }}
              </td>
              <td class="px-5 py-3.5 whitespace-nowrap">
                <UBadge
                  :color="statusColor(p.status)"
                  variant="soft"
                  size="sm"
                >
                  {{ statusLabel(p.status) }}
                </UBadge>
              </td>
              <td class="px-5 py-3.5 whitespace-nowrap text-gray-700">
                {{ formatDate(p.paid_at || p.created_at) }}
              </td>
              <td class="px-5 py-3.5 whitespace-nowrap text-end">
                <UButton
                  v-if="p.status === 'pending'"
                  color="primary"
                  size="xs"
                  icon="i-heroicons-credit-card"
                  @click="openCheckout(p)"
                >
                  ادفع الآن
                </UButton>
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

    <!-- Resume checkout -->
    <DashboardPaymentsCheckoutModal
      v-model:open="checkoutOpen"
      :payment="resumePayment"
      @paid="onPaid"
      @cancelled="onCancelled"
    />
  </div>
</template>

<script setup lang="ts">
import { paymentsService, type Payment } from '@/services/api/payments.service'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'سجل المدفوعات' })
useSeoMeta({ title: 'سجل المدفوعات | A Plus' })

const payments = ref<Payment[]>([])
const meta = ref<{ total: number, per_page: number, last_page: number } | null>(null)
const loading = ref(true)
const page = ref(1)
const searchQuery = ref('')
const statusFilter = ref<string | null>(null)
const checkoutOpen = ref(false)
const resumePayment = ref<Payment | null>(null)

const statusOptions = [
  { label: 'كل الحالات', value: null },
  { label: 'قيد الدفع', value: 'pending' },
  { label: 'مدفوع', value: 'paid' },
  { label: 'فاشل', value: 'failed' },
  { label: 'مسترد', value: 'refunded' }
]

const subtitle = computed(() => {
  const total = meta.value?.total
  if (total === undefined || total === null) return 'كل عمليات الدفع التي قمت بها'
  if (total === 0) return 'لا توجد عمليات دفع بعد'
  return `${total} عملية`
})

const stats = computed(() => {
  if (!payments.value.length) return null
  const paid = payments.value.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount || 0), 0)
  const pending = payments.value.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount || 0), 0)
  const failedCount = payments.value.filter(p => p.status === 'failed').length
  return {
    total: meta.value?.total ?? payments.value.length,
    paid,
    pending,
    failedCount
  }
})

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return payments.value.filter((p) => {
    if (statusFilter.value && p.status !== statusFilter.value) return false
    if (!q) return true
    return [p.transaction_id, p.description, p.payment_method].some(s => (s || '').toLowerCase().includes(q))
  })
})

watch(page, () => fetchPayments())
onMounted(() => fetchPayments())

async function fetchPayments() {
  loading.value = true
  try {
    const res = await paymentsService.list({ page: page.value, per_page: 15 })
    const body = res.data?.data ?? res.data
    payments.value = body?.data ?? body ?? []
    meta.value = body?.meta ?? {
      total: body?.total ?? payments.value.length,
      per_page: body?.per_page ?? 15,
      last_page: body?.last_page ?? 1
    }
  } catch (err) {
    console.error('Failed to load payments', err)
    payments.value = []
  } finally {
    loading.value = false
  }
}

function openCheckout(p: Payment) {
  resumePayment.value = p
  checkoutOpen.value = true
}

function onPaid() {
  fetchPayments()
}
function onCancelled() {
  fetchPayments()
}

function statusLabel(s: string) {
  return ({ pending: 'قيد الدفع', paid: 'مدفوع', failed: 'فاشل', refunded: 'مسترد' } as Record<string, string>)[s] || s
}
function statusColor(s: string) {
  if (s === 'paid') return 'success' as const
  if (s === 'pending') return 'warning' as const
  if (s === 'failed') return 'error' as const
  if (s === 'refunded') return 'info' as const
  return 'neutral' as const
}
function kindLabel(k: string) {
  if (k === 'enrollment') return 'اشتراك في كورس'
  if (k === 'subscription') return 'اشتراك في باقة'
  return 'أخرى'
}
function kindIcon(k: string) {
  if (k === 'enrollment') return 'i-heroicons-academic-cap'
  if (k === 'subscription') return 'i-heroicons-credit-card'
  return 'i-heroicons-receipt-percent'
}
function kindBg(k: string) {
  if (k === 'enrollment') return 'bg-primary-50'
  if (k === 'subscription') return 'bg-secondary-50'
  return 'bg-gray-100'
}
function kindColor(k: string) {
  if (k === 'enrollment') return 'text-primary-600'
  if (k === 'subscription') return 'text-secondary-600'
  return 'text-gray-500'
}
function methodLabel(m: string | null) {
  if (!m || m === 'pending') return 'بانتظار الاختيار'
  if (m === 'visa') return 'Visa / Mastercard'
  if (m === 'mada') return 'مدى'
  if (m === 'apple_pay') return 'Apple Pay'
  if (m === 'wallet') return 'محفظة إلكترونية'
  if (m === 'mock') return 'تجريبي'
  return m
}
function formatAmount(n?: number | null) {
  if (n == null) return '0'
  return new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n)
}
function formatDate(iso?: string | null) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return iso }
}
</script>
