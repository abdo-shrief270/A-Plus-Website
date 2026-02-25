<template>
  <UButton
    v-bind="$attrs"
    :class="[
      'b-button transition-all duration-200 active:scale-95 font-semibold',
      variant === 'solid' && color === 'primary'
        ? 'shadow-lg shadow-primary-500/30'
        : ''
    ]"
    :color="color"
    :variant="variant"
    :size="size"
  >
    <slot />
  </UButton>
</template>

<script setup lang="ts">
interface Props {
  color?: 'error' | 'primary' | 'warning' | 'success' | 'info' | 'neutral'
  variant?: 'link' | 'solid' | 'outline' | 'ghost' | 'soft' | 'subtle'
  size?: 'md' | 'sm' | 'lg' | 'xs' | 'xl'
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'solid',
  size: 'md'
})
</script>

<style scoped>
.b-button {
  border-radius: 0.5rem;
}

/* Ensure white text on primary solid buttons as per design requirement */
:deep(.bg-primary) {
  color: white !important;
}

:deep(.bg-primary-500) {
  color: white !important;
}
</style>
