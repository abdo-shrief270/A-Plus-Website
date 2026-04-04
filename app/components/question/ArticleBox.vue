<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden group"
  >
    <!-- Decors -->
    <div
      class="absolute -top-12 -right-12 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors"
    />
    <div
      class="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary-500/5 rounded-full blur-2xl group-hover:bg-secondary-500/10 transition-colors"
    />

    <div class="relative z-10 flex flex-col items-center text-center">
      <!-- Icon & Meta -->
      <div
        class="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-2xl shadow-primary-500/30 mb-8 transform group-hover:scale-110 transition-transform duration-500"
      >
        <UIcon
          name="i-heroicons-document-text"
          class="w-10 h-10"
        />
      </div>

      <div class="flex items-center gap-2 mb-4">
        <UBadge
          v-if="article.questions_count"
          color="primary"
          variant="soft"
          size="xs"
          class="rounded-lg px-3 font-black"
        >
          {{ article.questions_count }} أسئلة لهذا النص
        </UBadge>
        <div class="text-xs font-bold text-gray-400">
          نص قرائي
        </div>
      </div>

      <h1 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-10 tracking-tight leading-tight">
        {{ article.title }}
      </h1>

      <div
        v-if="article.image_path"
        class="w-full mb-10 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-lg"
      >
        <img
          :src="article.image_path"
          class="w-full object-cover h-auto max-h-[400px]"
          :alt="article.title"
        >
      </div>

      <!-- Content -->
      <div class="w-full text-right dir-rtl font-medium text-lg text-gray-700 dark:text-gray-300 leading-[2] whitespace-pre-wrap select-text">
        {{ article.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/question-bank'

defineProps<{
  article: Article
}>()
</script>

<style scoped>
.dir-rtl {
  direction: rtl;
}
</style>
