<template>
  <UModal
    v-bind="$attrs"
    :ui="{ content: 'sm:max-w-lg' }"
  >
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        header: 'px-6 py-4',
        body: 'p-6',
        footer: 'px-6 py-4'
      }"
    >
      <template
        v-if="title || $slots.header"
        #header
      >
        <div class="flex items-center justify-between">
          <slot name="header">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title ? $t(title) : "" }}
            </h3>
          </slot>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="$emit('close')"
          />
        </div>
      </template>

      <slot />

      <template
        v-if="$slots.footer"
        #footer
      >
        <div class="flex items-center justify-end gap-3">
          <slot name="footer" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()

defineEmits(['close'])
</script>
