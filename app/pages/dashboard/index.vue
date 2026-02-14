<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        مرحباً، {{ authStore.getUser?.name }}!
      </h1>
      <p class="text-gray-600 mt-2">
        نوع الحساب: {{ getRoleLabel }}
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">
              الطلاب
            </p>
            <p class="text-3xl font-bold text-gray-900 mt-1">
              24
            </p>
          </div>
          <div
            class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-user-group"
              class="w-6 h-6 text-primary-600"
            />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">
              الدورات
            </p>
            <p class="text-3xl font-bold text-gray-900 mt-1">
              12
            </p>
          </div>
          <div
            class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-book-open"
              class="w-6 h-6 text-green-600"
            />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">
              التقارير
            </p>
            <p class="text-3xl font-bold text-gray-900 mt-1">
              8
            </p>
          </div>
          <div
            class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-chart-bar"
              class="w-6 h-6 text-yellow-600"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          النشاط الأخير
        </h2>
      </div>
      <div class="p-6">
        <p class="text-gray-600 text-center py-8">
          لا يوجد نشاط حديث
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role']
})

useSeoMeta({
  title: 'لوحة التحكم',
  description: 'لوحة التحكم الخاصة بك'
})

const authStore = useAuthStore()

const getRoleLabel = computed(() => {
  const role = authStore.getUserRole
  switch (role) {
    case 'teacher':
      return 'معلم'
    case 'parent':
      return 'ولي أمر'
    case 'student':
      return 'طالب'
    default:
      return 'غير محدد'
  }
})
</script>
