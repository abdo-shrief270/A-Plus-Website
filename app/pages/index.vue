<template>
  <div>
    <!-- Hero Section -->
    <HomeHero />

    <!-- About/Stats Section -->
    <HomeAbout />

    <!-- App Section (placeholder) -->
    <div class="py-16 bg-gray-50">
      <UContainer>
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            حمّل التطبيق الآن
          </h2>
          <p class="text-lg text-gray-600 mb-8">متاح على جميع المنصات</p>
          <div class="flex justify-center gap-4">
            <UButton size="lg" color="neutral"> App Store </UButton>
            <UButton size="lg" color="neutral"> Google Play </UButton>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Testimonials (placeholder) -->
    <div class="py-16">
      <UContainer>
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">آراء الطلاب</h2>
          <p class="text-lg text-gray-600 mb-8">ماذا يقول طلابنا عن المنصة</p>
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "website",
});

useSeoMeta({
  title: "الرئيسية - A+",
  description: "منصة تعليمية متكاملة للطلاب والمعلمين",
});
</script>
