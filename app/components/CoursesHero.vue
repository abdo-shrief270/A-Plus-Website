<template>
  <div class="relative overflow-hidden bg-gradient-to-b from-[#E0F2F1] to-[#F5F7FA] py-16 lg:py-24 dark:from-gray-800 dark:to-gray-900">
    <!-- Background Decor -->
    <div class="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#009688]/10 blur-3xl" />
    <div class="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

    <UContainer class="relative z-10">
      <div class="flex flex-col items-center text-center">
        <!-- Badge -->
        <UBadge
          color="primary"
          variant="subtle"
          size="lg"
          class="mb-6 animate-bounce rounded-full px-4"
        >
          أفضل الدورات التعليمية
        </UBadge>

        <!-- Title -->
        <h1 class="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
          استثمر في مستقبلك مع <span class="text-[#009688]">أفضل الدورات</span>
        </h1>

        <!-- Subtitle -->
        <p class="mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          اختر من بين مئات الدورات المتخصصة في مختلف المجالات، مجهزة خصيصاً لتناسب احتياجاتك وتطور مهاراتك بشكل احترافي.
        </p>

        <!-- Search Bar -->
        <div class="relative w-full max-w-2xl">
          <UInput
            v-model="searchQuery"
            size="xl"
            placeholder="ابحث عن دورة تدريبية..."
            class="w-full shadow-2xl"
            :ui="{
              base: 'pl-16 pr-6 py-4 rounded-2xl bg-white dark:bg-gray-800 border-none ring-0 focus:ring-2 focus:ring-[#009688] transition-all',
              placeholder: 'text-gray-400'
            }"
            @update:model-value="onSearch"
          >
            <template #leading>
              <div class="flex h-full items-center px-4">
                <UIcon
                  name="i-heroicons-magnifying-glass"
                  class="h-6 w-6 text-[#009688]"
                />
              </div>
            </template>
          </UInput>
        </div>

        <!-- Quick Filters -->
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">شائع:</span>
          <button
            v-for="tag in popularTags"
            :key="tag"
            class="text-sm font-medium text-[#009688] hover:underline"
            @click="searchQuery = tag; onSearch(tag)"
          >
            #{{ tag }}
          </button>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const emit = defineEmits(['search'])

const popularTags = ['قدرات', 'تحصيلي', 'رياضيات', 'لغة_إنجليزية']

let debounceTimeout: any = null
const onSearch = (val: string) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    emit('search', val)
  }, 300)
}
</script>
