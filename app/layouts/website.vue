<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b border-gray-200">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <img src="/logo.svg" alt="A+" class="h-10 w-10" />
            <span class="text-2xl font-bold text-gray-900">A+</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink to="/" class="text-gray-700 hover:text-primary-600">
              الرئيسية
            </NuxtLink>
            <NuxtLink to="/about" class="text-gray-700 hover:text-primary-600">
              من نحن
            </NuxtLink>
            <NuxtLink
              to="/courses"
              class="text-gray-700 hover:text-primary-600"
            >
              الدورات
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="text-gray-700 hover:text-primary-600"
            >
              تواصل معنا
            </NuxtLink>
          </nav>

          <!-- Auth Buttons -->
          <div class="flex items-center gap-3">
            <template v-if="authStore.isLoggedIn">
              <UDropdown :items="userMenuItems">
                <UButton
                  color="gray"
                  variant="ghost"
                  trailing-icon="i-heroicons-chevron-down-20-solid"
                >
                  {{ authStore.getUser?.name }}
                </UButton>
              </UDropdown>
            </template>
            <template v-else>
              <UButton to="/login" variant="ghost" color="gray">
                تسجيل الدخول
              </UButton>
              <UButton to="/register" color="primary"> إنشاء حساب </UButton>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 mt-20">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="A+" class="h-8 w-8" />
              <span class="text-xl font-bold text-gray-900">A+</span>
            </div>
            <p class="text-gray-600 text-sm">
              منصة تعليمية متكاملة للطلاب والمعلمين
            </p>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-4">روابط سريعة</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/" class="text-gray-600 hover:text-primary-600">
                  الرئيسية
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/about"
                  class="text-gray-600 hover:text-primary-600"
                >
                  من نحن
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/courses"
                  class="text-gray-600 hover:text-primary-600"
                >
                  الدورات
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-4">الدعم</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink
                  to="/contact"
                  class="text-gray-600 hover:text-primary-600"
                >
                  تواصل معنا
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/faq"
                  class="text-gray-600 hover:text-primary-600"
                >
                  الأسئلة الشائعة
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-4">تابعنا</h3>
            <div class="flex gap-3">
              <a href="#" class="text-gray-600 hover:text-primary-600">
                <UIcon name="i-simple-icons-facebook" class="w-5 h-5" />
              </a>
              <a href="#" class="text-gray-600 hover:text-primary-600">
                <UIcon name="i-simple-icons-twitter" class="w-5 h-5" />
              </a>
              <a href="#" class="text-gray-600 hover:text-primary-600">
                <UIcon name="i-simple-icons-instagram" class="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div
          class="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600"
        >
          <p>&copy; 2026 A+. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
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
      click: () => navigateTo("/profile"),
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
