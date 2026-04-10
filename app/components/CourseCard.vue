<template>
  <div
    class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#009688]/30 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
    dir="rtl"
  >
    <!-- Course Image Wrapper -->
    <div class="relative aspect-[16/9] overflow-hidden">
      <img
        :src="course.image"
        :alt="course.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      >
      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <!-- Level Badge -->
      <div class="absolute right-3 top-3">
        <UBadge
          :color="levelColor"
          variant="solid"
          class="font-medium shadow-sm backdrop-blur-md"
        >
          {{ translatedLevel }}
        </UBadge>
      </div>

      <!-- Price Floating -->
      <div class="absolute bottom-3 left-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div class="rounded-lg bg-white px-3 py-1 text-sm font-bold text-[#009688] shadow-lg dark:bg-gray-800">
          {{ course.price }} ر.س
        </div>
      </div>
    </div>

    <!-- Course Content -->
    <div class="flex flex-1 flex-col p-5">
      <!-- Category/Top Info -->
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
          <UIcon name="i-heroicons-user-group" class="h-4 w-4" />
          <span>{{ course.enrollments_count }} طالب</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-star-solid" class="h-4 w-4 text-amber-400" />
          <span class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ course.rating }}</span>
        </div>
      </div>

      <!-- Title -->
      <h3 class="mb-3 line-clamp-2 text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-[#009688] dark:text-white">
        {{ course.title }}
      </h3>

      <!-- Stats Grid -->
      <div class="mt-auto grid grid-cols-2 gap-3 border-t border-gray-50 pt-4 dark:border-gray-800">
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
            <UIcon name="i-heroicons-clock" class="h-4 w-4 text-[#009688]" />
          </div>
          <span>{{ course.total_hours }} ساعة</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
            <UIcon name="i-heroicons-play-circle" class="h-4 w-4 text-[#009688]" />
          </div>
          <span>{{ course.lectures_count }} محاضرة</span>
        </div>
      </div>

      <!-- Action -->
      <div class="mt-5">
        <UButton
          block
          size="lg"
          class="bg-[#009688] transition-colors hover:bg-[#00796B]"
          @click="$emit('enroll', course)"
        >
          اشترك الآن
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from '@/types/course'

const props = defineProps<{
  course: Course
}>()

defineEmits(['enroll'])

const levelColor = computed(() => {
  switch (props.course.level) {
    case 'beginner': return 'emerald'
    case 'intermediate': return 'amber'
    case 'advanced': return 'rose'
    default: return 'primary'
  }
})

const translatedLevel = computed(() => {
  switch (props.course.level) {
    case 'beginner': return 'مبتدئ'
    case 'intermediate': return 'متوسط'
    case 'advanced': return 'متقدم'
    default: return props.course.level
  }
})
</script>
