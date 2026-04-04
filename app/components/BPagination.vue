<template>
  <div class="flex items-center justify-between gap-4 py-4">
    <div class="text-sm text-gray-500 dark:text-gray-400">
      عرض <span class="font-medium text-gray-900 dark:text-white">{{ from }}</span> إلى
      <span class="font-medium text-gray-900 dark:text-white">{{ to }}</span> من
      <span class="font-medium text-gray-900 dark:text-white">{{ total }}</span> نتيجة
    </div>

    <UPagination
      v-model="page"
      :total="total"
      :page-count="perPage"
      :prev-button="{ icon: 'i-heroicons-chevron-right', color: 'gray', variant: 'ghost', class: 'rtl:rotate-180' }"
      :next-button="{ icon: 'i-heroicons-chevron-left', color: 'gray', variant: 'ghost', class: 'rtl:rotate-180' }"
      :ui="{
        list: 'flex items-center gap-1',
        item: {
          base: 'min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
          active: 'bg-primary-500 text-white shadow-md shadow-primary-500/20',
          inactive: 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      }"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  total: number
  perPage: number
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const page = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  }
})

const from = computed(() => ((props.modelValue - 1) * props.perPage) + 1)
const to = computed(() => Math.min(props.modelValue * props.perPage, props.total))
</script>
