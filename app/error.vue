<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true,
  },
});

useHead({
  htmlAttrs: {
    lang: "ar",
    dir: "rtl",
  },
});

useSeoMeta({
  title: "الصفحة غير موجودة",
  description: "عذراً، لم نتمكن من العثور على هذه الصفحة.",
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white p-4">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">
        {{ error.statusCode }}
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        {{ error.message || "الصفحة غير موجودة" }}
      </p>
      <UButton size="lg" @click="handleError"> العودة للرئيسية </UButton>
    </div>
  </div>
</template>
