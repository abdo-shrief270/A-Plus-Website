<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      الملف الشخصي
    </h1>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-primary-500 animate-spin" />
    </div>

    <div v-else class="max-w-2xl space-y-6">
      <!-- Profile Info -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
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

        <UForm :state="profileState" class="space-y-4" @submit.prevent="onUpdateProfile">
          <UFormField label="الاسم">
            <UInput v-model="profileState.name" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="البريد الإلكتروني">
            <UInput v-model="profileState.email" type="email" size="lg" class="w-full" />
          </UFormField>
          <UButton type="submit" :loading="savingProfile">
            حفظ البيانات
          </UButton>
        </UForm>
      </div>

      <!-- Change Password -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <h3 class="font-bold text-gray-900 dark:text-white mb-5">
          تغيير كلمة المرور
        </h3>
        <div class="space-y-4">
          <UFormField label="كلمة المرور الحالية">
            <UInput v-model="passwordState.old_password" type="password" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="كلمة المرور الجديدة">
            <UInput v-model="passwordState.password" type="password" size="lg" class="w-full" />
          </UFormField>
          <UButton :loading="savingPassword" @click="onChangePassword">
            تغيير كلمة المرور
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const profileState = reactive({ name: '', email: '' })
const passwordState = reactive({ old_password: '', password: '' })

onMounted(async () => {
  try {
    const res = await authService.me()
    user.value = res.data?.data?.user
    profileState.name = user.value?.name || ''
    profileState.email = user.value?.email || ''
  } catch {
    //
  } finally {
    loading.value = false
  }
})

async function onUpdateProfile() {
  savingProfile.value = true
  try {
    await authService.updateProfile(profileState)
    showToast('نجح', 'تم تحديث البيانات', 'success')
  } catch {
    //
  } finally {
    savingProfile.value = false
  }
}

async function onChangePassword() {
  if (!passwordState.old_password || !passwordState.password) return
  savingPassword.value = true
  try {
    await authService.updateProfile(passwordState)
    showToast('نجح', 'تم تغيير كلمة المرور', 'success')
    passwordState.old_password = ''
    passwordState.password = ''
  } catch {
    //
  } finally {
    savingPassword.value = false
  }
}
</script>
