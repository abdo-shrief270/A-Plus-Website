<template>
  <div>
    <h1 class="mb-2 text-center text-2xl font-bold text-gray-900">
      إنشاء حساب جديد
    </h1>
    <p class="mb-8 text-center text-gray-500">
      اختر نوع حسابك للمتابعة
    </p>

    <div class="grid grid-cols-2 gap-4">
      <NuxtLink
        to="/auth/register/student"
        class="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-gray-200 p-6 transition-all hover:border-primary-500"
      >
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 transition-all group-hover:bg-primary-200">
          <UIcon
            name="i-heroicons-academic-cap"
            class="h-8 w-8 text-primary-600"
          />
        </div>
        <span class="text-lg font-semibold text-gray-800">طالب</span>
        <span class="mt-1 text-center text-xs text-gray-500">سجل واستعد للامتحانات</span>
      </NuxtLink>

      <NuxtLink
        to="/auth/register/parent"
        class="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-gray-200 p-6 transition-all hover:border-primary-500"
      >
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100 transition-all group-hover:bg-success-200">
          <UIcon
            name="i-heroicons-user-group"
            class="h-8 w-8 text-success-600"
          />
        </div>
        <span class="text-lg font-semibold text-gray-800">ولي أمر</span>
        <span class="mt-1 text-center text-xs text-gray-500">تابع أداء أبنائك</span>
      </NuxtLink>
    </div>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        لديك حساب بالفعل؟
        <NuxtLink
          to="/auth/login"
          class="font-medium text-primary-600 underline hover:text-primary-700"
        >
          سجل دخولك
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useSeoMeta({
  title: 'إنشاء حساب | A Plus',
  description: 'سجل في منصة A Plus التعليمية'
})
</script>
