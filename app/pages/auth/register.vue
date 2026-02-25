<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-gray-900">
    <div class="w-full max-w-md">
      <div class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          إنشاء حساب جديد
        </h1>
        <p class="text-gray-500 text-center mb-8">
          اختر نوع حسابك للمتابعة
        </p>

        <div class="grid grid-cols-2 gap-4">
          <NuxtLink to="/auth/register/student" class="flex flex-col items-center justify-center border-2 border-gray-200 hover:border-primary-500 rounded-2xl p-6 cursor-pointer transition-all group">
            <div class="w-16 h-16 rounded-full bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center mb-4 transition-all">
              <UIcon name="i-heroicons-academic-cap" class="w-8 h-8 text-primary-600" />
            </div>
            <span class="font-semibold text-gray-800 dark:text-white text-lg">طالب</span>
            <span class="text-xs text-gray-500 mt-1 text-center">سجل واستعد للامتحانات</span>
          </NuxtLink>

          <NuxtLink to="/auth/register/parent" class="flex flex-col items-center justify-center border-2 border-gray-200 hover:border-primary-500 rounded-2xl p-6 cursor-pointer transition-all group">
            <div class="w-16 h-16 rounded-full bg-success-100 group-hover:bg-success-200 flex items-center justify-center mb-4 transition-all">
              <UIcon name="i-heroicons-user-group" class="w-8 h-8 text-success-600" />
            </div>
            <span class="font-semibold text-gray-800 dark:text-white text-lg">ولي أمر</span>
            <span class="text-xs text-gray-500 mt-1 text-center">تابع أداء أبنائك</span>
          </NuxtLink>
        </div>

        <div class="text-center mt-6">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            لديك حساب بالفعل؟
            <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium underline">
              سجل دخولك
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'fullscreen',
  middleware: 'guest'
})

useSeoMeta({
  title: 'إنشاء حساب | A Plus',
  description: 'سجل في منصة A Plus التعليمية'
})
</script>
