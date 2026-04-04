<template>
  <div class="relative overflow-hidden w-full">
    <!-- Content Slot -->
    <slot />

    <!-- Sentinel/Observer -->
    <div
      ref="sentinel"
      class="h-1 w-full pointer-events-none"
    />

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex justify-center py-10"
    >
      <div class="flex flex-col items-center gap-3">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-10 h-10 text-primary-500 animate-spin"
        />
        <span class="text-xs text-gray-500 font-medium tracking-wide">جاري تحميل المزيد من المحتوى...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && !hasMore && showEnd"
      class="text-center py-12 border-t border-gray-50 dark:border-gray-800 mt-6"
    >
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 text-xs font-semibold">
        <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
        تم الوصول إلى نهاية القائمة
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  loading?: boolean
  hasMore?: boolean
  threshold?: number
  showEnd?: boolean
}>(), {
  loading: false,
  hasMore: true,
  threshold: 50,
  showEnd: true
})

const emit = defineEmits(['load-more'])

const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry?.isIntersecting && props.hasMore && !props.loading) {
      emit('load-more')
    }
  }, {
    threshold: 0.1,
    rootMargin: `0px 0px ${props.threshold}px 0px`
  })

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
