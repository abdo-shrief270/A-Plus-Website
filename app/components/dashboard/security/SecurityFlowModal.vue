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
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', headerIconBg]">
              <UIcon
                :name="headerIcon"
                :class="['w-5 h-5', headerIconColor]"
              />
            </div>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-gray-900 truncate">
                {{ title }}
              </h3>
              <p class="text-xs text-gray-500 truncate">
                {{ subtitle }}
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

        <!-- Step 1: Pick channel -->
        <div
          v-if="step === 'choose'"
          class="px-6 py-5 space-y-4"
        >
          <p class="text-sm text-gray-700 leading-relaxed">
            اختر طريقة استلام رمز التحقق:
          </p>
          <div class="space-y-2">
            <button
              v-for="option in availableMethods"
              :key="option.value"
              type="button"
              :disabled="busy"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-primary-400 hover:bg-primary-50/30 transition-colors text-right disabled:opacity-50"
              @click="sendOtp(option.value)"
            >
              <div :class="['w-10 h-10 rounded-lg flex items-center justify-center shrink-0', option.iconBg]">
                <UIcon
                  :name="option.icon"
                  :class="['w-5 h-5', option.iconColor]"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900">
                  {{ option.label }}
                </p>
                <p
                  class="text-xs text-gray-500 truncate"
                  dir="ltr"
                >
                  {{ option.target }}
                </p>
              </div>
              <UIcon
                name="i-heroicons-chevron-left"
                class="w-4 h-4 text-gray-400"
              />
            </button>
          </div>
          <p
            v-if="!availableMethods.length"
            class="text-xs text-error-600 leading-relaxed"
          >
            لا توجد قناة متاحة لاستلام الرمز. أضف بريداً أو رقم هاتف من
            <NuxtLink
              to="/dashboard/profile"
              class="font-bold underline"
            >
              الملف الشخصي
            </NuxtLink>
            أولاً.
          </p>
        </div>

        <!-- Step 2: Enter OTP -->
        <div
          v-else-if="step === 'verify'"
          class="px-6 py-5 space-y-4"
        >
          <div class="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-2">
            <UIcon
              :name="sentChannel === 'email' ? 'i-heroicons-envelope' : (sentChannel === 'whatsapp' ? 'i-heroicons-chat-bubble-bottom-center-text' : 'i-heroicons-device-phone-mobile')"
              class="w-4 h-4 text-primary-600 shrink-0"
            />
            <p class="text-xs text-gray-700">
              تم إرسال الرمز إلى
              <span
                class="font-bold"
                dir="ltr"
              >{{ sentTo }}</span>
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              رمز التحقق
            </label>
            <UInput
              ref="otpInputRef"
              :model-value="otp"
              size="lg"
              maxlength="6"
              inputmode="numeric"
              autocomplete="one-time-code"
              placeholder="● ● ● ● ● ●"
              dir="ltr"
              class="w-full font-mono text-center text-lg tracking-[0.5em]"
              :disabled="busy"
              @update:model-value="onOtpInput"
              @keyup.enter="confirm"
            />
            <p
              v-if="error"
              class="mt-2 text-xs text-error-600"
            >
              {{ error }}
            </p>
            <p
              v-else
              class="mt-2 text-xs text-gray-500"
            >
              لم يصلك الرمز؟
              <button
                type="button"
                class="font-bold text-primary-600 hover:text-primary-700 disabled:text-gray-400"
                :disabled="busy || resendCooldown > 0"
                @click="resend"
              >
                {{ resendCooldown > 0 ? `إعادة الإرسال خلال ${resendCooldown}ث` : 'إعادة الإرسال' }}
              </button>
            </p>
          </div>
        </div>

        <!-- Step 3: Done -->
        <div
          v-else-if="step === 'done'"
          class="px-6 py-8 text-center"
        >
          <div class="w-16 h-16 mx-auto rounded-2xl bg-success-50 flex items-center justify-center mb-4">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-9 h-9 text-success-600"
            />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">
            {{ doneTitle }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ doneSubtitle }}
          </p>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="busy"
            @click="onOpenChange(false)"
          >
            {{ step === 'done' ? 'إغلاق' : 'إلغاء' }}
          </UButton>
          <UButton
            v-if="step === 'verify'"
            color="primary"
            icon="i-heroicons-check"
            :loading="busy"
            :disabled="otp.length < 4"
            @click="confirm"
          >
            تأكيد
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import {
  securityService,
  type SecurityMethod,
  type SecurityPurpose,
  type SecurityStatus
} from '@/services/api/security.service'

const props = defineProps<{
  open: boolean
  purpose: SecurityPurpose
  status: SecurityStatus | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'done': [status: SecurityStatus]
}>()

type Step = 'choose' | 'verify' | 'done'

const step = ref<Step>('choose')
const busy = ref(false)
const error = ref('')
const token = ref('')
const otp = ref('')
const sentChannel = ref<SecurityMethod>('email')
const sentTo = ref('')
const resendCooldown = ref(0)
const otpInputRef = ref<{ $el?: HTMLElement, input?: HTMLInputElement } | null>(null)
let cooldownInterval: ReturnType<typeof setInterval> | null = null

function onOtpInput(value: string) {
  // Strip non-digits and cap to 6
  const cleaned = (value ?? '').replace(/\D/g, '').slice(0, 6)
  otp.value = cleaned
  error.value = ''
  // Auto-submit when 6 digits entered
  if (cleaned.length === 6 && !busy.value) {
    confirm()
  }
}

function focusOtp() {
  nextTick(() => {
    const el: unknown = otpInputRef.value?.$el?.querySelector?.('input')
      ?? otpInputRef.value?.input
      ?? otpInputRef.value
    if (el && typeof (el as { focus?: unknown }).focus === 'function') {
      (el as { focus: () => void }).focus()
    }
  })
}

const title = computed(() => {
  switch (props.purpose) {
    case 'enable_2fa': return 'تفعيل المصادقة الثنائية'
    case 'disable_2fa': return 'إيقاف المصادقة الثنائية'
    case 'verify_email': return 'تأكيد البريد الإلكتروني'
    case 'verify_phone': return 'تأكيد رقم الهاتف (SMS)'
    case 'verify_whatsapp': return 'تأكيد رقم واتساب'
    default: return 'إجراء أمان'
  }
})

const subtitle = computed(() => {
  if (step.value === 'verify') return 'أدخل الرمز الذي وصلك للتأكيد'
  if (step.value === 'done') return 'اكتمل الإجراء بنجاح'
  return 'سنرسل إليك رمز تحقق'
})

const headerIcon = computed(() => {
  if (props.purpose === 'enable_2fa') return 'i-heroicons-shield-check'
  if (props.purpose === 'disable_2fa') return 'i-heroicons-shield-exclamation'
  if (props.purpose === 'verify_email') return 'i-heroicons-envelope'
  if (props.purpose === 'verify_whatsapp') return 'i-heroicons-chat-bubble-bottom-center-text'
  return 'i-heroicons-device-phone-mobile'
})

const headerIconBg = computed(() => {
  if (props.purpose === 'disable_2fa') return 'bg-error-50'
  if (props.purpose === 'verify_email') return 'bg-primary-50'
  if (props.purpose === 'verify_phone') return 'bg-secondary-50'
  if (props.purpose === 'verify_whatsapp') return 'bg-success-50'
  return 'bg-success-50'
})

const headerIconColor = computed(() => {
  if (props.purpose === 'disable_2fa') return 'text-error-600'
  if (props.purpose === 'verify_email') return 'text-primary-600'
  if (props.purpose === 'verify_phone') return 'text-secondary-600'
  if (props.purpose === 'verify_whatsapp') return 'text-success-600'
  return 'text-success-600'
})

const doneTitle = computed(() => {
  switch (props.purpose) {
    case 'enable_2fa': return 'تم تفعيل المصادقة الثنائية'
    case 'disable_2fa': return 'تم إيقاف المصادقة الثنائية'
    case 'verify_email': return 'تم تأكيد بريدك الإلكتروني'
    case 'verify_phone': return 'تم تأكيد رقم هاتفك عبر SMS'
    case 'verify_whatsapp': return 'تم تأكيد رقم واتساب'
    default: return 'تمت العملية'
  }
})

const doneSubtitle = computed(() => {
  if (props.purpose === 'enable_2fa') return 'سيُطلب منك إدخال رمز عند تسجيل الدخول من جهاز جديد.'
  if (props.purpose === 'disable_2fa') return 'تم إلغاء طلب رمز التحقق عند تسجيل الدخول.'
  return 'يمكنك الآن استخدام هذه القناة لاستلام الإشعارات.'
})

const availableMethods = computed(() => {
  const list: Array<{ value: SecurityMethod, label: string, target: string, icon: string, iconBg: string, iconColor: string }> = []
  const s = props.status

  const emailOption = {
    value: 'email' as const,
    label: 'البريد الإلكتروني',
    target: s?.masked_email || s?.email || '',
    icon: 'i-heroicons-envelope',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600'
  }
  const smsOption = {
    value: 'sms' as const,
    label: 'رسالة SMS',
    target: s?.masked_phone || s?.phone || '',
    icon: 'i-heroicons-device-phone-mobile',
    iconBg: 'bg-secondary-50',
    iconColor: 'text-secondary-600'
  }
  const whatsappOption = {
    value: 'whatsapp' as const,
    label: 'واتساب',
    target: s?.masked_phone || s?.phone || '',
    icon: 'i-heroicons-chat-bubble-bottom-center-text',
    iconBg: 'bg-success-50',
    iconColor: 'text-success-600'
  }

  // Each verify-* purpose only allows its own channel
  if (props.purpose === 'verify_email') {
    if (s?.email) list.push(emailOption)
    return list
  }
  if (props.purpose === 'verify_phone') {
    if (s?.phone) list.push(smsOption)
    return list
  }
  if (props.purpose === 'verify_whatsapp') {
    if (s?.phone) list.push(whatsappOption)
    return list
  }

  // 2FA enable/disable accepts any available channel
  if (s?.email) list.push(emailOption)
  if (s?.phone) list.push(smsOption, whatsappOption)
  return list
})

const onOpenChange = (val: boolean) => {
  if (busy.value) return
  emit('update:open', val)
  if (!val) reset()
}

function reset() {
  step.value = 'choose'
  busy.value = false
  error.value = ''
  token.value = ''
  otp.value = ''
  sentTo.value = ''
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
    cooldownInterval = null
  }
  resendCooldown.value = 0
}

function startCooldown(seconds = 30) {
  resendCooldown.value = seconds
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    resendCooldown.value -= 1
    if (resendCooldown.value <= 0) {
      if (cooldownInterval) clearInterval(cooldownInterval)
      cooldownInterval = null
    }
  }, 1000)
}

async function sendOtp(method: SecurityMethod) {
  busy.value = true
  error.value = ''
  try {
    const res = await securityService.sendOtp(method)
    const data = res.data?.data ?? res.data ?? {}
    token.value = data.token
    sentChannel.value = method
    sentTo.value = data.sent_to || ''
    otp.value = ''
    step.value = 'verify'
    startCooldown(30)
    focusOtp()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    error.value = e?.response?.data?.message || 'تعذّر إرسال الرمز'
  } finally {
    busy.value = false
  }
}

async function resend() {
  if (resendCooldown.value > 0) return
  await sendOtp(sentChannel.value)
}

async function confirm() {
  if (otp.value.length < 4 || !token.value) return
  busy.value = true
  error.value = ''
  try {
    const res = await securityService.confirm({
      token: token.value,
      otp: otp.value,
      purpose: props.purpose
    })
    const updated: SecurityStatus = res.data?.data ?? res.data
    emit('done', updated)
    step.value = 'done'
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    error.value = e?.response?.data?.message || 'الرمز غير صحيح'
  } finally {
    busy.value = false
  }
}

watch(() => props.open, (val) => {
  if (val) reset()
})
</script>
