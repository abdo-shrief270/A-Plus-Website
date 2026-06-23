<template>
  <div
    dir="rtl"
    class="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-error-50 dark:bg-error-500/10">
      <UIcon
        :name="icon"
        class="h-8 w-8 text-error-500"
      />
    </div>
    <h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-white">
      {{ title }}
    </h3>
    <p class="mb-6 max-w-sm text-sm leading-relaxed text-gray-500">
      {{ message }}
    </p>
    <UButton
      v-if="retryable"
      color="primary"
      icon="i-heroicons-arrow-path"
      :loading="retrying"
      @click="$emit('retry')"
    >
      إعادة المحاولة
    </UButton>
  </div>
</template>

<script setup lang="ts">
/** Standardized "failed to load" state with an optional retry. Distinct from
 *  empty states — use this only when a fetch actually errored. */
withDefaults(defineProps<{
  title?: string
  message?: string
  icon?: string
  retryable?: boolean
  retrying?: boolean
}>(), {
  title: 'تعذّر تحميل البيانات',
  message: 'حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى.',
  icon: 'i-heroicons-exclamation-triangle',
  retryable: true,
  retrying: false
})

defineEmits<{ retry: [] }>()
</script>
