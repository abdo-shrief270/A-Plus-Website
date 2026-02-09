<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex h-screen">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-l border-gray-200 flex flex-col">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center gap-2">
            <img src="/logo.svg" alt="A+" class="h-10 w-10" />
            <span class="text-2xl font-bold text-gray-900">A+</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1">
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
            active-class="bg-primary-50 text-primary-600 hover:bg-primary-50"
          >
            <UIcon name="i-heroicons-home" class="w-5 h-5" />
            <span>الرئيسية</span>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/students"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
            active-class="bg-primary-50 text-primary-600 hover:bg-primary-50"
          >
            <UIcon name="i-heroicons-user-group" class="w-5 h-5" />
            <span>الطلاب</span>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/courses"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
            active-class="bg-primary-50 text-primary-600 hover:bg-primary-50"
          >
            <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
            <span>الدورات</span>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/reports"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
            active-class="bg-primary-50 text-primary-600 hover:bg-primary-50"
          >
            <UIcon name="i-heroicons-chart-bar" class="w-5 h-5" />
            <span>التقارير</span>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/settings"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
            active-class="bg-primary-50 text-primary-600 hover:bg-primary-50"
          >
            <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
            <span>الإعدادات</span>
          </NuxtLink>
        </nav>

        <!-- User Menu -->
        <div class="p-4 border-t border-gray-200">
          <UDropdown :items="userMenuItems" :popper="{ placement: 'top' }">
            <div
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div
                class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center"
              >
                <span class="text-primary-600 font-semibold">
                  {{ authStore.getUser?.name?.charAt(0) }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ authStore.getUser?.name }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ authStore.getUser?.email }}
                </p>
              </div>
              <UIcon
                name="i-heroicons-chevron-up-down"
                class="w-5 h-5 text-gray-400"
              />
            </div>
          </UDropdown>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">لوحة التحكم</h1>

            <div class="flex items-center gap-4">
              <!-- Notifications -->
              <UButton color="gray" variant="ghost" icon="i-heroicons-bell">
              </UButton>

              <!-- Back to Website -->
              <UButton to="/" color="gray" variant="ghost">
                العودة للموقع
              </UButton>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const userMenuItems = [
  [
    {
      label: "الملف الشخصي",
      icon: "i-heroicons-user",
      click: () => navigateTo("/dashboard/profile"),
    },
  ],
  [
    {
      label: "تسجيل الخروج",
      icon: "i-heroicons-arrow-right-on-rectangle",
      click: () => authStore.logoutUser(),
    },
  ],
];
</script>
