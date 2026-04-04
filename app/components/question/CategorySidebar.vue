<template>
  <div class="space-y-6">
    <div
      v-for="section in sections"
      :key="section.id"
      class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <!-- Section Header -->
      <div
        class="px-6 py-5 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"
      >
        <h3 class="font-black text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon
            name="i-heroicons-folder-open"
            class="w-5 h-5 text-primary-500"
          />
          {{ section.name }}
        </h3>
        <UBadge
          v-if="section.categories?.length"
          color="neutral"
          variant="soft"
          size="xs"
          class="rounded-lg px-2 font-bold"
        >
          {{ section.categories?.length }} تخصصات
        </UBadge>
      </div>

      <!-- Categories List -->
      <div class="divide-y divide-gray-50 dark:divide-gray-800">
        <NuxtLink
          v-for="cat in section.categories"
          :key="cat.id"
          :to="`/categories/${cat.id}`"
          class="group flex items-center justify-between px-6 py-4 hover:bg-primary-50/30 dark:hover:bg-primary-500/5 transition-all"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 flex items-center justify-center transition-colors"
            >
              <UIcon
                name="i-heroicons-chevron-left"
                class="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors"
              />
            </div>
            <div class="flex flex-col text-right">
              <span
                class="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ cat.name }}
              </span>
              <span
                v-if="cat.description"
                class="text-[10px] text-gray-400 line-clamp-1 max-w-[180px]"
              >
                {{ cat.description }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span
              v-if="cat.questions_count"
              class="text-xs font-black text-gray-400 group-hover:text-primary-500 transition-colors"
            >
              {{ cat.questions_count }}
            </span>
            <UIcon
              name="i-heroicons-arrow-small-left"
              class="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-[-4px] transition-all"
            />
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!sections?.length"
      class="text-center py-10 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700"
    >
      <UIcon
        name="i-heroicons-inbox"
        class="w-10 h-10 text-gray-300 mb-2"
      />
      <p class="text-xs text-gray-400 font-medium tracking-wide">
        لا توجد أقسام متاحة لهذا الاختبار
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Section } from '~/types/question-bank'

defineProps<{
  sections: Section[]
}>()
</script>
