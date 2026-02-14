<template>
  <div class="min-h-screen flex items-center justify-center">
    <UContainer>
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          تواصل معنا
        </h1>
        <p class="text-lg text-gray-600">
          قريباً...
        </p>
        <UButton
          label="الرئيسية"
          to="/"
          color="secondary"
          size="lg"
        />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'website'
})

useSeoMeta({
  title: 'تواصل معنا - A+',
  description: 'تواصل معنا'
})
</script>
