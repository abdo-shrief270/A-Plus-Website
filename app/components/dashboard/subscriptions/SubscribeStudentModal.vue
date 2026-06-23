<template>
  <UModal
    :open="open"
    :ui="{ content: 'sm:max-w-lg' }"
    @update:open="onOpenChange"
  >
    <template #content>
      <div class="bg-white rounded-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-credit-card"
                class="w-5 h-5 text-secondary-600"
              />
            </div>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-gray-900 truncate">
                اشتراك جديد
              </h3>
              <p class="text-xs text-gray-500 truncate">
                {{ effectiveplan?.name || 'اختر الباقة المناسبة' }}
              </p>
            </div>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="sm"
            :disabled="submitting"
            @click="onOpenChange(false)"
          />
        </div>

        <div class="px-6 py-5 space-y-5">
          <!-- Plan picker -->
          <div v-if="!plan">
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              اختر الباقة <span class="text-error-500">*</span>
            </label>
            <USelect
              v-model="pickedPlanIdModel"
              :items="planOptions"
              :loading="plansLoading"
              :disabled="plansLoading || submitting"
              placeholder="اختر الباقة"
              size="lg"
            />
          </div>

          <!-- Plan summary -->
          <div
            v-if="effectiveplan"
            class="bg-gradient-to-l from-secondary-50 to-primary-50 rounded-xl p-4 border border-secondary-100"
          >
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 rounded-lg bg-secondary-500 flex items-center justify-center text-white shrink-0">
                <UIcon
                  :name="effectiveplan.type === 'subscription' ? 'i-heroicons-calendar-days' : 'i-heroicons-gift'"
                  class="w-6 h-6"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 truncate">
                  {{ effectiveplan.name }}
                </p>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-600">
                  <span class="flex items-center gap-1">
                    <UIcon
                      name="i-heroicons-star"
                      class="w-3.5 h-3.5"
                    />
                    {{ formatNumber(effectiveplan.points || 0) }} نقطة
                  </span>
                  <span
                    v-if="effectiveplan.duration_days"
                    class="flex items-center gap-1"
                  >
                    <UIcon
                      name="i-heroicons-clock"
                      class="w-3.5 h-3.5"
                    />
                    {{ effectiveplan.duration_days }} يوم
                  </span>
                  <span class="font-semibold text-primary-700">
                    {{ effectiveplan.price }} ر.س
                  </span>
                </div>
              </div>
              <UBadge
                :color="effectiveplan.type === 'subscription' ? 'primary' : 'secondary'"
                variant="solid"
                size="sm"
              >
                {{ effectiveplan.type === 'subscription' ? 'اشتراك' : 'حزمة نقاط' }}
              </UBadge>
            </div>
          </div>

          <!-- Conflict warning -->
          <div
            v-if="effectiveplan?.type === 'subscription' && hasActiveSubscription"
            class="rounded-xl border border-warning-200 bg-warning-50/60 p-4 flex items-start gap-3"
          >
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-5 h-5 text-warning-600 shrink-0 mt-0.5"
            />
            <div class="text-sm text-gray-700">
              لديك بالفعل اشتراك نشط في باقة شهرية / فصلية / سنوية. لا يمكنك الاشتراك في أكثر من باقة اشتراك في نفس الوقت. يمكنك مع ذلك شراء حزم النقاط.
            </div>
          </div>

          <!-- Result -->
          <div
            v-if="result"
            class="rounded-xl border p-4 space-y-2"
            :class="result.total_skipped > 0
              ? 'bg-warning-50/60 border-warning-200'
              : 'bg-success-50/60 border-success-200'"
          >
            <p class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <UIcon
                :name="result.total_skipped > 0 ? 'i-heroicons-exclamation-circle' : 'i-heroicons-check-circle'"
                class="w-5 h-5"
                :class="result.total_skipped > 0 ? 'text-warning-600' : 'text-success-600'"
              />
              {{ result.total_skipped > 0 ? 'تعذّر إنشاء الاشتراك' : 'تم إنشاء الاشتراك بنجاح' }}
            </p>
            <p
              v-if="result.total_created > 0"
              class="text-xs text-gray-700"
            >
              تم إنشاء اشتراكك. تابع عملية الدفع لإكمال التفعيل.
            </p>
            <p
              v-else
              class="text-xs text-gray-700"
            >
              لم يتم إنشاء الاشتراك. تحقق من حالة اشتراكاتك الحالية.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="submitting"
            @click="onOpenChange(false)"
          >
            {{ result ? 'إغلاق' : 'إلغاء' }}
          </UButton>
          <UButton
            v-if="!result"
            color="primary"
            icon="i-heroicons-check"
            :loading="submitting"
            :disabled="!canSubmit"
            @click="submit"
          >
            تأكيد الاشتراك
          </UButton>
        </div>
      </div>
    </template>
  </UModal>

  <DashboardPaymentsCheckoutModal
    v-model:open="checkoutOpen"
    :payment="pendingPayment"
    @paid="onPaid"
    @cancelled="onCancelled"
  />
</template>

<script setup lang="ts">
import { plansService, subscriptionsService } from '@/services/api/plans.service'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

interface PlanSummary {
  id: number
  name: string
  type?: string
  price?: number
  points?: number
  duration_days?: number
  [key: string]: unknown
}

interface SubscriptionRecord {
  status?: string
  plan?: { type?: string }
  [key: string]: unknown
}

interface PendingPayment {
  id: number
  amount: number
  currency?: string
  description?: string
  transaction_id?: string
  kind?: string
}

const props = defineProps<{
  open: boolean
  plan: PlanSummary | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'subscribed': [result: { total_created: number, total_skipped: number }]
}>()

const plans = ref<PlanSummary[]>([])
const plansLoading = ref(false)
const pickedPlanId = ref<number | null>(null)

const subs = ref<SubscriptionRecord[]>([])
const submitting = ref(false)
const result = ref<{ total_created: number, total_skipped: number } | null>(null)

const checkoutOpen = ref(false)
const pendingPayment = ref<PendingPayment | null>(null)

const studentId = computed<number | null>(() => {
  const user = authStore.getUser as { student?: { id?: number } } | null
  return user?.student?.id ?? null
})

const planOptions = computed(() =>
  plans.value.map(p => ({
    label: `${p.name} — ${p.price} ر.س`,
    value: p.id
  }))
)

const pickedPlanIdModel = computed<number | undefined>({
  get: () => pickedPlanId.value ?? undefined,
  set: (val) => { pickedPlanId.value = val ?? null }
})

const effectiveplan = computed(() => {
  if (props.plan) return props.plan
  return plans.value.find(p => p.id === pickedPlanId.value) ?? null
})

const hasActiveSubscription = computed(() =>
  subs.value.some(s => s.status === 'active' && s.plan?.type === 'subscription')
)

const canSubmit = computed(() => {
  if (!effectiveplan.value?.id || !studentId.value || submitting.value) return false
  if (effectiveplan.value.type === 'subscription' && hasActiveSubscription.value) return false
  return true
})

const onOpenChange = (val: boolean) => {
  if (submitting.value) return
  emit('update:open', val)
  if (!val) reset()
}

function reset() {
  result.value = null
  if (!props.plan) pickedPlanId.value = null
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('ar-EG').format(n)
}

async function loadPlans() {
  if (plans.value.length) return
  plansLoading.value = true
  try {
    const res = await plansService.list({ per_page: 100 })
    const body = res.data?.data ?? res.data
    plans.value = Array.isArray(body) ? body : (body?.data ?? [])
  } catch (err) {
    console.error('Failed to load plans', err)
  } finally {
    plansLoading.value = false
  }
}

async function loadSubs() {
  try {
    const res = await subscriptionsService.list({ per_page: 100 })
    const body = res.data?.data ?? res.data
    subs.value = Array.isArray(body) ? body : (body?.data ?? [])
  } catch (err) {
    console.error('Failed to load subs', err)
    subs.value = []
  }
}

async function submit() {
  if (!canSubmit.value || !effectiveplan.value?.id || !studentId.value) return
  submitting.value = true
  try {
    const res = await subscriptionsService.create({
      plan_id: effectiveplan.value.id,
      student_ids: [studentId.value]
    })
    const data = res.data?.data ?? res.data
    result.value = {
      total_created: data.total_created ?? 0,
      total_skipped: data.total_skipped ?? 0
    }
    if (data.requires_payment && data.payment) {
      pendingPayment.value = {
        ...data.payment,
        description: 'اشتراك في باقة: ' + (effectiveplan.value.name ?? ''),
        kind: 'subscription'
      }
      checkoutOpen.value = true
    }
    emit('subscribed', result.value)
  } catch (err) {
    console.error('Subscribe failed', err)
  } finally {
    submitting.value = false
  }
}

function onPaid() {
  loadSubs()
}
function onCancelled() {
  loadSubs()
}

watch(() => props.open, async (val) => {
  if (val) {
    reset()
    // If the cached user blob predates the login fix, fetch /me so student.id is available.
    if (!studentId.value) {
      await authStore.refreshUser()
    }
    loadSubs()
    if (!props.plan) loadPlans()
  }
})
</script>
