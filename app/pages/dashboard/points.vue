<template>
  <div
    dir="rtl"
    class="space-y-6"
  >
    <!-- Header / balance -->
    <div class="rounded-2xl bg-gradient-to-l from-primary-700 to-primary-500 p-6 text-white shadow-sm">
      <p class="text-sm text-primary-100">
        رصيد النقاط الحالي
      </p>
      <p class="mt-1 text-4xl font-extrabold">
        {{ formatNumber(currentBalance) }}
        <span class="text-lg font-bold text-primary-100">نقطة</span>
      </p>
    </div>

    <div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 class="text-base font-bold text-gray-900">
          سجل النقاط
        </h2>
        <UButton
          icon="i-heroicons-arrow-path"
          color="neutral"
          variant="ghost"
          size="sm"
          :loading="loading"
          @click="load(1)"
        />
      </div>

      <div
        v-if="loading && !rows.length"
        class="py-12 text-center text-gray-400"
      >
        جارٍ التحميل…
      </div>
      <div
        v-else-if="!rows.length"
        class="py-12 text-center text-gray-500"
      >
        لا توجد حركات على رصيدك بعد
      </div>

      <ul
        v-else
        class="divide-y divide-gray-100"
      >
        <li
          v-for="t in rows"
          :key="t.id"
          class="flex items-center justify-between gap-3 px-6 py-4"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              :class="t.direction === 'credit' ? 'bg-success-50 text-success-600' : 'bg-error-50 text-error-600'"
            >
              <UIcon
                :name="t.direction === 'credit' ? 'i-heroicons-arrow-down-left' : 'i-heroicons-arrow-up-right'"
                class="h-5 w-5"
              />
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-gray-900">
                {{ typeLabel(t.type) }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatDate(t.created_at) }}
              </p>
            </div>
          </div>
          <div class="text-left">
            <p
              class="font-bold"
              :class="t.direction === 'credit' ? 'text-success-600' : 'text-error-600'"
            >
              {{ t.direction === 'credit' ? '+' : '' }}{{ formatNumber(t.amount) }}
            </p>
            <p
              v-if="t.running_balance != null"
              class="text-xs text-gray-400"
            >
              الرصيد: {{ formatNumber(t.running_balance) }}
            </p>
          </div>
        </li>
      </ul>

      <div
        v-if="pagination && pagination.last_page > 1"
        class="flex items-center justify-between border-t border-gray-100 px-6 py-3"
      >
        <UButton
          size="sm"
          variant="soft"
          color="neutral"
          icon="i-heroicons-chevron-right"
          :disabled="page <= 1 || loading"
          @click="load(page - 1)"
        />
        <span class="text-sm text-gray-500">صفحة {{ page }} من {{ pagination.last_page }}</span>
        <UButton
          size="sm"
          variant="soft"
          color="neutral"
          icon="i-heroicons-chevron-left"
          :disabled="page >= pagination.last_page || loading"
          @click="load(page + 1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { walletService } from '@/services/api/wallet.service'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'سجل النقاط' })

interface Tx {
  id: number
  amount: number
  direction: 'credit' | 'debit'
  type: string
  reference_type?: string | null
  running_balance?: number | null
  created_at?: string
}
interface Pagination { current_page: number, per_page: number, total: number, last_page: number }

const rows = ref<Tx[]>([])
const currentBalance = ref(0)
const pagination = ref<Pagination | null>(null)
const page = ref(1)
const loading = ref(true)

const TYPE_LABELS: Record<string, string> = {
  subscription_grant: 'نقاط اشتراك',
  pack_purchase: 'شراء باقة نقاط',
  question_answer: 'حلّ سؤال',
  content_view: 'فتح محتوى',
  deposit: 'إيداع',
  withdraw: 'سحب'
}

function typeLabel(type: string) {
  return TYPE_LABELS[type] ?? type
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('ar-EG').format(n ?? 0)
}

function formatDate(d?: string) {
  if (!d) return ''
  return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(new Date(d))
}

async function load(p = 1) {
  loading.value = true
  try {
    const res = await walletService.transactions({ page: p, per_page: 20 })
    const data = res.data?.data ?? res.data ?? {}
    rows.value = data.data ?? []
    currentBalance.value = data.current_balance ?? 0
    pagination.value = data.meta ?? null
    page.value = data.meta?.current_page ?? p
  } catch (err) {
    console.error('Failed to load points history', err)
    rows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))
</script>
