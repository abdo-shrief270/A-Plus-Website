<template>
  <div>
    <!-- Top -->
    <div class="mb-6">
      <p class="text-xs text-gray-500">
        <NuxtLink
          to="/dashboard"
          class="hover:text-primary-600"
        >
          الرئيسية
        </NuxtLink>
        <span class="mx-1">›</span>
        <span>الإعدادات</span>
      </p>
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
        الإعدادات
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        اختر القسم المطلوب من الأقسام أدناه
      </p>
    </div>

    <!-- Section cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <NuxtLink
        v-for="section in sections"
        :key="section.to"
        :to="section.to"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all p-5 group"
      >
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center mb-4', section.iconBg]">
          <UIcon
            :name="section.icon"
            :class="['w-6 h-6', section.iconColor]"
          />
        </div>
        <h3 class="font-bold text-gray-900 group-hover:text-primary-700 transition-colors mb-1.5">
          {{ section.title }}
        </h3>
        <p class="text-xs text-gray-500 leading-relaxed">
          {{ section.description }}
        </p>
        <div class="mt-4 flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:text-primary-700">
          <span>الانتقال</span>
          <UIcon
            name="i-heroicons-arrow-left"
            class="w-3.5 h-3.5"
          />
        </div>
      </NuxtLink>
    </div>

    <!-- Danger zone -->
    <section class="bg-white rounded-2xl border border-error-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-error-100 bg-error-50/40 flex items-center gap-2">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-5 h-5 text-error-600"
        />
        <h2 class="font-bold text-error-700">
          منطقة الخطر
        </h2>
      </div>
      <div class="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="min-w-0">
          <p class="font-bold text-gray-900">
            تسجيل الخروج
          </p>
          <p class="text-xs text-gray-500 mt-0.5">
            ستحتاج لإعادة تسجيل الدخول للوصول إلى لوحة التحكم.
          </p>
        </div>
        <UButton
          color="error"
          variant="soft"
          icon="i-heroicons-arrow-right-on-rectangle"
          @click="logoutOpen = true"
        >
          تسجيل الخروج
        </UButton>
      </div>
    </section>

    <DashboardLogoutConfirmModal v-model:open="logoutOpen" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'الإعدادات' })
useSeoMeta({ title: 'الإعدادات | A Plus' })

const logoutOpen = ref(false)

const sections = [
  {
    title: 'الملف الشخصي',
    description: 'تعديل الاسم والبريد ورقم الهاتف وتغيير كلمة المرور.',
    to: '/dashboard/profile',
    icon: 'i-heroicons-user-circle',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600'
  },
  {
    title: 'الأمان والتحقق',
    description: 'تفعيل المصادقة الثنائية وتأكيد البريد ورقم الهاتف.',
    to: '/dashboard/settings/security',
    icon: 'i-heroicons-shield-check',
    iconBg: 'bg-success-50',
    iconColor: 'text-success-600'
  },
  {
    title: 'الأجهزة المتصلة',
    description: 'إدارة الأجهزة التي سجلت الدخول من حسابك.',
    to: '/dashboard/devices',
    icon: 'i-heroicons-device-phone-mobile',
    iconBg: 'bg-secondary-50',
    iconColor: 'text-secondary-600'
  },
  {
    title: 'حول المنصة',
    description: 'معلومات المنصة، طرق التواصل، السياسات والشروط.',
    to: '/dashboard/settings/about',
    icon: 'i-heroicons-information-circle',
    iconBg: 'bg-info-50',
    iconColor: 'text-info-600'
  }
]
</script>
