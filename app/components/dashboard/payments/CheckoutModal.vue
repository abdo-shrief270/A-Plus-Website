<template>
  <UModal
    :open="open"
    :ui="{ content: 'sm:max-w-lg' }"
    @update:open="onOpenChange"
  >
    <template #content>
      <div class="bg-white rounded-2xl">
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
                {{ paymentsEnabled ? 'إتمام الدفع' : 'تأكيد الطلب' }}
              </h3>
              <p class="text-xs text-gray-500 truncate">
                {{ payment?.description || 'معاملة دفع' }}
              </p>
            </div>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="sm"
            :disabled="busy"
            @click="onOpenChange(false)"
          />
        </div>

        <!-- Pending admin approval (payment gateways disabled) -->
        <div
          v-if="step === 'pending'"
          class="px-6 py-8 text-center"
        >
          <div class="w-16 h-16 mx-auto rounded-2xl bg-warning-50 flex items-center justify-center mb-4">
            <UIcon
              name="i-heroicons-clock"
              class="w-9 h-9 text-warning-600"
            />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">
            تم استلام طلبك
          </h3>
          <p class="text-sm text-gray-500 mb-4 leading-relaxed">
            سيتم تفعيل {{ payment?.kind === 'subscription' ? 'اشتراكك' : 'طلبك' }}
            من قبل الإدارة بعد إتمام الدفع. ستصلك إشعار عند التفعيل.
          </p>
          <div class="bg-gradient-to-l from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100 inline-block">
            <p class="text-xs text-gray-600 mb-1">
              المبلغ المستحق
            </p>
            <p class="text-2xl font-bold text-primary-700">
              {{ formatAmount(payment?.amount) }} <span class="text-sm font-semibold">{{ payment?.currency || 'SAR' }}</span>
            </p>
          </div>
        </div>

        <div
          v-else-if="step === 'pay'"
          class="px-6 py-5 space-y-5"
        >
          <!-- Order summary -->
          <div class="bg-gradient-to-l from-primary-50 to-secondary-50 rounded-xl p-5 border border-primary-100">
            <p class="text-xs text-gray-600 mb-1">
              المبلغ المطلوب
            </p>
            <p class="text-3xl font-bold text-primary-700">
              {{ formatAmount(payment?.amount) }} <span class="text-base font-semibold">{{ payment?.currency || 'SAR' }}</span>
            </p>
            <p
              v-if="payment?.transaction_id"
              class="text-[11px] text-gray-500 mt-2 font-mono"
              dir="ltr"
            >
              {{ payment.transaction_id }}
            </p>
          </div>

          <!-- Payment method -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              اختر طريقة الدفع
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="m in methods"
                :key="m.value"
                type="button"
                :disabled="busy"
                :class="[
                  'flex items-center gap-2 p-3 rounded-xl border transition-colors text-right',
                  selectedMethod === m.value
                    ? 'border-primary-500 bg-primary-50/60 ring-1 ring-primary-300'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/30'
                ]"
                @click="selectedMethod = m.value"
              >
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0', m.bg]">
                  <UIcon
                    :name="m.icon"
                    :class="['w-4 h-4', m.color]"
                  />
                </div>
                <span class="text-sm font-bold text-gray-900">
                  {{ m.label }}
                </span>
              </button>
            </div>
          </div>

          <p
            v-if="error"
            class="text-xs text-error-600 flex items-center gap-1"
          >
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-4 h-4"
            />
            {{ error }}
          </p>

          <!-- Disclaimer -->
          <div class="bg-info-50/40 border border-info-100 rounded-lg p-3 text-[11px] text-info-700 leading-relaxed">
            <UIcon
              name="i-heroicons-information-circle"
              class="w-3.5 h-3.5 inline ml-1"
            />
            هذه بيئة تجريبية، لن يتم خصم أي مبالغ فعلية.
          </div>
        </div>

        <!-- Done state -->
        <div
          v-else-if="step === 'success'"
          class="px-6 py-10 text-center"
        >
          <div class="w-16 h-16 mx-auto rounded-2xl bg-success-50 flex items-center justify-center mb-4">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-9 h-9 text-success-600"
            />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">
            تم الدفع بنجاح
          </h3>
          <p class="text-sm text-gray-500">
            تم تفعيل {{ payment?.kind === 'subscription' ? 'الاشتراك' : 'التسجيل' }} بنجاح.
          </p>
        </div>

        <div
          v-else-if="step === 'cancelled'"
          class="px-6 py-10 text-center"
        >
          <div class="w-16 h-16 mx-auto rounded-2xl bg-error-50 flex items-center justify-center mb-4">
            <UIcon
              name="i-heroicons-x-circle"
              class="w-9 h-9 text-error-600"
            />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">
            تم إلغاء عملية الدفع
          </h3>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <template v-if="step === 'pay'">
            <UButton
              color="error"
              variant="ghost"
              :disabled="busy"
              @click="cancelPayment"
            >
              إلغاء
            </UButton>
            <UButton
              color="primary"
              icon="i-heroicons-lock-closed"
              :loading="busy"
              :disabled="!payment"
              @click="confirmPayment"
            >
              ادفع {{ formatAmount(payment?.amount) }} {{ payment?.currency || 'SAR' }}
            </UButton>
          </template>
          <UButton
            v-else
            color="neutral"
            variant="ghost"
            @click="onOpenChange(false)"
          >
            إغلاق
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { paymentsService, type Payment } from '@/services/api/payments.service'

const props = defineProps<{
  open: boolean
  payment: Payment | { id: number, amount: number, currency?: string, description?: string, transaction_id?: string, kind?: string } | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'paid': [payment: Payment]
  'cancelled': [payment: Payment]
}>()

type Step = 'pay' | 'pending' | 'success' | 'cancelled'

const { flags, ensureLoaded: ensureFlags } = usePlatformFlags()
const paymentsEnabled = computed(() => flags.value.payments_enabled)

const step = ref<Step>('pay')
const busy = ref(false)
const error = ref('')
const selectedMethod = ref<string>('visa')

const methods = [
  { value: 'visa', label: 'Visa / Mastercard', icon: 'i-heroicons-credit-card', bg: 'bg-primary-50', color: 'text-primary-600' },
  { value: 'mada', label: 'مدى', icon: 'i-heroicons-credit-card', bg: 'bg-success-50', color: 'text-success-600' },
  { value: 'apple_pay', label: 'Apple Pay', icon: 'i-heroicons-device-phone-mobile', bg: 'bg-gray-100', color: 'text-gray-700' },
  { value: 'wallet', label: 'محفظة إلكترونية', icon: 'i-heroicons-wallet', bg: 'bg-secondary-50', color: 'text-secondary-600' }
]

const onOpenChange = (val: boolean) => {
  if (busy.value) return
  emit('update:open', val)
  if (!val) reset()
}

function reset() {
  // When gateways are off, the order is already recorded as pending on the
  // server — just show the "awaiting admin approval" state.
  step.value = paymentsEnabled.value ? 'pay' : 'pending'
  busy.value = false
  error.value = ''
  selectedMethod.value = 'visa'
}

function formatAmount(n?: number | null) {
  if (n == null) return '0'
  return new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n)
}

async function confirmPayment() {
  if (!props.payment?.id) return
  busy.value = true
  error.value = ''
  try {
    const res = await paymentsService.confirm(props.payment.id, selectedMethod.value)
    const updated: Payment = res.data?.data ?? res.data
    step.value = 'success'
    emit('paid', updated)
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'تعذّر إتمام الدفع'
  } finally {
    busy.value = false
  }
}

async function cancelPayment() {
  if (!props.payment?.id) return
  if (!confirm('هل تريد إلغاء عملية الدفع؟')) return
  busy.value = true
  error.value = ''
  try {
    const res = await paymentsService.cancel(props.payment.id)
    const updated: Payment = res.data?.data ?? res.data
    step.value = 'cancelled'
    emit('cancelled', updated)
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'تعذّر إلغاء العملية'
  } finally {
    busy.value = false
  }
}

watch(() => props.open, async (val) => {
  if (val) {
    await ensureFlags()
    reset()
  }
})
</script>
