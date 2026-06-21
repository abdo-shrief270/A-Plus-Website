<template>
  <div class="text-center">
    <UIcon
      name="i-heroicons-shield-check"
      class="mx-auto mb-4 h-16 w-16 text-primary-600"
    />
    <h1 class="mb-2 text-2xl font-bold text-gray-900">
      التحقق من الهوية
    </h1>
    <p class="mb-8 text-gray-600">
      أدخل رمز التحقق المرسل إليك
    </p>

    <!-- OTP Input -->
    <div
      class="mb-8 flex justify-center gap-3"
      dir="ltr"
    >
      <input
        v-for="(_, i) in 6"
        :key="i"
        :ref="(el) => { if (el) otpRefs[i] = el as HTMLInputElement }"
        v-model="otpDigits[i]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="h-14 w-12 rounded-xl border-2 border-gray-300 text-center text-xl font-bold transition-colors focus:border-primary-500 focus:outline-none"
        @input="onInput(i)"
        @keydown.backspace="onBackspace(i)"
        @paste.prevent="onPaste"
      >
    </div>

    <UButton
      block
      size="lg"
      :loading="loading"
      :disabled="otp.length < 6"
      @click="onVerify"
    >
      تحقق
    </UButton>

    <div class="mt-4 flex items-center justify-center gap-2">
      <span class="text-sm text-gray-500">لم تستلم الرمز؟</span>
      <UButton
        variant="link"
        size="sm"
        :disabled="resendCooldown > 0"
        @click="onResend"
      >
        {{ resendCooldown > 0 ? `إعادة الإرسال (${resendCooldown}s)` : 'إعادة الإرسال' }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authService } from '@/services/api/auth.service'
import { useAuthStore } from '@/stores/auth'
import { useRedirect } from '@/composables/useRedirect'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useSeoMeta({
  title: 'التحقق من الهوية | A Plus'
})

const route = useRoute()
const authStore = useAuthStore()
const { redirectByRole } = useRedirect()

const otpToken = computed(() => route.query.token as string)
const otpType = computed(() => (route.query.type as string) || 'login')

const loading = ref(false)
const resendCooldown = ref(0)

// OTP state: 6 individual digits
const otpDigits = reactive<string[]>(['', '', '', '', '', ''])
const otpRefs: HTMLInputElement[] = []
const otp = computed(() => otpDigits.join(''))

function onInput(index: number) {
  const val = otpDigits[index]
  if (val && index < 5) {
    otpRefs[index + 1]?.focus()
  }
}

function onBackspace(index: number) {
  if (!otpDigits[index] && index > 0) {
    otpDigits[index - 1] = ''
    otpRefs[index - 1]?.focus()
  }
}

function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') ?? ''
  const digits = text.replace(/\D/g, '').slice(0, 6).split('')
  digits.forEach((d, i) => {
    otpDigits[i] = d
  })
  otpRefs[Math.min(digits.length, 5)]?.focus()
}

async function onVerify() {
  if (otp.value.length < 6) return
  loading.value = true
  try {
    const res = await authService.verifyOtp(otpToken.value, otp.value, otpType.value)
    const data = res.data?.data

    if (otpType.value === 'login' && data?.token && data?.user) {
      await authStore.storeUser(res.data)
      redirectByRole(data.user)
    } else if (otpType.value === 'reset' && data?.verified) {
      // Redirect to change-password with the verified token
      navigateTo(`/auth/forgot-password?step=4&token=${otpToken.value}`)
    } else {
      showToast('تنبيه', 'تحقق غير صالح', 'warning')
    }
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

async function onResend() {
  if (resendCooldown.value > 0) return
  loading.value = true
  try {
    await authService.sendOtp({ token: otpToken.value })
    showToast('نجح', 'تم إرسال الرمز مجدداً', 'success')
    startCooldown()
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

function startCooldown() {
  resendCooldown.value = 60
  const interval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(interval)
  }, 1000)
}

onMounted(startCooldown)
</script>
