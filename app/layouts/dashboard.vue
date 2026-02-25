<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
    <div class="flex h-screen">
      <!-- Sidebar -->
      <aside class="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <span class="text-white font-bold text-lg">A+</span>
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">A Plus</span>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold"
          >
            <UIcon name="i-heroicons-home" class="w-5 h-5" />
            <span>الرئيسية</span>
          </NuxtLink>

          <!-- School-only nav -->
          <template v-if="isSchool">
            <div class="pt-3 pb-1 px-4">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">إدارة الطلاب</p>
            </div>
            <NuxtLink
              to="/dashboard/students"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold"
            >
              <UIcon name="i-heroicons-user-group" class="w-5 h-5" />
              <span>الطلاب</span>
            </NuxtLink>
            <NuxtLink
              to="/dashboard/students/create"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold"
            >
              <UIcon name="i-heroicons-user-plus" class="w-5 h-5" />
              <span>إضافة طالب</span>
            </NuxtLink>
            <NuxtLink
              to="/dashboard/students/import"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold"
            >
              <UIcon name="i-heroicons-arrow-up-tray" class="w-5 h-5" />
              <span>استيراد الطلاب</span>
            </NuxtLink>
          </template>

          <!-- Parent nav -->
          <template v-if="isParent">
            <div class="pt-3 pb-1 px-4">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">متابعة الأبناء</p>
            </div>
          </template>

          <!-- Shared -->
          <div class="pt-3 pb-1 px-4">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">الحساب</p>
          </div>
          <NuxtLink
            to="/dashboard/profile"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold"
          >
            <UIcon name="i-heroicons-user-circle" class="w-5 h-5" />
            <span>الملف الشخصي</span>
          </NuxtLink>
          <NuxtLink
            to="/dashboard/devices"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold"
          >
            <UIcon name="i-heroicons-device-phone-mobile" class="w-5 h-5" />
            <span>الأجهزة</span>
          </NuxtLink>
        </nav>

        <!-- User Menu Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <UDropdown :items="userMenuItems" :popper="{ placement: 'top' }">
            <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <div class="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span class="text-primary-700 dark:text-primary-400 font-bold text-sm">
                  {{ authStore.getUser?.name?.charAt(0) }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {{ authStore.getUser?.name }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ roleLabel }}
                </p>
              </div>
              <UIcon name="i-heroicons-chevron-up-down" class="w-4 h-4 text-gray-400" />
            </div>
          </UDropdown>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Header -->
        <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            لوحة التحكم
          </div>
          <div class="flex items-center gap-3">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-bell"
              size="sm"
            />
            <UButton
              to="/"
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-heroicons-home"
            >
              العودة للموقع
            </UButton>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isSchool = computed(() => authStore.isSchool)
const isParent = computed(() => authStore.isParent)

const roleLabel = computed(() => {
  if (isSchool.value) return 'مدرسة'
  if (isParent.value) return 'ولي أمر'
  return ''
})

const userMenuItems = computed(() => [
  [
    {
      label: 'الملف الشخصي',
      icon: 'i-heroicons-user-circle',
      click: () => navigateTo('/dashboard/profile')
    },
    {
      label: 'الأجهزة',
      icon: 'i-heroicons-device-phone-mobile',
      click: () => navigateTo('/dashboard/devices')
    }
  ],
  [
    {
      label: 'تسجيل الخروج',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => authStore.logoutUser()
    }
  ]
])
</script>
