<template>
  <div class="grid grid-cols-1 md:grid-cols-2 min-h-screen">
    <!-- Banner -->
    <div class="hidden md:flex relative items-start justify-center bg-primary-600 overflow-hidden">
      <img
        src="~/assets/images/auth/authBg.png"
        class="absolute w-full h-full object-cover"
        alt="A Plus"
      >
      <div class="z-[100] mt-32 w-full flex flex-col items-center justify-start text-center px-8">
        <h1 class="text-4xl font-bold text-white mb-4 leading-tight">
          مرحباً بك في A+
        </h1>
        <p class="text-white text-xl opacity-90">
          المنصة التعليمية الأكثر تطوراً
        </p>
      </div>
    </div>

    <!-- Form -->
    <div class="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
      <div class="w-full max-w-md space-y-6">
        <!-- Step 1: Username check -->
        <div v-if="step === 1" class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
          <h2 class="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            تسجيل الدخول
          </h2>
          <UForm :schema="usernameSchema" :state="usernameState" class="space-y-4" @submit="onCheckUsername">
            <UFormField label="اسم المستخدم" name="user_name">
              <UInput
                v-model="usernameState.user_name"
                type="text"
                placeholder="أدخل اسم المستخدم"
                size="lg"
                icon="i-heroicons-user"
                class="w-full"
              />
            </UFormField>
            <UButton type="submit" block size="lg" :loading="loading">
              متابعة
            </UButton>
            <div class="text-center mt-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                ليس لديك حساب؟
                <NuxtLink to="/auth/register" class="text-primary-600 hover:text-primary-700 font-medium underline">
                  سجل الآن
                </NuxtLink>
              </p>
            </div>
          </UForm>
        </div>

        <!-- Step 2: Password -->
        <div v-if="step === 2" class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
          <div class="flex items-center gap-3 mb-6">
            <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-right" @click="step = 1" />
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              مرحباً، {{ usernameState.user_name }}
            </h2>
          </div>
          <UForm :schema="passwordSchema" :state="passwordState" class="space-y-4" @submit="onLogin">
            <UFormField label="كلمة المرور" name="password">
              <UInput
                v-model="passwordState.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="أدخل كلمة المرور"
                size="lg"
                icon="i-heroicons-lock-closed"
                :trailing-icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                class="w-full"
                @click:trailing="showPassword = !showPassword"
              />
            </UFormField>
            <div class="flex justify-end">
              <NuxtLink to="/auth/forgot-password" class="text-sm text-primary-600 hover:text-primary-700 underline">
                نسيت كلمة المرور؟
              </NuxtLink>
            </div>
            <UButton type="submit" block size="lg" :loading="loading">
              دخول
            </UButton>
          </UForm>
        </div>

        <!-- Step 3: 2FA hint -->
        <div v-if="step === 3" class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm text-center">
          <UIcon name="i-heroicons-shield-check" class="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            التحقق الثنائي مطلوب
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            سيتم إرسال رمز التحقق إلى
            <span v-if="twoFaContact.phone" class="font-semibold">{{ twoFaContact.phone }}</span>
            <span v-if="twoFaContact.email" class="font-semibold"> أو {{ twoFaContact.email }}</span>
          </p>
          <div class="flex flex-col gap-3">
            <UButton v-if="twoFaContact.phone" block size="lg" :loading="loading" @click="sendOtpAndRedirect('sms')">
              إرسال رمز عبر SMS
            </UButton>
            <UButton v-if="twoFaContact.phone" block size="lg" color="success" variant="outline" :loading="loading" @click="sendOtpAndRedirect('whatsapp')">
              إرسال رمز عبر WhatsApp
            </UButton>
            <UButton v-if="twoFaContact.email" block size="lg" color="neutral" variant="outline" :loading="loading" @click="sendOtpAndRedirect('email')">
              إرسال رمز عبر البريد الإلكتروني
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { authService } from '@/services/api/auth.service'
import { useAuthStore } from '@/stores/auth'
import { useRedirect } from '@/composables/useRedirect'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({
  layout: 'fullscreen',
  middleware: 'guest'
})

useSeoMeta({
  title: 'تسجيل الدخول | A Plus',
  description: 'تسجيل الدخول إلى منصة A Plus التعليمية'
})

const authStore = useAuthStore()
const { redirectByRole } = useRedirect()

const step = ref(1)
const loading = ref(false)
const showPassword = ref(false)
const twoFaContact = ref<{ phone?: string; email?: string }>({})

// Step 1 schema
const usernameSchema = z.object({
  user_name: z.string().min(1, 'اسم المستخدم مطلوب')
})
const usernameState = reactive({ user_name: '' })

// Step 2 schema
const passwordSchema = z.object({
  password: z.string().min(1, 'كلمة المرور مطلوبة')
})
const passwordState = reactive({ password: '' })

async function onCheckUsername(event: FormSubmitEvent<{ user_name: string }>) {
  loading.value = true
  try {
    const res = await authService.loginCheck(event.data.user_name)
    if (res.data?.data) {
      step.value = 2
    } else {
      showToast('خطأ', 'اسم المستخدم غير موجود', 'error')
    }
  } catch {
    // error handled by Axios interceptor
  } finally {
    loading.value = false
  }
}

async function onLogin(event: FormSubmitEvent<{ password: string }>) {
  loading.value = true
  try {
    const res = await authService.login(usernameState.user_name, event.data.password)
    const data = res.data?.data

    if (data?.requires_2fa) {
      // Store masked contact info and move to 2FA step
      twoFaContact.value = { phone: data.phone, email: data.email }
      step.value = 3
      return
    }

    await authStore.storeUser(res.data)
    redirectByRole(res.data.data.user)
  } catch {
    // error handled by Axios interceptor
  } finally {
    loading.value = false
  }
}

async function sendOtpAndRedirect(method: 'sms' | 'whatsapp' | 'email') {
  loading.value = true
  try {
    const res = await authService.sendOtp({
      user_name: usernameState.user_name,
      method
    })
    const token = res.data?.data?.token
    if (token) {
      navigateTo(`/auth/otp?type=login&token=${token}`)
    }
  } catch {
    // error handled by Axios interceptor
  } finally {
    loading.value = false
  }
}
</script>
