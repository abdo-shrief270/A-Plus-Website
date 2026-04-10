<template>
  <div class="sticky top-[73px] z-20 bg-white/80 py-4 backdrop-blur-md dark:bg-gray-900/80">
    <UContainer>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Level Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <UButton
            v-for="level in levels"
            :key="level.value"
            :variant="modelValue.level === level.value ? 'solid' : 'ghost'"
            :color="modelValue.level === level.value ? 'primary' : 'neutral'"
            class="whitespace-nowrap rounded-full px-6"
            @click="updateFilter('level', level.value)"
          >
            {{ level.label }}
          </UButton>
        </div>

        <!-- Right Side: Sorting & Stats -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span class="hidden sm:inline">ترتيب حسب:</span>
            <USelect
              v-model="sortBy"
              :options="sortOptions"
              class="w-40"
              @update:model-value="updateFilter('sortBy', $event)"
            />
          </div>
          
          <div class="hidden h-6 w-[1px] bg-gray-200 sm:block dark:bg-gray-800" />
          
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ totalResults }} دورة تدريبية
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: {
    level: string
    sortBy: string
  }
  totalResults: number
}>()

const emit = defineEmits(['update:modelValue'])

const levels = [
  { label: 'الكل', value: 'all' },
  { label: 'مبتدئ', value: 'beginner' },
  { label: 'متوسط', value: 'intermediate' },
  { label: 'متقدم', value: 'advanced' }
]

const sortOptions = [
  { label: 'الأكثر شعبية', value: 'popular' },
  { label: 'الأحدث', value: 'newest' },
  { label: 'السعر: من الأقل', value: 'price_asc' },
  { label: 'السعر: من الأعلى', value: 'price_desc' }
]

const sortBy = ref(props.modelValue.sortBy)

const updateFilter = (key: string, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}
</script>
