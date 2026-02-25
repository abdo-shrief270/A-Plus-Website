<template>
  <div class="bg-[#E0F2F1] py-8 border-y border-[#B2DFDB]" dir="rtl">
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-gray-300">
        
        <!-- Statistic: Students -->
        <div class="flex items-center justify-center gap-4 py-4 md:py-0">
          <div class="w-14 h-14 bg-[#009688] rounded-full flex items-center justify-center text-white shadow-sm">
            <UIcon name="i-heroicons-user-group" class="w-7 h-7" />
          </div>
          <div class="text-right">
            <p class="text-3xl font-bold text-gray-900">4000 <span class="text-2xl">+</span></p>
          </div>
        </div>

        <!-- Statistic: Courses -->
        <div class="flex items-center justify-center gap-4 py-4 md:py-0">
          <div class="w-14 h-14 bg-[#009688] rounded-full flex items-center justify-center text-white shadow-sm">
            <UIcon name="i-heroicons-play-circle" class="w-7 h-7" />
          </div>
          <div class="text-right">
            <p class="text-3xl font-bold text-gray-900">300 <span class="text-2xl">+</span></p>
          </div>
        </div>

        <!-- Statistic: Viewers / Daily Visits -->
        <div class="flex items-center justify-center gap-4 py-4 md:py-0">
          <div class="w-14 h-14 bg-[#009688] rounded-full flex items-center justify-center text-white shadow-sm">
            <UIcon name="i-heroicons-users" class="w-7 h-7" />
          </div>
          <div class="text-right">
            <p class="text-3xl font-bold text-gray-900">2000 <span class="text-2xl">+</span></p>
          </div>
        </div>

      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Simple static component matches the Figma stats bar
</script>
