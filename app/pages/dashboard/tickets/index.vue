<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          رسائل التواصل
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
          @click="fetchTickets"
        >
          تحديث
        </UButton>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          @click="newOpen = true"
        >
          رسالة جديدة
        </UButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="ابحث في الموضوع..."
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
      v-if="loading && !tickets.length"
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
          name="i-heroicons-chat-bubble-left-right"
          class="w-10 h-10 text-primary-500"
        />
      </div>
      <h2 class="text-lg font-bold text-gray-900 mb-2">
        لا توجد رسائل بعد
      </h2>
      <p class="text-sm text-gray-500 mb-5 max-w-md mx-auto">
        إذا كان لديك أي استفسار أو مشكلة، أرسل لنا رسالة وسنرد عليك في أقرب وقت.
      </p>
      <UButton
        color="primary"
        size="lg"
        icon="i-heroicons-plus"
        @click="newOpen = true"
      >
        أرسل أول رسالة
      </UButton>
    </div>

    <!-- No filter results -->
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

    <!-- Tickets list -->
    <div
      v-else
      class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <ul class="divide-y divide-gray-100">
        <li
          v-for="t in filtered"
          :key="t.id"
        >
          <NuxtLink
            :to="`/dashboard/tickets/${t.id}`"
            class="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors group"
          >
            <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shrink-0', statusBg(t.status)]">
              <UIcon
                :name="statusIcon(t.status)"
                :class="['w-5 h-5', statusIconColor(t.status)]"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="font-bold text-gray-900 truncate group-hover:text-primary-700 transition-colors">
                  {{ t.subject || '(بدون موضوع)' }}
                </p>
                <UBadge
                  :color="statusColor(t.status)"
                  variant="soft"
                  size="sm"
                >
                  {{ statusLabel(t.status) }}
                </UBadge>
                <UBadge
                  v-if="t.category"
                  :color="categoryColor(t.category)"
                  variant="soft"
                  size="sm"
                >
                  {{ categoryLabel(t.category) }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-600 line-clamp-1 mt-1">
                {{ t.description }}
              </p>
              <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <UIcon
                    name="i-heroicons-calendar"
                    class="w-3.5 h-3.5"
                  />
                  {{ formatDate(t.last_reply_at || t.created_at) }}
                </span>
                <span
                  v-if="(t.replies_count ?? 0) > 0"
                  class="flex items-center gap-1"
                >
                  <UIcon
                    name="i-heroicons-chat-bubble-left"
                    class="w-3.5 h-3.5"
                  />
                  {{ t.replies_count }} رد
                </span>
              </div>
            </div>
            <UIcon
              name="i-heroicons-chevron-left"
              class="w-4 h-4 text-gray-400 mt-2 shrink-0 group-hover:text-primary-600"
            />
          </NuxtLink>
        </li>
      </ul>
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

    <DashboardTicketsNewTicketModal
      v-model:open="newOpen"
      @created="onCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ticketsService, type Ticket } from '@/services/api/tickets.service'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'رسائل التواصل' })
useSeoMeta({ title: 'رسائل التواصل | A Plus' })

const tickets = ref<Ticket[]>([])
const meta = ref<{ total: number, per_page: number, last_page: number } | null>(null)
const loading = ref(true)
const page = ref(1)
const searchQuery = ref('')
const statusFilter = ref<string | null>(null)
const newOpen = ref(false)

const statusOptions = [
  { label: 'كل الحالات', value: null },
  { label: 'مفتوحة', value: 'open' },
  { label: 'قيد المتابعة', value: 'pending' },
  { label: 'تم حلها', value: 'resolved' },
  { label: 'مغلقة', value: 'closed' }
]

const subtitle = computed(() => {
  const total = meta.value?.total
  if (total === undefined || total === null) return 'تواصل مع فريق الدعم وتابع الردود'
  if (total === 0) return 'لا توجد رسائل بعد'
  return `${total} رسالة`
})

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return tickets.value.filter((t) => {
    if (statusFilter.value && t.status !== statusFilter.value) return false
    if (!q) return true
    return [t.subject, t.description].some(s => (s || '').toLowerCase().includes(q))
  })
})

watch(page, () => fetchTickets())

onMounted(() => fetchTickets())

async function fetchTickets() {
  loading.value = true
  try {
    const res = await ticketsService.list({ page: page.value, per_page: 15 })
    const body = res.data?.data ?? res.data
    tickets.value = body?.data ?? body ?? []
    meta.value = body?.meta ?? {
      total: body?.total ?? tickets.value.length,
      per_page: body?.per_page ?? 15,
      last_page: body?.last_page ?? 1
    }
  } catch (err) {
    console.error('Failed to load tickets', err)
    tickets.value = []
  } finally {
    loading.value = false
  }
}

function onCreated(ticket: { id?: number } | null) {
  if (ticket?.id) {
    navigateTo(`/dashboard/tickets/${ticket.id}`)
  } else {
    page.value = 1
    fetchTickets()
  }
}

function statusLabel(s: string) {
  return ({ open: 'مفتوحة', pending: 'قيد المتابعة', resolved: 'تم حلها', closed: 'مغلقة' })[s] || s
}
function statusColor(s: string) {
  if (s === 'open') return 'primary' as const
  if (s === 'pending') return 'warning' as const
  if (s === 'resolved') return 'success' as const
  if (s === 'closed') return 'neutral' as const
  return 'neutral' as const
}
function statusBg(s: string) {
  if (s === 'open') return 'bg-primary-50'
  if (s === 'pending') return 'bg-warning-50'
  if (s === 'resolved') return 'bg-success-50'
  return 'bg-gray-100'
}
function statusIcon(s: string) {
  if (s === 'open') return 'i-heroicons-chat-bubble-left'
  if (s === 'pending') return 'i-heroicons-clock'
  if (s === 'resolved') return 'i-heroicons-check-circle'
  return 'i-heroicons-archive-box'
}
function statusIconColor(s: string) {
  if (s === 'open') return 'text-primary-600'
  if (s === 'pending') return 'text-warning-600'
  if (s === 'resolved') return 'text-success-600'
  return 'text-gray-500'
}
function categoryLabel(c: string) {
  const labels: Record<string, string> = {
    inquiry: 'استفسار',
    complaint: 'شكوى',
    suggestion: 'اقتراح',
    technical: 'مشكلة تقنية',
    billing: 'الدفع والفواتير',
    question_report: 'الإبلاغ عن سؤال',
    other: 'أخرى'
  }
  return labels[c] || c
}
function categoryColor(c: string) {
  if (c === 'complaint') return 'error' as const
  if (c === 'suggestion') return 'success' as const
  if (c === 'technical') return 'warning' as const
  if (c === 'billing') return 'info' as const
  if (c === 'other') return 'neutral' as const
  return 'primary' as const
}
function formatDate(iso?: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return iso }
}
</script>
