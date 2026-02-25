<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-gray-900">
    <div class="w-full max-w-md">
      <!-- Step indicator -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div
          v-for="s in 4"
          :key="s"
          class="flex items-center gap-2"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
            :class="step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'"
          >
            {{ s }}
          </div>
          <div v-if="s < 4" class="w-8 h-0.5" :class="step > s ? 'bg-primary-600' : 'bg-gray-200'" />
        </div>
      </div>

      <div class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        <!-- Step 1: Find user -->
        <div v-if="step === 1">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            استعادة كلمة المرور
          </h1>
          <p class="text-gray-500 text-sm mb-6">
            أدخل اسم المستخدم الخاص بك
          </p>
          <div class="space-y-4">
            <UInput
              v-model="userName"
              placeholder="اسم المستخدم"
              size="lg"
              icon="i-heroicons-user"
              class="w-full"
            />
            <UButton block size="lg" :loading="loading" @click="onFindUser">
              متابعة
            </UButton>
          </div>
        </div>

        <!-- Step 2: Choose method -->
        <div v-if="step === 2">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            اختر طريقة الإرسال
          </h1>
          <p class="text-gray-500 text-sm mb-6">
            سيُرسل رمز التحقق عبر الطريقة التي تختارها
          </p>
          <div class="space-y-3">
            <UButton
              v-if="maskedPhone"
              block
              size="lg"
              :loading="loading"
              class="justify-start"
              @click="onSendOtp('sms')"
            >
              <UIcon name="i-heroicons-device-phone-mobile" class="w-5 h-5 ml-2" />
              SMS · {{ maskedPhone }}
            </UButton>
            <UButton
              v-if="maskedPhone"
              block
              size="lg"
              color="success"
              variant="outline"
              :loading="loading"
              class="justify-start"
              @click="onSendOtp('whatsapp')"
            >
              <UIcon name="i-simple-icons-whatsapp" class="w-5 h-5 ml-2" />
              WhatsApp · {{ maskedPhone }}
            </UButton>
            <UButton
              v-if="maskedEmail"
              block
              size="lg"
              color="neutral"
              variant="outline"
              :loading="loading"
              class="justify-start"
              @click="onSendOtp('email')"
            >
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 ml-2" />
              بريد إلكتروني · {{ maskedEmail }}
            </UButton>
          </div>
        </div>

        <!-- Step 3: Enter OTP (redirect handled) -->
        <!-- Step 4: New Password -->
        <div v-if="step === 4">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            كلمة المرور الجديدة
          </h1>
          <p class="text-gray-500 text-sm mb-6">
            أدخل كلمة مرور قوية لحسابك
          </p>
          <div class="space-y-4">
            <UInput
              v-model="newPassword"
              type="password"
              placeholder="كلمة المرور الجديدة"
              size="lg"
              icon="i-heroicons-lock-closed"
              class="w-full"
            />
            <UInput
              v-model="confirmPassword"
              type="password"
              placeholder="تأكيد كلمة المرور"
              size="lg"
              icon="i-heroicons-lock-closed"
              class="w-full"
            />
            <p v-if="confirmPassword && newPassword !== confirmPassword" class="text-xs text-error-600">
              كلمتا المرور غير متطابقتين
            </p>
            <UButton
              block
              size="lg"
              :loading="loading"
              :disabled="!newPassword || newPassword !== confirmPassword"
              @click="onChangePassword"
            >
              تغيير كلمة المرور
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authService } from '@/services/api/auth.service'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({ layout: 'fullscreen', middleware: 'guest' })
useSeoMeta({ title: 'استعادة كلمة المرور | A Plus' })

const route = useRoute()

const step = ref(Number(route.query.step) || 1)
const loading = ref(false)

const userName = ref('')
const maskedPhone = ref('')
const maskedEmail = ref('')
const otpToken = ref((route.query.token as string) || '')
const newPassword = ref('')
const confirmPassword = ref('')

// Watch query changes (OTP redirects back here with step=4)
watch(
  () => route.query,
  (q) => {
    if (q.step) step.value = Number(q.step)
    if (q.token) otpToken.value = q.token as string
  },
  { immediate: true }
)

async function onFindUser() {
  if (!userName.value) return
  loading.value = true
  try {
    const res = await authService.resetPassword({ user_name: userName.value })
    const data = res.data?.data
    maskedPhone.value = data?.phone || ''
    maskedEmail.value = data?.email || ''
    step.value = 2
  } catch {
    // handled
  } finally {
    loading.value = false
  }
}

async function onSendOtp(method: 'sms' | 'whatsapp' | 'email') {
  loading.value = true
  try {
    const res = await authService.sendOtp({ user_name: userName.value, method })
    const token = res.data?.data?.token
    if (token) {
      otpToken.value = token
      navigateTo(`/auth/otp?type=reset&token=${token}`)
    }
  } catch {
    // handled
  } finally {
    loading.value = false
  }
}

async function onChangePassword() {
  if (newPassword.value !== confirmPassword.value) return
  loading.value = true
  try {
    await authService.changePassword(otpToken.value, newPassword.value, confirmPassword.value)
    showToast('نجح', 'تم تغيير كلمة المرور بنجاح', 'success')
    navigateTo('/auth/login')
  } catch {
    // handled
  } finally {
    loading.value = false
  }
}
</script>
