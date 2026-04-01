<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      الملف الشخصي
    </h1>

    <div
      v-if="loading"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary-500 animate-spin"
      />
    </div>

    <div
      v-else
      class="max-w-2xl space-y-6"
    >
      <!-- Profile Info -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6"
      >
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center"
          >
            <span class="text-2xl font-bold text-primary-600">
              {{ user?.name?.charAt(0) }}
            </span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ user?.name }}
            </h2>
            <p class="text-gray-500">
              @{{ user?.user_name }}
            </p>
          </div>
        </div>

        <UForm
          :schema="profileSchema"
          :state="profileState"
          class="space-y-4"
          @submit="onUpdateProfile"
        >
          <UFormField
            label="الاسم الكامل"
            name="name"
          >
            <UInput
              v-model="profileState.name"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="البريد الإلكتروني"
            name="email"
          >
            <UInput
              v-model="profileState.email"
              type="email"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="رقم الهاتف"
            name="phone"
          >
            <UInput
              v-model="profileState.phone"
              type="tel"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            :loading="savingProfile"
            class="mt-2"
          >
            حفظ البيانات
          </UButton>
        </UForm>
      </div>

      <!-- Change Password -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6"
      >
        <h3 class="font-bold text-gray-900 dark:text-white mb-5">
          تغيير كلمة المرور
        </h3>
        <UForm
          :schema="passwordSchema"
          :state="passwordState"
          class="space-y-4"
          @submit="onChangePassword"
        >
          <UFormField
            label="كلمة المرور الحالية"
            name="old_password"
          >
            <UInput
              v-model="passwordState.old_password"
              type="password"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="كلمة المرور الجديدة"
            name="password"
          >
            <UInput
              v-model="passwordState.password"
              type="password"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            :loading="savingPassword"
            class="mt-2"
          >
            تحديث كلمة المرور
          </UButton>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { authService } from '@/services/api/auth.service'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })
useSeoMeta({ title: 'الملف الشخصي | A Plus' })

const authStore = useAuthStore()
const loading = ref(true)
const savingProfile = ref(false)
const savingPassword = ref(false)
const user = ref<any>(null)

// Schemas
const profileSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z
    .string()
    .email('البريد الإلكتروني غير صالح')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional().or(z.literal(''))
})

const passwordSchema = z.object({
  old_password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف')
})

// States
type ProfileSchema = z.output<typeof profileSchema>
type PasswordSchema = z.output<typeof passwordSchema>

const profileState = reactive<ProfileSchema>({
  name: '',
  email: '',
  phone: ''
})

const passwordState = reactive<PasswordSchema>({
  old_password: '',
  password: ''
})

onMounted(async () => {
  try {
    const res = await authService.me()
    user.value = res.data?.data?.user ?? res.data?.user ?? res.data

    profileState.name = user.value?.name || ''
    profileState.email = user.value?.email || ''
    profileState.phone = user.value?.phone || ''

    // Update Pinia store to keep app in sync
    if (user.value) {
      authStore.user = user.value
    }
  } catch (error) {
    console.error('Failed to load profile', error)
    showToast('خطأ', 'فشل في تحميل بيانات الملف الشخصي', 'error')
  } finally {
    loading.value = false
  }
})

async function onUpdateProfile(event: FormSubmitEvent<ProfileSchema>) {
  savingProfile.value = true
  try {
    // Clean up empty strings to avoid validation errors on the backend
    const payload = { ...event.data }
    if (!payload.email) delete payload.email
    if (!payload.phone) delete payload.phone

    const res = await authService.updateProfile(payload)

    // Update local state if the API returns the updated user
    const updatedUser = res.data?.data?.user ?? res.data?.user
    if (updatedUser) {
      user.value = updatedUser
      authStore.user = updatedUser
    }

    showToast('نجاح', 'تم تحديث بيانات الملف الشخصي بنجاح', 'success')
  } catch (error: any) {
    const msg = error.response?.data?.message || 'حدث خطأ أثناء التحديث'
    showToast('خطأ', msg, 'error')
  } finally {
    savingProfile.value = false
  }
}

async function onChangePassword(event: FormSubmitEvent<PasswordSchema>) {
  savingPassword.value = true
  try {
    await authService.updateProfile({
      old_password: event.data.old_password,
      password: event.data.password
    })
    showToast('نجاح', 'تم تغيير كلمة المرور بنجاح', 'success')
    passwordState.old_password = ''
    passwordState.password = ''
  } catch (error: any) {
    const msg
      = error.response?.data?.message || 'تأكد من صحة كلمة المرور الحالية'
    showToast('خطأ', msg, 'error')
  } finally {
    savingPassword.value = false
  }
}
</script>
