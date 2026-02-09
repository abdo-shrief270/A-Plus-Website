<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100"
  >
    <UContainer>
      <div class="text-center">
        <h1 class="text-6xl md:text-8xl font-bold text-gray-900 mb-6">
          مرحباً بك في A+
        </h1>
        <p class="text-xl md:text-2xl text-gray-700 mb-8">
          منصة تعليمية متكاملة للطلاب والمعلمين
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <UButton to="/register" size="xl" color="primary">
            ابدأ الآن
          </UButton>
          <UButton to="/about" size="xl" variant="outline" color="gray">
            اعرف المزيد
          </UButton>
        </div>

        <!-- Features -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div class="bg-white rounded-lg p-6 shadow-lg">
            <div
              class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <UIcon
                name="i-heroicons-book-open"
                class="w-6 h-6 text-primary-600"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              دورات متنوعة
            </h3>
            <p class="text-gray-600">
              مجموعة واسعة من الدورات التعليمية في مختلف المجالات
            </p>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-lg">
            <div
              class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <UIcon
                name="i-heroicons-user-group"
                class="w-6 h-6 text-primary-600"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              معلمون محترفون
            </h3>
            <p class="text-gray-600">
              تعلم من أفضل المعلمين والخبراء في مجالاتهم
            </p>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-lg">
            <div
              class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <UIcon
                name="i-heroicons-chart-bar"
                class="w-6 h-6 text-primary-600"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              تتبع التقدم
            </h3>
            <p class="text-gray-600">راقب تقدمك وإنجازاتك بشكل مستمر</p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "website",
});

useSeoMeta({
  title: "الرئيسية",
  description: "منصة تعليمية متكاملة للطلاب والمعلمين",
});
</script>
